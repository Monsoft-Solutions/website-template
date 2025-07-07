import { eq, asc, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema/service.table";
import { serviceFeatures } from "@/lib/db/schema/service-feature.table";
import { serviceBenefits } from "@/lib/db/schema/service-benefit.table";
import { serviceProcessSteps } from "@/lib/db/schema/service-process-step.table";
import { servicePricingTiers } from "@/lib/db/schema/service-pricing-tier.table";
import { servicePricingFeatures } from "@/lib/db/schema/service-pricing-feature.table";
import { serviceTechnologies } from "@/lib/db/schema/service-technology.table";
import { serviceDeliverables } from "@/lib/db/schema/service-deliverable.table";
import { serviceGalleryImages } from "@/lib/db/schema/service-gallery-image.table";
import { serviceFaqs } from "@/lib/db/schema/service-faq.table";
import { serviceTestimonials } from "@/lib/db/schema/service-testimonial.table";
import { serviceRelated } from "@/lib/db/schema/service-related.table";
import { ApiResponse } from "@/lib/types/api-response.type";
import { ServiceCategory } from "@/lib/types/service-category.type";
import {
  ServiceWithRelations,
  ProcessStep,
  PricingTier,
  Testimonial,
  FAQ,
} from "@/lib/types/service-with-relations.type";

export async function getServicesNames(): Promise<ApiResponse<string[]>> {
  try {
    const allServices = await db
      .select({ name: services.title })
      .from(services);
    return { success: true, data: allServices.map((s) => s.name) };
  } catch (error) {
    console.error("Error fetching services names:", error);
    return {
      success: false,
      data: [],
      error: "Failed to fetch services names",
    };
  }
}

/**
 * Get all services with their relations - optimized version
 */
export async function getAllServices(): Promise<
  ApiResponse<ServiceWithRelations[]>
> {
  try {
    // Get all services first
    const allServices = await db
      .select()
      .from(services)
      .orderBy(asc(services.createdAt));

    if (allServices.length === 0) {
      return { success: true, data: [] };
    }

    const serviceIds = allServices.map((s) => s.id);

    // Fetch all related data in parallel using efficient queries
    const [
      featuresMap,
      benefitsMap,
      processStepsMap,
      technologiesMap,
      deliverablesMap,
      galleryImagesMap,
      testimonialsMap,
      faqsMap,
      relatedServicesMap,
      pricingData,
    ] = await Promise.all([
      getServiceFeaturesByIds(serviceIds),
      getServiceBenefitsByIds(serviceIds),
      getServiceProcessStepsByIds(serviceIds),
      getServiceTechnologiesByIds(serviceIds),
      getServiceDeliverablesByIds(serviceIds),
      getServiceGalleryImagesByIds(serviceIds),
      getServiceTestimonialsByIds(serviceIds),
      getServiceFaqsByIds(serviceIds),
      getRelatedServicesByIds(serviceIds),
      getServicePricingDataByIds(serviceIds),
    ]);

    // Transform services with their relations
    const transformedServices: ServiceWithRelations[] = allServices.map(
      (service) => {
        return buildServiceFromMaps(
          service,
          featuresMap,
          benefitsMap,
          processStepsMap,
          technologiesMap,
          deliverablesMap,
          galleryImagesMap,
          testimonialsMap,
          faqsMap,
          relatedServicesMap,
          pricingData
        );
      }
    );

    return {
      success: true,
      data: transformedServices,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error:
        error instanceof Error ? error.message : "Failed to fetch services",
    };
  }
}

/**
 * Get a service by slug with all relations - optimized version
 */
export async function getServiceBySlug(
  slug: string
): Promise<ApiResponse<ServiceWithRelations | null>> {
  try {
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.slug, slug))
      .limit(1);

    if (!service) {
      return {
        success: false,
        data: null,
        error: "Service not found",
      };
    }

    // Use the optimized single service fetching
    const [
      featuresMap,
      benefitsMap,
      processStepsMap,
      technologiesMap,
      deliverablesMap,
      galleryImagesMap,
      testimonialsMap,
      faqsMap,
      relatedServicesMap,
      pricingData,
    ] = await Promise.all([
      getServiceFeaturesByIds([service.id]),
      getServiceBenefitsByIds([service.id]),
      getServiceProcessStepsByIds([service.id]),
      getServiceTechnologiesByIds([service.id]),
      getServiceDeliverablesByIds([service.id]),
      getServiceGalleryImagesByIds([service.id]),
      getServiceTestimonialsByIds([service.id]),
      getServiceFaqsByIds([service.id]),
      getRelatedServicesByIds([service.id]),
      getServicePricingDataByIds([service.id]),
    ]);

    const transformedService = buildServiceFromMaps(
      service,
      featuresMap,
      benefitsMap,
      processStepsMap,
      technologiesMap,
      deliverablesMap,
      galleryImagesMap,
      testimonialsMap,
      faqsMap,
      relatedServicesMap,
      pricingData
    );

    return {
      success: true,
      data: transformedService,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch service",
    };
  }
}

/**
 * Get services by category - optimized version
 */
export async function getServicesByCategory(
  category: ServiceCategory
): Promise<ApiResponse<ServiceWithRelations[]>> {
  try {
    const categoryServices = await db
      .select()
      .from(services)
      .where(eq(services.category, category))
      .orderBy(asc(services.createdAt));

    if (categoryServices.length === 0) {
      return { success: true, data: [] };
    }

    const serviceIds = categoryServices.map((s) => s.id);

    // Fetch all related data in parallel using efficient queries
    const [
      featuresMap,
      benefitsMap,
      processStepsMap,
      technologiesMap,
      deliverablesMap,
      galleryImagesMap,
      testimonialsMap,
      faqsMap,
      relatedServicesMap,
      pricingData,
    ] = await Promise.all([
      getServiceFeaturesByIds(serviceIds),
      getServiceBenefitsByIds(serviceIds),
      getServiceProcessStepsByIds(serviceIds),
      getServiceTechnologiesByIds(serviceIds),
      getServiceDeliverablesByIds(serviceIds),
      getServiceGalleryImagesByIds(serviceIds),
      getServiceTestimonialsByIds(serviceIds),
      getServiceFaqsByIds(serviceIds),
      getRelatedServicesByIds(serviceIds),
      getServicePricingDataByIds(serviceIds),
    ]);

    // Transform services with their relations
    const transformedServices: ServiceWithRelations[] = categoryServices.map(
      (service) => {
        return buildServiceFromMaps(
          service,
          featuresMap,
          benefitsMap,
          processStepsMap,
          technologiesMap,
          deliverablesMap,
          galleryImagesMap,
          testimonialsMap,
          faqsMap,
          relatedServicesMap,
          pricingData
        );
      }
    );

    return {
      success: true,
      data: transformedServices,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch services by category",
    };
  }
}

// Optimized helper functions that fetch data for multiple services at once

export async function getServiceFeaturesByIds(serviceIds: string[]) {
  const features = await db
    .select()
    .from(serviceFeatures)
    .where(
      serviceIds.length === 1
        ? eq(serviceFeatures.serviceId, serviceIds[0])
        : inArray(serviceFeatures.serviceId, serviceIds)
    )
    .orderBy(asc(serviceFeatures.order));

  return groupByServiceId(features, "serviceId");
}

export async function getServiceBenefitsByIds(serviceIds: string[]) {
  const benefits = await db
    .select()
    .from(serviceBenefits)
    .where(
      serviceIds.length === 1
        ? eq(serviceBenefits.serviceId, serviceIds[0])
        : inArray(serviceBenefits.serviceId, serviceIds)
    )
    .orderBy(asc(serviceBenefits.order));

  return groupByServiceId(benefits, "serviceId");
}

export async function getServiceProcessStepsByIds(serviceIds: string[]) {
  const processSteps = await db
    .select()
    .from(serviceProcessSteps)
    .where(
      serviceIds.length === 1
        ? eq(serviceProcessSteps.serviceId, serviceIds[0])
        : inArray(serviceProcessSteps.serviceId, serviceIds)
    )
    .orderBy(asc(serviceProcessSteps.step));

  return groupByServiceId(processSteps, "serviceId");
}

export async function getServiceTechnologiesByIds(serviceIds: string[]) {
  const technologies = await db
    .select()
    .from(serviceTechnologies)
    .where(
      serviceIds.length === 1
        ? eq(serviceTechnologies.serviceId, serviceIds[0])
        : inArray(serviceTechnologies.serviceId, serviceIds)
    )
    .orderBy(asc(serviceTechnologies.order));

  return groupByServiceId(technologies, "serviceId");
}

export async function getServiceDeliverablesByIds(serviceIds: string[]) {
  const deliverables = await db
    .select()
    .from(serviceDeliverables)
    .where(
      serviceIds.length === 1
        ? eq(serviceDeliverables.serviceId, serviceIds[0])
        : inArray(serviceDeliverables.serviceId, serviceIds)
    )
    .orderBy(asc(serviceDeliverables.order));

  return groupByServiceId(deliverables, "serviceId");
}

export async function getServiceGalleryImagesByIds(serviceIds: string[]) {
  const galleryImages = await db
    .select()
    .from(serviceGalleryImages)
    .where(
      serviceIds.length === 1
        ? eq(serviceGalleryImages.serviceId, serviceIds[0])
        : inArray(serviceGalleryImages.serviceId, serviceIds)
    )
    .orderBy(asc(serviceGalleryImages.order));

  return groupByServiceId(galleryImages, "serviceId");
}

export async function getServiceTestimonialsByIds(serviceIds: string[]) {
  const testimonials = await db
    .select()
    .from(serviceTestimonials)
    .where(
      serviceIds.length === 1
        ? eq(serviceTestimonials.serviceId, serviceIds[0])
        : inArray(serviceTestimonials.serviceId, serviceIds)
    );

  return groupByServiceId(testimonials, "serviceId");
}

export async function getServiceFaqsByIds(serviceIds: string[]) {
  const faqs = await db
    .select()
    .from(serviceFaqs)
    .where(
      serviceIds.length === 1
        ? eq(serviceFaqs.serviceId, serviceIds[0])
        : inArray(serviceFaqs.serviceId, serviceIds)
    )
    .orderBy(asc(serviceFaqs.order));

  return groupByServiceId(faqs, "serviceId");
}

export async function getRelatedServicesByIds(serviceIds: string[]) {
  const relatedServices = await db
    .select({
      serviceId: serviceRelated.serviceId,
      id: services.id,
      title: services.title,
      slug: services.slug,
      shortDescription: services.shortDescription,
      category: services.category,
      featuredImage: services.featuredImage,
    })
    .from(serviceRelated)
    .innerJoin(services, eq(serviceRelated.relatedServiceId, services.id))
    .where(
      serviceIds.length === 1
        ? eq(serviceRelated.serviceId, serviceIds[0])
        : inArray(serviceRelated.serviceId, serviceIds)
    );

  return groupByServiceId(relatedServices, "serviceId");
}

export async function getServicePricingDataByIds(serviceIds: string[]) {
  // Get pricing tiers
  const pricingTiers = await db
    .select()
    .from(servicePricingTiers)
    .where(
      serviceIds.length === 1
        ? eq(servicePricingTiers.serviceId, serviceIds[0])
        : inArray(servicePricingTiers.serviceId, serviceIds)
    )
    .orderBy(asc(servicePricingTiers.order));

  // Get all pricing features for these tiers
  const tierIds = pricingTiers.map((t) => t.id);
  const pricingFeatures =
    tierIds.length > 0
      ? await db
          .select()
          .from(servicePricingFeatures)
          .where(
            tierIds.length === 1
              ? eq(servicePricingFeatures.pricingTierId, tierIds[0])
              : inArray(servicePricingFeatures.pricingTierId, tierIds)
          )
          .orderBy(asc(servicePricingFeatures.order))
      : [];

  return { pricingTiers, pricingFeatures };
}

// Helper function to group results by serviceId
function groupByServiceId<T extends Record<string, unknown>>(
  items: T[],
  serviceIdKey: string
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const serviceId = item[serviceIdKey] as string;
    if (!map.has(serviceId)) {
      map.set(serviceId, []);
    }
    map.get(serviceId)!.push(item);
  }
  return map;
}

// Type definitions for better type safety
type ServiceFeatureData = typeof serviceFeatures.$inferSelect;
type ServiceBenefitData = typeof serviceBenefits.$inferSelect;
type ServiceProcessStepData = typeof serviceProcessSteps.$inferSelect;
type ServiceTechnologyData = typeof serviceTechnologies.$inferSelect;
type ServiceDeliverableData = typeof serviceDeliverables.$inferSelect;
type ServiceGalleryImageData = typeof serviceGalleryImages.$inferSelect;
type ServiceTestimonialData = typeof serviceTestimonials.$inferSelect;
type ServiceFaqData = typeof serviceFaqs.$inferSelect;
type ServicePricingTierData = typeof servicePricingTiers.$inferSelect;
type ServicePricingFeatureData = typeof servicePricingFeatures.$inferSelect;
type RelatedServiceData = {
  serviceId: string;
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  category: string;
  featuredImage: string | null;
};

// Optimized function to build service from pre-fetched data maps
export function buildServiceFromMaps(
  baseService: typeof services.$inferSelect,
  featuresMap: Map<string, ServiceFeatureData[]>,
  benefitsMap: Map<string, ServiceBenefitData[]>,
  processStepsMap: Map<string, ServiceProcessStepData[]>,
  technologiesMap: Map<string, ServiceTechnologyData[]>,
  deliverablesMap: Map<string, ServiceDeliverableData[]>,
  galleryImagesMap: Map<string, ServiceGalleryImageData[]>,
  testimonialsMap: Map<string, ServiceTestimonialData[]>,
  faqsMap: Map<string, ServiceFaqData[]>,
  relatedServicesMap: Map<string, RelatedServiceData[]>,
  pricingData: {
    pricingTiers: ServicePricingTierData[];
    pricingFeatures: ServicePricingFeatureData[];
  }
): ServiceWithRelations {
  const serviceId = baseService.id;

  // Get data from maps
  const features = featuresMap.get(serviceId) || [];
  const benefits = benefitsMap.get(serviceId) || [];
  const processSteps = processStepsMap.get(serviceId) || [];
  const technologies = technologiesMap.get(serviceId) || [];
  const deliverables = deliverablesMap.get(serviceId) || [];
  const galleryImages = galleryImagesMap.get(serviceId) || [];
  const testimonials = testimonialsMap.get(serviceId) || [];
  const faqs = faqsMap.get(serviceId) || [];
  const relatedServices = relatedServicesMap.get(serviceId) || [];

  // Build pricing tiers for this service
  const servicePricingTiers = pricingData.pricingTiers.filter(
    (t) => t.serviceId === serviceId
  );
  const pricing: PricingTier[] = servicePricingTiers.map((tier) => {
    const tierFeatures = pricingData.pricingFeatures
      .filter((f) => f.pricingTierId === tier.id)
      .map((f) => f.feature);

    return {
      name: tier.name,
      price: tier.price,
      description: tier.description,
      popular: tier.popular || undefined,
      features: tierFeatures,
    };
  });

  // Transform process steps
  const process: ProcessStep[] = processSteps.map((step) => ({
    step: step.step,
    title: step.title,
    description: step.description,
    duration: step.duration || undefined,
  }));

  // Transform testimonials
  const transformedTestimonials: Testimonial[] = testimonials.map(
    (testimonial) => ({
      quote: testimonial.quote,
      author: testimonial.author,
      company: testimonial.company,
      avatar: testimonial.avatar || undefined,
    })
  );

  // Transform FAQs
  const faq: FAQ[] = faqs.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  return {
    ...baseService,
    features: features.map((f) => f.feature),
    benefits: benefits.map((b) => b.benefit),
    process,
    pricing,
    technologies: technologies.map((t) => t.technology),
    deliverables: deliverables.map((d) => d.deliverable),
    gallery:
      galleryImages.length > 0
        ? galleryImages.map((g) => g.imageUrl)
        : undefined,
    testimonials:
      transformedTestimonials.length > 0 ? transformedTestimonials : undefined,
    faq,
    relatedServices: relatedServices.map((rs) => ({
      id: rs.id,
      title: rs.title,
      slug: rs.slug,
      shortDescription: rs.shortDescription || "",
      category: rs.category,
      featuredImage: rs.featuredImage || "",
    })),
  };
}

/**
 * Helper function to build a service with all its relations (legacy - kept for backward compatibility)
 * @deprecated Use the optimized getAllServices, getServiceBySlug, or getServicesByCategory instead
 */
export async function buildServiceWithRelations(
  serviceId: string,
  baseService: Record<string, unknown>
): Promise<ServiceWithRelations> {
  console.warn(
    "buildServiceWithRelations is deprecated. Use optimized service functions instead."
  );

  // Use the optimized approach for single service
  const [
    featuresMap,
    benefitsMap,
    processStepsMap,
    technologiesMap,
    deliverablesMap,
    galleryImagesMap,
    testimonialsMap,
    faqsMap,
    relatedServicesMap,
    pricingData,
  ] = await Promise.all([
    getServiceFeaturesByIds([serviceId]),
    getServiceBenefitsByIds([serviceId]),
    getServiceProcessStepsByIds([serviceId]),
    getServiceTechnologiesByIds([serviceId]),
    getServiceDeliverablesByIds([serviceId]),
    getServiceGalleryImagesByIds([serviceId]),
    getServiceTestimonialsByIds([serviceId]),
    getServiceFaqsByIds([serviceId]),
    getRelatedServicesByIds([serviceId]),
    getServicePricingDataByIds([serviceId]),
  ]);

  return buildServiceFromMaps(
    baseService as typeof services.$inferSelect,
    featuresMap,
    benefitsMap,
    processStepsMap,
    technologiesMap,
    deliverablesMap,
    galleryImagesMap,
    testimonialsMap,
    faqsMap,
    relatedServicesMap,
    pricingData
  );
}
