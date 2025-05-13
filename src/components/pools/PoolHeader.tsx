
import React from 'react';
import { Star, MapPin } from 'lucide-react';

interface PoolHeaderProps {
  name: string;
  rating?: number;
  reviews?: number;
  location: string;
}

const PoolHeader = ({ name, rating = 0, reviews = 0, location }: PoolHeaderProps) => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      <div className="flex items-center text-gray-600 mb-6">
        <div className="flex items-center mr-4">
          <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400 mr-1" />
          <span className="font-medium">{rating?.toFixed(1)}</span>
          <span className="text-gray-500 ml-1">({reviews} reviews)</span>
        </div>
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{location}</span>
        </div>
      </div>
    </>
  );
};

export default PoolHeader;
