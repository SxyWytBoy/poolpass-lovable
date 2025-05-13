
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewProps {
  id: string;
  user: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
  created_at?: string;
}

interface ReviewsSectionProps {
  reviews: ReviewProps[];
  overallRating: number;
  totalReviews: number;
}

const ReviewsSection = ({ reviews, overallRating, totalReviews }: ReviewsSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center mb-6">
        <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400 mr-2" />
        <span className="text-xl font-semibold mr-1">{overallRating?.toFixed(1)}</span>
        <span className="text-gray-700">· {totalReviews} reviews</span>
      </div>
      
      <div className="space-y-6">
        {reviews && reviews.map((review: ReviewProps) => (
          <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
            <div className="flex items-center mb-2">
              <img 
                src={review.avatar || review.profiles?.avatar_url || "https://via.placeholder.com/40"} 
                alt={review.user || review.profiles?.full_name || "User"}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-medium">{review.user || review.profiles?.full_name || "User"}</p>
                <p className="text-sm text-gray-500">
                  {review.date || new Date(review.created_at || "").toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-4 w-4 mr-0.5", 
                    i < review.rating ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"
                  )}
                />
              ))}
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
