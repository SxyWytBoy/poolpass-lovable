
import { useState, useMemo, useEffect } from 'react';
import { PoolItem } from '@/components/pools/PoolGrid';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/contexts/LocationContext';

export const usePoolFilters = (pools: PoolItem[]) => {
  const { currentLocation } = useLocation();
  const { toast } = useToast();
  
  // Set different price ranges based on location
  const maxPrice = currentLocation === 'london' ? 200 : 2500;
  
  const [priceRange, setPriceRange] = useState<number[]>([0, maxPrice]);
  
  // Update price range when location changes
  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [currentLocation, maxPrice]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [poolType, setPoolType] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("price_asc");
  
  // Reset filters function - update price range based on location
  const resetFilters = () => {
    setPriceRange([0, maxPrice]);
    setSelectedAmenities([]);
    setPoolType("all");
    
    toast({
      title: "Filters reset",
      description: "All filters have been reset to default values.",
    });
  };
  
  // Filter pools based on selected filters
  const filteredPools = useMemo(() => {
    return pools.filter(pool => {
      // Filter by price
      if (pool.price < priceRange[0] || pool.price > priceRange[1]) return false;
      
      // Filter by pool type
      if (poolType !== "all" && pool.indoorOutdoor !== poolType) return false;
      
      // Filter by amenities
      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every(amenity => 
          pool.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }
      
      return true;
    });
  }, [pools, priceRange, poolType, selectedAmenities]);
  
  // Sort pools based on selected sort option
  const sortedPools = useMemo(() => {
    return [...filteredPools].sort((a, b) => {
      switch (sortOrder) {
        case "price_desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviews - a.reviews;
        case "price_asc":
        default:
          return a.price - b.price;
      }
    });
  }, [filteredPools, sortOrder]);
  
  return {
    priceRange,
    setPriceRange,
    selectedAmenities,
    setSelectedAmenities,
    poolType,
    setPoolType,
    sortOrder,
    setSortOrder,
    sortedPools,
    resetFilters,
    maxPrice
  };
};
