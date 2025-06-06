
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface BookingActionProps {
  isUserLoggedIn: boolean;
  isBookingValid: boolean;
  isProcessingPayment?: boolean;
  onBookNow: () => void;
}

const BookingAction = ({ 
  isUserLoggedIn, 
  isBookingValid, 
  isProcessingPayment = false,
  onBookNow 
}: BookingActionProps) => {
  return (
    <>
      <Button 
        className="w-full bg-pool-primary hover:bg-pool-secondary"
        onClick={onBookNow}
        disabled={!isBookingValid || isProcessingPayment}
      >
        {isProcessingPayment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isProcessingPayment ? 'Processing...' : isUserLoggedIn ? 'Book Now' : 'Sign in to Book'}
      </Button>
      
      <p className="text-xs text-center text-gray-500 mt-4">
        You won't be charged yet
      </p>
    </>
  );
};

export default BookingAction;
