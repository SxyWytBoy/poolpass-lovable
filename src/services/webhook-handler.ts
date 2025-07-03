
import { supabase } from '@/integrations/supabase/client';
import { SyncScheduler } from './sync-scheduler';

export interface WebhookEvent {
  id: string;
  source: 'mews' | 'cloudbeds' | 'opera' | 'protel' | 'custom';
  event_type: 'booking_created' | 'booking_updated' | 'booking_cancelled' | 'availability_changed' | 'pool_updated';
  integration_id: string;
  external_pool_id?: string;
  event_data: any;
  processed: boolean;
  created_at: string;
}

export class WebhookHandler {
  /**
   * Process incoming webhook
   */
  static async processWebhook(
    source: string,
    eventType: string,
    integrationId: string,
    eventData: any
  ): Promise<{ success: boolean; message?: string }> {
    try {
      console.log(`Processing webhook: ${source} - ${eventType} for integration ${integrationId}`);

      // Store webhook event for auditing
      const { error: logError } = await (supabase as any)
        .from('webhook_events')
        .insert({
          source: source as any,
          event_type: eventType as any,
          integration_id: integrationId,
          external_pool_id: eventData.pool_id || eventData.room_id,
          event_data: eventData,
          processed: false
        });

      if (logError) {
        console.error('Error logging webhook event:', logError);
      }

      // Process based on event type
      switch (eventType) {
        case 'booking_created':
        case 'booking_updated':
        case 'booking_cancelled':
          await this.handleBookingEvent(integrationId, eventType, eventData);
          break;
          
        case 'availability_changed':
          await this.handleAvailabilityEvent(integrationId, eventData);
          break;
          
        case 'pool_updated':
          await this.handlePoolUpdateEvent(integrationId, eventData);
          break;
          
        default:
          console.warn(`Unknown webhook event type: ${eventType}`);
          return { success: false, message: `Unknown event type: ${eventType}` };
      }

      // Mark as processed
      await (supabase as any)
        .from('webhook_events')
        .update({ processed: true })
        .eq('integration_id', integrationId)
        .eq('event_type', eventType as any)
        .order('created_at', { ascending: false })
        .limit(1);

      return { success: true };
    } catch (error) {
      console.error('Error processing webhook:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Handle booking-related events
   */
  private static async handleBookingEvent(
    integrationId: string,
    eventType: string,
    eventData: any
  ) {
    try {
      // Find the mapped pool
      const { data: mapping } = await supabase
        .from('crm_pool_mappings')
        .select('poolpass_pool_id, external_pool_id')
        .eq('crm_integration_id', integrationId)
        .eq('external_pool_id', eventData.pool_id || eventData.room_id)
        .single();

      if (!mapping?.poolpass_pool_id) {
        console.warn('No pool mapping found for external pool:', eventData.pool_id || eventData.room_id);
        return;
      }

      // Check for booking conflicts
      const conflicts = await this.detectBookingConflicts(
        mapping.poolpass_pool_id,
        eventData
      );

      if (conflicts.length > 0) {
        console.warn('Booking conflicts detected:', conflicts);
        await this.handleBookingConflicts(conflicts, eventData);
      }

      // Trigger availability sync for affected pool
      const scheduler = SyncScheduler.getInstance();
      await scheduler.scheduleSync(integrationId, 'availability', 'hourly');
      
      // Create notification for host
      await this.createNotification(
        mapping.poolpass_pool_id,
        `External booking ${eventType.replace('_', ' ')}`,
        `A booking has been ${eventType.replace('booking_', '').replace('_', ' ')} in your CRM system.`
      );

    } catch (error) {
      console.error('Error handling booking event:', error);
      throw error;
    }
  }

  /**
   * Handle availability change events
   */
  private static async handleAvailabilityEvent(integrationId: string, eventData: any) {
    try {
      // Find the mapped pool
      const { data: mapping } = await supabase
        .from('crm_pool_mappings')
        .select('poolpass_pool_id')
        .eq('crm_integration_id', integrationId)
        .eq('external_pool_id', eventData.pool_id || eventData.room_id)
        .single();

      if (!mapping?.poolpass_pool_id) {
        console.warn('No pool mapping found for availability event');
        return;
      }

      // Trigger immediate availability sync
      const scheduler = SyncScheduler.getInstance();
      await scheduler.scheduleSync(integrationId, 'availability', 'hourly');

      // Create notification
      await this.createNotification(
        mapping.poolpass_pool_id,
        'Availability Updated',
        'Pool availability has been updated in your CRM system.'
      );

    } catch (error) {
      console.error('Error handling availability event:', error);
      throw error;
    }
  }

  /**
   * Handle pool update events
   */
  private static async handlePoolUpdateEvent(integrationId: string, eventData: any) {
    try {
      // Trigger pool details sync
      const scheduler = SyncScheduler.getInstance();
      await scheduler.scheduleSync(integrationId, 'pools', 'daily');

      console.log('Pool update event processed, sync scheduled');
    } catch (error) {
      console.error('Error handling pool update event:', error);
      throw error;
    }
  }

  /**
   * Detect booking conflicts
   */
  private static async detectBookingConflicts(
    poolId: string,
    eventData: any
  ): Promise<any[]> {
    try {
      const bookingDate = eventData.date || eventData.booking_date;
      const startTime = eventData.start_time;
      const endTime = eventData.end_time;

      if (!bookingDate || !startTime || !endTime) {
        return [];
      }

      // Check for overlapping bookings
      const { data: overlappingBookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('pool_id', poolId)
        .eq('booking_date', bookingDate)
        .or(`and(start_time.lte.${endTime},end_time.gte.${startTime})`);

      if (error) {
        console.error('Error checking for overlapping bookings:', error);
        return [];
      }

      return overlappingBookings || [];
    } catch (error) {
      console.error('Error detecting booking conflicts:', error);
      return [];
    }
  }

  /**
   * Handle booking conflicts
   */
  private static async handleBookingConflicts(conflicts: any[], eventData: any) {
    try {
      for (const conflict of conflicts) {
        // Log the conflict
        const { error } = await (supabase as any)
          .from('sync_conflicts')
          .insert({
            type: 'booking_overlap',
            pool_id: conflict.pool_id,
            external_pool_id: eventData.pool_id || eventData.room_id,
            conflict_data: {
              external_booking: eventData,
              internal_booking: conflict,
              detected_at: new Date().toISOString()
            },
            status: 'pending'
          });

        if (error) {
          console.error('Error logging conflict:', error);
        }

        // Create urgent notification
        await this.createNotification(
          conflict.pool_id,
          'Booking Conflict Detected',
          `A booking conflict has been detected between your CRM system and PoolPass. Please review immediately.`,
          'urgent'
        );
      }
    } catch (error) {
      console.error('Error handling booking conflicts:', error);
    }
  }

  /**
   * Create notification for host
   */
  private static async createNotification(
    poolId: string,
    title: string,
    message: string,
    priority: 'normal' | 'urgent' = 'normal'
  ) {
    try {
      // Get pool host
      const { data: pool } = await supabase
        .from('pools')
        .select('host_id')
        .eq('id', poolId)
        .single();

      if (!pool?.host_id) return;

      // Create notification
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: pool.host_id,
          title: title,
          message: message,
          type: priority === 'urgent' ? 'alert' : 'info',
          action_url: `/host-dashboard?tab=sync`
        });

      if (error) {
        console.error('Error creating notification:', error);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  /**
   * Get webhook events for an integration
   */
  static async getWebhookEvents(integrationId: string, limit: number = 50) {
    try {
      const { data, error } = await (supabase as any)
        .from('webhook_events')
        .select('*')
        .eq('integration_id', integrationId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting webhook events:', error);
      return [];
    }
  }
}
