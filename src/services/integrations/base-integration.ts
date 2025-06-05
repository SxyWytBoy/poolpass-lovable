
import { HotelIntegration, Availability, PoolDetails, CrmCredentials } from '@/types/crm';

export abstract class BaseIntegration implements HotelIntegration {
  protected credentials: CrmCredentials;
  protected hostId: string;

  constructor(credentials: CrmCredentials, hostId: string) {
    this.credentials = credentials;
    this.hostId = hostId;
  }

  abstract getAvailability(): Promise<Availability[]>;
  abstract getPoolDetails(): Promise<PoolDetails>;
  abstract syncBookings(): Promise<void>;
  abstract testConnection(): Promise<boolean>;

  protected async makeRequest(
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> {
    const headers = this.getAuthHeaders();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  protected abstract getAuthHeaders(): Record<string, string>;

  protected logSync(type: string, status: 'success' | 'error', message?: string) {
    console.log(`[${this.credentials.provider}] ${type}: ${status}`, message);
    // This would typically save to database
  }
}
