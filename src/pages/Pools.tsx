
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileFilterToggle from '@/components/pools/MobileFilterToggle';
import PoolFilters from '@/components/pools/PoolFilters';
import PoolGrid, { PoolItem } from '@/components/pools/PoolGrid';
import PoolResultsHeader from '@/components/pools/PoolResultsHeader';
import SearchHeader from '@/components/pools/SearchHeader';
import { useToast } from '@/components/ui/use-toast';
import { realHotelPools } from '@/data/mockPools';

const amenitiesOptions = [
  "Heated",
  "Loungers", 
  "Towels Provided",
  "Food Available",
  "Changing Rooms",
  "Hot Tub/Jacuzzi",
  "Sauna",
  "WiFi",
  "Bar Service",
  "Parking",
  "Accessible",
  "Child Friendly",
  "City Views",
  "Sea Views",
  "Mountain Views",
  "Spa",
  "Steam Room",
  "Hydrotherapy",
  "Fitness Center",
  "Business Center",
  "Beach Access",
  "Garden Setting",
  "Historic Property",
  "Luxury Service",
  "Infinity Pool",
  "Private Cabanas",
  "Champagne Service",
  "Michelin Star Restaurant",
  "Wildlife Views",
  "Northern Lights"
];

const Pools = () => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 300]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [poolType, setPoolType] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("price_asc");
  const { toast } = useToast();
  
  // Reset filters function
  const resetFilters = () => {
    setPriceRange([0, 300]);
    setSelectedAmenities([]);
    setPoolType("all");
    
    toast({
      title: "Filters reset",
      description: "All filters have been reset to default values.",
    });
  };
  
  // Filter pools based on selected filters
  const filteredPools = realHotelPools.filter(pool => {
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
  
  // Sort pools based on selected sort option
  const sortedPools = [...filteredPools].sort((a, b) => {
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
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Search Header */}
        <SearchHeader />
        
        <div className="container mx-auto px-4 py-8">
          <div className="lg:flex gap-6">
            {/* Mobile Filter Toggle */}
            <MobileFilterToggle 
              isFilterOpen={isFilterOpen} 
              toggleFilter={() => setIsFilterOpen(!isFilterOpen)} 
            />
            
            {/* Filters Sidebar */}
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
            
            {/* Pool Listings */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <PoolResultsHeader 
                count={sortedPools.length}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
              
              {/* Pool Grid */}
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
