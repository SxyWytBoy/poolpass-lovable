import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const WaitlistLanding = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section with background image */}
        <section
          className="section-padding relative min-h-[600px] md:min-h-[700px]"
          style={{
            backgroundImage: `url('/lovable-uploads/waitlist-water.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed', // optional, remove if you prefer
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black opacity-40"></div>

          <div className="container mx-auto px-4 relative z-10 flex flex-col justify-center min-h-[600px] md:min-h-[700px]">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Find Your Next Pool Day — No Hotel Stay Needed
              </h1>
              
              <div className="text-xl md:text-2xl mb-8 space-y-4">
                <p className="leading-relaxed">
                  PoolPass gives you access to beautiful hotel, Airbnb and private pools across the UK — just for the day.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-lg">
                  <span className="flex items-center gap-2">
                    🌤️ Swim. Sunbathe. Chill. No overnight stay required.
                  </span>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-lg">
                  <span className="flex items-center gap-2">
                    🏨 Hotels earn extra revenue. You escape without leaving town.
                  </span>
                </div>
                <p className="text-xl font-medium text-pool-primary mt-6">
                  👇 Join the waitlist and be the first to book.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                <Link to="/guest-waitlist">
                  <Button 
                    size="lg" 
                    className="bg-pool-primary hover:bg-pool-secondary text-white px-8 py-4 text-lg font-medium w-full sm:w-auto"
                  >
                    🏊‍♀️ I want to swim
                  </Button>
                </Link>
                
                <Link to="/host-waitlist">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-pool-primary text-pool-primary hover:bg-pool-primary hover:text-white px-8 py-4 text-lg font-medium w-full sm:w-auto"
                  >
                    🏨 I manage a hotel pool
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="bg-white section-padding">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-pool-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏊‍♀️</span>
                </div>
                <h3 className="text-xl font-semibold text-pool-dark mb-2">Book by the Day</h3>
                <p className="text-gray-600">Access beautiful pools without the overnight stay</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-pool-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌟</span>
                </div>
                <h3 className="text-xl font-semibold text-pool-dark mb-2">Premium Venues</h3>
                <p className="text-gray-600">Hotels, private pools, and unique locations</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-pool-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold text-pool-dark mb-2">Simple Booking</h3>
                <p className="text-gray-600">Easy online booking for instant confirmation</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default WaitlistLanding;
