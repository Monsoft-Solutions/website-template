import type { Service } from "./service.type";
import type { ServiceFeature } from "./service-feature.type";
import type { ServiceBenefit } from "./service-benefit.type";
import type { ServiceProcessStep } from "./service-process-step.type";
import type { ServicePricingTier } from "./service-pricing-tier.type";
import type { ServicePricingFeature } from "./service-pricing-feature.type";
import type { ServiceTechnology } from "./service-technology.type";
import type { ServiceDeliverable } from "./service-deliverable.type";
import type { ServiceGalleryImage } from "./service-gallery-image.type";
import type { ServiceTestimonial } from "./service-testimonial.type";
import type { ServiceFaq } from "./service-faq.type";

/**
 * Service with all related data - matches the original Service interface structure
 * This type represents a complete service with all its nested relationships
 */
export type ServiceWithRelations = Service & {
  features: ServiceFeature[];
  benefits: ServiceBenefit[];
  processSteps: ServiceProcessStep[];
  pricingTiers: (ServicePricingTier & {
    features: ServicePricingFeature[];
  })[];
  technologies: ServiceTechnology[];
  deliverables: ServiceDeliverable[];
  galleryImages: ServiceGalleryImage[];
  testimonials: ServiceTestimonial[];
  faqs: ServiceFaq[];
  relatedServices: Service[];
};

/**
 * Transformed service type that matches the original Service interface exactly
 * This can be used to maintain backward compatibility with existing code
 */
export type TransformedService = {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly shortDescription: string;
  readonly fullDescription: string;
  readonly features: readonly string[];
  readonly benefits: readonly string[];
  readonly process: readonly {
    readonly step: number;
    readonly title: string;
    readonly description: string;
    readonly duration?: string;
  }[];
  readonly pricing: readonly {
    readonly name: string;
    readonly price: string;
    readonly description: string;
    readonly features: readonly string[];
    readonly popular?: boolean;
  }[];
  readonly technologies?: readonly string[];
  readonly deliverables: readonly string[];
  readonly timeline: string;
  readonly category:
    | "Development"
    | "Design"
    | "Consulting"
    | "Marketing"
    | "Support";
  readonly featuredImage: string;
  readonly gallery?: readonly string[];
  readonly testimonial?: {
    readonly quote: string;
    readonly author: string;
    readonly company: string;
    readonly avatar?: string;
  };
  readonly faq: readonly {
    readonly question: string;
    readonly answer: string;
  }[];
  readonly relatedServices: readonly string[];
};
