
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PoolCard from '@/components/PoolCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import SearchBar from '@/components/SearchBar';

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
  
  const handleAmenityChange = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Search Header */}
        <div className="bg-pool-light py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Find the Perfect Pool</h1>
            <SearchBar className="max-w-4xl" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="lg:flex gap-6">
            {/* Filters - Mobile Toggle */}
            <div className="lg:hidden mb-4">
              <Button 
                onClick={() => setIsFilterOpen(!isFilterOpen)} 
                variant="outline" 
                className="w-full mb-4"
              >
                {isFilterOpen ? "Hide Filters" : "Show Filters"} 
              </Button>
            </div>
            
            {/* Filters Sidebar */}
            <aside className={`lg:w-1/4 space-y-6 mb-8 lg:mb-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium mb-4">Filters</h2>
                
                {/* Price Range Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Price Range (per hour)</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 100]}
                      min={0}
                      max={100}
                      step={5}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>£{priceRange[0]}</span>
                      <span>£{priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                
                {/* Pool Type Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Pool Type</h3>
                  <RadioGroup value={poolType} onValueChange={setPoolType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="type-all" />
                      <Label htmlFor="type-all">All Pools</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="indoor" id="type-indoor" />
                      <Label htmlFor="type-indoor">Indoor Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="outdoor" id="type-outdoor" />
                      <Label htmlFor="type-outdoor">Outdoor Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="type-both" />
                      <Label htmlFor="type-both">Indoor & Outdoor</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Amenities Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Amenities</h3>
                  <div className="space-y-2 max-h-60 overflow-auto">
                    {amenitiesOptions.map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <Checkbox 
                          id={`amenity-${amenity}`} 
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={() => handleAmenityChange(amenity)}
                          className="mr-2"
                        />
                        <label 
                          htmlFor={`amenity-${amenity}`}
                          className="text-sm text-gray-700 cursor-pointer"
                        >
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Clear Filters Button */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setPriceRange([0, 100]);
                      setSelectedAmenities([]);
                      setPoolType("all");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </aside>
            
            {/* Pool Listings */}
            <div className="lg:w-3/4">
              {/* Results Count */}
              <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-600">
                  <span className="font-medium">{filteredPools.length}</span> pools available
                </p>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                  <select className="text-sm border rounded py-1 px-2">
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating</option>
                    <option>Most Reviewed</option>
                  </select>
                </div>
              </div>
              
              {/* Pool Grid */}
              {filteredPools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPools.map((pool) => (
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
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg text-center">
                  <h3 className="text-lg font-medium mb-2">No pools match your filters</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filter criteria to find more options.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setPriceRange([0, 100]);
                      setSelectedAmenities([]);
                      setPoolType("all");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pools;
