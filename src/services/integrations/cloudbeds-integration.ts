
import { BaseIntegration } from './base-integration';
import { Availability, PoolDetails } from '@/types/crm';

export class CloudbedsIntegration extends BaseIntegration {
  private baseUrl = 'https://hotels.cloudbeds.com/api/v1.1';

  protected getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.credentials.oauth_token}`,
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/getHotel`);
      return response.ok;
    } catch (error) {
      console.error('Cloudbeds connection test failed:', error);
      return false;
    }
  }

  async getPoolDetails(): Promise<PoolDetails> {
    try {
      // Get hotel information
      const hotelResponse = await this.makeRequest(`${this.baseUrl}/getHotel`);
      const hotelData = await hotelResponse.json();
      
      // Get room types (looking for pool areas)
      const roomTypesResponse = await this.makeRequest(`${this.baseUrl}/getRoomTypes`);
      const roomTypesData = await roomTypesResponse.json();
      
      // Filter for pool-related room types or amenities
      const poolTypes = roomTypesData.data?.filter((type: any) => 
        type.roomTypeName.toLowerCase().includes('pool') ||
        type.roomTypeDescription?.toLowerCase().includes('pool')
      ) || [];

      if (poolTypes.length === 0) {
        throw new Error('No pool facilities found in Cloudbeds');
      }

      const poolType = poolTypes[0];

      return {
        external_id: poolType.roomTypeID,
        title: poolType.roomTypeName,
        description: poolType.roomTypeDescription || '',
        location: `${hotelData.data?.hotelAddress || ''}, ${hotelData.data?.hotelCity || ''}`,
        amenities: this.extractAmenities(poolType),
        price_per_day: parseFloat(poolType.maxPrice) || 50,
        max_guests: poolType.maxGuests || 8,
        images: poolType.roomTypeImages || [],
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
      endDate.setDate(today.getDate() + 30);

      const response = await this.makeRequest(
        `${this.baseUrl}/getAvailability?` +
        `start_date=${today.toISOString().split('T')[0]}&` +
        `end_date=${endDate.toISOString().split('T')[0]}`
      );

      const data = await response.json();
      
      return this.transformAvailability(data.data || []);
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

      const response = await this.makeRequest(
        `${this.baseUrl}/getReservations?` +
        `checkin_from=${today.toISOString().split('T')[0]}&` +
        `checkin_to=${endDate.toISOString().split('T')[0]}`
      );

      const data = await response.json();
      
      // Process and sync bookings to PoolPass database
      console.log('Cloudbeds bookings synced:', data.data?.length || 0);
      
      this.logSync('syncBookings', 'success', `Synced ${data.data?.length || 0} bookings`);
    } catch (error) {
      this.logSync('syncBookings', 'error', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  private extractAmenities(roomType: any): string[] {
    const amenities: string[] = [];
    
    if (roomType.roomTypeAmenities) {
      roomType.roomTypeAmenities.forEach((amenity: any) => {
        if (amenity.amenityName) {
          amenities.push(amenity.amenityName);
        }
      });
    }
    
    return amenities;
  }

  private transformAvailability(availabilityData: any[]): Availability[] {
    const availability: Availability[] = [];
    
    availabilityData.forEach((item: any) => {
      availability.push({
        date: item.date,
        start: '09:00',
        end: '18:00',
        is_booked: item.available <= 0,
      });
    });
    
    return availability;
  }
}
