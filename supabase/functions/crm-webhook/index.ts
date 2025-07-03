
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('CRM webhook received:', req.method, req.url)
    
    // Parse the request body
    const body = await req.json()
    console.log('Webhook payload:', body)

    // Extract integration ID from URL path or headers
    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/')
    const integrationId = pathSegments[pathSegments.length - 1] || body.integration_id

    if (!integrationId) {
      return new Response(
        JSON.stringify({ error: 'Integration ID required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Verify the integration exists
    const { data: integration, error: integrationError } = await supabaseClient
      .from('crm_integrations')
      .select('*')
      .eq('id', integrationId)
      .eq('is_active', true)
      .single()

    if (integrationError || !integration) {
      console.error('Integration not found:', integrationError)
      return new Response(
        JSON.stringify({ error: 'Integration not found or inactive' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Determine event type and source
    const eventType = body.event_type || body.type || 'unknown'
    const source = integration.provider

    // Store webhook event
    const { error: webhookError } = await supabaseClient
      .from('webhook_events')
      .insert({
        source: source,
        event_type: eventType,
        integration_id: integrationId,
        external_pool_id: body.pool_id || body.room_id || body.resource_id,
        event_data: body,
        processed: false
      })

    if (webhookError) {
      console.error('Error storing webhook event:', webhookError)
    }

    // Process the webhook based on event type
    await processWebhookEvent(integrationId, eventType, body)

    // Mark webhook as processed
    await supabaseClient
      .from('webhook_events')
      .update({ processed: true })
      .eq('integration_id', integrationId)
      .eq('event_type', eventType)
      .order('created_at', { ascending: false })
      .limit(1)

    console.log('Webhook processed successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully',
        integration_id: integrationId,
        event_type: eventType
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function processWebhookEvent(integrationId: string, eventType: string, eventData: any) {
  try {
    console.log(`Processing ${eventType} event for integration ${integrationId}`)

    switch (eventType) {
      case 'booking_created':
      case 'booking_updated':
      case 'booking_cancelled':
        await handleBookingEvent(integrationId, eventType, eventData)
        break
        
      case 'availability_changed':
        await handleAvailabilityEvent(integrationId, eventData)
        break
        
      case 'pool_updated':
      case 'room_updated':
        await handlePoolUpdateEvent(integrationId, eventData)
        break
        
      default:
        console.log(`Unhandled event type: ${eventType}`)
    }
  } catch (error) {
    console.error('Error processing webhook event:', error)
    throw error
  }
}

async function handleBookingEvent(integrationId: string, eventType: string, eventData: any) {
  try {
    // Find the mapped pool
    const { data: mapping } = await supabaseClient
      .from('crm_pool_mappings')
      .select('poolpass_pool_id, external_pool_id')
      .eq('crm_integration_id', integrationId)
      .eq('external_pool_id', eventData.pool_id || eventData.room_id)
      .single()

    if (!mapping?.poolpass_pool_id) {
      console.log('No pool mapping found for external pool:', eventData.pool_id || eventData.room_id)
      return
    }

    // Check for booking conflicts
    const conflicts = await detectBookingConflicts(mapping.poolpass_pool_id, eventData)

    if (conflicts.length > 0) {
      console.log('Booking conflicts detected:', conflicts.length)
      await handleBookingConflicts(conflicts, eventData, mapping.poolpass_pool_id)
    }

    // Create notification for host
    await createNotification(
      mapping.poolpass_pool_id,
      `External booking ${eventType.replace('_', ' ')}`,
      `A booking has been ${eventType.replace('booking_', '').replace('_', ' ')} in your CRM system.`
    )

    console.log('Booking event processed successfully')
  } catch (error) {
    console.error('Error handling booking event:', error)
    throw error
  }
}

async function handleAvailabilityEvent(integrationId: string, eventData: any) {
  try {
    // Find the mapped pool
    const { data: mapping } = await supabaseClient
      .from('crm_pool_mappings')
      .select('poolpass_pool_id')
      .eq('crm_integration_id', integrationId)
      .eq('external_pool_id', eventData.pool_id || eventData.room_id)
      .single()

    if (!mapping?.poolpass_pool_id) {
      console.log('No pool mapping found for availability event')
      return
    }

    // Create notification
    await createNotification(
      mapping.poolpass_pool_id,
      'Availability Updated',
      'Pool availability has been updated in your CRM system.'
    )

    console.log('Availability event processed successfully')
  } catch (error) {
    console.error('Error handling availability event:', error)
    throw error
  }
}

async function handlePoolUpdateEvent(integrationId: string, eventData: any) {
  try {
    console.log('Pool update event processed')
  } catch (error) {
    console.error('Error handling pool update event:', error)
    throw error
  }
}

async function detectBookingConflicts(poolId: string, eventData: any) {
  try {
    const bookingDate = eventData.date || eventData.booking_date
    const startTime = eventData.start_time
    const endTime = eventData.end_time

    if (!bookingDate || !startTime || !endTime) {
      return []
    }

    // Check for overlapping bookings
    const { data: overlappingBookings, error } = await supabaseClient
      .from('bookings')
      .select('*')
      .eq('pool_id', poolId)
      .eq('booking_date', bookingDate)
      .or(`and(start_time.lte.${endTime},end_time.gte.${startTime})`)

    if (error) {
      console.error('Error checking for overlapping bookings:', error)
      return []
    }

    return overlappingBookings || []
  } catch (error) {
    console.error('Error detecting booking conflicts:', error)
    return []
  }
}

async function handleBookingConflicts(conflicts: any[], eventData: any, poolId: string) {
  try {
    for (const conflict of conflicts) {
      // Log the conflict
      const { error } = await supabaseClient
        .from('sync_conflicts')
        .insert({
          type: 'booking_overlap',
          pool_id: poolId,
          external_pool_id: eventData.pool_id || eventData.room_id,
          conflict_data: {
            external_booking: eventData,
            internal_booking: conflict,
            detected_at: new Date().toISOString()
          },
          status: 'pending'
        })

      if (error) {
        console.error('Error logging conflict:', error)
      }

      // Create urgent notification
      await createNotification(
        poolId,
        'Booking Conflict Detected',
        'A booking conflict has been detected between your CRM system and PoolPass. Please review immediately.',
        'urgent'
      )
    }
  } catch (error) {
    console.error('Error handling booking conflicts:', error)
  }
}

async function createNotification(
  poolId: string,
  title: string,
  message: string,
  priority: 'normal' | 'urgent' = 'normal'
) {
  try {
    // Get pool host
    const { data: pool } = await supabaseClient
      .from('pools')
      .select('host_id')
      .eq('id', poolId)
      .single()

    if (!pool?.host_id) return

    // Create notification
    const { error } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: pool.host_id,
        title: title,
        message: message,
        type: priority === 'urgent' ? 'alert' : 'info',
        action_url: '/host-dashboard?tab=sync'
      })

    if (error) {
      console.error('Error creating notification:', error)
    }
  } catch (error) {
    console.error('Error creating notification:', error)
  }
}
