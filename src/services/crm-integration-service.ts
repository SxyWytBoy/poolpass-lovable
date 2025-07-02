
import { supabase } from '@/integrations/supabase/client';
import { MewsIntegration } from './integrations/mews-integration';
import { CloudbedsIntegration } from './integrations/cloudbeds-integration';
import { IntegrationFactory } from './integrations/integration-factory';
import { CrmCredentials, PoolDetails } from '@/types/crm';

export interface CrmPoolMapping {
  id: string;
  external_pool_id: string;
  external_pool_name: string;
  poolpass_pool_id?: string;
  mapping_configuration: any;
  is_active: boolean;
}

export interface ImportedPool {
  external_id: string;
  title: string;
  description: string;
  location: string;
  amenities: string[];
  price_per_day: number;
  max_guests: number;
  images: string[];
}

export class CrmIntegrationService {
  /**
   * Test connection to CRM system with credentials
   */
  static async testConnection(
    provider: 'mews' | 'cloudbeds' | 'opera' | 'protel' | 'custom',
    credentials: CrmCredentials
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const integration = IntegrationFactory.createIntegration(credentials, 'test-host');
      const isConnected = await integration.testConnection();
      
      return {
        success: isConnected,
        error: isConnected ? undefined : 'Connection failed'
      };
    } catch (error) {
      console.error('Connection test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Create a new CRM integration with credentials
   */
  static async createIntegration(
    hostId: string,
    provider: 'mews' | 'cloudbeds' | 'opera' | 'protel' | 'custom',
    integrationName: string,
    credentials: CrmCredentials,
    configuration: any = {}
  ) {
    try {
      // Test connection first
      const testResult = await this.testConnection(provider, credentials);
      if (!testResult.success) {
        throw new Error(testResult.error || 'Connection test failed');
      }

      // Create the integration
      const { data: integration, error } = await supabase
        .from('crm_integrations')
        .insert({
          host_id: hostId,
          provider: provider,
          integration_name: integrationName,
          configuration: configuration,
          webhook_url: credentials.base_url || null,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      // Store credentials securely
      const credentialInserts = [];
      
      if (credentials.api_key) {
        credentialInserts.push({
          crm_integration_id: integration.id,
          credential_type: 'api_key',
          encrypted_value: credentials.api_key // TODO: Implement proper encryption
        });
      }
      
      if (credentials.oauth_token) {
        credentialInserts.push({
          crm_integration_id: integration.id,
          credential_type: 'oauth_token',
          encrypted_value: credentials.oauth_token
        });
      }
      
      if (credentials.refresh_token) {
        credentialInserts.push({
          crm_integration_id: integration.id,
          credential_type: 'refresh_token',
          encrypted_value: credentials.refresh_token,
          expires_at: credentials.expires_at
        });
      }

      if (credentialInserts.length > 0) {
        const { error: credError } = await supabase
          .from('crm_credentials')
          .insert(credentialInserts);

        if (credError) throw credError;
      }

      return integration;
    } catch (error) {
      console.error('Error creating CRM integration:', error);
      throw error;
    }
  }

  /**
   * Import pools from CRM system
   */
  static async importPools(integrationId: string): Promise<ImportedPool[]> {
    try {
      // Get integration details with credentials
      const { data: integration, error } = await supabase
        .from('crm_integrations')
        .select(`
          *,
          crm_credentials (
            credential_type,
            encrypted_value,
            expires_at
          )
        `)
        .eq('id', integrationId)
        .single();

      if (error || !integration) {
        throw new Error('Integration not found');
      }

      // Build credentials object
      const credentials: CrmCredentials = {
        provider: integration.provider,
        base_url: integration.webhook_url
      };

      integration.crm_credentials.forEach((cred: any) => {
        switch (cred.credential_type) {
          case 'api_key':
            credentials.api_key = cred.encrypted_value;
            break;
          case 'oauth_token':
            credentials.oauth_token = cred.encrypted_value;
            break;
          case 'refresh_token':
            credentials.refresh_token = cred.encrypted_value;
            credentials.expires_at = cred.expires_at;
            break;
        }
      });

      // Create integration instance and get pool details
      const integrationInstance = IntegrationFactory.createIntegration(
        credentials, 
        integration.host_id
      );

      const poolDetails = await integrationInstance.getPoolDetails();
      
      // For simplicity, we'll return a single pool for now
      // In a real implementation, this would fetch multiple pools
      const importedPools: ImportedPool[] = [{
        external_id: poolDetails.external_id,
        title: poolDetails.title,
        description: poolDetails.description,
        location: poolDetails.location,
        amenities: poolDetails.amenities,
        price_per_day: poolDetails.price_per_day,
        max_guests: poolDetails.max_guests,
        images: poolDetails.images || []
      }];

      // Create pool mappings for imported pools
      const mappingInserts = importedPools.map(pool => ({
        crm_integration_id: integrationId,
        external_pool_id: pool.external_id,
        external_pool_name: pool.title,
        mapping_configuration: {
          imported_at: new Date().toISOString(),
          original_data: pool
        }
      }));

      const { error: mappingError } = await supabase
        .from('crm_pool_mappings')
        .insert(mappingInserts);

      if (mappingError) {
        console.error('Error creating pool mappings:', mappingError);
        // Don't throw error, just log it
      }

      return importedPools;
    } catch (error) {
      console.error('Error importing pools:', error);
      throw error;
    }
  }

  /**
   * Get pool mappings for an integration
   */
  static async getPoolMappings(integrationId: string): Promise<CrmPoolMapping[]> {
    try {
      const { data, error } = await supabase
        .from('crm_pool_mappings')
        .select('*')
        .eq('crm_integration_id', integrationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting pool mappings:', error);
      throw error;
    }
  }

  /**
   * Create a PoolPass pool from imported pool data
   */
  static async createPoolFromImport(
    hostId: string,
    importedPool: ImportedPool,
    mappingId: string
  ) {
    try {
      // Create the pool in PoolPass
      const { data: pool, error } = await supabase
        .from('pools')
        .insert({
          host_id: hostId,
          title: importedPool.title,
          description: importedPool.description,
          location: importedPool.location,
          price_per_hour: Math.round(importedPool.price_per_day / 8), // Rough conversion
          amenities: importedPool.amenities,
          pool_details: {
            max_guests: importedPool.max_guests,
            imported_from_crm: true,
            external_id: importedPool.external_id
          },
          images: importedPool.images,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      // Update the mapping to link to the created pool
      const { error: updateError } = await supabase
        .from('crm_pool_mappings')
        .update({
          poolpass_pool_id: pool.id,
          mapping_configuration: {
            ...{},
            pool_created_at: new Date().toISOString()
          }
        })
        .eq('id', mappingId);

      if (updateError) {
        console.error('Error updating pool mapping:', updateError);
      }

      return pool;
    } catch (error) {
      console.error('Error creating pool from import:', error);
      throw error;
    }
  }

  /**
   * Sync availability from CRM to PoolPass
   */
  static async syncAvailability(integrationId: string, poolId: string) {
    try {
      // Get integration details
      const { data: integration, error } = await supabase
        .from('crm_integrations')
        .select(`
          *,
          crm_credentials (
            credential_type,
            encrypted_value
          )
        `)
        .eq('id', integrationId)
        .single();

      if (error || !integration) {
        throw new Error('Integration not found');
      }

      // Build credentials and create integration instance
      const credentials: CrmCredentials = {
        provider: integration.provider
      };

      integration.crm_credentials.forEach((cred: any) => {
        if (cred.credential_type === 'api_key') {
          credentials.api_key = cred.encrypted_value;
        }
      });

      const integrationInstance = IntegrationFactory.createIntegration(
        credentials,
        integration.host_id
      );

      // Get availability from CRM
      const availability = await integrationInstance.getAvailability();

      // TODO: Update PoolPass availability calendar
      console.log('Synced availability:', availability.length, 'slots');

      return availability;
    } catch (error) {
      console.error('Error syncing availability:', error);
      throw error;
    }
  }
}
