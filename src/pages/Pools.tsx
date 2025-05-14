
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileFilterToggle from '@/components/pools/MobileFilterToggle';
import PoolFilters from '@/components/pools/PoolFilters';
import PoolGrid, { PoolItem } from '@/components/pools/PoolGrid';
import PoolResultsHeader from '@/components/pools/PoolResultsHeader';
import SearchHeader from '@/components/pools/SearchHeader';
import { useToast } from '@/components/ui/use-toast';

// Mock pool data
const poolsData = [
  {
    id: "1",
    name: "Luxury Indoor Pool & Spa",
    location: "Kensington, London",
    price: 45,
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Loungers", "Towels Provided", "Jacuzzi"]
  },
  {
    id: "2",
    name: "Rooftop Infinity Pool",
    location: "Manchester City Centre",
    price: 60,
    rating: 4.7,
    reviews: 85,
    image: "https://images.unsplash.com/photo-1477120292453-dbba2d987c24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "City View", "Bar Service", "Loungers"]
  },
  {
    id: "3",
    name: "Country House Pool & Gardens",
    location: "Cotswolds",
    price: 38,
    rating: 4.8,
    reviews: 63,
    image: "https://images.unsplash.com/photo-1551123847-4041291bec0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "both" as const,
    amenities: ["Garden Access", "Changing Rooms", "Food Available"]
  },
  {
    id: "4",
    name: "Boutique Hotel Swim Club",
    location: "Brighton",
    price: 55,
    rating: 4.6,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1540539234-c14a20fb7c7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Sauna", "Spa", "Bar Service"]
  },
  {
    id: "5",
    name: "Modern Loft with Private Pool",
    location: "Liverpool",
    price: 35,
    rating: 4.5,
    reviews: 29,
    image: "https://images.unsplash.com/photo-1529290130-4ca3753253ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "WiFi", "Changing Rooms"]
  },
  {
    id: "6",
    name: "Countryside Retreat Pool",
    location: "Lake District",
    price: 42,
    rating: 4.9,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1519046004466-a539881296e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Loungers", "Nature Views", "BBQ Area"]
  },
];

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
  "Child Friendly"
];

const Pools = () => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [poolType, setPoolType] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("price_asc");
  const { toast } = useToast();
  
  // Reset filters function
  const resetFilters = () => {
    setPriceRange([0, 100]);
    setSelectedAmenities([]);
    setPoolType("all");
    
    toast({
      title: "Filters reset",
      description: "All filters have been reset to default values.",
    });
  };
  
  // Filter pools based on selected filters
  const filteredPools = poolsData.filter(pool => {
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
