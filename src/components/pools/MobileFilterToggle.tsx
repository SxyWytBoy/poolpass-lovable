
import React from 'react';
import { Button } from '@/components/ui/button';

interface MobileFilterToggleProps {
  isFilterOpen: boolean;
  toggleFilter: () => void;
}

const MobileFilterToggle = ({ isFilterOpen, toggleFilter }: MobileFilterToggleProps) => {
  return (
    <div className="lg:hidden mb-4">
      <Button 
        onClick={toggleFilter} 
        variant="outline" 
        className="w-full mb-4"
      >
        {isFilterOpen ? "Hide Filters" : "Show Filters"} 
      </Button>
    </div>
  );
};

export default MobileFilterToggle;
