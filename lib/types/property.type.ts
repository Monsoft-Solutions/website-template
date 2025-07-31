/**
 * Property data structure for featured properties display
 * Based on the implementation plan Phase 3 requirements
 */
export interface Property {
  /** Unique identifier for the property */
  id: string;

  /** MLS number */
  mlsNumber: string;

  /** Property price formatted as number */
  price: number;

  /** Street address */
  address: string;

  /** Neighborhood or area */
  neighborhood: string;

  /** Number of bedrooms */
  bedrooms: number;

  /** Number of bathrooms */
  bathrooms: number;

  /** Square footage */
  squareFeet: number;

  /** Property type */
  propertyType: "Single Family" | "Condo" | "Townhouse" | "Vacant Land";

  /** Array of high-quality property images */
  images: string[];

  /** Key features (2-3 highlights) */
  features: string[];

  /** Brief description */
  description: string;

  /** Listing status */
  status: "Active" | "Pending" | "New" | "Price Reduced";

  /** URL slug for property details */
  slug: string;
}

/**
 * Featured property filter types
 */
export type PropertyFilter =
  | "All Properties"
  | "Waterfront"
  | "New Listings"
  | "Price Reduced";
