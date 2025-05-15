
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Pool } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PoolHeader from '@/components/pool-detail/PoolHeader';
import PhotoGallery from '@/components/pool-detail/PhotoGallery';
import PoolInfo from '@/components/pool-detail/PoolInfo';
import ReviewsSection from '@/components/pool-detail/ReviewsSection';
import BookingPanel from '@/components/pool-detail/BookingPanel';

// Mock data for a fallback when API is not available
const poolDataFallback = {
  id: "1",
  name: "Luxury Indoor Pool & Spa",
  description: "This stunning indoor pool and spa is located in a private residence in Kensington. The heated pool is 15m x 5m with a constant depth of 1.4m, perfect for swimming laps or relaxing. The space includes loungers, changing facilities, and optional towel service. The ambient lighting and modern design create a serene atmosphere for your swimming experience.",
  location: "Kensington, London",
  price: 45,
  rating: 4.9,
  reviews: 128,
  indoor_outdoor: "indoor" as const,
  images: [
    "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  ],
  amenities: [
    { name: "Heated Pool", included: true },
    { name: "Loungers", included: true },
    { name: "Towels", included: false },
    { name: "Changing Room", included: true },
    { name: "Jacuzzi", included: true },
    { name: "Sauna", included: false },
    { name: "Parking", included: true },
    { name: "WiFi", included: true },
  ],
  extras: [
    { id: "towels", name: "Towels", price: 5 },
    { id: "sauna", name: "Sauna Session", price: 15 },
    { id: "drinks", name: "Welcome Drinks", price: 8 },
    { id: "instructor", name: "Swimming Instructor (30 min)", price: 25 },
  ],
  pool_details: {
    size: "15m x 5m",
    depth: "1.4m constant",
    temperature: "29°C / 84°F",
    maxGuests: 8
  },
  host: {
    id: "host-1",
    name: "Emma",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    responseTime: "Within an hour",
    joinedDate: "March 2022"
  },
  available_time_slots: [
    { id: "1", time: "09:00 - 10:00" },
    { id: "2", time: "10:30 - 11:30" },
    { id: "3", time: "12:00 - 13:00" },
    { id: "4", time: "14:00 - 15:00" },
    { id: "5", time: "15:30 - 16:30" },
    { id: "6", time: "17:00 - 18:00" },
    { id: "7", time: "19:00 - 20:00" },
  ],
  reviewsData: [
    {
      id: "1",
      user: "Sarah",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      date: "July 2023",
      rating: 5,
      comment: "Absolutely stunning pool! The water was perfectly heated and the entire space was spotless. Emma was a gracious host and made sure we had everything we needed. Will definitely be back!"
    },
    {
      id: "2",
      user: "Michael",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
      date: "June 2023",
      rating: 5,
      comment: "A wonderful experience from start to finish. The pool area is beautiful and so relaxing. It feels very private and luxurious."
    },
    {
      id: "3",
      user: "Jessica",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
      date: "May 2023",
      rating: 4,
      comment: "Great pool in a convenient location. The changing facilities were clean and well-maintained. The only reason for 4 stars instead of 5 was that the parking was a bit limited."
    }
  ]
};

// Type for processed pool data - fixing missing id property in host
interface ProcessedPoolData extends Omit<Pool, 'host'> {
  reviewsData?: any[];
  host: {
    id?: string | undefined;
    name: string;
    image: string;
    responseTime: string;
    joinedDate: string;
  };
}

// Type for review data to fix TypeScript errors
interface ReviewData {
  id: string;
  user?: string;
  avatar?: string;
  date?: string;
  rating: number;
  comment: string;
  user_id?: string;
  pool_id?: string;
  created_at?: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}

// Type for profiles data in reviews
interface ProfileData {
  id?: string;
  full_name?: string;
  avatar_url?: string;
}

const PoolDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch pool data
  const { data: rawPoolData, isLoading } = useQuery({
    queryKey: ['pool', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('pools')
          .select(`
            *,
            host:host_id (*)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Process the data to match our expected format
          const processedData = {
            ...data,
            amenities: Array.isArray(data.amenities) ? data.amenities : [],
            extras: Array.isArray(data.extras) ? data.extras : [],
            pool_details: data.pool_details || {
              size: "Unknown",
              depth: "Unknown",
              temperature: "Unknown",
              maxGuests: 1
            },
            // If host information exists, format it, otherwise use fallback
            host: {
              id: data.host?.id,
              name: data.host?.full_name || "Host",
              image: data.host?.avatar_url || "https://via.placeholder.com/40",
              responseTime: "Within a day",
              joinedDate: new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
            },
            available_time_slots: [
              { id: "1", time: "09:00 - 10:00" },
              { id: "2", time: "10:30 - 11:30" },
              { id: "3", time: "12:00 - 13:00" },
              { id: "4", time: "14:00 - 15:00" },
              { id: "5", time: "15:30 - 16:30" },
            ]
          };
          return processedData;
        }
        
        return poolDataFallback;
      } catch (error) {
        console.error("Error fetching pool:", error);
        return poolDataFallback;
      }
    },
    enabled: !!id,
  });

  // Process pool data to ensure it has all the required fields
  const poolData: ProcessedPoolData = rawPoolData as ProcessedPoolData;

  // Fetch reviews for this pool
  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      try {
        const { data: reviewData, error } = await supabase
          .from('reviews')
          .select(`
            *,
            profiles:user_id (full_name, avatar_url)
          `)
          .eq('pool_id', id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        return reviewData || poolDataFallback.reviewsData;
      } catch (error) {
        console.error("Error fetching reviews:", error);
        return poolDataFallback.reviewsData;
      }
    },
    enabled: !!id,
  });
  
  const handleBookNow = async (selectedDate: Date, selectedTimeSlot: string, selectedExtras: string[]) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book this pool",
      });
      return;
    }
    
    try {
      const timeSlot = poolData.available_time_slots?.find((slot: any) => slot.id === selectedTimeSlot)?.time || '';
      
      // Calculate total price for the booking
      const basePrice = poolData?.price || 0;
      const extrasPrice = selectedExtras.reduce((total, extraId) => {
        const extra = poolData?.extras?.find((e: any) => e.id === extraId);
        return total + (extra ? extra.price : 0);
      }, 0);
      const totalPrice = basePrice + extrasPrice;
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          pool_id: id || '',
          user_id: user.id,
          date: selectedDate.toISOString().split('T')[0],
          time_slot: timeSlot,
          extras: selectedExtras,
          total_price: totalPrice,
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast({
        title: "Booking successful!",
        description: "You can view your booking in your dashboard",
      });
      
    } catch (error) {
      console.error("Error booking pool:", error);
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking",
        variant: "destructive",
      });
    }
  };

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

  const pool = poolData || poolDataFallback;
  
  // Process the reviews data to ensure proper typing
  const processedReviewsData = React.useMemo(() => {
    if (!reviewsData) return [];
    
    return (reviewsData as ReviewData[]).map(review => {
      // Ensure profiles is treated as ProfileData or undefined
      const profileData = review.profiles as ProfileData | undefined;
      
      return {
        ...review,
        // Use profile data if available, otherwise use fallbacks
        user: profileData?.full_name || review.user || "Anonymous",
        avatar: profileData?.avatar_url || review.avatar || "https://via.placeholder.com/40",
        date: review.created_at 
          ? new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) 
          : review.date || "Unknown date"
      };
    });
  }, [reviewsData]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Photo Gallery Section with Animation */}
        <div className="container mx-auto px-4 py-6">
          <PoolHeader 
            name={pool.name} 
            rating={pool.rating} 
            reviews={pool.reviews} 
            location={pool.location} 
          />
          
          <PhotoGallery images={pool.images} name={pool.name} />
        </div>
        
        {/* Pool Details & Booking Section */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2">
              <PoolInfo 
                description={pool.description}
                host={pool.host}
                poolDetails={pool.pool_details}
                amenities={pool.amenities}
              />
              
              {/* Reviews Section */}
              <ReviewsSection 
                rating={pool.rating} 
                reviews={pool.reviews} 
                reviewsData={processedReviewsData}
              />
            </div>
            
            {/* Right Column - Booking */}
            <div className="lg:col-span-1">
              <BookingPanel 
                pool={pool}
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
