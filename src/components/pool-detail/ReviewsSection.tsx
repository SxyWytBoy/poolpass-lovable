
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  user?: string;
  avatar?: string;
  date?: string;
  rating: number;
  comment: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
  created_at?: string;
}

interface ReviewsSectionProps {
  rating?: number;
  reviews?: number;
  reviewsData: Review[];
}

const ReviewsSection = ({ rating = 0, reviews = 0, reviewsData }: ReviewsSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center mb-8">
        <div className="bg-yellow-50 p-3 rounded-full mr-4">
          <Star className="h-6 w-6 fill-yellow-400 stroke-yellow-400" />
        </div>
        <div>
          <span className="text-xl font-semibold mr-1">{rating.toFixed(1)}</span>
          <span className="text-gray-700">· {reviews} reviews</span>
        </div>
      </div>
      
      <div className="space-y-6">
        {reviewsData && reviewsData.map((review: Review) => (
          <div 
            key={review.id} 
            className="pb-6 border-b border-gray-100 last:border-0 transform transition-all duration-300 hover:bg-gray-50 hover:rounded-lg hover:px-3"
          >
            <div className="flex items-center mb-3">
              <img 
                src={review.avatar || (review.profiles && review.profiles.avatar_url) || "https://via.placeholder.com/40"} 
                alt={review.user || (review.profiles && review.profiles.full_name) || "User"}
                className="w-12 h-12 rounded-full mr-3 border border-gray-200"
              />
              <div>
                <p className="font-medium text-gray-800">{review.user || (review.profiles && review.profiles.full_name) || "User"}</p>
                <p className="text-sm text-gray-500">
                  {review.date || (review.created_at && new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }))}
                </p>
              </div>
            </div>
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-4 w-4 mr-0.5", 
                    i < review.rating 
                      ? "fill-yellow-400 stroke-yellow-400" 
                      : "stroke-gray-300"
                  )}
                />
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
