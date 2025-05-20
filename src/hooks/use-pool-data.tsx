
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Pool } from '@/types';

// Type for host profile data
interface HostProfile {
  id?: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  [key: string]: any; // For other potential properties
}

// Mock data for a fallback when API is not available
const poolDataFallback = {
  id: "1",
  name: "Luxury Indoor Pool & Spa",
  description: "This stunning indoor pool and spa is located in a private residence in Kensington. The heated pool is 15m x 5m with a constant depth of 1.4m, perfect for swimming laps or relaxing. The space includes loungers, changing facilities, and optional towel service. The ambient lighting and modern design create a serene atmosphere for your swimming experience.",
  location: "Kensington, London",
  price: 45,
  rating: 4.9,
  reviews: 128,
  indoor_outdoor: "indoor" as const,
  images: [
    "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  ],
  amenities: [
    { name: "Heated Pool", included: true },
    { name: "Loungers", included: true },
    { name: "Towels", included: false },
    { name: "Changing Room", included: true },
    { name: "Jacuzzi", included: true },
    { name: "Sauna", included: false },
    { name: "Parking", included: true },
    { name: "WiFi", included: true },
  ],
  extras: [
    { id: "towels", name: "Towels", price: 5 },
    { id: "sauna", name: "Sauna Session", price: 15 },
    { id: "drinks", name: "Welcome Drinks", price: 8 },
    { id: "instructor", name: "Swimming Instructor (30 min)", price: 25 },
  ],
  pool_details: {
    size: "15m x 5m",
    depth: "1.4m constant",
    temperature: "29°C / 84°F",
    maxGuests: 8
  },
  host: {
    id: "host-1",
    name: "Emma",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    responseTime: "Within an hour",
    joinedDate: "March 2022"
  },
  available_time_slots: [
    { id: "full-day", time: "Full Day Access" },
  ],
  host_id: "host-1",
  created_at: "2023-01-15",
};

// Type for processed pool data - fixing missing id property in host
interface ProcessedPoolData extends Omit<Pool, 'host'> {
  reviewsData?: any[];
  host: {
    id?: string | undefined;
    name: string;
    image: string;
    responseTime: string;
    joinedDate: string;
  };
}

export const usePoolData = (id: string | undefined) => {
  // Fetch pool data
  const { data: rawPoolData, isLoading } = useQuery({
    queryKey: ['pool', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('pools')
          .select(`
            *,
            host:host_id (*)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Process the data to match our expected format
          const hostData = data.host as HostProfile || {};
          
          const processedData = {
            ...data,
            amenities: Array.isArray(data.amenities) ? data.amenities : [],
            extras: Array.isArray(data.extras) ? data.extras : [],
            pool_details: data.pool_details || {
              size: "Unknown",
              depth: "Unknown",
              temperature: "Unknown",
              maxGuests: 1
            },
            // If host information exists, format it, otherwise use fallback
            host: {
              id: hostData?.id,
              name: hostData?.full_name || "Host",
              image: hostData?.avatar_url || "https://via.placeholder.com/40",
              responseTime: "Within a day",
              joinedDate: hostData?.created_at 
                ? new Date(hostData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                : "Unknown"
            },
            available_time_slots: [
              { id: "full-day", time: "Full Day Access" },
            ]
          };
          return processedData;
        }
        
        return poolDataFallback;
      } catch (error) {
        console.error("Error fetching pool:", error);
        return poolDataFallback;
      }
    },
    enabled: !!id,
  });

  const poolData: ProcessedPoolData = rawPoolData as ProcessedPoolData;

  return { poolData, isLoading };
};

export { poolDataFallback };
