
import React from 'react';
import { Star } from 'lucide-react';

interface BookingPriceProps {
  price: number;
  rating?: number;
  reviews?: number;
}

const BookingPrice = ({ price, rating, reviews }: BookingPriceProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="text-2xl font-semibold text-pool-primary">
        £{price}
        <span className="text-sm font-normal text-gray-600">/day</span>
      </div>
      {rating && (
        <div className="flex items-center">
          <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400 mr-1" />
          <span className="font-medium mr-1">{rating?.toFixed(1)}</span>
          {reviews && <span className="text-xs text-gray-500">({reviews})</span>}
        </div>
      )}
    </div>
  );
};

export default BookingPrice;
