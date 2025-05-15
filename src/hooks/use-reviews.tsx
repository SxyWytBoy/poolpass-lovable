
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { poolDataFallback } from './use-pool-data';

// Type for review data to fix TypeScript errors
export interface ReviewData {
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

export const useReviews = (poolId: string | undefined) => {
  // Fetch reviews for this pool
  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', poolId],
    queryFn: async () => {
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
        
        if (error) throw error;
        
        return reviewData || poolDataFallback.reviewsData;
      } catch (error) {
        console.error("Error fetching reviews:", error);
        return poolDataFallback.reviewsData;
      }
    },
    enabled: !!poolId,
  });
  
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

  return { reviewsData: processedReviewsData };
};
