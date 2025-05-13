
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, MapPin } from "lucide-react";
import { cn } from '@/lib/utils';

const SearchBar = ({ className }: { className?: string }) => {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", { location, date });
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
      <div className="relative flex-grow">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="pl-10 h-12 bg-gray-50 border-gray-200"
        />
      </div>
      
      {/* Date Picker */}
      <div className="relative">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-12 w-full md:w-[240px] pl-10 pr-3 text-left font-normal bg-gray-50 border-gray-200 hover:bg-gray-50",
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
      
      {/* Search Button */}
      <Button className="h-12 px-6 bg-pool-primary hover:bg-pool-secondary">
        <Search className="h-5 w-5 mr-2" />
        <span>Search</span>
      </Button>
    </form>
  );
};

export default SearchBar;
