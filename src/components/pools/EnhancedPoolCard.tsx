
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Users, Heart, GitCompare, Wifi, Car, Waves } from 'lucide-react';

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
  instant_book?: boolean;
}

interface EnhancedPoolCardProps {
  pool: Pool;
  onAddToComparison?: (pool: Pool) => void;
  onToggleFavorite?: (poolId: string) => void;
  isFavorite?: boolean;
  isInComparison?: boolean;
}

const iconMap: { [key: string]: any } = {
  'wifi': Wifi,
  'car': Car,
  'waves': Waves,
  'users': Users
};

const EnhancedPoolCard = ({
  pool,
  onAddToComparison,
  onToggleFavorite,
  isFavorite = false,
  isInComparison = false
}: EnhancedPoolCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/pool/${pool.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(pool.id);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToComparison?.(pool);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group relative">
      <div onClick={handleCardClick}>
        {/* Image Section */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={pool.images[0] || '/placeholder.svg'}
            alt={pool.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Overlay Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {pool.instant_book && (
              <Badge className="bg-green-500 text-white">Instant Book</Badge>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 opacity-80 hover:opacity-100"
              onClick={handleFavoriteClick}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            
            {onAddToComparison && (
              <Button
                size="sm"
                variant="secondary"
                className={`h-8 w-8 p-0 opacity-80 hover:opacity-100 ${
                  isInComparison ? 'bg-blue-500 text-white' : ''
                }`}
                onClick={handleCompareClick}
                disabled={isInComparison}
              >
                <GitCompare className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Image Gallery Indicator */}
          {pool.images.length > 1 && (
            <div className="absolute bottom-2 right-2">
              <Badge variant="secondary" className="text-xs">
                +{pool.images.length - 1} photos
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          {/* Title and Rating */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg truncate flex-1 mr-2">{pool.title}</h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-sm">{pool.rating}</span>
              <span className="text-xs text-gray-500">({pool.reviews_count})</span>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-1 text-gray-600 mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-sm truncate">{pool.location}</span>
          </div>
          
          {/* Quick Info */}
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Up to {pool.max_guests || 8}</span>
            </div>
          </div>
          
          {/* Top Amenities */}
          <div className="flex flex-wrap gap-1 mb-3">
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
          
          {/* Price */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-blue-600">
                £{pool.price_per_hour}
              </span>
              <span className="text-gray-500 text-sm"> /hour</span>
            </div>
            
            <Button size="sm" className="px-4">
              View Details
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default EnhancedPoolCard;
