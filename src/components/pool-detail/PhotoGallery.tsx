
import React, { useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

interface PhotoGalleryProps {
  images: string[];
  name: string;
}

const PhotoGallery = ({ images, name }: PhotoGalleryProps) => {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-8 fade-in">
      {/* Main Image with zoom effect on hover */}
      <div className="md:col-span-8 h-[400px] md:h-[500px] rounded-lg overflow-hidden">
        <AspectRatio ratio={16/9} className="h-full">
          <img 
            src={images[mainImageIndex]} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </AspectRatio>
      </div>
      
      {/* Thumbnails with hover effects */}
      <div className="md:col-span-4 grid grid-cols-2 gap-3 h-[400px] md:h-[500px]">
        {images.slice(0, 4).map((img: string, index: number) => (
          index !== mainImageIndex && (
            <div 
              key={index}
              onClick={() => setMainImageIndex(index)}
              className={cn(
                "rounded-lg overflow-hidden cursor-pointer h-full transform transition-all duration-300",
                "hover:shadow-lg hover:-translate-y-1"
              )}
            >
              <img 
                src={img} 
                alt={`${name} - view ${index + 1}`}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
