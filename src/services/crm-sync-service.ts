
import { supabase } from '@/integrations/supabase/client';
import { IntegrationFactory } from './integrations/integration-factory';
import { CrmIntegration, AvailabilitySyncLog } from '@/types';

export class CrmSyncService {
  static async syncAvailability(crmIntegrationId: string, poolId: string) {
    try {
      console.log(`Starting availability sync for CRM integration: ${crmIntegrationId}`);
      
      // Get CRM integration details
      const { data: integration, error: integrationError } = await supabase
        .from('crm_integrations')
        .select('*')
        .eq('id', crmIntegrationId)
        .eq('is_active', true)
        .single();

      if (integrationError || !integration) {
        throw new Error('CRM integration not found or inactive');
      }

      // Create integration instance
      const crmIntegration = IntegrationFactory.createIntegration(
        {
          provider: integration.provider as any,
          api_key: integration.api_key,
          oauth_token: integration.oauth_token,
          refresh_token: integration.refresh_token,
          base_url: integration.base_url,
          client_id: integration.client_id
        },
        integration.host_id
      );

      // Test connection first
      const isConnected = await crmIntegration.testConnection();
      if (!isConnected) {
        throw new Error('Failed to connect to CRM system');
      }

      // Get availability data
      const availability = await crmIntegration.getAvailability();
      
      // Log successful sync
      await this.createSyncLog(
        poolId,
        crmIntegrationId,
        'availability',
        'success',
        `Synced ${availability.length} availability records`,
        { availability }
      );

      // Update last sync time
      await supabase
        .from('crm_integrations')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', crmIntegrationId);

      console.log(`Successfully synced availability for pool: ${poolId}`);
      return availability;
      
    } catch (error) {
      console.error('Availability sync failed:', error);
      
      // Log failed sync
      await this.createSyncLog(
        poolId,
        crmIntegrationId,
        'availability',
        'error',
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      throw error;
    }
  }

  static async syncPoolDetails(crmIntegrationId: string) {
    try {
      console.log(`Starting pool details sync for CRM integration: ${crmIntegrationId}`);
      
      const { data: integration, error: integrationError } = await supabase
        .from('crm_integrations')
        .select('*')
        .eq('id', crmIntegrationId)
        .eq('is_active', true)
        .single();

      if (integrationError || !integration) {
        throw new Error('CRM integration not found or inactive');
      }

      const crmIntegration = IntegrationFactory.createIntegration(
        {
          provider: integration.provider as any,
          api_key: integration.api_key,
          oauth_token: integration.oauth_token,
          refresh_token: integration.refresh_token,
          base_url: integration.base_url,
          client_id: integration.client_id
        },
        integration.host_id
      );

      const poolDetails = await crmIntegration.getPoolDetails();
      
      // Update or create pool in our database
      const { data: existingPool } = await supabase
        .from('pools')
        .select('id')
        .eq('host_id', integration.host_id)
        .single();

      if (existingPool) {
        // Update existing pool
        await supabase
          .from('pools')
          .update({
            title: poolDetails.title,
            description: poolDetails.description,
            location: poolDetails.location,
            amenities: poolDetails.amenities,
            price_per_hour: poolDetails.price_per_day / 8, // Convert daily to hourly
            pool_details: {
              maxGuests: poolDetails.max_guests
            },
            images: poolDetails.images || [],
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPool.id);
      } else {
        // Create new pool
        await supabase
          .from('pools')
          .insert({
            host_id: integration.host_id,
            title: poolDetails.title,
            description: poolDetails.description,
            location: poolDetails.location,
            amenities: poolDetails.amenities,
            price_per_hour: poolDetails.price_per_day / 8,
            pool_details: {
              maxGuests: poolDetails.max_guests
            },
            images: poolDetails.images || [],
            is_active: false // Needs approval
          });
      }

      await this.createSyncLog(
        existingPool?.id || 'new',
        crmIntegrationId,
        'pools',
        'success',
        'Pool details synced successfully',
        { poolDetails }
      );

      return poolDetails;
      
    } catch (error) {
      console.error('Pool details sync failed:', error);
      
      await this.createSyncLog(
        'unknown',
        crmIntegrationId,
        'pools',
        'error',
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      throw error;
    }
  }

  static async syncBookings(crmIntegrationId: string, poolId: string) {
    try {
      console.log(`Starting bookings sync for CRM integration: ${crmIntegrationId}`);
      
      const { data: integration, error: integrationError } = await supabase
        .from('crm_integrations')
        .select('*')
        .eq('id', crmIntegrationId)
        .eq('is_active', true)
        .single();

      if (integrationError || !integration) {
        throw new Error('CRM integration not found or inactive');
      }

      const crmIntegration = IntegrationFactory.createIntegration(
        {
          provider: integration.provider as any,
          api_key: integration.api_key,
          oauth_token: integration.oauth_token,
          refresh_token: integration.refresh_token,
          base_url: integration.base_url,
          client_id: integration.client_id
        },
        integration.host_id
      );

      await crmIntegration.syncBookings();

      await this.createSyncLog(
        poolId,
        crmIntegrationId,
        'bookings',
        'success',
        'Bookings synced successfully'
      );

      return true;
      
    } catch (error) {
      console.error('Bookings sync failed:', error);
      
      await this.createSyncLog(
        poolId,
        crmIntegrationId,
        'bookings',
        'error',
        error instanceof Error ? error.message : 'Unknown error'
      );
      
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
      await supabase
        .from('availability_sync_logs')
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
