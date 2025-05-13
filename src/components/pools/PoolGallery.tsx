
import React, { useState } from 'react';
import { Pool } from '@/types';

interface PoolGalleryProps {
  images: string[];
  name: string;
}

const PoolGallery = ({ images, name }: PoolGalleryProps) => {
  const [mainImageIndex, setMainImageIndex] = useState(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-8">
      {/* Main Image */}
      <div className="md:col-span-8 h-[400px] md:h-[500px] rounded-lg overflow-hidden">
        <img 
          src={images[mainImageIndex]} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Thumbnails */}
      <div className="md:col-span-4 grid grid-cols-2 gap-2 h-[400px] md:h-[500px]">
        {images.slice(0, 4).map((img: string, index: number) => (
          index !== mainImageIndex && (
            <div 
              key={index}
              onClick={() => setMainImageIndex(index)}
              className="rounded-lg overflow-hidden cursor-pointer h-full"
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

export default PoolGallery;
