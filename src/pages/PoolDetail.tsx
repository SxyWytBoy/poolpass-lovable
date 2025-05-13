
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Star, MapPin, Calendar as CalendarIcon, Clock, Check, Info } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

// Mock data for a specific pool
const poolData = {
  id: "1",
  name: "Luxury Indoor Pool & Spa",
  description: "This stunning indoor pool and spa is located in a private residence in Kensington. The heated pool is 15m x 5m with a constant depth of 1.4m, perfect for swimming laps or relaxing. The space includes loungers, changing facilities, and optional towel service. The ambient lighting and modern design create a serene atmosphere for your swimming experience.",
  location: "Kensington, London",
  price: 45,
  rating: 4.9,
  reviews: 128,
  indoorOutdoor: "indoor" as const,
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
  poolDetails: {
    size: "15m x 5m",
    depth: "1.4m constant",
    temperature: "29°C / 84°F",
    maxGuests: 8
  },
  host: {
    name: "Emma",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    responseTime: "Within an hour",
    joinedDate: "March 2022"
  },
  availableTimeSlots: [
    { id: "1", time: "09:00 - 10:00" },
    { id: "2", time: "10:30 - 11:30" },
    { id: "3", time: "12:00 - 13:00" },
    { id: "4", time: "14:00 - 15:00" },
    { id: "5", time: "15:30 - 16:30" },
    { id: "6", time: "17:00 - 18:00" },
    { id: "7", time: "19:00 - 20:00" },
  ],
  reviews: [
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

const PoolDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  const toggleExtra = (extraId: string) => {
    if (selectedExtras.includes(extraId)) {
      setSelectedExtras(selectedExtras.filter(id => id !== extraId));
    } else {
      setSelectedExtras([...selectedExtras, extraId]);
    }
  };
  
  // Calculate total price
  const basePrice = poolData.price;
  const extrasPrice = selectedExtras.reduce((total, extraId) => {
    const extra = poolData.extras.find(e => e.id === extraId);
    return total + (extra ? extra.price : 0);
  }, 0);
  const totalPrice = basePrice + extrasPrice;
  
  const handleBookNow = () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select a date and time slot");
      return;
    }
    console.log("Booking confirmed", {
      pool: poolData,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      extras: selectedExtras,
      totalPrice
    });
    // In a real app, this would navigate to the checkout/payment page
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Photo Gallery */}
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-4">{poolData.name}</h1>
          <div className="flex items-center text-gray-600 mb-6">
            <div className="flex items-center mr-4">
              <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400 mr-1" />
              <span className="font-medium">{poolData.rating.toFixed(1)}</span>
              <span className="text-gray-500 ml-1">({poolData.reviews} reviews)</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{poolData.location}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-8">
            {/* Main Image */}
            <div className="md:col-span-8 h-[400px] md:h-[500px] rounded-lg overflow-hidden">
              <img 
                src={poolData.images[mainImageIndex]} 
                alt={poolData.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="md:col-span-4 grid grid-cols-2 gap-2 h-[400px] md:h-[500px]">
              {poolData.images.slice(0, 4).map((img, index) => (
                index !== mainImageIndex && (
                  <div 
                    key={index}
                    onClick={() => setMainImageIndex(index)}
                    className="rounded-lg overflow-hidden cursor-pointer h-full"
                  >
                    <img 
                      src={img} 
                      alt={`${poolData.name} - view ${index + 1}`}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    />
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
        
        {/* Pool Details & Booking Section */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold">About this pool</h2>
                    <p className="text-gray-600">Hosted by {poolData.host.name}</p>
                  </div>
                  <img 
                    src={poolData.host.image} 
                    alt={poolData.host.name}
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700">{poolData.description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-medium">{poolData.poolDetails.size}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Depth</p>
                    <p className="font-medium">{poolData.poolDetails.depth}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Temperature</p>
                    <p className="font-medium">{poolData.poolDetails.temperature}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Max Guests</p>
                    <p className="font-medium">{poolData.poolDetails.maxGuests}</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {poolData.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      {amenity.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <span className="h-5 w-5 border rounded-full flex items-center justify-center mr-2 text-gray-400">
                          <Info className="h-3 w-3" />
                        </span>
                      )}
                      <span className={amenity.included ? 'text-gray-800' : 'text-gray-400 line-through'}>
                        {amenity.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Reviews Section */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-center mb-6">
                  <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400 mr-2" />
                  <span className="text-xl font-semibold mr-1">{poolData.rating.toFixed(1)}</span>
                  <span className="text-gray-700">· {poolData.reviews} reviews</span>
                </div>
                
                <div className="space-y-6">
                  {poolData.reviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
                      <div className="flex items-center mb-2">
                        <img 
                          src={review.avatar} 
                          alt={review.user}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium">{review.user}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
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
            </div>
            
            {/* Right Column - Booking */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-24">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-2xl font-semibold text-pool-primary">
                    £{poolData.price}
                    <span className="text-sm font-normal text-gray-600">/hour</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400 mr-1" />
                    <span className="font-medium mr-1">{poolData.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({poolData.reviews})</span>
                  </div>
                </div>
                
                {/* Date Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Time Slots */}
                {selectedDate && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
                    <div className="grid grid-cols-2 gap-2">
                      {poolData.availableTimeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot.id)}
                          className={cn(
                            "p-2 text-sm border rounded-md flex items-center justify-center",
                            selectedTimeSlot === slot.id 
                              ? "bg-pool-light border-pool-primary text-pool-primary font-medium" 
                              : "border-gray-200 text-gray-700 hover:border-pool-primary"
                          )}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Extras */}
                <div className="mb-6">
                  <Tabs defaultValue="extras">
                    <TabsList className="w-full mb-4">
                      <TabsTrigger value="extras" className="w-full">Add Extras</TabsTrigger>
                      <TabsTrigger value="guests" className="w-full">Guests</TabsTrigger>
                    </TabsList>
                    <TabsContent value="extras">
                      <div className="space-y-3">
                        {poolData.extras.map((extra) => (
                          <div key={extra.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Checkbox 
                                id={extra.id}
                                checked={selectedExtras.includes(extra.id)}
                                onCheckedChange={() => toggleExtra(extra.id)}
                                className="mr-2"
                              />
                              <Label htmlFor={extra.id}>{extra.name}</Label>
                            </div>
                            <span className="text-sm">+ £{extra.price}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="guests">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Number of Guests</span>
                        <select className="border rounded-md p-1">
                          {[...Array(poolData.poolDetails.maxGuests)].map((_, i) => (
                            <option key={i} value={i + 1}>
                              {i + 1} {i === 0 ? 'guest' : 'guests'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Price Summary */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Base price</span>
                    <span>£{basePrice}</span>
                  </div>
                  {selectedExtras.length > 0 && (
                    <div className="flex justify-between mb-2">
                      <span>Extras</span>
                      <span>£{extrasPrice}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>£{totalPrice}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-pool-primary hover:bg-pool-secondary"
                  onClick={handleBookNow}
                  disabled={!selectedDate || !selectedTimeSlot}
                >
                  Book Now
                </Button>
                
                <p className="text-xs text-center text-gray-500 mt-4">
                  You won't be charged yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PoolDetail;
