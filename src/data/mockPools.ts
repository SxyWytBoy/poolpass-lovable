
import { PoolItem } from '@/components/pools/PoolGrid';

export const realHotelPools: PoolItem[] = [
  // Central London Luxury Hotels
  {
    id: "shangri-la-shard",
    name: "Shangri-La Hotel at The Shard - TING Lounge Pool",
    location: "London Bridge, London",
    price: 95,
    rating: 4.9,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "City Views", "Towels Provided", "Changing Rooms", "Bar Service", "Spa Access"]
  },
  {
    id: "corinthia-espa",
    name: "Corinthia Hotel London - ESPA Life Spa Pool",
    location: "Whitehall, London",
    price: 85,
    rating: 4.8,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Spa", "Sauna", "Steam Room", "Towels Provided", "Hydrotherapy"]
  },
  {
    id: "bulgari-london",
    name: "Bulgari Hotel London - Spa Pool",
    location: "Knightsbridge, London",
    price: 120,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Luxury Spa", "Towels Provided", "Private Cabanas", "Champagne Service"]
  },
  {
    id: "ned-london",
    name: "The Ned - Rooftop Pool Club",
    location: "Bank, London",
    price: 75,
    rating: 4.7,
    reviews: 298,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "City Views", "Bar Service", "Loungers", "Food Available", "DJ Sets"]
  },
  {
    id: "four-seasons-park-lane",
    name: "Four Seasons Hotel London at Park Lane - Spa Pool",
    location: "Mayfair, London",
    price: 110,
    rating: 4.8,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Spa", "Towels Provided", "Personal Training", "Relaxation Area"]
  },
  {
    id: "zetter-townhouse-marylebone",
    name: "Zetter Townhouse Marylebone - Hidden Pool",
    location: "Marylebone, London",
    price: 68,
    rating: 4.5,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1615394717477-43fe6ee0def3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Victorian Townhouse", "Intimate Setting", "Cocktail Bar", "Boutique Luxury"]
  },
  {
    id: "rosewood-london",
    name: "Rosewood London - Sense Spa Pool",
    location: "Holborn, London",
    price: 90,
    rating: 4.8,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Luxury Spa", "Vitality Pool", "Relaxation Pods", "Towels Provided"]
  },
  {
    id: "berkeley-rooftop",
    name: "The Berkeley - Rooftop Pool",
    location: "Belgravia, London",
    price: 105,
    rating: 4.9,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1477120292453-dbba2d987c24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Rooftop Views", "Fashion-themed", "Luxury Service", "Poolside Dining"]
  },

  // Greater London & Home Counties (within 50 miles)
  {
    id: "grove-hertfordshire",
    name: "The Grove - Championship Golf Resort Pool",
    location: "Hertfordshire (25 miles from London)",
    price: 55,
    rating: 4.6,
    reviews: 187,
    image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Golf Resort", "Spa", "Family Friendly", "Countryside Views", "Fitness Center"]
  },
  {
    id: "stoke-park-buckinghamshire",
    name: "Stoke Park - Country Club Pool",
    location: "Buckinghamshire (30 miles from London)",
    price: 65,
    rating: 4.7,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Country Club", "Golf Course", "Spa", "Historic Property", "Luxury Service"]
  },
  {
    id: "cliveden-house",
    name: "Cliveden House - Pavilion Spa Pool",
    location: "Berkshire (35 miles from London)",
    price: 95,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "both" as const,
    amenities: ["Heated", "Historic Estate", "Thames Views", "Luxury Spa", "Award Winning", "National Trust"]
  },
  {
    id: "pennyhill-park-surrey",
    name: "Pennyhill Park Hotel & Spa - Outdoor Pool",
    location: "Surrey (40 miles from London)",
    price: 70,
    rating: 4.8,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "both" as const,
    amenities: ["Heated", "England Rugby HQ", "Spa", "Family Pool", "Hot Tub/Jacuzzi", "Countryside"]
  },
  {
    id: "alexander-house-sussex",
    name: "Alexander House Hotel & Utopia Spa - Pool Complex",
    location: "West Sussex (45 miles from London)",
    price: 58,
    rating: 4.6,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "both" as const,
    amenities: ["Heated", "Utopia Spa", "Indoor/Outdoor", "Hydrotherapy", "Garden Setting", "Spa Treatments"]
  },

  // Heathrow Area Hotels
  {
    id: "sofitel-heathrow",
    name: "Sofitel London Heathrow - Terminal 5 Pool",
    location: "Heathrow Airport (20 miles from London)",
    price: 42,
    rating: 4.4,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Airport Hotel", "24/7 Access", "Business Center", "Transit Convenience"]
  },
  {
    id: "hilton-heathrow-t4",
    name: "Hilton London Heathrow Airport Terminal 4 - Pool",
    location: "Heathrow Airport (20 miles from London)",
    price: 38,
    rating: 4.3,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Airport Location", "Fitness Center", "Business Facilities", "24/7 Access"]
  },

  // Thames Valley Hotels
  {
    id: "great-fosters-surrey",
    name: "Great Fosters - Historic Estate Pool",
    location: "Surrey (25 miles from London)",
    price: 72,
    rating: 4.7,
    reviews: 123,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Tudor Mansion", "Historic Property", "Spa", "Garden Views", "Luxury Service"]
  },
  {
    id: "runnymede-surrey",
    name: "Runnymede on Thames - Spa Pool",
    location: "Surrey (30 miles from London)",
    price: 52,
    rating: 4.5,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Thames Views", "Spa", "Historic Location", "Magna Carta", "River Setting"]
  },

  // Essex & Kent Hotels (within range)
  {
    id: "eastwell-manor-kent",
    name: "Eastwell Manor Hotel & Spa - Country Pool",
    location: "Kent (50 miles from London)",
    price: 62,
    rating: 4.6,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1615394717477-43fe6ee0def3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "both" as const,
    amenities: ["Heated", "Manor House", "Spa", "Golf Course", "Country Estate", "Historic Property"]
  },
  {
    id: "down-hall-essex",
    name: "Down Hall Hotel & Spa - Woodland Pool",
    location: "Essex (40 miles from London)",
    price: 48,
    rating: 4.4,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Country House", "Spa", "Woodland Setting", "Family Friendly", "Golf Course"]
  },

  // North London Area
  {
    id: "grove-chandlers-cross",
    name: "The Grove Hotel - Sequoia Spa Pool",
    location: "Hertfordshire (20 miles from London)",
    price: 68,
    rating: 4.8,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "both" as const,
    amenities: ["Heated", "Championship Golf", "Sequoia Spa", "Family Pool", "Luxury Resort", "Country Estate"]
  },

  // Windsor Area
  {
    id: "oakley-court-windsor",
    name: "Oakley Court Hotel - Victorian Pool",
    location: "Windsor, Berkshire (25 miles from London)",
    price: 58,
    rating: 4.5,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Victorian Gothic", "Thames Views", "Historic Hotel", "Film Location", "Spa"]
  },
  {
    id: "macdonald-windsor",
    name: "Macdonald Windsor Hotel - Leisure Pool",
    location: "Windsor, Berkshire (25 miles from London)",
    price: 35,
    rating: 4.2,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Fitness Center", "Family Friendly", "Windsor Castle Views", "Leisure Club"]
  },

  // Oxfordshire Hotels
  {
    id: "le-manoir-oxfordshire",
    name: "Le Manoir aux Quat'Saisons - Garden Pool",
    location: "Oxfordshire (45 miles from London)",
    price: 150,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1477120292453-dbba2d987c24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Raymond Blanc", "Michelin Stars", "Kitchen Garden", "Luxury Spa", "Gourmet Experience"]
  },
  {
    id: "oxford-spires",
    name: "Oxford Spires Hotel - City Pool",
    location: "Oxford (50 miles from London)",
    price: 42,
    rating: 4.3,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "City Centre", "University Town", "Fitness Center", "Business Facilities"]
  },

  // Boutique London Hotels
  {
    id: "ham-yard-hotel",
    name: "Ham Yard Hotel - Subterranean Pool",
    location: "Soho, London",
    price: 82,
    rating: 4.6,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1615394717477-43fe6ee0def3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Boutique Design", "Underground Pool", "Theatre District", "Firmdale Hotels", "Unique Design"]
  },
  {
    id: "mondrian-london",
    name: "Mondrian London - Agua Spa Pool",
    location: "South Bank, London",
    price: 78,
    rating: 4.5,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Thames Views", "Agua Spa", "Modern Design", "Riverside Location", "Spa Treatments"]
  },
  {
    id: "chiltern-firehouse",
    name: "Chiltern Firehouse - Private Pool",
    location: "Marylebone, London",
    price: 125,
    rating: 4.8,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Celebrity Hotspot", "Historic Firehouse", "Exclusive Access", "Luxury Service", "Private Club Feel"]
  }
];
