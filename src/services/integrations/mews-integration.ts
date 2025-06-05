
import { BaseIntegration } from './base-integration';
import { Availability, PoolDetails } from '@/types/crm';

export class MewsIntegration extends BaseIntegration {
  private baseUrl = 'https://api.mews.com';

  protected getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.credentials.api_key}`,
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/api/connector/v1/enterprises/get`, {
        method: 'POST',
        body: JSON.stringify({
          ClientToken: this.credentials.api_key,
          AccessToken: this.credentials.oauth_token,
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Mews connection test failed:', error);
      return false;
    }
  }

  async getPoolDetails(): Promise<PoolDetails> {
    try {
      // Get hotel information
      const hotelResponse = await this.makeRequest(`${this.baseUrl}/api/connector/v1/enterprises/get`, {
        method: 'POST',
        body: JSON.stringify({
          ClientToken: this.credentials.api_key,
          AccessToken: this.credentials.oauth_token,
        }),
      });

      const hotelData = await hotelResponse.json();
      
      // Get resources (rooms/pools)
      const resourcesResponse = await this.makeRequest(`${this.baseUrl}/api/connector/v1/resources/getAll`, {
        method: 'POST',
        body: JSON.stringify({
          ClientToken: this.credentials.api_key,
          AccessToken: this.credentials.oauth_token,
        }),
      });

      const resourcesData = await resourcesResponse.json();
      
      // Filter for pool-related resources
      const poolResources = resourcesData.Resources?.filter((resource: any) => 
        resource.Name.toLowerCase().includes('pool') || 
        resource.Description?.toLowerCase().includes('pool')
      ) || [];

      if (poolResources.length === 0) {
        throw new Error('No pool resources found in Mews');
      }

      const poolResource = poolResources[0]; // Take the first pool resource

      return {
        external_id: poolResource.Id,
        title: poolResource.Name,
        description: poolResource.Description || '',
        location: hotelData.Enterprise?.Address?.Line1 || '',
        amenities: this.extractAmenities(poolResource),
        price_per_day: 50, // Default price, should be configured
        max_guests: poolResource.Capacity || 8,
        images: [],
      };
    } catch (error) {
      this.logSync('getPoolDetails', 'error', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async getAvailability(): Promise<Availability[]> {
    try {
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 30); // Get 30 days of availability

      const response = await this.makeRequest(`${this.baseUrl}/api/connector/v1/resources/getAvailability`, {
        method: 'POST',
        body: JSON.stringify({
          ClientToken: this.credentials.api_key,
          AccessToken: this.credentials.oauth_token,
          StartUtc: today.toISOString(),
          EndUtc: endDate.toISOString(),
        }),
      });

      const data = await response.json();
      
      return this.transformAvailability(data.ResourceAvailabilities || []);
    } catch (error) {
      this.logSync('getAvailability', 'error', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async syncBookings(): Promise<void> {
    try {
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 30);

      const response = await this.makeRequest(`${this.baseUrl}/api/connector/v1/reservations/getAll`, {
        method: 'POST',
        body: JSON.stringify({
          ClientToken: this.credentials.api_key,
          AccessToken: this.credentials.oauth_token,
          StartUtc: today.toISOString(),
          EndUtc: endDate.toISOString(),
        }),
      });

      const data = await response.json();
      
      // Process and sync bookings to PoolPass database
      // This would typically involve saving to Supabase
      console.log('Mews bookings synced:', data.Reservations?.length || 0);
      
      this.logSync('syncBookings', 'success', `Synced ${data.Reservations?.length || 0} bookings`);
    } catch (error) {
      this.logSync('syncBookings', 'error', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  private extractAmenities(resource: any): string[] {
    const amenities: string[] = [];
    
    if (resource.Description?.toLowerCase().includes('heated')) {
      amenities.push('Heated Pool');
    }
    if (resource.Description?.toLowerCase().includes('wifi')) {
      amenities.push('WiFi');
    }
    if (resource.Description?.toLowerCase().includes('towel')) {
      amenities.push('Towels Provided');
    }
    
    return amenities;
  }

  private transformAvailability(resourceAvailabilities: any[]): Availability[] {
    const availability: Availability[] = [];
    
    resourceAvailabilities.forEach((resource: any) => {
      resource.Availabilities?.forEach((avail: any) => {
        availability.push({
          date: avail.StartUtc.split('T')[0],
          start: '09:00',
          end: '18:00',
          is_booked: avail.Available === 0,
        });
      });
    });
    
    return availability;
  }
}
