export type User = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  user_type: 'guest' | 'host' | 'admin';
  phone?: string;
  bio?: string;
  created_at: string;
};

export type Pool = {
  id: string;
  title: string; // Mapped from Supabase 'title'
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  price_per_hour: number; // Mapped from Supabase 'price_per_hour'
  rating: number;
  reviews_count: number; // Mapped from Supabase 'reviews_count'
  images: string[];
  amenities: Amenity[]; // Changed from any[] to Amenity[]
  extras: Extra[];
  pool_details: PoolDetails;
  available_time_slots: TimeSlot[];
  host_id: string;
  host?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    created_at: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Extra = {
  id: string;
  name: string;
  price: number;
};

export type PoolDetails = {
  size: string;
  depth: string;
  temperature: string;
  maxGuests: number;
};

export type TimeSlot = {
  id: string;
  time: string;
};

export type Review = {
  id: string;
  pool_id: string;
  user_id: string;
  rating: number;
  comment: string; // Make comment required to match component expectations
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
  user?: string; // Add processed fields for display
  avatar?: string;
  date?: string;
};

export type Booking = {
  id: string;
  pool_id: string;
  user_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests?: string;
  created_at: string;
  updated_at: string;
  pools?: Pool;
  profiles?: User;
};

export type Amenity = {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  created_at: string;
  included?: boolean; // Add for PoolInfo component compatibility
};

export type PoolAmenity = {
  id: string;
  pool_id: string;
  amenity_id: string;
  amenities?: Amenity;
};

export type Payment = {
  id: string;
  booking_id: string;
  stripe_payment_intent_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  host_payout_amount?: number;
  platform_fee?: number;
  processed_at?: string;
  created_at: string;
  updated_at: string;
};

export type HostPayout = {
  id: string;
  host_id: string;
  payment_id: string;
  amount: number;
  currency: string;
  stripe_transfer_id?: string;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  processed_at?: string;
  created_at: string;
};

export type CrmIntegration = {
  id: string;
  host_id: string;
  provider: 'mews' | 'cloudbeds' | 'custom';
  api_key?: string;
  oauth_token?: string;
  refresh_token?: string;
  base_url?: string;
  client_id?: string;
  expires_at?: string;
  is_active: boolean;
  last_sync_at?: string;
  created_at: string;
  updated_at: string;
};

export type AvailabilitySyncLog = {
  id: string;
  pool_id: string;
  crm_integration_id: string;
  sync_type: 'availability' | 'pools' | 'bookings';
  status: 'success' | 'error' | 'in_progress';
  message?: string;
  synced_data?: any;
  created_at: string;
};
