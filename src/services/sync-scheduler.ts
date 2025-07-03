
import { supabase } from '@/integrations/supabase/client';
import { CrmIntegrationService } from './crm-integration-service';
import { CrmSyncService } from './crm-sync-service';

export interface SyncSchedule {
  id: string;
  integration_id: string;
  sync_type: 'availability' | 'pools' | 'bookings';
  frequency: 'hourly' | 'daily' | 'weekly';
  next_run: string;
  is_active: boolean;
  last_run?: string;
  error_count: number;
}

export interface SyncConflict {
  id: string;
  type: 'booking_overlap' | 'availability_mismatch' | 'price_difference';
  pool_id: string;
  external_pool_id: string;
  conflict_data: any;
  status: 'pending' | 'resolved' | 'ignored';
  created_at: string;
}

export class SyncScheduler {
  private static instance: SyncScheduler;
  private syncIntervals: Map<string, NodeJS.Timeout> = new Map();
  private isRunning = false;

  static getInstance(): SyncScheduler {
    if (!SyncScheduler.instance) {
      SyncScheduler.instance = new SyncScheduler();
    }
    return SyncScheduler.instance;
  }

  /**
   * Start the sync scheduler
   */
  async start() {
    if (this.isRunning) return;
    
    console.log('Starting sync scheduler...');
    this.isRunning = true;
    
    // Load existing schedules and start them
    await this.loadAndStartSchedules();
    
    // Set up a master scheduler that runs every 5 minutes to check for due syncs
    setInterval(() => {
      this.checkDueSync();
    }, 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Stop the sync scheduler
   */
  stop() {
    console.log('Stopping sync scheduler...');
    this.isRunning = false;
    
    // Clear all intervals
    this.syncIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.syncIntervals.clear();
  }

  /**
   * Schedule a new sync
   */
  async scheduleSync(
    integrationId: string,
    syncType: 'availability' | 'pools' | 'bookings',
    frequency: 'hourly' | 'daily' | 'weekly'
  ) {
    try {
      const nextRun = this.calculateNextRun(frequency);
      
      const { error } = await supabase
        .from('sync_schedules')
        .upsert({
          integration_id: integrationId,
          sync_type: syncType,
          frequency: frequency,
          next_run: nextRun,
          is_active: true,
          error_count: 0
        }, {
          onConflict: 'integration_id,sync_type'
        });

      if (error) throw error;

      // Start the interval for this schedule
      this.startScheduleInterval(integrationId, syncType, frequency);
      
      console.log(`Scheduled ${syncType} sync for integration ${integrationId} - ${frequency}`);
    } catch (error) {
      console.error('Error scheduling sync:', error);
      throw error;
    }
  }

  /**
   * Remove a scheduled sync
   */
  async unscheduleSync(integrationId: string, syncType: string) {
    try {
      const { error } = await supabase
        .from('sync_schedules')
        .update({ is_active: false })
        .eq('integration_id', integrationId)
        .eq('sync_type', syncType);

      if (error) throw error;

      // Clear the interval
      const intervalKey = `${integrationId}-${syncType}`;
      const interval = this.syncIntervals.get(intervalKey);
      if (interval) {
        clearInterval(interval);
        this.syncIntervals.delete(intervalKey);
      }
    } catch (error) {
      console.error('Error unscheduling sync:', error);
      throw error;
    }
  }

  /**
   * Execute a scheduled sync
   */
  private async executeScheduledSync(integrationId: string, syncType: string) {
    try {
      console.log(`Executing ${syncType} sync for integration ${integrationId}`);
      
      // Update last run time
      const { error: updateError } = await supabase
        .from('sync_schedules')
        .update({ 
          last_run: new Date().toISOString(),
          next_run: this.calculateNextRun('hourly') // Will be updated based on actual frequency
        })
        .eq('integration_id', integrationId)
        .eq('sync_type', syncType);

      if (updateError) {
        console.error('Error updating sync schedule:', updateError);
      }

      // Execute the actual sync based on type
      switch (syncType) {
        case 'availability':
          // Get pool associated with this integration
          const { data: mappings } = await supabase
            .from('crm_pool_mappings')
            .select('poolpass_pool_id')
            .eq('crm_integration_id', integrationId)
            .eq('is_active', true)
            .limit(1)
            .single();

          if (mappings?.poolpass_pool_id) {
            await CrmSyncService.syncAvailability(integrationId, mappings.poolpass_pool_id);
          }
          break;
          
        case 'pools':
          await CrmSyncService.syncPoolDetails(integrationId);
          break;
          
        case 'bookings':
          // Get pool associated with this integration
          const { data: bookingMappings } = await supabase
            .from('crm_pool_mappings')
            .select('poolpass_pool_id')
            .eq('crm_integration_id', integrationId)
            .eq('is_active', true)
            .limit(1)
            .single();

          if (bookingMappings?.poolpass_pool_id) {
            await CrmSyncService.syncBookings(integrationId, bookingMappings.poolpass_pool_id);
          }
          break;
      }

      // Reset error count on successful sync
      await supabase
        .from('sync_schedules')
        .update({ error_count: 0 })
        .eq('integration_id', integrationId)
        .eq('sync_type', syncType);

    } catch (error) {
      console.error(`Error in scheduled sync ${syncType} for ${integrationId}:`, error);
      
      // Increment error count
      await supabase
        .from('sync_schedules')
        .update({ 
          error_count: supabase.sql`error_count + 1`,
          last_error: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('integration_id', integrationId)
        .eq('sync_type', syncType);
    }
  }

  /**
   * Check for due syncs and execute them
   */
  private async checkDueSync() {
    try {
      const { data: dueSchedules, error } = await supabase
        .from('sync_schedules')
        .select('*')
        .eq('is_active', true)
        .lt('next_run', new Date().toISOString())
        .lt('error_count', 5); // Don't retry if too many errors

      if (error) {
        console.error('Error checking due syncs:', error);
        return;
      }

      for (const schedule of dueSchedules || []) {
        await this.executeScheduledSync(schedule.integration_id, schedule.sync_type);
        
        // Update next run time
        const nextRun = this.calculateNextRun(schedule.frequency);
        await supabase
          .from('sync_schedules')
          .update({ next_run: nextRun })
          .eq('id', schedule.id);
      }
    } catch (error) {
      console.error('Error in checkDueSync:', error);
    }
  }

  /**
   * Load existing schedules and start intervals
   */
  private async loadAndStartSchedules() {
    try {
      const { data: schedules, error } = await supabase
        .from('sync_schedules')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error loading sync schedules:', error);
        return;
      }

      for (const schedule of schedules || []) {
        this.startScheduleInterval(
          schedule.integration_id,
          schedule.sync_type,
          schedule.frequency
        );
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
    }
  }

  /**
   * Start interval for a specific schedule
   */
  private startScheduleInterval(integrationId: string, syncType: string, frequency: string) {
    const intervalKey = `${integrationId}-${syncType}`;
    
    // Clear existing interval if any
    const existingInterval = this.syncIntervals.get(intervalKey);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    // Calculate interval in milliseconds
    let intervalMs: number;
    switch (frequency) {
      case 'hourly':
        intervalMs = 60 * 60 * 1000; // 1 hour
        break;
      case 'daily':
        intervalMs = 24 * 60 * 60 * 1000; // 24 hours
        break;
      case 'weekly':
        intervalMs = 7 * 24 * 60 * 60 * 1000; // 7 days
        break;
      default:
        intervalMs = 60 * 60 * 1000; // Default to hourly
    }

    // Set up the interval
    const interval = setInterval(() => {
      this.executeScheduledSync(integrationId, syncType);
    }, intervalMs);

    this.syncIntervals.set(intervalKey, interval);
  }

  /**
   * Calculate next run time based on frequency
   */
  private calculateNextRun(frequency: string): string {
    const now = new Date();
    switch (frequency) {
      case 'hourly':
        return new Date(now.getTime() + 60 * 60 * 1000).toISOString();
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() + 60 * 60 * 1000).toISOString();
    }
  }

  /**
   * Get sync status for an integration
   */
  async getSyncStatus(integrationId: string) {
    try {
      const { data: schedules, error } = await supabase
        .from('sync_schedules')
        .select('*')
        .eq('integration_id', integrationId)
        .eq('is_active', true);

      if (error) throw error;
      return schedules || [];
    } catch (error) {
      console.error('Error getting sync status:', error);
      return [];
    }
  }
}

// Initialize scheduler when module loads
const scheduler = SyncScheduler.getInstance();
if (typeof window !== 'undefined') {
  scheduler.start();
}

export { scheduler };
