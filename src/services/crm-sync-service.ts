
import { supabase } from '@/integrations/supabase/client';

export class CrmSyncService {
  static async syncAvailability(crmIntegrationId: string, poolId: string) {
    try {
      console.log(`Starting availability sync for CRM integration: ${crmIntegrationId}`);
      
      // Get the CRM integration details
      const { data: integration, error: integrationError } = await supabase
        .from('crm_integrations')
        .select(`
          *,
          crm_credentials (
            credential_type,
            encrypted_value,
            expires_at
          )
        `)
        .eq('id', crmIntegrationId)
        .eq('is_active', true)
        .single();

      if (integrationError || !integration) {
        throw new Error('CRM integration not found or inactive');
      }

      // Create sync log entry
      const logId = await this.createSyncLog(
        poolId,
        crmIntegrationId,
        'availability',
        'in_progress',
        'Starting availability sync'
      );

      try {
        // Get pool mapping
        const { data: mapping } = await supabase
          .from('crm_pool_mappings')
          .select('*')
          .eq('crm_integration_id', crmIntegrationId)
          .eq('poolpass_pool_id', poolId)
          .eq('is_active', true)
          .single();

        if (!mapping) {
          throw new Error('Pool mapping not found for this CRM integration');
        }

        // TODO: Implement actual CRM API calls based on provider
        // For now, we'll simulate successful sync
        const mockAvailabilityData = [
          {
            date: new Date().toISOString().split('T')[0],
            available_slots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
            external_pool_id: mapping.external_pool_id
          }
        ];

        // Update sync log with success
        await this.updateSyncLog(logId, 'success', 'Availability sync completed successfully', {
          synced_slots: mockAvailabilityData.length,
          data: mockAvailabilityData
        });

        // Update integration last sync time
        await supabase
          .from('crm_integrations')
          .update({ last_sync_at: new Date().toISOString() })
          .eq('id', crmIntegrationId);

        console.log(`Successfully synced availability for pool: ${poolId}`);
        return mockAvailabilityData;
        
      } catch (syncError) {
        await this.updateSyncLog(logId, 'error', syncError instanceof Error ? syncError.message : 'Unknown sync error', {
          error: syncError
        });
        throw syncError;
      }
      
    } catch (error) {
      console.error('Availability sync failed:', error);
      throw error;
    }
  }

  static async syncPoolDetails(crmIntegrationId: string) {
    try {
      console.log(`Starting pool details sync for CRM integration: ${crmIntegrationId}`);
      
      // Get the CRM integration details
      const { data: integration, error } = await supabase
        .from('crm_integrations')
        .select('*')
        .eq('id', crmIntegrationId)
        .eq('is_active', true)
        .single();

      if (error || !integration) {
        throw new Error('CRM integration not found or inactive');
      }

      // Create sync log entry
      const logId = await this.createSyncLog(
        null,
        crmIntegrationId,
        'pools',
        'in_progress',
        'Starting pool details sync'
      );

      try {
        // TODO: Implement actual CRM API calls to fetch pool/room details
        const mockPoolDetails = {
          external_pools: [
            {
              external_id: 'room_001',
              title: 'Premium Pool Suite',
              description: 'Luxury pool with panoramic views',
              location: this.getConfigurationValue(integration.configuration, 'location', 'Unknown Location'),
              amenities: ['WiFi', 'Towels', 'Changing Room'],
              max_guests: 8
            }
          ]
        };

        await this.updateSyncLog(logId, 'success', 'Pool details sync completed', mockPoolDetails);
        
        return mockPoolDetails;
        
      } catch (syncError) {
        await this.updateSyncLog(logId, 'error', syncError instanceof Error ? syncError.message : 'Pool sync error');
        throw syncError;
      }
      
    } catch (error) {
      console.error('Pool details sync failed:', error);
      throw error;
    }
  }

  static async syncBookings(crmIntegrationId: string, poolId: string) {
    try {
      console.log(`Starting bookings sync for CRM integration: ${crmIntegrationId}`);
      
      // Create sync log entry
      const logId = await this.createSyncLog(
        poolId,
        crmIntegrationId,
        'bookings',
        'in_progress',
        'Starting bookings sync'
      );

      try {
        // TODO: Implement actual CRM booking sync
        await this.updateSyncLog(logId, 'success', 'Bookings sync completed successfully');
        
        return true;
        
      } catch (syncError) {
        await this.updateSyncLog(logId, 'error', syncError instanceof Error ? syncError.message : 'Booking sync error');
        throw syncError;
      }
      
    } catch (error) {
      console.error('Bookings sync failed:', error);
      throw error;
    }
  }

  private static getConfigurationValue(configuration: any, key: string, defaultValue: string): string {
    if (!configuration) return defaultValue;
    
    try {
      // Handle different types of configuration data
      if (typeof configuration === 'string') {
        const parsed = JSON.parse(configuration);
        return parsed[key] || defaultValue;
      } else if (typeof configuration === 'object' && configuration !== null) {
        return configuration[key] || defaultValue;
      }
    } catch (error) {
      console.warn('Failed to parse configuration:', error);
    }
    
    return defaultValue;
  }

  private static async createSyncLog(
    poolId: string | null,
    crmIntegrationId: string,
    syncType: 'availability' | 'pools' | 'bookings' | 'pricing',
    status: 'success' | 'error' | 'in_progress' | 'pending',
    message: string,
    syncedData?: any
  ): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('availability_sync_logs')
        .insert({
          pool_id: poolId,
          crm_integration_id: crmIntegrationId,
          sync_type: syncType,
          status: status,
          message: message,
          synced_data: syncedData
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Failed to create sync log:', error);
      throw error;
    }
  }

  private static async updateSyncLog(
    logId: string,
    status: 'success' | 'error' | 'in_progress' | 'pending',
    message: string,
    syncedData?: any
  ) {
    try {
      await supabase
        .from('availability_sync_logs')
        .update({
          status: status,
          message: message,
          synced_data: syncedData,
          sync_completed_at: new Date().toISOString()
        })
        .eq('id', logId);
    } catch (error) {
      console.error('Failed to update sync log:', error);
    }
  }

  static async getIntegrationsByHost(hostId: string) {
    try {
      const { data, error } = await supabase
        .from('crm_integrations')
        .select(`
          *,
          availability_sync_logs (
            id,
            sync_type,
            status,
            message,
            sync_started_at,
            sync_completed_at
          )
        `)
        .eq('host_id', hostId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get integrations:', error);
      return [];
    }
  }

  static async createIntegration(
    hostId: string,
    provider: 'mews' | 'cloudbeds' | 'opera' | 'protel' | 'custom',
    integrationName: string,
    configuration: any,
    credentials: { type: string; value: string; expiresAt?: string }[]
  ) {
    try {
      // Create the integration
      const { data: integration, error: integrationError } = await supabase
        .from('crm_integrations')
        .insert({
          host_id: hostId,
          provider: provider,
          integration_name: integrationName,
          configuration: configuration,
          is_active: true
        })
        .select()
        .single();

      if (integrationError) throw integrationError;

      // Add credentials
      if (credentials.length > 0) {
        const credentialInserts = credentials.map(cred => ({
          crm_integration_id: integration.id,
          credential_type: cred.type,
          encrypted_value: cred.value, // TODO: Implement proper encryption
          expires_at: cred.expiresAt
        }));

        const { error: credError } = await supabase
          .from('crm_credentials')
          .insert(credentialInserts);

        if (credError) throw credError;
      }

      return integration;
    } catch (error) {
      console.error('Failed to create CRM integration:', error);
      throw error;
    }
  }
}
