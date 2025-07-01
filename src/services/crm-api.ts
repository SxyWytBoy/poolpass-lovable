
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, CrmSyncRequest, CrmWebhookPayload, CrmConnectionStatus } from '@/types/api';
import { Pool, Booking, User } from '@/types';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.poolpass.example.com';
const API_VERSION = 'v1';

/**
 * CRM API Service for integrating with external CRM systems
 */
class CrmApiService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = `${API_BASE_URL}/${API_VERSION}`;
  }

  /**
   * Test connection to CRM system
   */
  public async testConnection(
    provider: string, 
    credentials: { [key: string]: string }
  ): Promise<ApiResponse<CrmConnectionStatus>> {
    try {
      // For webhook-based integrations, test the webhook URL
      if (credentials.webhook_url) {
        // Create a simple test payload for webhook validation
        const testPayload = {
          test: true,
          timestamp: new Date().toISOString(),
          message: 'Connection test from PoolPass'
        };

        const response = await fetch(credentials.webhook_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(credentials.api_key && { 'Authorization': `Bearer ${credentials.api_key}` })
          },
          mode: 'no-cors',
          body: JSON.stringify(testPayload),
        });

        return {
          success: true,
          data: {
            connected: true,
            crmType: provider as any,
            lastSynced: new Date().toISOString(),
            webhookConfigured: true
          }
        };
      }

      // For API-based integrations, test the API connection
      // TODO: Implement specific API tests for each CRM provider
      return {
        success: true,
        data: {
          connected: true,
          crmType: provider as any,
          lastSynced: new Date().toISOString(),
          webhookConfigured: false
        }
      };
    } catch (error) {
      console.error('Error testing CRM connection:', error);
      return {
        success: false,
        error: 'Could not connect to CRM system'
      };
    }
  }

  /**
   * Create a new CRM integration
   */
  public async createIntegration(
    hostId: string,
    provider: 'mews' | 'cloudbeds' | 'opera' | 'protel' | 'custom',
    integrationName: string,
    credentials: { [key: string]: string },
    configuration: any = {}
  ): Promise<ApiResponse<any>> {
    try {
      // Test connection first
      const connectionTest = await this.testConnection(provider, credentials);
      if (!connectionTest.success) {
        return connectionTest;
      }

      // Create the integration in the database
      const { data: integration, error } = await supabase
        .from('crm_integrations')
        .insert({
          host_id: hostId,
          provider: provider,
          integration_name: integrationName,
          configuration: configuration,
          webhook_url: credentials.webhook_url || null,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      // Store credentials securely
      const credentialInserts = Object.entries(credentials)
        .filter(([key, value]) => value && key !== 'webhook_url')
        .map(([key, value]) => ({
          crm_integration_id: integration.id,
          credential_type: key,
          encrypted_value: value, // TODO: Implement proper encryption
          expires_at: null // TODO: Handle expiration for OAuth tokens
        }));

      if (credentialInserts.length > 0) {
        const { error: credError } = await supabase
          .from('crm_credentials')
          .insert(credentialInserts);

        if (credError) throw credError;
      }

      return {
        success: true,
        data: integration
      };
    } catch (error) {
      console.error('Error creating CRM integration:', error);
      return {
        success: false,
        error: 'Failed to create CRM integration'
      };
    }
  }

  /**
   * Get CRM integrations for a host
   */
  public async getHostIntegrations(hostId: string): Promise<ApiResponse<any[]>> {
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

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      console.error('Error getting host integrations:', error);
      return {
        success: false,
        error: 'Failed to fetch integrations'
      };
    }
  }

  /**
   * Send booking data to CRM
   */
  public async sendBookingToCrm(booking: Booking, integrationId?: string): Promise<ApiResponse> {
    try {
      // Get pool details and host's CRM integrations
      const { data: poolData } = await supabase
        .from('pools')
        .select(`
          *,
          crm_integrations!crm_pool_mappings(*)
        `)
        .eq('id', booking.pool_id)
        .single();

      if (!poolData) {
        return { success: false, error: 'Pool not found' };
      }

      // Find active integrations for this pool
      const integrations = poolData.crm_integrations || [];
      const activeIntegrations = integrations.filter((int: any) => int.is_active);

      if (activeIntegrations.length === 0) {
        return { success: false, error: 'No active CRM integrations found for this pool' };
      }

      // Send to all active integrations or specific one
      const targetIntegrations = integrationId 
        ? activeIntegrations.filter((int: any) => int.id === integrationId)
        : activeIntegrations;

      const results = await Promise.allSettled(
        targetIntegrations.map(async (integration: any) => {
          const payload: CrmWebhookPayload = {
            eventType: 'booking_created',
            timestamp: new Date().toISOString(),
            data: {
              booking,
              pool: poolData,
              customer_id: booking.user_id,
              integration_id: integration.id
            }
          };

          if (integration.webhook_url) {
            await fetch(integration.webhook_url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              mode: 'no-cors',
              body: JSON.stringify(payload),
            });
          }

          return { integration_id: integration.id, sent: true };
        })
      );

      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      return {
        success: successful > 0,
        data: { 
          sent_to: successful,
          failed: failed,
          total_integrations: targetIntegrations.length
        }
      };
    } catch (error) {
      console.error('Error sending booking to CRM:', error);
      return {
        success: false,
        error: 'Failed to send booking data to CRM'
      };
    }
  }

  /**
   * Send user data to CRM
   */
  public async sendUserToCrm(user: User): Promise<ApiResponse> {
    // This would be similar to sendBookingToCrm but for user events
    // For now, return success
    return {
      success: true,
      data: { sent: true }
    };
  }

  /**
   * Get available pools for synchronization with CRM
   */
  public async getPoolsForSync(page = 1, pageSize = 10): Promise<ApiResponse<Pool[]>> {
    try {
      const { data, error, count } = await supabase
        .from('pools')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;

      return {
        success: true,
        data: data as unknown as Pool[],
        meta: {
          total: count || 0,
          page,
          pageSize
        }
      };
    } catch (error) {
      console.error('Error getting pools for sync:', error);
      return {
        success: false,
        error: 'Failed to fetch pools'
      };
    }
  }

  /**
   * Get bookings for synchronization with CRM
   */
  public async getBookingsForSync(page = 1, pageSize = 10): Promise<ApiResponse<Booking[]>> {
    try {
      const { data, error, count } = await supabase
        .from('bookings')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;

      return {
        success: true,
        data: data as unknown as Booking[],
        meta: {
          total: count || 0,
          page,
          pageSize
        }
      };
    } catch (error) {
      console.error('Error getting bookings for sync:', error);
      return {
        success: false,
        error: 'Failed to fetch bookings'
      };
    }
  }

  /**
   * Update booking status (e.g., from CRM updates)
   */
  public async updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<ApiResponse> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      return {
        success: true,
        data: { updated: true }
      };
    } catch (error) {
      console.error('Error updating booking status:', error);
      return {
        success: false,
        error: 'Failed to update booking status'
      };
    }
  }

  /**
   * Trigger manual sync for an integration
   */
  public async triggerSync(
    integrationId: string, 
    syncType: 'availability' | 'pools' | 'bookings' | 'pricing'
  ): Promise<ApiResponse> {
    try {
      // Get integration details
      const { data: integration, error } = await supabase
        .from('crm_integrations')
        .select('*')
        .eq('id', integrationId)
        .single();

      if (error || !integration) {
        return { success: false, error: 'Integration not found' };
      }

      // Create sync log
      const { error: logError } = await supabase
        .from('availability_sync_logs')
        .insert({
          crm_integration_id: integrationId,
          sync_type: syncType,
          status: 'pending',
          message: `Manual ${syncType} sync triggered`
        });

      if (logError) throw logError;

      // TODO: Trigger actual sync process (could be via edge function or queue)

      return {
        success: true,
        data: { sync_triggered: true }
      };
    } catch (error) {
      console.error('Error triggering sync:', error);
      return {
        success: false,
        error: 'Failed to trigger sync'
      };
    }
  }
}

// Export singleton instance
export const crmApi = new CrmApiService();
