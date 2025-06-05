
export interface HotelIntegration {
  getAvailability(): Promise<Availability[]>;
  getPoolDetails(): Promise<PoolDetails>;
  syncBookings(): Promise<void>;
  testConnection(): Promise<boolean>;
}

export interface Availability {
  date: string;
  start: string;
  end: string;
  is_booked: boolean;
  pool_id?: string;
}

export interface PoolDetails {
  external_id: string;
  title: string;
  description?: string;
  location: string;
  amenities: string[];
  price_per_day: number;
  max_guests: number;
  images?: string[];
}

export interface CrmCredentials {
  provider: 'mews' | 'cloudbeds' | 'custom';
  api_key?: string;
  oauth_token?: string;
  refresh_token?: string;
  base_url?: string;
  client_id?: string;
  expires_at?: string;
}

export interface CrmSyncLog {
  id: string;
  host_id: string;
  provider: string;
  sync_type: 'availability' | 'pools' | 'bookings';
  status: 'success' | 'error' | 'in_progress';
  message?: string;
  synced_at: string;
}
