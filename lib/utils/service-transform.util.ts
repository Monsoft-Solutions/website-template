import type { Service } from "@/lib/types/service.type";
import type {
  ServiceWithRelations,
  RelatedService,
} from "@/lib/types/service-with-relations.type";

/**
 * Transform ServiceWithRelations to Service for backward compatibility
 * This converts the enhanced related services data to the expected format
 */
export const transformServiceWithRelationsToService = (
  serviceWithRelations: ServiceWithRelations
): Service => {
  return {
    id: serviceWithRelations.id,
    title: serviceWithRelations.title,
    slug: serviceWithRelations.slug,
    shortDescription: serviceWithRelations.shortDescription,
    fullDescription: serviceWithRelations.fullDescription,
    features: serviceWithRelations.features,
    benefits: serviceWithRelations.benefits,
    process: serviceWithRelations.process,
    pricing: serviceWithRelations.pricing,
    technologies: serviceWithRelations.technologies,
    deliverables: serviceWithRelations.deliverables,
    timeline: serviceWithRelations.timeline,
    category: serviceWithRelations.category,
    status: serviceWithRelations.status,
    featuredImage: serviceWithRelations.featuredImage,
    gallery: serviceWithRelations.gallery,
    testimonials: serviceWithRelations.testimonials,
    faq: serviceWithRelations.faq,
    relatedServices: serviceWithRelations.relatedServices.map((rs) => rs.slug),
  };
};

/**
 * Transform array of ServiceWithRelations to Service array
 */
export const transformServicesWithRelationsToServices = (
  servicesWithRelations: ServiceWithRelations[]
): Service[] => {
  return servicesWithRelations.map(transformServiceWithRelationsToService);
};

/**
 * Extract related service slugs from ServiceWithRelations
 */
export const extractRelatedServiceSlugs = (
  service: ServiceWithRelations
): string[] => {
  return service.relatedServices.map((rs) => rs.slug);
};

/**
 * Extract related service objects from ServiceWithRelations
 */
export const extractRelatedServices = (
  service: ServiceWithRelations
): RelatedService[] => {
  return service.relatedServices;
};
