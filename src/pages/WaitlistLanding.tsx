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
        {/* Hero Section */}
        <section
          className="relative min-h-[360px] md:min-h-[400px]"
          style={{
            backgroundImage: `url('/images/waitlist-water.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>

          <div className="container mx-auto px-4 relative z-10 flex flex-col justify-center min-h-[360px] md:min-h-[400px] pt-10">
            <div className="max-w-3xl mx-auto text-center text-white space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                Find and Book Your Next Pool Day — No Hotel Stay or Special Membership Needed
              </h1>

              <p className="text-lg md:text-xl">
                PoolPass gives you access to beautiful hotel pools across the UK, for the day.
              </p>

              <div className="text-base md:text-lg">
                <p>🌤️ Swim. Sunbathe. Chill. No overnight stay required.</p>
                <p>🏨 Hotels earn extra revenue. You escape without leaving town.</p>
              </div>

              <p className="font-medium">👇 Join the waitlist and be the first to book.</p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
                <Link to="/guest-waitlist">
                  <Button 
                    size="lg" 
                    className="bg-pool-primary hover:bg-pool-secondary text-white px-6 py-3 text-base font-medium w-full sm:w-auto"
                  >
                    I’d be interested in booking a PoolPass
                  </Button>
                </Link>
                <Link to="/host-waitlist">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-pool-primary text-pool-primary hover:bg-pool-primary hover:text-white px-6 py-3 text-base font-medium w-full sm:w-auto"
                  >
                    I’d be interested in hosting my pool space
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-14 h-14 bg-pool-light rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🏊‍♀️</span>
                </div>
                <h3 className="text-lg font-semibold text-pool-dark mb-1">Book by the Day</h3>
                <p className="text-gray-600 text-sm">Access stunning pools with no overnight commitment</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-pool-light rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🌟</span>
                </div>
                <h3 className="text-lg font-semibold text-pool-dark mb-1">Premium Locations</h3>
                <p className="text-gray-600 text-sm">Enjoy hotel-grade pools and curated private spaces</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-pool-light rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">📱</span>
                </div>
                <h3 className="text-lg font-semibold text-pool-dark mb-1">Simple Booking</h3>
                <p className="text-gray-600 text-sm">Easy-to-use online platform with instant confirmation</p>
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
