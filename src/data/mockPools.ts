
import { PoolItem } from '@/components/pools/PoolGrid';

export const realHotelPools: PoolItem[] = [
  // London Luxury Hotels
  {
    id: "shangri-la-shard",
    name: "Shangri-La Hotel at The Shard - TING Lounge Pool",
    location: "London Bridge, London",
    price: 95,
    rating: 4.9,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
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
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
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
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
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
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
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
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Spa", "Towels Provided", "Personal Training", "Relaxation Area"]
  },

  // Manchester Hotels
  {
    id: "stock-exchange-manchester",
    name: "Stock Exchange Hotel - Spa Pool",
    location: "Manchester City Centre",
    price: 45,
    rating: 4.6,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Spa", "Sauna", "Towels Provided", "Changing Rooms"]
  },
  {
    id: "kimpton-clocktower",
    name: "Kimpton Clocktower Hotel - Spa Pool",
    location: "Oxford Road, Manchester",
    price: 40,
    rating: 4.5,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Fitness Center", "Towels Provided", "Modern Design"]
  },

  // Birmingham Hotels
  {
    id: "hotel-du-vin-birmingham",
    name: "Hotel du Vin Birmingham - Spa Pool",
    location: "Birmingham City Centre",
    price: 38,
    rating: 4.4,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Spa", "Wine Bar", "Towels Provided", "Boutique Style"]
  },

  // Edinburgh Hotels
  {
    id: "balmoral-edinburgh",
    name: "The Balmoral Hotel Edinburgh - Spa Pool",
    location: "Princes Street, Edinburgh",
    price: 65,
    rating: 4.7,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Historic Building", "Spa", "Towels Provided", "Castle Views"]
  },
  {
    id: "scotsman-edinburgh",
    name: "The Scotsman Hotel - Pool & Spa",
    location: "Old Town, Edinburgh",
    price: 55,
    rating: 4.5,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Historic Hotel", "Spa", "Fitness Center", "Towels Provided"]
  },

  // Bath & Spa Hotels
  {
    id: "royal-crescent-bath",
    name: "Royal Crescent Hotel & Spa - Garden Pool",
    location: "Bath",
    price: 70,
    rating: 4.8,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "both" as const,
    amenities: ["Heated", "Garden Setting", "Spa", "Historic Property", "Towels Provided", "Afternoon Tea"]
  },
  {
    id: "thermae-bath-spa",
    name: "Thermae Bath Spa - Rooftop Pool",
    location: "Bath City Centre",
    price: 42,
    rating: 4.6,
    reviews: 456,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Natural Hot Springs", "City Views", "Historic Spa", "Towels Provided", "Mineralized Water"]
  },

  // Cotswolds Country Hotels
  {
    id: "lucknam-park",
    name: "Lucknam Park Hotel & Spa - Country Pool",
    location: "Colerne, Wiltshire",
    price: 85,
    rating: 4.9,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1551123847-4041291bec0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "both" as const,
    amenities: ["Heated", "Countryside Views", "Luxury Spa", "Equestrian Center", "Fine Dining", "Michelin Star Restaurant"]
  },
  {
    id: "dormy-house",
    name: "Dormy House Hotel - Spa Pool",
    location: "Broadway, Cotswolds",
    price: 58,
    rating: 4.6,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Spa", "Countryside Location", "Towels Provided", "Farm-to-Table Restaurant"]
  },

  // Brighton & South Coast
  {
    id: "grand-brighton",
    name: "The Grand Brighton - Sea Spa Pool",
    location: "Brighton Seafront",
    price: 48,
    rating: 4.5,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Sea Views", "Victorian Building", "Spa", "Towels Provided"]
  },
  {
    id: "pig-hotel-bridge-place",
    name: "The Pig Hotel Bridge Place - Garden Pool",
    location: "Canterbury, Kent",
    price: 52,
    rating: 4.7,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1551123847-4041291bec0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Garden Setting", "Farm-to-Fork Dining", "Countryside Views", "Kitchen Garden"]
  },

  // Liverpool Hotels
  {
    id: "titanic-liverpool",
    name: "Titanic Hotel Liverpool - Rum Warehouse Pool",
    location: "Stanley Dock, Liverpool",
    price: 35,
    rating: 4.4,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Historic Building", "Industrial Design", "Heated", "Towels Provided", "Dockland Views"]
  },

  // York Hotels
  {
    id: "grand-york",
    name: "The Grand York Hotel - Heritage Pool",
    location: "York City Centre",
    price: 42,
    rating: 4.6,
    reviews: 123,
    image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Historic Railway Hotel", "Spa", "Towels Provided", "Victorian Architecture"]
  },

  // Cambridge Hotels
  {
    id: "university-arms-cambridge",
    name: "University Arms Cambridge - Autograph Collection Pool",
    location: "Cambridge City Centre",
    price: 65,
    rating: 4.7,
    reviews: 187,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "University Views", "Spa", "Fitness Center", "Towels Provided"]
  },

  // Oxford Hotels
  {
    id: "old-parsonage-oxford",
    name: "Old Parsonage Hotel Oxford - Garden Pool",
    location: "Oxford City Centre",
    price: 58,
    rating: 4.5,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Historic Building", "Garden Setting", "University Town", "Boutique Style"]
  },

  // Cornwall & Devon Coastal Hotels
  {
    id: "watergate-bay-hotel",
    name: "Watergate Bay Hotel - Coastal Pool",
    location: "Newquay, Cornwall",
    price: 68,
    rating: 4.8,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "both" as const,
    amenities: ["Ocean Views", "Heated", "Beach Access", "Surf School", "Spa", "Family Friendly"]
  },
  {
    id: "burgh-island-hotel",
    name: "Burgh Island Hotel - Art Deco Pool",
    location: "Bigbury-on-Sea, Devon",
    price: 95,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Art Deco Design", "Private Island", "Historic Hotel", "Heated", "Black Tie Dining", "Tidal Island"]
  },

  // Lake District Hotels
  {
    id: "langdale-estate",
    name: "Langdale Estate - Mountain View Pool",
    location: "Great Langdale, Cumbria",
    price: 48,
    rating: 4.6,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1551123847-4041291bec0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "both" as const,
    amenities: ["Mountain Views", "Heated", "Spa", "Hiking Trails", "Family Friendly", "Lake Access"]
  },
  {
    id: "forest-side-grasmere",
    name: "Forest Side Hotel - Lakeland Pool",
    location: "Grasmere, Lake District",
    price: 72,
    rating: 4.8,
    reviews: 123,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Lake Views", "Heated", "Michelin Star Restaurant", "Spa", "Nature Trails", "Award Winning"]
  },

  // International Luxury Hotels (for variety)
  {
    id: "burj-al-arab-dubai",
    name: "Burj Al Arab Jumeirah - Terrace Pool",
    location: "Dubai, UAE",
    price: 180,
    rating: 4.9,
    reviews: 567,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Ocean Views", "Luxury Service", "Private Beach", "Butler Service", "Infinity Pool", "7-Star Experience"]
  },
  {
    id: "marina-bay-sands",
    name: "Marina Bay Sands - SkyPark Infinity Pool",
    location: "Singapore",
    price: 95,
    rating: 4.8,
    reviews: 892,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["City Views", "Infinity Pool", "57th Floor", "Iconic Location", "Observation Deck", "World Famous"]
  },
  {
    id: "santorini-grace",
    name: "Grace Hotel Santorini - Infinity Pool",
    location: "Imerovigli, Santorini",
    price: 120,
    rating: 4.9,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Caldera Views", "Infinity Pool", "Sunset Views", "Luxury Suites", "Greek Island", "Romance"]
  },
  {
    id: "amanzoe-greece",
    name: "Amanzoe - Hilltop Pool Pavilion",
    location: "Porto Heli, Greece",
    price: 250,
    rating: 4.9,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Aegean Sea Views", "Private Pavilions", "Aman Luxury", "Helicopter Access", "Beach Club", "Ultra Luxury"]
  },

  // Additional UK City Hotels
  {
    id: "malmaison-belfast",
    name: "Malmaison Belfast - Brasserie Pool",
    location: "Belfast City Centre",
    price: 32,
    rating: 4.3,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Modern Design", "City Centre", "Boutique Style", "Towels Provided"]
  },
  {
    id: "dakota-leeds",
    name: "Dakota Leeds - Boutique Pool",
    location: "Leeds City Centre",
    price: 38,
    rating: 4.4,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Boutique Hotel", "Modern Amenities", "Business District", "Towels Provided"]
  },
  {
    id: "hilton-cardiff",
    name: "Hilton Cardiff - Executive Pool",
    location: "Cardiff City Centre",
    price: 35,
    rating: 4.3,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Fitness Center", "City Centre", "Business Facilities", "Towels Provided"]
  },

  // Boutique & Design Hotels
  {
    id: "artist-residence-penzance",
    name: "Artist Residence Penzance - Coastal Pool",
    location: "Penzance, Cornwall",
    price: 45,
    rating: 4.6,
    reviews: 76,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Sea Views", "Artist Community", "Bohemian Style", "Local Art", "Creative Space"]
  },
  {
    id: "zetter-townhouse-marylebone",
    name: "Zetter Townhouse Marylebone - Hidden Pool",
    location: "Marylebone, London",
    price: 68,
    rating: 4.5,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Victorian Townhouse", "Intimate Setting", "Cocktail Bar", "Boutique Luxury"]
  },

  // Spa & Wellness Hotels
  {
    id: "champneys-tring",
    name: "Champneys Tring - Wellness Pool",
    location: "Tring, Hertfordshire",
    price: 55,
    rating: 4.7,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "both" as const,
    amenities: ["Heated", "Full Spa", "Wellness Programs", "Fitness Classes", "Healthy Dining", "Detox Programs"]
  },
  {
    id: "ragdale-hall",
    name: "Ragdale Hall Health Hydro & Thermal Spa - Thermal Pool",
    location: "Melton Mowbray, Leicestershire",
    price: 48,
    rating: 4.6,
    reviews: 345,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Thermal Waters", "Spa Treatments", "Hydrotherapy", "Relaxation Pool", "Wellness Focus", "Health Programs"]
  },

  // Airport & Business Hotels
  {
    id: "sofitel-heathrow",
    name: "Sofitel London Heathrow - Terminal 5 Pool",
    location: "Heathrow Airport, London",
    price: 42,
    rating: 4.4,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Airport Hotel", "24/7 Access", "Business Center", "Transit Convenience"]
  },

  // Castle & Historic Hotels
  {
    id: "ashford-castle",
    name: "Ashford Castle - Lake View Pool",
    location: "Cong, County Mayo, Ireland",
    price: 150,
    rating: 4.9,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1551123847-4041291bec0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Castle Setting", "Lake Views", "Historic Property", "Luxury Spa", "Activities", "Presidential Suite"]
  },
  {
    id: "inverlochy-castle",
    name: "Inverlochy Castle Hotel - Highland Pool",
    location: "Fort William, Scotland",
    price: 185,
    rating: 4.9,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Castle Hotel", "Highland Views", "Luxury Service", "Historic Property", "Ben Nevis Views", "Royal Heritage"]
  },

  // Modern City Hotels
  {
    id: "hyatt-regency-birmingham",
    name: "Hyatt Regency Birmingham - Sky Pool",
    location: "Birmingham City Centre",
    price: 45,
    rating: 4.5,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "City Views", "Modern Facilities", "Business Center", "Towels Provided"]
  },
  {
    id: "radisson-blu-manchester",
    name: "Radisson Blu Edwardian Manchester - Fitness Pool",
    location: "Manchester City Centre",
    price: 40,
    rating: 4.4,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Fitness Center", "Modern Design", "City Centre", "Business Facilities"]
  },

  // Unique & Themed Hotels
  {
    id: "ice-hotel-jukkasjarvi",
    name: "ICEHOTEL Jukkasjärvi - Heated Pool (Seasonal)",
    location: "Jukkasjärvi, Sweden",
    price: 85,
    rating: 4.8,
    reviews: 123,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Arctic Experience", "Northern Lights", "Ice Sculptures", "Unique Experience", "Seasonal"]
  },
  {
    id: "giraffe-manor-kenya",
    name: "Giraffe Manor - Safari Pool",
    location: "Nairobi, Kenya",
    price: 200,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Wildlife Views", "Giraffe Encounters", "Safari Experience", "Conservation", "Unique Location", "Instagram Famous"]
  }
];
