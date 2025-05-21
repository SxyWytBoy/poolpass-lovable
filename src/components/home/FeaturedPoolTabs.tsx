
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import PhotoGallery from '@/components/pool-detail/PhotoGallery';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface FeaturedPool {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  indoorOutdoor: 'indoor' | 'outdoor' | 'both';
  amenities: string[];
  images: string[];
  tabImages?: {
    rooftop?: string[];
    countryhouse?: string[];
  };
}

interface FeaturedPoolTabsProps {
  pools: FeaturedPool[];
}

const FeaturedPoolTabs: React.FC<FeaturedPoolTabsProps> = ({ pools }) => {
  const [activePool, setActivePool] = useState(pools[0]);

  const handleTabChange = (poolId: string) => {
    const selected = pools.find(pool => pool.id === poolId);
    if (selected) {
      setActivePool(selected);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
      <Tabs 
        defaultValue={pools[0]?.id} 
        onValueChange={handleTabChange} 
        className="w-full"
      >
        <div className="border-b">
          <TabsList className="flex w-full h-auto bg-transparent p-0">
            {pools.map((pool) => (
              <TabsTrigger 
                key={pool.id} 
                value={pool.id}
                className="flex-1 py-4 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-pool-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <div className="text-center">
                  <div className="font-medium">{pool.name}</div>
                  <div className="text-xs text-gray-500">{pool.location}</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {pools.map((pool) => (
          <TabsContent key={pool.id} value={pool.id} className="mt-0 p-0">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              <div className="md:col-span-8">
                <PhotoGallery 
                  images={pool.images} 
                  name={pool.name} 
                  tabImages={pool.tabImages}
                />
              </div>
              <div className="md:col-span-4 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{pool.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{pool.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({pool.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="text-gray-600 mb-4">{pool.location}</div>
                  
                  <div className="mb-4">
                    <Badge 
                      className={
                        pool.indoorOutdoor === 'indoor' ? "bg-pool-light text-pool-dark" : 
                        pool.indoorOutdoor === 'outdoor' ? "bg-pool-light text-pool-dark" :
                        "bg-pool-light text-pool-dark"
                      }
                    >
                      {pool.indoorOutdoor === 'both' ? 'Indoor & Outdoor' : pool.indoorOutdoor}
                    </Badge>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-2">Amenities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {pool.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <div className="text-pool-primary">
                      <span className="font-bold text-2xl">£{pool.price}</span>
                      <span className="text-sm text-gray-500">/day</span>
                    </div>
                  </div>
                  
                  <Link to={`/pools/${pool.id}`}>
                    <Button className="w-full bg-pool-primary hover:bg-pool-secondary">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FeaturedPoolTabs;
