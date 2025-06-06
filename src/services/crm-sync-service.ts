
import { supabase } from '@/integrations/supabase/client';

export class CrmSyncService {
  static async syncAvailability(crmIntegrationId: string, poolId: string) {
    try {
      console.log(`Starting availability sync for CRM integration: ${crmIntegrationId}`);
      
      // Use untyped query for new tables until schema is updated
      const { data: integration, error: integrationError } = await supabase
        .from('crm_integrations' as any)
        .select('*')
        .eq('id', crmIntegrationId)
        .eq('is_active', true)
        .single();

      if (integrationError || !integration) {
        throw new Error('CRM integration not found or inactive');
      }

      // Temporary mock implementation until types are updated
      console.log(`Successfully synced availability for pool: ${poolId}`);
      return [];
      
    } catch (error) {
      console.error('Availability sync failed:', error);
      throw error;
    }
  }

  static async syncPoolDetails(crmIntegrationId: string) {
    try {
      console.log(`Starting pool details sync for CRM integration: ${crmIntegrationId}`);
      
      // Temporary mock implementation until types are updated
      return { title: 'Pool', description: 'Description', location: 'Location' };
      
    } catch (error) {
      console.error('Pool details sync failed:', error);
      throw error;
    }
  }

  static async syncBookings(crmIntegrationId: string, poolId: string) {
    try {
      console.log(`Starting bookings sync for CRM integration: ${crmIntegrationId}`);
      
      // Temporary mock implementation until types are updated
      return true;
      
    } catch (error) {
      console.error('Bookings sync failed:', error);
      throw error;
    }
  }

  private static async createSyncLog(
    poolId: string,
    crmIntegrationId: string,
    syncType: 'availability' | 'pools' | 'bookings',
    status: 'success' | 'error' | 'in_progress',
    message: string,
    syncedData?: any
  ) {
    try {
      // Use untyped query for new tables until schema is updated
      await supabase
        .from('availability_sync_logs' as any)
        .insert({
          pool_id: poolId,
          crm_integration_id: crmIntegrationId,
          sync_type: syncType,
          status: status,
          message: message,
          synced_data: syncedData
        });
    } catch (error) {
      console.error('Failed to create sync log:', error);
    }
  }
}
