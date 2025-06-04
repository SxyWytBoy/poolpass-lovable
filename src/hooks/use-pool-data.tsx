import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Pool } from '@/types';
import { Json } from '@/types/supabase'; // or 'supabase-js' if that's what you use

// Fallback mock data
const poolDataFallback: Pool = {
  id: "1",
  title: "Luxury Indoor Pool & Spa",
  description: "This stunning indoor pool and spa is located in a private residence in Kensington. The heated pool is 15m x 5m with a constant depth of 1.4m, perfect for swimming laps or relaxing.",
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
  is_active: true,
  created_at: "2023-01-15",
  updated_at: "2023-01-15"
};

// Type guards
function isExtraArray(value: Json): value is { id: string; name: string; price: number }[] {
  return Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'name' in item &&
        'price' in item
    );
}

function isPoolDetails(value: Json): value is {
  size: string;
  depth: string;
  temperature: string;
  maxGuests: number;
} {
  return (
    typeof value === 'object' &&
    value !== null &&
    'size' in value &&
    'depth' in value &&
    'temperature' in value &&
    'maxGuests' in value
  );
}

function isTimeSlotArray(value: Json): value is { id: string; time: string }[] {
  return Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'time' in item
    );
}

// Main hook
export const usePoolData = (id: string | undefined) => {
  const { data: poolData, isLoading } = useQuery({
    queryKey: ['pool', id],
    queryFn: async () => {
      if (!id) return poolDataFallback;

      try {
        const { data, error } = await supabase
          .from('pools')
          .select(`
            *,
            host:host_id (
              id,
              full_name,
              avatar_url,
              created_at
            )
          `)
          .eq('id', id)
          .eq('is_active', true)
          .single();

        if (error) {
          console.error("Error fetching pool:", error);
          return poolDataFallback;
        }

        if (data) {
          const processedData: Pool = {
            ...data,
            amenities: Array.isArray(data.amenities) ? data.amenities : [],
            extras: isExtraArray(data.extras) ? data.extras : [],
            pool_details: isPoolDetails(data.pool_details)
              ? data.pool_details
              : {
                  size: "Unknown",
                  depth: "Unknown",
                  temperature: "Unknown",
                  maxGuests: 1
                },
            available_time_slots: isTimeSlotArray(data.available_time_slots)
              ? data.available_time_slots
              : [{ id: "full-day", time: "Full Day Access" }]
          };

          return processedData;
        }

        return poolDataFallback;
      } catch (error) {
        console.error("Error fetching pool:", error);
        return poolDataFallback;
      }
    },
    enabled: !!id
  });

  return { poolData: poolData || poolDataFallback, isLoading };
};

export { poolDataFallback };
