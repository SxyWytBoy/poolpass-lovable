
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Users, Car } from 'lucide-react';

interface Pool {
  id: string;
  title: string;
  location: string;
  price_per_hour: number;
  rating: number;
  reviews_count: number;
  images: string[];
  latitude?: number;
  longitude?: number;
  max_guests?: number;
}

interface SearchResultsMapProps {
  pools: Pool[];
  onPoolSelect: (poolId: string) => void;
  selectedPoolId?: string;
}

const SearchResultsMap = ({ pools, onPoolSelect, selectedPoolId }: SearchResultsMapProps) => {
  const [mapCenter, setMapCenter] = useState({ lat: 51.5074, lng: -0.1278 }); // London default

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Map View ({pools.length} pools)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[500px] relative">
        {/* Placeholder for map implementation */}
        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Interactive map coming soon</p>
            <p className="text-sm text-gray-400">
              Showing {pools.length} pools in the selected area
            </p>
          </div>
          
          {/* Pool markers simulation */}
          <div className="absolute inset-0">
            {pools.slice(0, 5).map((pool, index) => (
              <div
                key={pool.id}
                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                  selectedPoolId === pool.id ? 'z-20' : 'z-10'
                }`}
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + index * 10}%`
                }}
                onClick={() => onPoolSelect(pool.id)}
              >
                <div className={`
                  relative bg-white rounded-lg shadow-lg border-2 p-2 min-w-[200px]
                  ${selectedPoolId === pool.id ? 'border-blue-500 shadow-xl' : 'border-gray-200'}
                `}>
                  <div className="flex gap-2">
                    <img
                      src={pool.images[0] || '/placeholder.svg'}
                      alt={pool.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{pool.title}</h4>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {pool.rating} ({pool.reviews_count})
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">
                          <Users className="h-3 w-3 inline mr-1" />
                          Up to {pool.max_guests || 8}
                        </span>
                        <span className="font-semibold text-blue-600">
                          £{pool.price_per_hour}/hr
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Map pin pointer */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded-full rotate-45 transform origin-center"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchResultsMap;
