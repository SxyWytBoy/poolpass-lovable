
import React from 'react';
import { useBooking } from '@/hooks/use-booking';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import BookingPrice from './booking/BookingPrice';
import DateSelector from './booking/DateSelector';
import TimeSlots from './booking/TimeSlots';
import BookingExtras from './booking/BookingExtras';
import PriceSummary from './booking/PriceSummary';
import BookingAction from './booking/BookingAction';
import StripeCheckout from '@/components/payment/StripeCheckout';

interface BookingPanelProps {
  pool: {
    id?: string;
    price_per_hour?: number;
    price?: number; // fallback for compatibility
    rating?: number;
    reviews?: number;
    reviews_count?: number; // new field name
    available_time_slots: { id: string; time: string }[];
    extras?: { id: string; name: string; price: number }[];
    pool_details?: {
      maxGuests: number;
    };
  };
  user: any;
  onBookNow: (date: Date, timeSlot: string, extras: string[]) => void;
}

const BookingPanel = ({ pool, user, onBookNow }: BookingPanelProps) => {
  const pricePerHour = pool.price_per_hour || pool.price || 0;
  const reviewsCount = pool.reviews_count || pool.reviews || 0;
  
  const {
    selectedDate,
    setSelectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot,
    selectedExtras,
    toggleExtra,
    handleBookNow,
    calculateExtrasPrice,
    isProcessingPayment,
    showCheckout,
    bookingId,
    handlePaymentSuccess,
    handlePaymentCancel
  } = useBooking(pool.id, user?.id, pricePerHour);

  // Calculate total price (assuming 8-hour day for full access)
  const basePriceForDay = pricePerHour * 8;
  const extrasPrice = calculateExtrasPrice(selectedExtras, pool?.extras);
  const totalPrice = basePriceForDay + extrasPrice;

  const handleBookNowClick = () => {
    if (selectedDate && selectedTimeSlot) {
      // Call both the local hook handler and the prop callback
      handleBookNow(pool?.extras);
      onBookNow(selectedDate, selectedTimeSlot, selectedExtras);
    }
  };

  const isBookingValid = !!selectedDate && !!selectedTimeSlot;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-24">
        {/* Price and Rating */}
        <BookingPrice 
          price={basePriceForDay} 
          rating={pool.rating} 
          reviews={reviewsCount} 
        />
        
        {/* Date Selector */}
        <DateSelector 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate} 
        />
        
        {/* Time Slots */}
        {selectedDate && (
          <TimeSlots 
            timeSlots={pool.available_time_slots} 
            selectedTimeSlot={selectedTimeSlot} 
            setSelectedTimeSlot={setSelectedTimeSlot} 
          />
        )}
        
        {/* Extras */}
        <BookingExtras 
          extras={pool.extras}
          maxGuests={pool.pool_details?.maxGuests}
          selectedExtras={selectedExtras}
          toggleExtra={toggleExtra}
        />
        
        {/* Price Summary */}
        <PriceSummary 
          basePrice={basePriceForDay}
          extrasPrice={extrasPrice}
          selectedExtras={selectedExtras}
        />
        
        {/* Booking Action Button */}
        <BookingAction 
          isUserLoggedIn={!!user}
          isBookingValid={isBookingValid}
          isProcessingPayment={isProcessingPayment}
          onBookNow={handleBookNowClick}
        />
      </div>

      {/* Stripe Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={(open) => !open && handlePaymentCancel()}>
        <DialogContent className="max-w-md">
          {bookingId && (
            <StripeCheckout
              bookingId={bookingId}
              amount={totalPrice}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingPanel;
