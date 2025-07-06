import { InferSelectModel } from "drizzle-orm";
import { services } from "@/lib/db/schema/service.table";
import { serviceFeatures } from "@/lib/db/schema/service-feature.table";
import { serviceBenefits } from "@/lib/db/schema/service-benefit.table";
import { serviceProcessSteps } from "@/lib/db/schema/service-process-step.table";
import { servicePricingTiers } from "@/lib/db/schema/service-pricing-tier.table";
import { servicePricingFeatures } from "@/lib/db/schema/service-pricing-feature.table";
import { serviceTechnologies } from "@/lib/db/schema/service-technology.table";
import { serviceDeliverables } from "@/lib/db/schema/service-deliverable.table";
import { serviceGalleryImages } from "@/lib/db/schema/service-gallery-image.table";
import { serviceTestimonials } from "@/lib/db/schema/service-testimonial.table";
import { serviceFaqs } from "@/lib/db/schema/service-faq.table";

/**
 * Related service type for displaying service cards
 */
export type RelatedService = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  category: string;
  featuredImage: string;
};

/**
 * Complete service type with all relations - matches the static data structure
 */
export type ServiceWithRelations = InferSelectModel<typeof services> & {
  features: string[];
  benefits: string[];
  process: ProcessStep[];
  pricing: PricingTier[];
  technologies: string[];
  deliverables: string[];
  gallery?: string[];
  testimonials?: Testimonial[];
  faq: FAQ[];
  relatedServices: RelatedService[];
};

/**
 * Process step for service delivery
 */
export type ProcessStep = {
  step: number;
  title: string;
  description: string;
  duration?: string;
};

/**
 * Pricing tier with features
 */
export type PricingTier = {
  name: string;
  price: string;
  description: string;
  popular?: boolean;
  features: string[];
};

/**
 * Customer testimonial
 */
export type Testimonial = {
  quote: string;
  author: string;
  company: string;
  avatar?: string;
};

/**
 * Frequently asked question
 */
export type FAQ = {
  question: string;
  answer: string;
};

/**
 * Database query result type for services with all relations
 */
export type ServiceQueryResult = InferSelectModel<typeof services> & {
  features: InferSelectModel<typeof serviceFeatures>[];
  benefits: InferSelectModel<typeof serviceBenefits>[];
  processSteps: InferSelectModel<typeof serviceProcessSteps>[];
  pricingTiers: (InferSelectModel<typeof servicePricingTiers> & {
    features: InferSelectModel<typeof servicePricingFeatures>[];
  })[];
  technologies: InferSelectModel<typeof serviceTechnologies>[];
  deliverables: InferSelectModel<typeof serviceDeliverables>[];
  galleryImages: InferSelectModel<typeof serviceGalleryImages>[];
  testimonials: InferSelectModel<typeof serviceTestimonials>[];
  faqs: InferSelectModel<typeof serviceFaqs>[];
  relatedServices: { relatedServiceId: string }[];
};
