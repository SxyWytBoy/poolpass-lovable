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
  title: string; // Mapped from Supabase 'name'
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  price_per_hour: number; // Mapped from Supabase 'price'
  rating: number;
  reviews_count: number; // Mapped from Supabase 'reviews'
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
  comment?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
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
};

export type PoolAmenity = {
  id: string;
  pool_id: string;
  amenity_id: string;
  amenities?: Amenity;
};
