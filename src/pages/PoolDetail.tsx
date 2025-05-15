
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PoolHeader from '@/components/pool-detail/PoolHeader';
import PhotoGallery from '@/components/pool-detail/PhotoGallery';
import PoolInfo from '@/components/pool-detail/PoolInfo';
import ReviewsSection from '@/components/pool-detail/ReviewsSection';
import BookingPanel from '@/components/pool-detail/BookingPanel';
import { usePoolData } from '@/hooks/use-pool-data';
import { useReviews } from '@/hooks/use-reviews';

const PoolDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  // Use our custom hooks
  const { poolData, isLoading } = usePoolData(id);
  const { reviewsData } = useReviews(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-gray-200 rounded w-48 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBookNow = async (selectedDate: Date, selectedTimeSlot: string, selectedExtras: string[]) => {
    // We'll delegate this to the BookingPanel component which uses our useBooking hook
    // This is just a wrapper to maintain the same interface
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Photo Gallery Section with Animation */}
        <div className="container mx-auto px-4 py-6">
          <PoolHeader 
            name={poolData.name} 
            rating={poolData.rating} 
            reviews={poolData.reviews} 
            location={poolData.location} 
          />
          
          <PhotoGallery images={poolData.images} name={poolData.name} />
        </div>
        
        {/* Pool Details & Booking Section */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2">
              <PoolInfo 
                description={poolData.description}
                host={poolData.host}
                poolDetails={poolData.pool_details}
                amenities={poolData.amenities}
              />
              
              {/* Reviews Section */}
              <ReviewsSection 
                rating={poolData.rating} 
                reviews={poolData.reviews} 
                reviewsData={reviewsData}
              />
            </div>
            
            {/* Right Column - Booking */}
            <div className="lg:col-span-1">
              <BookingPanel 
                pool={poolData}
                user={user}
                onBookNow={handleBookNow}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PoolDetail;
