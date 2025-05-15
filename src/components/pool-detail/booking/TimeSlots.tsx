
import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeSlotsProps {
  timeSlots: { id: string; time: string }[];
  selectedTimeSlot: string | null;
  setSelectedTimeSlot: (timeSlot: string) => void;
}

const TimeSlots = ({ timeSlots, selectedTimeSlot, setSelectedTimeSlot }: TimeSlotsProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
      <div className="grid grid-cols-2 gap-2">
        {timeSlots.map((slot) => (
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
  );
};

export default TimeSlots;
