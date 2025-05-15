
import React from 'react';
import { useBooking } from '@/hooks/use-booking';
import BookingPrice from './booking/BookingPrice';
import DateSelector from './booking/DateSelector';
import TimeSlots from './booking/TimeSlots';
import BookingExtras from './booking/BookingExtras';
import PriceSummary from './booking/PriceSummary';
import BookingAction from './booking/BookingAction';

interface BookingPanelProps {
  pool: {
    id?: string;
    price: number;
    rating?: number;
    reviews?: number;
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
  const {
    selectedDate,
    setSelectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot,
    selectedExtras,
    toggleExtra,
    handleBookNow,
    calculateExtrasPrice
  } = useBooking(pool.id, user?.id, pool.price);

  // Calculate total price
  const basePrice = pool?.price || 0;
  const extrasPrice = calculateExtrasPrice(selectedExtras, pool?.extras);

  const handleBookNowClick = () => {
    if (selectedDate && selectedTimeSlot) {
      // Call both the local hook handler and the prop callback
      handleBookNow(pool?.extras);
      onBookNow(selectedDate, selectedTimeSlot, selectedExtras);
    }
  };

  const isBookingValid = !!selectedDate && !!selectedTimeSlot;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-24">
      {/* Price and Rating */}
      <BookingPrice 
        price={pool.price} 
        rating={pool.rating} 
        reviews={pool.reviews} 
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
        basePrice={basePrice}
        extrasPrice={extrasPrice}
        selectedExtras={selectedExtras}
      />
      
      {/* Booking Action Button */}
      <BookingAction 
        isUserLoggedIn={!!user}
        isBookingValid={isBookingValid}
        onBookNow={handleBookNowClick}
      />
    </div>
  );
};

export default BookingPanel;
