
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, MapPin, Filter } from "lucide-react";
import { cn } from '@/lib/utils';
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const amenities = [
  { id: 'indoor', label: 'Indoor' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'rooftop', label: 'Rooftop' },
  { id: 'covered', label: 'Covered Areas' },
  { id: 'bar', label: 'Bar' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'loungers', label: 'Loungers' },
  { id: 'towels', label: 'Towels to Rent' },
  { id: 'spa', label: 'Spa/Gym Facilities' },
];

const SearchBar = ({ className }: { className?: string }) => {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  const handleAmenityChange = (amenityId: string) => {
    setSelectedAmenities(current => 
      current.includes(amenityId)
        ? current.filter(id => id !== amenityId)
        : [...current, amenityId]
    );
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", { location, date, amenities: selectedAmenities });
    // In a real app, this would navigate to search results with the params
  };

  return (
    <form 
      onSubmit={handleSearch}
      className={cn(
        "flex flex-col md:flex-row gap-3 p-3 bg-white rounded-xl shadow-lg",
        className
      )}
    >
      {/* Location Input */}
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="pl-10 h-12 bg-gray-50 border-gray-200 w-full"
        />
      </div>
      
      {/* Date Picker */}
      <div className="relative flex-1">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-12 w-full pl-10 pr-3 text-left font-normal bg-gray-50 border-gray-200 hover:bg-gray-50",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => {
                setDate(date);
                setIsCalendarOpen(false);
              }}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Amenities Filter */}
      <div className="relative flex-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-12 w-full pl-10 pr-3 bg-gray-50 border-gray-200 hover:bg-gray-50 flex justify-between items-center"
            >
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <span className="mr-1">Amenities</span>
              {selectedAmenities.length > 0 && (
                <span className="bg-pool-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {selectedAmenities.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 p-3" align="start">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <h3 className="font-medium mb-2 text-sm">Select Amenities</h3>
              {amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`amenity-${amenity.id}`} 
                    checked={selectedAmenities.includes(amenity.id)}
                    onCheckedChange={() => handleAmenityChange(amenity.id)}
                  />
                  <label 
                    htmlFor={`amenity-${amenity.id}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {amenity.label}
                  </label>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Search Button */}
      <Button type="submit" className="h-12 px-6 bg-pool-primary hover:bg-pool-secondary flex-1">
        <Search className="h-5 w-5 mr-2" />
        <span>Search</span>
      </Button>
    </form>
  );
};

export default SearchBar;
