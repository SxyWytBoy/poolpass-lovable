
import React from 'react';
import PoolCard from '@/components/PoolCard';
import { Button } from '@/components/ui/button';

export interface PoolItem {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  indoorOutdoor: 'indoor' | 'outdoor' | 'both';
  amenities: string[];
}

interface PoolGridProps {
  pools: PoolItem[];
  resetFilters: () => void;
}

// Fallback images by pool type
const fallbackImages = {
  indoor: "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  outdoor: "https://images.unsplash.com/photo-1477120292453-dbba2d987c24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  both: "https://images.unsplash.com/photo-1615394717477-43fe6ee0def3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
};

const PoolGrid = ({ pools, resetFilters }: PoolGridProps) => {
  if (pools.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg text-center">
        <h3 className="text-lg font-medium mb-2">No pools match your filters</h3>
        <p className="text-gray-500 mb-4">Try adjusting your filter criteria to find more options.</p>
        <Button 
          variant="outline" 
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pools.map((pool) => (
        <PoolCard
          key={pool.id}
          id={pool.id}
          name={pool.name}
          location={pool.location}
          price={pool.price}
          rating={pool.rating}
          reviews={pool.reviews}
          image={pool.image}
          indoorOutdoor={pool.indoorOutdoor}
          amenities={pool.amenities}
          fallbackImage={fallbackImages[pool.indoorOutdoor]}
        />
      ))}
    </div>
  );
};

export default PoolGrid;
