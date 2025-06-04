
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types';

// Create mock data for fallback reviews
const reviewsDataFallback: Review[] = [
  {
    id: "1",
    pool_id: "1",
    user_id: "user1",
    rating: 5,
    comment: "Absolutely stunning pool! The facilities were immaculate and the host was incredibly accommodating.",
    created_at: "2023-10-15",
    updated_at: "2023-10-15",
    profiles: {
      full_name: "Sarah Johnson",
      avatar_url: "https://randomuser.me/api/portraits/women/32.jpg"
    }
  },
  {
    id: "2",
    pool_id: "1", 
    user_id: "user2",
    rating: 4,
    comment: "Great experience overall. The water temperature was perfect and the atmosphere was very relaxing.",
    created_at: "2023-09-28",
    updated_at: "2023-09-28",
    profiles: {
      full_name: "Michael Thompson",
      avatar_url: "https://randomuser.me/api/portraits/men/41.jpg"
    }
  }
];

export const useReviews = (poolId: string | undefined) => {
  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', poolId],
    queryFn: async () => {
      if (!poolId) return reviewsDataFallback;
      
      try {
        const { data: reviewData, error } = await supabase
          .from('reviews')
          .select(`
            *,
            profiles:user_id (full_name, avatar_url)
          `)
          .eq('pool_id', poolId)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) {
          console.error("Error fetching reviews:", error);
          return reviewsDataFallback;
        }
        
        return reviewData || reviewsDataFallback;
      } catch (error) {
        console.error("Error fetching reviews:", error);
        return reviewsDataFallback;
      }
    },
    enabled: !!poolId,
  });
  
  // Process the reviews data to ensure proper display formatting
  const processedReviewsData = React.useMemo(() => {
    if (!reviewsData) return [];
    
    return reviewsData.map(review => ({
      ...review,
      user: review.profiles?.full_name || "Anonymous",
      avatar: review.profiles?.avatar_url || "https://via.placeholder.com/40",
      date: new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    }));
  }, [reviewsData]);

  return { reviewsData: processedReviewsData };
};

export { reviewsDataFallback };
