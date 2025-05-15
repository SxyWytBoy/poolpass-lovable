
import React, { useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PhotoGalleryProps {
  images: string[];
  name: string;
}

const PhotoGallery = ({ images, name }: PhotoGalleryProps) => {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  
  // Make sure we have at least one image
  const safeImages = images && images.length > 0 ? images : ['https://via.placeholder.com/800x500?text=No+Image+Available'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-8 fade-in">
      {/* Main Image with zoom effect on hover */}
      <div className="md:col-span-8 h-[400px] md:h-[500px] rounded-lg overflow-hidden">
        <AspectRatio ratio={16/9} className="h-full">
          <img 
            src={safeImages[mainImageIndex]} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            onError={(e) => {
              // Fallback for image loading errors
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x500?text=Image+Not+Available';
            }}
          />
        </AspectRatio>
      </div>
      
      {/* Thumbnails with hover effects */}
      <div className="md:col-span-4 grid grid-cols-2 gap-3 h-[400px] md:h-[500px]">
        {safeImages.length <= 1 ? (
          // Show placeholder thumbnails if there's only the main image
          <>
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="rounded-lg bg-gray-100 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Image {num}
                </div>
              </div>
            ))}
          </>
        ) : (
          // Show thumbnails for available images
          safeImages.slice(0, 5).map((img: string, index: number) => (
            // Don't skip the main image in the thumbnails
            <div 
              key={index}
              onClick={() => setMainImageIndex(index)}
              className={cn(
                "rounded-lg overflow-hidden cursor-pointer h-full transform transition-all duration-300",
                "hover:shadow-lg hover:-translate-y-1",
                index === mainImageIndex ? "ring-2 ring-pool-primary" : ""
              )}
            >
              <img 
                src={img} 
                alt={`${name} - view ${index + 1}`}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                onError={(e) => {
                  // Fallback for thumbnail errors
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Thumbnail';
                }}
              />
            </div>
          ))
        )}
      </div>
      
      {/* Mobile carousel for small screens */}
      <div className="md:hidden col-span-12 mt-4">
        <Carousel className="w-full">
          <CarouselContent>
            {safeImages.map((img: string, index: number) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <div className="rounded-lg overflow-hidden h-[250px]">
                    <img 
                      src={img} 
                      alt={`${name} - view ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x500?text=Image+Not+Available';
                      }}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </div>
  );
};

export default PhotoGallery;
