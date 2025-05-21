
import React from 'react';
import Navbar from '@/components/Navbar';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pool-dark to-pool-primary mt-16 md:mt-20 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">How PoolPass Works</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Discover how our platform connects pool owners with guests seeking amazing swimming experiences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/pools">
              <Button className="bg-white text-pool-primary hover:bg-gray-100 px-8">
                Find a Pool
              </Button>
            </Link>
            <Link to="/host">
              <Button className="bg-pool-secondary text-white hover:bg-pool-secondary/90 px-8">
                Become a Host
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Main HowItWorks Component */}
      <HowItWorks />
      
      {/* For Guests Section */}
      <section className="bg-gray-50 section-padding">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">For Guests</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enjoy access to exclusive pools without the commitment of ownership.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-pool-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pool-primary">
                  <path d="M4 20V19C4 16.2386 6.23858 14 9 14H15C17.7614 14 20 16.2386 20 19V20M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Account</h3>
              <p className="text-gray-500">Sign up in just a few minutes and start exploring available pools in your area.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-pool-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pool-primary">
                  <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
              <p className="text-gray-500">All pools on our platform are verified for quality and safety standards.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-pool-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pool-primary">
                  <path d="M20 7L9 18L4 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-500">Our secure platform handles all bookings and payments with complete peace of mind.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/sign-up">
              <Button className="bg-pool-primary hover:bg-pool-secondary text-white px-8">
                Sign Up as a Guest
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="bg-white section-padding">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold mb-2">How do I book a pool?</h3>
              <p className="text-gray-600">Browse our selection of pools, select your preferred date, and complete the booking. You'll receive instant confirmation and details for your visit.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold mb-2">What if I need to cancel my booking?</h3>
              <p className="text-gray-600">Cancellations can be made up to 48 hours before your booking for a full refund. For cancellations within 48 hours, please refer to the host's cancellation policy.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold mb-2">Are there any additional fees?</h3>
              <p className="text-gray-600">The price shown includes the pool rental fee for the day. Some hosts may offer extra amenities for an additional cost, which will be clearly displayed during booking.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold mb-2">How do I contact the pool host?</h3>
              <p className="text-gray-600">Once your booking is confirmed, you'll have access to the host's contact details through our messaging system to discuss any specific requirements.</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
