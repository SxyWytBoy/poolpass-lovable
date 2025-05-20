
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useBooking = (poolId: string | undefined, userId: string | undefined, price: number) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

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
    
    try {
      const timeSlot = poolId ? getTimeSlotText(selectedTimeSlot) : '';
      
      // Calculate total price for the booking
      const basePrice = price || 0;
      const extrasPrice = calculateExtrasPrice(selectedExtras, extras);
      const totalPrice = basePrice + extrasPrice;
      
      const { error } = await supabase
        .from('bookings')
        .insert({
          pool_id: poolId || '',
          user_id: userId,
          date: selectedDate.toISOString().split('T')[0],
          time_slot: timeSlot,
          extras: selectedExtras,
          total_price: totalPrice,
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast({
        title: "Booking successful!",
        description: "You can view your booking in your dashboard",
      });
      
      // Reset form
      resetForm();
      
    } catch (error) {
      console.error("Error booking pool:", error);
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    setSelectedExtras([]);
  };

  const getTimeSlotText = (timeSlotId: string) => {
    // This function would normally look up the time slot from available slots
    // For simplicity, returning a placeholder
    return "Full day access"; // Updated from time slot to full day access
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
    calculateExtrasPrice
  };
};
