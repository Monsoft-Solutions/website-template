import { Property } from "@/lib/types/property.type";

/**
 * Sample featured properties data for the homepage
 * Based on typical Cape Coral real estate offerings
 */
export const featuredProperties: Property[] = [
  {
    id: "1",
    mlsNumber: "C7448521",
    price: 485000,
    address: "1425 SW 53rd Lane",
    neighborhood: "Cape Coral",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1842,
    propertyType: "Single Family",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&auto=format",
    ],
    features: ["Waterfront", "Pool", "Updated Kitchen"],
    description:
      "Beautiful waterfront home with direct gulf access, perfect for boating enthusiasts.",
    status: "New",
    slug: "1425-sw-53rd-lane-cape-coral",
  },
  {
    id: "2",
    mlsNumber: "C7449123",
    price: 362000,
    address: "2247 NE 5th Avenue",
    neighborhood: "Rose Garden",
    bedrooms: 4,
    bathrooms: 2,
    squareFeet: 1654,
    propertyType: "Single Family",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop&auto=format",
    ],
    features: ["New Construction", "Open Floor Plan", "Two Car Garage"],
    description:
      "Brand new construction in desirable Rose Garden neighborhood with modern amenities.",
    status: "Active",
    slug: "2247-ne-5th-avenue-cape-coral",
  },
  {
    id: "3",
    mlsNumber: "C7447890",
    price: 295000,
    address: "1834 SW 40th Street",
    neighborhood: "Pelican",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1456,
    propertyType: "Single Family",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop&auto=format",
    ],
    features: ["Golf Course Community", "Screened Lanai", "Tile Floors"],
    description:
      "Charming home in quiet golf course community with beautiful lanai and lake views.",
    status: "Price Reduced",
    slug: "1834-sw-40th-street-cape-coral",
  },
  {
    id: "4",
    mlsNumber: "C7450321",
    price: 725000,
    address: "5284 Dolphin Drive",
    neighborhood: "Southwest Cape",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2456,
    propertyType: "Single Family",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=800&h=500&fit=crop&auto=format",
    ],
    features: ["Sailboat Access", "Pool & Spa", "Chef's Kitchen"],
    description:
      "Luxurious waterfront estate with sailboat access and resort-style amenities.",
    status: "Active",
    slug: "5284-dolphin-drive-cape-coral",
  },
  {
    id: "5",
    mlsNumber: "C7448765",
    price: 425000,
    address: "1612 NW 42nd Place",
    neighborhood: "Northwest Cape",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1678,
    propertyType: "Single Family",
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=500&fit=crop&auto=format",
    ],
    features: ["Canal Front", "Boat Dock", "Hurricane Shutters"],
    description:
      "Well-maintained canal front home with private boat dock and stunning water views.",
    status: "Pending",
    slug: "1612-nw-42nd-place-cape-coral",
  },
  {
    id: "6",
    mlsNumber: "C7449567",
    price: 189000,
    address: "3456 SE 16th Avenue",
    neighborhood: "Southeast Cape",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1124,
    propertyType: "Condo",
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800&h=500&fit=crop&auto=format",
    ],
    features: ["55+ Community", "Clubhouse", "Maintenance Free"],
    description:
      "Perfect starter home or investment property in well-maintained 55+ community.",
    status: "New",
    slug: "3456-se-16th-avenue-cape-coral",
  },
  {
    id: "7",
    mlsNumber: "C7447234",
    price: 385000,
    address: "923 SW 48th Terrace",
    neighborhood: "Southwest Cape",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1789,
    propertyType: "Single Family",
    images: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=500&fit=crop&auto=format",
    ],
    features: ["Corner Lot", "Pool Ready", "Tile Throughout"],
    description:
      "Move-in ready home on oversized corner lot with room for pool and outdoor entertaining.",
    status: "Active",
    slug: "923-sw-48th-terrace-cape-coral",
  },
  {
    id: "8",
    mlsNumber: "C7450089",
    price: 650000,
    address: "2156 Coral Point Drive",
    neighborhood: "Coral Point",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2234,
    propertyType: "Single Family",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=500&fit=crop&auto=format",
    ],
    features: ["Gulf Access", "Deep Water", "Private Elevator"],
    description:
      "Stunning gulf access home with deep water dockage and luxury finishes throughout.",
    status: "New",
    slug: "2156-coral-point-drive-cape-coral",
  },
];

/**
 * Get properties by filter type
 */
export const getPropertiesByFilter = (filter: string): Property[] => {
  switch (filter) {
    case "Waterfront":
      return featuredProperties.filter((property) =>
        property.features.some(
          (feature) =>
            feature.toLowerCase().includes("waterfront") ||
            feature.toLowerCase().includes("canal") ||
            feature.toLowerCase().includes("gulf access") ||
            feature.toLowerCase().includes("sailboat access")
        )
      );
    case "New Listings":
      return featuredProperties.filter((property) => property.status === "New");
    case "Price Reduced":
      return featuredProperties.filter(
        (property) => property.status === "Price Reduced"
      );
    default:
      return featuredProperties;
  }
};
