
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileFilterToggle from '@/components/pools/MobileFilterToggle';
import PoolFilters from '@/components/pools/PoolFilters';
import PoolGrid from '@/components/pools/PoolGrid';
import PoolResultsHeader from '@/components/pools/PoolResultsHeader';
import SearchHeader from '@/components/pools/SearchHeader';
import { usePoolFilters } from '@/hooks/use-pool-filters';
import { realHotelPools } from '@/data/mockPools';
import { amenitiesOptions } from '@/constants/amenities';

const Pools = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const {
    priceRange,
    setPriceRange,
    selectedAmenities,
    setSelectedAmenities,
    poolType,
    setPoolType,
    sortOrder,
    setSortOrder,
    sortedPools,
    resetFilters
  } = usePoolFilters(realHotelPools);
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <SearchHeader />
        
        <div className="container mx-auto px-4 py-8">
          <div className="lg:flex gap-6">
            <MobileFilterToggle 
              isFilterOpen={isFilterOpen} 
              toggleFilter={() => setIsFilterOpen(!isFilterOpen)} 
            />
            
            <aside className={`lg:w-1/4 space-y-6 mb-8 lg:mb-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
              <PoolFilters 
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedAmenities={selectedAmenities}
                setSelectedAmenities={setSelectedAmenities}
                poolType={poolType}
                setPoolType={setPoolType}
                amenitiesOptions={amenitiesOptions}
                clearFilters={resetFilters}
              />
            </aside>
            
            <div className="lg:w-3/4">
              <PoolResultsHeader 
                count={sortedPools.length}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              
              <PoolGrid 
                pools={sortedPools}
                resetFilters={resetFilters}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pools;
