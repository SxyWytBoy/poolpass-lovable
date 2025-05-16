
import React from 'react';
import SearchBar from '@/components/SearchBar';

const SearchHeader = () => {
  return (
    <div className="relative py-8">
      {/* Background pool image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-pool-dark/80 to-pool-dark/60 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1576013551627-0ae7d1d6f79e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
          alt="Swimming Pool" 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1562778612-e1e0cda9915c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Find the Perfect Pool</h1>
        <SearchBar className="max-w-4xl" />
      </div>
    </div>
  );
};

export default SearchHeader;
