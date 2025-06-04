import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Pool } from '@/types';

export const poolDataFallback: Pool = {
  id: "1",
  title: "Luxury Indoor Pool & Spa",
  description: "This stunning indoor pool and spa is located in a private residence in Kensington.",
  location: "Kensington, London",
  latitude: 51.5074,
  longitude: -0.1278,
  price_per_hour: 45,
  rating: 4.9,
  reviews_count: 128,
  images: [
    "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  ],
  amenities: [],
  extras: [
    { id: "towels", name: "Towels", price: 5 },
    { id: "sauna", name: "Sauna Session", price: 15 }
  ],
  pool_details: {
    size: "15m x 5m",
    depth: "1.4m constant",
    temperature: "29°C / 84°F",
    maxGuests: 8
  },
  available_time_slots: [
    { id: "full-day", time: "Full Day Access" }
  ],
  host_id: "host-1",
  host: {
    id: "host-1",
    full_name: "Default Host",
    avatar_url: "",
    created_at: "2023-01-01"
  },
  is_active: true,
  created_at: "2023-01-15",
  updated_at: "2023-01-15"
};

export const usePoolData = (id: string | undefined) => {
  const { data: poolData, isLoading } = useQuery({
    queryKey: ['pool', id],
    queryFn: async () => {
      if (!id) return poolDataFallback;

      const { data, error } = await supabase
        .from('pools')
        .select(`
          *,
          profiles:host_id (
            id,
            full_name,
            avatar_url,
            created_at
          )
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        console.error("Error fetching pool:", error);
        return poolDataFallback;
      }

      const processedData: Pool = {
        id: data.id,
        title: data.name,
        description: data.description,
        location: data.location,
        latitude: undefined, // not in schema currently
        longitude: undefined, // not in schema currently
        price_per_hour: data.price,
        rating: data.rating,
        reviews_count: data.reviews,
        images: data.images,
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        extras: Array.isArray(data.extras) ? data.extras : [],
        pool_details: data.pool_details || {
          size: "Unknown",
          depth: "Unknown",
          temperature: "Unknown",
          maxGuests: 1
        },
        available_time_slots: [
          { id: "full-day", time: "Full Day Access" } // Supabase schema does not include this yet
        ],
        host_id: data.host_id,
        host: data.profiles || {
          id: data.host_id,
          full_name: "Unknown Host",
          avatar_url: "",
          created_at: ""
        },
        is_active: true,
        created_at: data.created_at,
        updated_at: data.created_at // No `updated_at` in schema
      };

      return processedData;
    },
    enabled: !!id,
  });

  return {
    poolData: poolData || poolDataFallback,
    isLoading,
  };
};
