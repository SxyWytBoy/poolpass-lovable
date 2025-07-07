
import { PoolItem } from '@/components/pools/PoolGrid';

export const capeTownHotelPools: PoolItem[] = [
  // Cape Town City Centre & Waterfront
  {
    id: "one-only-cape-town",
    name: "One&Only Cape Town - Island Spa Pool",
    location: "V&A Waterfront, Cape Town",
    price: 1200,
    rating: 4.9,
    reviews: 187,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Table Mountain Views", "Waterfront Location", "Luxury Spa", "Private Cabanas", "Champagne Service"]
  },
  {
    id: "cape-grace-hotel",
    name: "Cape Grace Hotel - Rooftop Pool",
    location: "V&A Waterfront, Cape Town",
    price: 950,
    rating: 4.8,
    reviews: 143,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Harbor Views", "Luxury Service", "Towels Provided", "Bar Service", "Historic Hotel"]
  },
  {
    id: "table-bay-hotel",
    name: "The Table Bay Hotel - Pool Deck",
    location: "V&A Waterfront, Cape Town",
    price: 850,
    rating: 4.7,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1477120292453-dbba2d987c24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Table Mountain Views", "Harbor Views", "Loungers", "Poolside Service", "Luxury Resort"]
  },
  {
    id: "mount-nelson-belmond",
    name: "Belmond Mount Nelson Hotel - Garden Pool",
    location: "Gardens, Cape Town",
    price: 1100,
    rating: 4.9,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1615394717477-43fe6ee0def3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Historic Gardens", "Pink Lady Hotel", "Luxury Service", "Afternoon Tea", "Mountain Views"]
  },
  {
    id: "silo-hotel",
    name: "The Silo Hotel - Rooftop Pool",
    location: "V&A Waterfront, Cape Town",
    price: 1500,
    rating: 4.9,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "360° Views", "Designer Hotel", "Art Collection", "Champagne Service", "Infinity Pool"]
  },
  {
    id: "taj-cape-town",
    name: "Taj Cape Town - Wellness Pool",
    location: "City Centre, Cape Town",
    price: 750,
    rating: 4.6,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "indoor" as const,
    amenities: ["Heated", "Spa", "Wellness Center", "Historic Building", "City Views", "Luxury Service"]
  },

  // Camps Bay & Atlantic Seaboard
  {
    id: "twelve-apostles",
    name: "The Twelve Apostles Hotel - Leopard Pool",
    location: "Camps Bay, Cape Town",
    price: 1300,
    rating: 4.9,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1507038772120-7fff76f79d79?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Ocean Views", "Twelve Apostles Views", "Luxury Spa", "Infinity Pool", "Champagne Bar"]
  },
  {
    id: "bay-hotel-camps-bay",
    name: "The Bay Hotel - Pool Deck",
    location: "Camps Bay, Cape Town",
    price: 980,
    rating: 4.7,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Beachfront", "Ocean Views", "Beach Access", "Loungers", "Poolside Dining"]
  },
  {
    id: "atlantic-seaboard",
    name: "Atlanticview Cape Town Boutique Hotel - Infinity Pool",
    location: "Green Point, Cape Town",
    price: 680,
    rating: 4.5,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Sea Views", "Boutique Hotel", "Modern Design", "Infinity Pool", "City Views"]
  },

  // Constantia Wine Region
  {
    id: "steenberg-hotel",
    name: "Steenberg Hotel - Vineyard Pool",
    location: "Constantia, Cape Town",
    price: 850,
    rating: 4.8,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Vineyard Views", "Wine Estate", "Golf Course", "Mountain Views", "Historic Property"]
  },
  {
    id: "cellars-hohenort",
    name: "The Cellars-Hohenort - Garden Pool",
    location: "Constantia, Cape Town",
    price: 920,
    rating: 4.7,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Award-winning Gardens", "Historic Hotel", "Mountain Views", "Spa", "Fine Dining"]
  },
  {
    id: "alphen-boutique-hotel",
    name: "Alphen Boutique Hotel - Estate Pool",
    location: "Constantia, Cape Town",
    price: 720,
    rating: 4.6,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Historic Estate", "Wine Tasting", "Mountain Views", "Boutique Luxury", "Gardens"]
  },

  // Stellenbosch Wine Region (within 50km)
  {
    id: "lanzerac-hotel",
    name: "Lanzerac Hotel & Spa - Manor Pool",
    location: "Stellenbosch (45km from Cape Town)",
    price: 780,
    rating: 4.7,
    reviews: 176,
    image: "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Wine Estate", "Historic Manor", "Spa", "Vineyard Views", "Mountain Backdrop"]
  },
  {
    id: "devon-valley-hotel",
    name: "Devon Valley Hotel - Valley Pool",
    location: "Stellenbosch (40km from Cape Town)",
    price: 650,
    rating: 4.5,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Wine Valley Views", "Country Estate", "Vineyard Access", "Mountain Views", "Wine Tasting"]
  },

  // Hermanus (within 50km coastal)
  {
    id: "birkenhead-house",
    name: "Birkenhead House - Clifftop Pool",
    location: "Hermanus (90min from Cape Town)",
    price: 1400,
    rating: 4.9,
    reviews: 123,
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Whale Watching", "Ocean Views", "Clifftop Location", "Luxury Boutique", "Infinity Pool"]
  },

  // Franschhoek (within 50km)
  {
    id: "mont-rochelle",
    name: "Mont Rochelle Hotel & Vineyard - Terrace Pool",
    location: "Franschhoek (65km from Cape Town)",
    price: 890,
    rating: 4.8,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Valley Views", "Wine Estate", "Richard Branson Property", "Luxury Service", "Mountain Views"]
  },
  {
    id: "rickety-bridge-winery",
    name: "Rickety Bridge Winery - Estate Pool",
    location: "Franschhoek (60km from Cape Town)",
    price: 550,
    rating: 4.4,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Working Winery", "Family Friendly", "Wine Tasting", "Country Setting", "Mountain Views"]
  },

  // Southern Suburbs
  {
    id: "southern-sun-newlands",
    name: "Southern Sun Newlands - Garden Pool",
    location: "Newlands, Cape Town",
    price: 420,
    rating: 4.2,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Garden Setting", "Family Friendly", "Rugby Stadium Views", "Business Center", "Parking"]
  },
  {
    id: "vineyard-hotel-spa",
    name: "The Vineyard Hotel & Spa - Riverside Pool",
    location: "Claremont, Cape Town",
    price: 680,
    rating: 4.6,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "River Views", "Historic Property", "Spa", "Award-winning Restaurant", "Garden Setting"]
  },

  // Airport Area
  {
    id: "city-lodge-airport",
    name: "City Lodge Hotel Cape Town Airport - Transit Pool",
    location: "Cape Town Airport (15km from city)",
    price: 320,
    rating: 4.1,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Airport Convenience", "Business Center", "24/7 Access", "Shuttle Service", "Transit Hotel"]
  },

  // Additional Luxury Options
  {
    id: "ellerman-house",
    name: "Ellerman House - Private Pool",
    location: "Bantry Bay, Cape Town",
    price: 2200,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80",
    indoorOutdoor: "outdoor" as const,
    amenities: ["Heated", "Ultra-luxury", "Ocean Views", "Art Collection", "Butler Service", "Private Beach Access"]
  }
];
