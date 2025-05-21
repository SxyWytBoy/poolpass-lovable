
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PhotoGalleryProps {
  images: string[];
  name: string;
}

const PhotoGallery = ({ images, name }: PhotoGalleryProps) => {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  
  // Make sure we have at least one image
  const safeImages = images && images.length > 0 ? images : ['https://via.placeholder.com/800x500?text=No+Image+Available'];
  
  // Define the tab specific images with more variety and better quality
  const rooftopPoolImages = [
    'https://images.unsplash.com/photo-1477120292453-dbba2d987c24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80', 
    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    'https://images.unsplash.com/photo-1496307653780-42ee777d4833?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
  ];
  
  const countryHouseImages = [
    'https://images.unsplash.com/photo-1551123847-4041291bec0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
  ];
  
  // Default to the main pool's images (from props)
  const [activeTabImages, setActiveTabImages] = useState<string[]>(safeImages);
  const [activeTabName, setActiveTabName] = useState("main");
  
  const handleTabChange = (value: string) => {
    setActiveTabName(value);
    setMainImageIndex(0); // Reset the main image index when changing tabs
    
    switch(value) {
      case 'rooftop':
        setActiveTabImages(rooftopPoolImages);
        break;
      case 'countryhouse':
        setActiveTabImages(countryHouseImages);
        break;
      case 'main':
      default:
        setActiveTabImages(safeImages);
    }
  };
  
  return (
    <div className="grid grid-cols-1 gap-3 mb-8 fade-in">
      {/* Tab selection for different views */}
      <div className="mb-4">
        <Tabs defaultValue="main" onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="main">Main Pool</TabsTrigger>
            <TabsTrigger value="rooftop">Rooftop Infinity Pool</TabsTrigger>
            <TabsTrigger value="countryhouse">Country House Pool & Gardens</TabsTrigger>
          </TabsList>
          
          {/* Adding TabsContent for visual feedback */}
          <TabsContent value="main" className="mt-0">
            <p className="text-sm text-gray-500 mb-2">Viewing main pool images</p>
          </TabsContent>
          <TabsContent value="rooftop" className="mt-0">
            <p className="text-sm text-gray-500 mb-2">Viewing rooftop infinity pool images</p>
          </TabsContent>
          <TabsContent value="countryhouse" className="mt-0">
            <p className="text-sm text-gray-500 mb-2">Viewing country house pool & gardens images</p>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Main Image with zoom effect on hover */}
        <div className="md:col-span-8 h-[400px] md:h-[500px] rounded-lg overflow-hidden">
          <AspectRatio ratio={16/9} className="h-full">
            <img 
              src={activeTabImages[mainImageIndex]} 
              alt={`${name} - ${activeTabName}`} 
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
          {activeTabImages.length <= 1 ? (
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
            activeTabImages.slice(0, 4).map((img: string, index: number) => (
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
                  alt={`${name} - ${activeTabName} view ${index + 1}`}
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
      </div>
      
      {/* Mobile carousel for small screens */}
      <div className="md:hidden col-span-12 mt-4">
        <Carousel className="w-full">
          <CarouselContent>
            {activeTabImages.map((img: string, index: number) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <div className="rounded-lg overflow-hidden h-[250px]">
                    <img 
                      src={img} 
                      alt={`${name} - ${activeTabName} view ${index + 1}`}
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
