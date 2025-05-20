
import React from 'react';

interface TimeSlotsProps {
  timeSlots: { id: string; time: string }[];
  selectedTimeSlot: string | null;
  setSelectedTimeSlot: (timeSlot: string) => void;
}

const TimeSlots = ({ timeSlots, selectedTimeSlot, setSelectedTimeSlot }: TimeSlotsProps) => {
  // Updated to show daily access options instead of hourly slots
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Access Options</label>
      <div className="grid grid-cols-1 gap-2">
        <div 
          className={`border rounded-md p-2 text-center cursor-pointer transition-colors ${
            selectedTimeSlot === 'full-day' 
              ? 'bg-pool-primary text-white' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => setSelectedTimeSlot('full-day')}
        >
          Full Day Access
        </div>
      </div>
    </div>
  );
};

export default TimeSlots;
