import type { ServiceCategory } from "./service-category.type";
import type { ProcessStep } from "./process-step.type";
import type { PricingTier } from "./pricing-tier.type";
import type { FAQ } from "./faq.type";
import type { Testimonial } from "./testimonial.type";

/**
 * Represents a complete service offering with all its details
 */
export type Service = {
  /** Unique identifier for the service */
  readonly id: string;
  /** Display title of the service */
  readonly title: string;
  /** URL-friendly slug for the service */
  readonly slug: string;
  /** Brief description for cards and previews */
  readonly shortDescription: string;
  /** Detailed description for service pages */
  readonly fullDescription: string;
  /** List of key features offered by this service */
  readonly features: readonly string[];
  /** List of benefits customers gain from this service */
  readonly benefits: readonly string[];
  /** Step-by-step process for service delivery */
  readonly process: readonly ProcessStep[];
  /** Available pricing tiers for this service */
  readonly pricing: readonly PricingTier[];
  /** Optional list of technologies used in this service */
  readonly technologies?: readonly string[];
  /** List of deliverables provided to the client */
  readonly deliverables: readonly string[];
  /** Expected timeline for service completion */
  readonly timeline: string;
  /** Category this service belongs to */
  readonly category: ServiceCategory;
  /** Main featured image for the service */
  readonly featuredImage: string;
  /** Optional gallery of additional images */
  readonly gallery?: readonly string[];
  /** Optional customer testimonial */
  readonly testimonial?: Testimonial;
  /** Frequently asked questions about this service */
  readonly faq: readonly FAQ[];
  /** Array of related service slugs */
  readonly relatedServices: readonly string[];
};
