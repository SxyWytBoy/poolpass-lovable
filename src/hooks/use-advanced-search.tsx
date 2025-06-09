
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SearchFilters {
  searchText: string;
  minPrice: number | null;
  maxPrice: number | null;
  selectedAmenities: string[];
  poolTypes: string[];
  minRating: number | null;
  maxGuests: number | null;
  checkIn: Date | null;
  checkOut: Date | null;
  location: string;
  radius: number;
  sortBy: 'price' | 'rating' | 'distance' | 'newest';
  sortOrder: 'asc' | 'desc';
}

interface PoolAmenity {
  amenities: {
    id: string;
    name: string;
    icon: string;
  };
}

interface Pool {
  id: string;
  title: string;
  location: string;
  price_per_hour: number;
  rating: number;
  reviews_count: number;
  images: string[];
  max_guests?: number;
  pool_amenities?: PoolAmenity[];
  instant_book?: boolean;
  is_active: boolean;
  host_id: string;
  description?: string;
  created_at: string;
}

interface Amenity {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export const useAdvancedSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchText: '',
    minPrice: null,
    maxPrice: null,
    selectedAmenities: [],
    poolTypes: [],
    minRating: null,
    maxGuests: null,
    checkIn: null,
    checkOut: null,
    location: '',
    radius: 25,
    sortBy: 'rating',
    sortOrder: 'desc'
  });

  const { data: amenities = [] } = useQuery<Amenity[]>({
    queryKey: ['amenities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('amenities')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: pools = [], isLoading, refetch } = useQuery<Pool[]>({
    queryKey: ['advanced-search', filters],
    queryFn: async () => {
      let query = supabase
        .from('pools')
        .select(`
          *,
          profiles:host_id (id, full_name, avatar_url),
          pool_amenities!inner (
            amenities (id, name, icon)
          )
        `)
        .eq('is_active', true);

      // Apply text search
      if (filters.searchText) {
        query = query.or(`title.ilike.%${filters.searchText}%,location.ilike.%${filters.searchText}%,description.ilike.%${filters.searchText}%`);
      }

      // Apply price filters
      if (filters.minPrice !== null) {
        query = query.gte('price_per_hour', filters.minPrice);
      }
      if (filters.maxPrice !== null) {
        query = query.lte('price_per_hour', filters.maxPrice);
      }

      // Apply rating filter
      if (filters.minRating !== null) {
        query = query.gte('rating', filters.minRating);
      }

      // Apply max guests filter
      if (filters.maxGuests !== null) {
        query = query.gte('max_guests', filters.maxGuests);
      }

      // Apply sorting
      const sortColumn = filters.sortBy === 'price' ? 'price_per_hour' : 
                        filters.sortBy === 'newest' ? 'created_at' : 
                        filters.sortBy;
      
      query = query.order(sortColumn, { ascending: filters.sortOrder === 'asc' });

      const { data, error } = await query;
      if (error) throw error;

      // Filter by amenities if selected
      if (filters.selectedAmenities.length > 0) {
        return data.filter(pool => {
          const poolAmenityIds = pool.pool_amenities?.map((pa: PoolAmenity) => pa.amenities.id) || [];
          return filters.selectedAmenities.every(amenityId => 
            poolAmenityIds.includes(amenityId)
          );
        });
      }

      return data;
    },
    enabled: true
  });

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchText: '',
      minPrice: null,
      maxPrice: null,
      selectedAmenities: [],
      poolTypes: [],
      minRating: null,
      maxGuests: null,
      checkIn: null,
      checkOut: null,
      location: '',
      radius: 25,
      sortBy: 'rating',
      sortOrder: 'desc'
    });
  };

  return {
    filters,
    updateFilter,
    resetFilters,
    pools,
    amenities,
    isLoading,
    refetch
  };
};
