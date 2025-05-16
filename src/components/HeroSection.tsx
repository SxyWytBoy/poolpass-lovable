
import React from 'react';
import SearchBar from './SearchBar';

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1576013551627-0ae7d1d6f79e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
          alt="Swimming Pool" 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1562778612-e1e0cda9915c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
          }}
        />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Discover and Book
            <span className="text-pool-accent"> Private Pools</span> Near You
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-lg">
            Find and book amazing swimming experiences at private pools and hotels across the UK.
          </p>
          
          {/* Search Bar */}
          <SearchBar className="max-w-3xl" />
          
          {/* Features */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg text-center">
              <div className="bg-pool-light inline-flex items-center justify-center w-10 h-10 rounded-full mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 14L12 12M12 12L14 10M12 12L10 10M12 12L14 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-medium text-gray-800">Verified Hosts</h3>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg text-center">
              <div className="bg-pool-light inline-flex items-center justify-center w-10 h-10 rounded-full mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M7.864 4.05L12 2L16.136 4.05C18.042 5.0894 19.5 7.19 19.5 9.5C19.5 12.794 17.5338 15.7479 15.4554 17.8881C14.4376 18.9352 13.2878 19.8388 12 20.523C10.7122 19.8388 9.5624 18.9352 8.5446 17.8881C6.4662 15.7479 4.5 12.794 4.5 9.5C4.5 7.19 5.95801 5.0894 7.864 4.05Z" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-medium text-gray-800">Secure Booking</h3>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg text-center col-span-2 md:col-span-1">
              <div className="bg-pool-light inline-flex items-center justify-center w-10 h-10 rounded-full mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 6V2.5M7.5 6V2.5M3.5 9.5H20.5M5.5 4.5H18.5C19.6046 4.5 20.5 5.39543 20.5 6.5V18.5C20.5 19.6046 19.6046 20.5 18.5 20.5H5.5C4.39543 20.5 3.5 19.6046 3.5 18.5V6.5C3.5 5.39543 4.39543 4.5 5.5 4.5Z" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-medium text-gray-800">Flexible Times</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave SVG */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path fill="#ffffff" fillOpacity="1" d="M0,224L60,213.3C120,203,240,181,360,176C480,171,600,181,720,192C840,203,960,213,1080,202.7C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
