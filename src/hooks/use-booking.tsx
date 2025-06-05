
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBooking = (poolId: string | undefined, userId: string | undefined, pricePerHour: number) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
      // Calculate total price for the booking (assuming 8-hour day for full access)
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
          status: 'pending'
        })
        .select()
        .single();
        
      if (bookingError) throw bookingError;
      
      // Create payment intent
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
        'create-payment-intent',
        {
          body: {
            bookingId: booking.id,
            amount: totalPrice,
            currency: 'gbp'
          }
        }
      );
      
      if (paymentError) throw paymentError;
      
      // Here you would normally redirect to Stripe Checkout or handle the payment
      // For now, we'll just show a success message
      toast({
        title: "Payment initiated!",
        description: "You will be redirected to complete payment",
      });
      
      // In a real implementation, you would use the client_secret to complete the payment
      console.log('Payment client secret:', paymentData.client_secret);
      
      // Reset form
      resetForm();
      
    } catch (error) {
      console.error("Error booking pool:", error);
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    setSelectedExtras([]);
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
    isProcessingPayment
  };
};
