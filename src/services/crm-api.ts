
import { supabase } from '@/lib/supabase';
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
  private webhookUrl: string | null = null;
  private apiKey: string | null = null;

  constructor() {
    this.apiUrl = `${API_BASE_URL}/${API_VERSION}`;
    // Load from localStorage for front-end usage
    this.loadCredentials();
  }

  /**
   * Load credentials from localStorage if available
   */
  private loadCredentials(): void {
    try {
      this.webhookUrl = localStorage.getItem('crm_webhook_url');
      this.apiKey = localStorage.getItem('crm_api_key');
    } catch (error) {
      console.warn('Could not load CRM credentials from localStorage');
    }
  }

  /**
   * Save credentials to localStorage
   */
  public saveCredentials(webhookUrl: string, apiKey: string): void {
    try {
      localStorage.setItem('crm_webhook_url', webhookUrl);
      localStorage.setItem('crm_api_key', apiKey);
      this.webhookUrl = webhookUrl;
      this.apiKey = apiKey;
    } catch (error) {
      console.error('Could not save CRM credentials to localStorage');
    }
  }

  /**
   * Test connection to CRM webhook
   */
  public async testConnection(webhookUrl: string): Promise<ApiResponse<CrmConnectionStatus>> {
    try {
      const testPayload: CrmWebhookPayload = {
        eventType: 'booking_created',
        timestamp: new Date().toISOString(),
        data: {
          test: true,
          message: 'This is a test payload from PoolPass'
        }
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors', // Add this to handle CORS
        body: JSON.stringify(testPayload),
      });

      return {
        success: true,
        data: {
          connected: true,
          crmType: 'custom',
          lastSynced: new Date().toISOString(),
          webhookConfigured: true
        }
      };
    } catch (error) {
      console.error('Error testing CRM connection:', error);
      return {
        success: false,
        error: 'Could not connect to CRM webhook URL'
      };
    }
  }

  /**
   * Send booking data to CRM
   */
  public async sendBookingToCrm(booking: Booking): Promise<ApiResponse> {
    if (!this.webhookUrl) {
      return {
        success: false,
        error: 'CRM webhook URL not configured'
      };
    }

    try {
      // Get additional booking data if needed
      const { data: poolData } = await supabase
        .from('pools')
        .select('name, location, price')
        .eq('id', booking.pool_id)
        .single();

      const payload: CrmWebhookPayload = {
        eventType: 'booking_created',
        timestamp: new Date().toISOString(),
        data: {
          booking,
          pool: poolData,
          customer_id: booking.user_id,
        }
      };

      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });

      return {
        success: true,
        data: { sent: true }
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
    if (!this.webhookUrl) {
      return {
        success: false,
        error: 'CRM webhook URL not configured'
      };
    }

    try {
      const payload: CrmWebhookPayload = {
        eventType: 'user_created',
        timestamp: new Date().toISOString(),
        data: {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            user_type: user.user_type,
            created_at: user.created_at
          }
        }
      };

      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });

      return {
        success: true,
        data: { sent: true }
      };
    } catch (error) {
      console.error('Error sending user to CRM:', error);
      return {
        success: false,
        error: 'Failed to send user data to CRM'
      };
    }
  }

  /**
   * Get available pools for synchronization with CRM
   */
  public async getPoolsForSync(page = 1, pageSize = 10): Promise<ApiResponse<Pool[]>> {
    try {
      const { data, error, count } = await supabase
        .from('pools')
        .select('*', { count: 'exact' })
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
  public async updateBookingStatus(bookingId: string, status: 'confirmed' | 'cancelled' | 'completed'): Promise<ApiResponse> {
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
}

// Export singleton instance
export const crmApi = new CrmApiService();
