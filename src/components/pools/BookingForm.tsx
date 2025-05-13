
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Star, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface Extra {
  id: string;
  name: string;
  price: number;
}

interface BookingFormProps {
  poolId: string;
  userId?: string;
  price: number;
  rating: number;
  reviews: number;
  extras: Extra[];
  availableTimeSlots: { id: string; time: string }[];
  maxGuests: number;
}

const BookingForm = ({ 
  poolId, 
  userId, 
  price, 
  rating, 
  reviews, 
  extras, 
  availableTimeSlots,
  maxGuests
}: BookingFormProps) => {
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
  
  // Calculate total price
  const basePrice = price || 0;
  const extrasPrice = selectedExtras.reduce((total, extraId) => {
    const extra = extras?.find((e: Extra) => e.id === extraId);
    return total + (extra ? extra.price : 0);
  }, 0);
  const totalPrice = basePrice + extrasPrice;

  const handleBookNow = async () => {
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
      const timeSlot = availableTimeSlots?.find((slot) => slot.id === selectedTimeSlot)?.time || '';
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          pool_id: poolId,
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
      setSelectedDate(undefined);
      setSelectedTimeSlot(null);
      setSelectedExtras([]);
    } catch (error) {
      console.error("Error booking pool:", error);
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-semibold text-pool-primary">
          £{price}
          <span className="text-sm font-normal text-gray-600">/hour</span>
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400 mr-1" />
          <span className="font-medium mr-1">{rating?.toFixed(1)}</span>
          <span className="text-xs text-gray-500">({reviews})</span>
        </div>
      </div>
      
      {/* Date Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Time Slots */}
      {selectedDate && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
          <div className="grid grid-cols-2 gap-2">
            {availableTimeSlots && availableTimeSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedTimeSlot(slot.id)}
                className={cn(
                  "p-2 text-sm border rounded-md flex items-center justify-center",
                  selectedTimeSlot === slot.id 
                    ? "bg-pool-light border-pool-primary text-pool-primary font-medium" 
                    : "border-gray-200 text-gray-700 hover:border-pool-primary"
                )}
              >
                <Clock className="h-3 w-3 mr-1" />
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Extras */}
      <div className="mb-6">
        <Tabs defaultValue="extras">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="extras" className="w-full">Add Extras</TabsTrigger>
            <TabsTrigger value="guests" className="w-full">Guests</TabsTrigger>
          </TabsList>
          <TabsContent value="extras">
            <div className="space-y-3">
              {Array.isArray(extras) && extras.map((extra) => (
                <div key={extra.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox 
                      id={extra.id}
                      checked={selectedExtras.includes(extra.id)}
                      onCheckedChange={() => toggleExtra(extra.id)}
                      className="mr-2"
                    />
                    <Label htmlFor={extra.id}>{extra.name}</Label>
                  </div>
                  <span className="text-sm">+ £{extra.price}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="guests">
            <div className="flex items-center justify-between">
              <span className="text-sm">Number of Guests</span>
              <select className="border rounded-md p-1">
                {[...Array(maxGuests || 1)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1} {i === 0 ? 'guest' : 'guests'}
                  </option>
                ))}
              </select>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Price Summary */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex justify-between mb-2">
          <span>Base price</span>
          <span>£{basePrice}</span>
        </div>
        {selectedExtras.length > 0 && (
          <div className="flex justify-between mb-2">
            <span>Extras</span>
            <span>£{extrasPrice}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>£{totalPrice}</span>
        </div>
      </div>
      
      <Button 
        className="w-full bg-pool-primary hover:bg-pool-secondary"
        onClick={handleBookNow}
        disabled={!selectedDate || !selectedTimeSlot}
      >
        {userId ? 'Book Now' : 'Sign in to Book'}
      </Button>
      
      <p className="text-xs text-center text-gray-500 mt-4">
        You won't be charged yet
      </p>
    </div>
  );
};

export default BookingForm;
