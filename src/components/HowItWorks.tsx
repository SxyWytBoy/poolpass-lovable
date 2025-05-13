
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Search for pools',
      description: 'Find pools near you by location, date, and amenities.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      number: '02',
      title: 'Book your visit',
      description: 'Select your date and time, and complete your booking securely.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.5 6V2.5M7.5 6V2.5M3.5 9.5H20.5M5.5 4.5H18.5C19.6046 4.5 20.5 5.39543 20.5 6.5V18.5C20.5 19.6046 19.6046 20.5 18.5 20.5H5.5C4.39543 20.5 3.5 19.6046 3.5 18.5V6.5C3.5 5.39543 4.39543 4.5 5.5 4.5Z" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      number: '03',
      title: 'Enjoy your swim',
      description: 'Arrive at the venue with your booking confirmation and enjoy your pool time!',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 6.5C15 8.433 13.433 10 11.5 10C9.567 10 8 8.433 8 6.5C8 4.567 9.567 3 11.5 3C13.433 3 15 4.567 15 6.5Z" stroke="#0891b2" strokeWidth="2"/>
          <path d="M11.5 13C6.25329 13 2 17.2533 2 22.5H21C21 17.2533 16.7467 13 11.5 13Z" stroke="#0891b2" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
  ];

  return (
    <section className="bg-white section-padding" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How PoolPass Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover and book amazing swimming experiences across the UK in just a few simple steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="relative mx-auto w-16 h-16 flex items-center justify-center mb-4">
                <div className="absolute inset-0 bg-pool-light rounded-full animate-pulse opacity-70"></div>
                <div className="relative">{step.icon}</div>
              </div>
              <div className="text-sm font-medium text-pool-primary mb-2">{step.number}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/pools">
            <Button className="bg-pool-primary hover:bg-pool-secondary text-white px-8">
              Find a Pool
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
