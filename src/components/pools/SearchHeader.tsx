
import React from 'react';
import SearchBar from '@/components/SearchBar';

const SearchHeader = () => {
  return (
    <div className="bg-pool-light py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Find the Perfect Pool</h1>
        <SearchBar className="max-w-4xl" />
      </div>
    </div>
  );
};

export default SearchHeader;
