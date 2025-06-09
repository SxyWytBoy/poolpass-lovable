
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Users, MapPin, Car, Wifi, Waves, X } from 'lucide-react';

interface Pool {
  id: string;
  title: string;
  location: string;
  price_per_hour: number;
  rating: number;
  reviews_count: number;
  images: string[];
  max_guests?: number;
  pool_amenities?: any[];
}

interface PoolComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  pools: Pool[];
  onRemovePool: (poolId: string) => void;
  onViewPool: (poolId: string) => void;
}

const iconMap: { [key: string]: any } = {
  'wifi': Wifi,
  'car': Car,
  'waves': Waves,
  'users': Users
};

const PoolComparisonModal = ({
  isOpen,
  onClose,
  pools,
  onRemovePool,
  onViewPool
}: PoolComparisonModalProps) => {
  if (pools.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Pools ({pools.length})</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pools.map((pool) => (
            <Card key={pool.id} className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10 h-6 w-6 p-0"
                onClick={() => onRemovePool(pool.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <CardContent className="p-4">
                <div className="aspect-video mb-3 overflow-hidden rounded-lg">
                  <img
                    src={pool.images[0] || '/placeholder.svg'}
                    alt={pool.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="font-semibold mb-1 truncate">{pool.title}</h3>
                
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{pool.location}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{pool.rating}</span>
                    <span className="text-xs text-gray-500">({pool.reviews_count})</span>
                  </div>
                  
                  <Badge variant="secondary" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {pool.max_guests || 8} guests
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <div className="text-lg font-bold text-blue-600">
                    £{pool.price_per_hour}/hour
                  </div>
                </div>
                
                {/* Amenities */}
                <div className="mb-3">
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Amenities</h4>
                  <div className="flex flex-wrap gap-1">
                    {pool.pool_amenities?.slice(0, 3).map((amenity: any, index) => {
                      const IconComponent = iconMap[amenity.amenities?.icon] || Waves;
                      return (
                        <Badge key={index} variant="outline" className="text-xs">
                          <IconComponent className="h-3 w-3 mr-1" />
                          {amenity.amenities?.name}
                        </Badge>
                      );
                    })}
                    {(pool.pool_amenities?.length || 0) > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(pool.pool_amenities?.length || 0) - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button
                  className="w-full"
                  onClick={() => onViewPool(pool.id)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {pools.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No pools selected for comparison
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PoolComparisonModal;
