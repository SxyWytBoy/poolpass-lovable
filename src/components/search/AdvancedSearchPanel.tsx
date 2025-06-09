
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { SearchFilters } from '@/hooks/use-advanced-search';
import { Calendar as CalendarIcon, MapPin, Users, Star, Filter, X } from 'lucide-react';
import { format } from 'date-fns';

interface AdvancedSearchPanelProps {
  filters: SearchFilters;
  updateFilter: (key: keyof SearchFilters, value: any) => void;
  resetFilters: () => void;
  amenities: any[];
  className?: string;
}

const poolTypeOptions = [
  { value: 'private', label: 'Private Pool' },
  { value: 'shared', label: 'Shared Pool' },
  { value: 'public', label: 'Public Pool' },
  { value: 'resort', label: 'Resort Pool' }
];

const AdvancedSearchPanel = ({
  filters,
  updateFilter,
  resetFilters,
  amenities,
  className
}: AdvancedSearchPanelProps) => {
  const handleAmenityToggle = (amenityId: string) => {
    const newAmenities = filters.selectedAmenities.includes(amenityId)
      ? filters.selectedAmenities.filter(id => id !== amenityId)
      : [...filters.selectedAmenities, amenityId];
    updateFilter('selectedAmenities', newAmenities);
  };

  const handlePoolTypeToggle = (poolType: string) => {
    const newTypes = filters.poolTypes.includes(poolType)
      ? filters.poolTypes.filter(type => type !== poolType)
      : [...filters.poolTypes, poolType];
    updateFilter('poolTypes', newTypes);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Advanced Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Text */}
        <div>
          <label className="block text-sm font-medium mb-2">Search</label>
          <Input
            placeholder="Search pools, locations..."
            value={filters.searchText}
            onChange={(e) => updateFilter('searchText', e.target.value)}
          />
        </div>

        {/* Location & Radius */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Location
            </label>
            <Input
              placeholder="City, area..."
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Radius ({filters.radius}km)
            </label>
            <Slider
              value={[filters.radius]}
              onValueChange={(value) => updateFilter('radius', value[0])}
              max={100}
              min={1}
              step={5}
            />
          </div>
        </div>

        {/* Check-in/Check-out Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2">Check-in</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.checkIn ? format(filters.checkIn, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={filters.checkIn || undefined}
                  onSelect={(date) => updateFilter('checkIn', date)}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Check-out</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.checkOut ? format(filters.checkOut, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={filters.checkOut || undefined}
                  onSelect={(date) => updateFilter('checkOut', date)}
                  disabled={(date) => date < (filters.checkIn || new Date())}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Price Range (£{filters.minPrice || 0} - £{filters.maxPrice || 200})
          </label>
          <div className="px-2">
            <Slider
              value={[filters.minPrice || 0, filters.maxPrice || 200]}
              onValueChange={(value) => {
                updateFilter('minPrice', value[0]);
                updateFilter('maxPrice', value[1]);
              }}
              max={200}
              min={0}
              step={5}
              className="mb-2"
            />
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <Users className="h-4 w-4 inline mr-1" />
            Maximum Guests
          </label>
          <Select
            value={filters.maxGuests?.toString() || ''}
            onValueChange={(value) => updateFilter('maxGuests', value ? parseInt(value) : null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any number" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any number</SelectItem>
              {[2, 4, 6, 8, 10, 12, 15, 20].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  Up to {num} guests
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Minimum Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <Star className="h-4 w-4 inline mr-1" />
            Minimum Rating
          </label>
          <Select
            value={filters.minRating?.toString() || ''}
            onValueChange={(value) => updateFilter('minRating', value ? parseFloat(value) : null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any rating</SelectItem>
              <SelectItem value="3">3+ stars</SelectItem>
              <SelectItem value="4">4+ stars</SelectItem>
              <SelectItem value="4.5">4.5+ stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pool Types */}
        <div>
          <label className="block text-sm font-medium mb-2">Pool Types</label>
          <div className="flex flex-wrap gap-2">
            {poolTypeOptions.map(option => (
              <Badge
                key={option.value}
                variant={filters.poolTypes.includes(option.value) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handlePoolTypeToggle(option.value)}
              >
                {option.label}
                {filters.poolTypes.includes(option.value) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium mb-2">Amenities</label>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {amenities.map(amenity => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity.id}`}
                  checked={filters.selectedAmenities.includes(amenity.id)}
                  onCheckedChange={() => handleAmenityToggle(amenity.id)}
                />
                <label
                  htmlFor={`amenity-${amenity.id}`}
                  className="text-sm cursor-pointer"
                >
                  {amenity.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2">Sort by</label>
            <Select
              value={filters.sortBy}
              onValueChange={(value: any) => updateFilter('sortBy', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Order</label>
            <Select
              value={filters.sortOrder}
              onValueChange={(value: any) => updateFilter('sortOrder', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reset Button */}
        <Button variant="outline" onClick={resetFilters} className="w-full">
          Reset All Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdvancedSearchPanel;
