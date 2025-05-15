
import React from 'react';
import { Button } from '@/components/ui/button';

interface BookingActionProps {
  isUserLoggedIn: boolean;
  isBookingValid: boolean;
  onBookNow: () => void;
}

const BookingAction = ({ isUserLoggedIn, isBookingValid, onBookNow }: BookingActionProps) => {
  return (
    <>
      <Button 
        className="w-full bg-pool-primary hover:bg-pool-secondary"
        onClick={onBookNow}
        disabled={!isBookingValid}
      >
        {isUserLoggedIn ? 'Book Now' : 'Sign in to Book'}
      </Button>
      
      <p className="text-xs text-center text-gray-500 mt-4">
        You won't be charged yet
      </p>
    </>
  );
};

export default BookingAction;
