
import React from 'react';

interface PoolResultsHeaderProps {
  count: number;
  sortOrder: string;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const PoolResultsHeader = ({ count, sortOrder, onSortChange }: PoolResultsHeaderProps) => {
  return (
    <div className="mb-4 flex justify-between items-center">
      <p className="text-gray-600">
        <span className="font-medium">{count}</span> pools available
      </p>
      <div className="flex items-center">
        <span className="text-sm text-gray-500 mr-2">Sort by:</span>
        <select 
          className="text-sm border rounded py-1 px-2"
          value={sortOrder}
          onChange={onSortChange}
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="reviews">Most Reviewed</option>
        </select>
      </div>
    </div>
  );
};

export default PoolResultsHeader;
