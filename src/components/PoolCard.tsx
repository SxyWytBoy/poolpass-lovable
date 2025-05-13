
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PoolCardProps {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  indoorOutdoor: 'indoor' | 'outdoor' | 'both';
  amenities?: string[];
  className?: string;
}

const PoolCard = ({
  id,
  name,
  location,
  price,
  rating,
  reviews,
  image,
  indoorOutdoor,
  amenities = [],
  className
}: PoolCardProps) => {
  return (
    <Link 
      to={`/pools/${id}`}
      className={cn(
        "block rounded-xl overflow-hidden bg-white group transition-all duration-300 hover:-translate-y-1 pool-card-shadow",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge 
            className={cn(
              "text-xs font-medium px-2 py-0.5",
              indoorOutdoor === 'indoor' ? "bg-blue-100 text-blue-800" : 
              indoorOutdoor === 'outdoor' ? "bg-green-100 text-green-800" :
              "bg-purple-100 text-purple-800"
            )}
          >
            {indoorOutdoor === 'both' ? 'Indoor & Outdoor' : indoorOutdoor}
          </Badge>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{name}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400 mr-1" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500 ml-1">({reviews})</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-3">{location}</p>
        
        {/* Amenities */}
        {amenities && amenities.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {amenities.slice(0, 3).map((amenity, i) => (
              <Badge key={i} variant="outline" className="text-xs bg-gray-50">
                {amenity}
              </Badge>
            ))}
            {amenities.length > 3 && (
              <Badge variant="outline" className="text-xs bg-gray-50">
                +{amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-pool-primary">
            <span className="font-bold text-lg">£{price}</span>
            <span className="text-sm text-gray-500">/hour</span>
          </div>
          <span className="text-xs bg-pool-light text-pool-primary px-2 py-1 rounded-full">
            Book now
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PoolCard;
