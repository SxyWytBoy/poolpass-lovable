
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useLocation, LocationType } from '@/contexts/LocationContext';
import { cn } from '@/lib/utils';

const LocationSwitcher = () => {
  const { currentLocation, setLocation, currencySymbol } = useLocation();
  
  const locations = [
    { id: 'london' as LocationType, name: 'London', country: 'UK', flag: '🇬🇧' },
    { id: 'cape-town' as LocationType, name: 'Cape Town', country: 'South Africa', flag: '🇿🇦' }
  ];
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <MapPin className="h-5 w-5 text-pool-primary" />
        <h3 className="font-medium text-gray-900">Browse pools in:</h3>
        <span className="text-sm text-gray-500">Prices in {currencySymbol}</span>
      </div>
      
      <div className="flex gap-2">
        {locations.map((location) => (
          <Button
            key={location.id}
            variant={currentLocation === location.id ? "default" : "outline"}
            size="sm"
            onClick={() => setLocation(location.id)}
            className={cn(
              "flex items-center gap-2",
              currentLocation === location.id 
                ? "bg-pool-primary hover:bg-pool-secondary text-white" 
                : "hover:bg-pool-light"
            )}
          >
            <span className="text-lg">{location.flag}</span>
            <span>{location.name}</span>
            <span className="text-xs opacity-75">{location.country}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LocationSwitcher;
