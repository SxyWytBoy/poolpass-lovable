
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBooking = (poolId: string | undefined, userId: string | undefined, pricePerHour: number) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const toggleExtra = (extraId: string) => {
    if (selectedExtras.includes(extraId)) {
      setSelectedExtras(selectedExtras.filter(id => id !== extraId));
    } else {
      setSelectedExtras([...selectedExtras, extraId]);
    }
  };

  const handleBookNow = async (
    extras: { id: string; name: string; price: number }[] | undefined
  ) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book this pool",
      });
      return;
    }
    
    if (!selectedDate || !selectedTimeSlot) {
      toast({
        title: "Please select a date and time slot",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // Calculate total price for the booking (8-hour day for full access)
      const basePriceForDay = pricePerHour * 8;
      const extrasPrice = calculateExtrasPrice(selectedExtras, extras);
      const totalPrice = basePriceForDay + extrasPrice;
      
      // Create booking first
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          pool_id: poolId || '',
          user_id: userId,
          booking_date: selectedDate.toISOString().split('T')[0],
          start_time: '09:00:00',
          end_time: '17:00:00',
          guests: 1,
          total_price: totalPrice,
          status: 'pending',
          cancellation_policy: 'flexible'
        })
        .select()
        .single();
        
      if (bookingError) throw bookingError;
      
      setBookingId(booking.id);
      setShowCheckout(true);
      
      // Create notification for successful booking creation
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: 'Booking Created',
          message: `Your booking for ${selectedDate.toLocaleDateString()} has been created. Complete payment to confirm.`,
          type: 'booking',
        });
      
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "There was an error creating your booking",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    resetForm();
    
    toast({
      title: "Payment successful!",
      description: "Your booking has been confirmed. Check your email for details.",
    });
  };

  const handlePaymentCancel = () => {
    setShowCheckout(false);
    setIsProcessingPayment(false);
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    setSelectedExtras([]);
    setBookingId(null);
  };

  const calculateExtrasPrice = (
    selectedExtras: string[],
    extras: { id: string; name: string; price: number }[] | undefined
  ) => {
    return selectedExtras.reduce((total, extraId) => {
      const extra = extras?.find((e) => e.id === extraId);
      return total + (extra ? extra.price : 0);
    }, 0);
  };

  return {
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
  };
};
