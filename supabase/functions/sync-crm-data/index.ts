
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  try {
    console.log('Starting automated CRM sync...')
    
    // Get all active CRM integrations
    const { data: integrations, error: integrationsError } = await supabaseClient
      .from('crm_integrations')
      .select('*')
      .eq('is_active', true)
    
    if (integrationsError) {
      throw integrationsError
    }

    console.log(`Found ${integrations?.length || 0} active integrations`)

    if (!integrations || integrations.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active integrations found' }),
        { 
          headers: { 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    const syncResults = []

    for (const integration of integrations) {
      try {
        console.log(`Syncing integration ${integration.id} for host ${integration.host_id}`)
        
        // Get host's pools
        const { data: pools, error: poolsError } = await supabaseClient
          .from('pools')
          .select('id')
          .eq('host_id', integration.host_id)
          .eq('is_active', true)

        if (poolsError) {
          throw poolsError
        }

        // Sync each pool's availability
        for (const pool of pools || []) {
          try {
            // Here you would call your CRM sync service
            // For now, we'll just log and create a sync log
            console.log(`Syncing pool ${pool.id}`)
            
            await supabaseClient
              .from('availability_sync_logs')
              .insert({
                pool_id: pool.id,
                crm_integration_id: integration.id,
                sync_type: 'availability',
                status: 'success',
                message: 'Automated sync completed'
              })

            syncResults.push({
              integration_id: integration.id,
              pool_id: pool.id,
              status: 'success'
            })
          } catch (poolError) {
            console.error(`Error syncing pool ${pool.id}:`, poolError)
            
            await supabaseClient
              .from('availability_sync_logs')
              .insert({
                pool_id: pool.id,
                crm_integration_id: integration.id,
                sync_type: 'availability',
                status: 'error',
                message: poolError instanceof Error ? poolError.message : 'Unknown error'
              })

            syncResults.push({
              integration_id: integration.id,
              pool_id: pool.id,
              status: 'error',
              error: poolError instanceof Error ? poolError.message : 'Unknown error'
            })
          }
        }

        // Update last sync time for the integration
        await supabaseClient
          .from('crm_integrations')
          .update({ last_sync_at: new Date().toISOString() })
          .eq('id', integration.id)

      } catch (integrationError) {
        console.error(`Error syncing integration ${integration.id}:`, integrationError)
        syncResults.push({
          integration_id: integration.id,
          status: 'error',
          error: integrationError instanceof Error ? integrationError.message : 'Unknown error'
        })
      }
    }

    console.log('CRM sync completed')

    return new Response(
      JSON.stringify({ 
        message: 'CRM sync completed',
        results: syncResults 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('CRM sync failed:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
