
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type LocationType = 'london' | 'cape-town';

export interface LocationContextType {
  currentLocation: LocationType;
  setLocation: (location: LocationType) => void;
  currency: string;
  currencySymbol: string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [currentLocation, setCurrentLocation] = useState<LocationType>('london');
  
  const setLocation = (location: LocationType) => {
    setCurrentLocation(location);
  };
  
  const currency = currentLocation === 'london' ? 'GBP' : 'ZAR';
  const currencySymbol = currentLocation === 'london' ? '£' : 'R';
  
  return (
    <LocationContext.Provider value={{
      currentLocation,
      setLocation,
      currency,
      currencySymbol
    }}>
      {children}
    </LocationContext.Provider>
  );
};
