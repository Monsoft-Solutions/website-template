import type { Service, ServiceCategory } from "../types";

/**
 * Find a service by its slug
 * @param services - Array of services to search through
 * @param slug - The slug to search for
 * @returns The service if found, undefined otherwise
 */
export const getServiceBySlug = (
  services: readonly Service[],
  slug: string
): Service | undefined => {
  return services.find((service) => service.slug === slug);
};

/**
 * Filter services by category
 * @param services - Array of services to filter
 * @param category - The category to filter by
 * @returns Array of services in the specified category
 */
export const getServicesByCategory = (
  services: readonly Service[],
  category: ServiceCategory
): Service[] => {
  return services.filter((service) => service.category === category);
};

/**
 * Get related services based on the current service's related services array
 * @param services - Array of all services
 * @param currentServiceSlug - Slug of the current service
 * @returns Array of related services
 */
export const getRelatedServices = (
  services: readonly Service[],
  currentServiceSlug: string
): Service[] => {
  const currentService = getServiceBySlug(services, currentServiceSlug);
  if (!currentService) return [];

  return services.filter((service) =>
    currentService.relatedServices.includes(service.slug)
  );
};

/**
 * Get all service slugs from a services array
 * @param services - Array of services
 * @returns Array of all service slugs
 */
export const getAllServiceSlugs = (services: readonly Service[]): string[] => {
  return services.map((service) => service.slug);
};
