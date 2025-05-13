
import React from 'react';
import { Check, Info } from 'lucide-react';
import { Pool } from '@/types';

interface PoolInfoProps {
  description: string;
  poolDetails: {
    size: string;
    depth: string;
    temperature: string;
    maxGuests: number;
  };
  amenities: { name: string; included: boolean }[];
  host: {
    name: string;
    image: string;
  };
}

const PoolInfo = ({ 
  description,
  poolDetails,
  amenities,
  host
}: PoolInfoProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-semibold">About this pool</h2>
          <p className="text-gray-600">Hosted by {host?.name}</p>
        </div>
        <img 
          src={host?.image} 
          alt={host?.name}
          className="w-12 h-12 rounded-full"
        />
      </div>
      
      <div className="mb-6">
        <p className="text-gray-700">{description}</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-500">Size</p>
          <p className="font-medium">{poolDetails?.size}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-500">Depth</p>
          <p className="font-medium">{poolDetails?.depth}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-500">Temperature</p>
          <p className="font-medium">{poolDetails?.temperature}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-500">Max Guests</p>
          <p className="font-medium">{poolDetails?.maxGuests}</p>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Amenities</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {Array.isArray(amenities) && amenities.map((amenity, index) => (
          <div key={index} className="flex items-center">
            {amenity.included ? (
              <Check className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <span className="h-5 w-5 border rounded-full flex items-center justify-center mr-2 text-gray-400">
                <Info className="h-3 w-3" />
              </span>
            )}
            <span className={amenity.included ? 'text-gray-800' : 'text-gray-400 line-through'}>
              {amenity.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoolInfo;
