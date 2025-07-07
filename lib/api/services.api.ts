import { eq, asc } from "drizzle-orm";
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
 * Get all services with their relations
 */
export async function getAllServices(): Promise<
  ApiResponse<ServiceWithRelations[]>
> {
  try {
    // Get all services
    const allServices = await db
      .select()
      .from(services)
      .orderBy(asc(services.createdAt));

    const transformedServices: ServiceWithRelations[] = [];

    for (const service of allServices) {
      const transformedService = await buildServiceWithRelations(
        service.id,
        service
      );
      transformedServices.push(transformedService);
    }

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
 * Get a service by slug with all relations
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

    const transformedService = await buildServiceWithRelations(
      service.id,
      service
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
 * Get services by category
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

    const transformedServices: ServiceWithRelations[] = [];

    for (const service of categoryServices) {
      const transformedService = await buildServiceWithRelations(
        service.id,
        service
      );
      transformedServices.push(transformedService);
    }

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

/**
 * Helper function to build a service with all its relations
 */
export async function buildServiceWithRelations(
  serviceId: string,
  baseService: Record<string, unknown>
): Promise<ServiceWithRelations> {
  // Get all related data in parallel
  const [
    features,
    benefits,
    processSteps,
    pricingTiers,
    technologies,
    deliverables,
    galleryImages,
    testimonials,
    faqs,
    relatedServices,
  ] = await Promise.all([
    db
      .select()
      .from(serviceFeatures)
      .where(eq(serviceFeatures.serviceId, serviceId))
      .orderBy(asc(serviceFeatures.order)),
    db
      .select()
      .from(serviceBenefits)
      .where(eq(serviceBenefits.serviceId, serviceId))
      .orderBy(asc(serviceBenefits.order)),
    db
      .select()
      .from(serviceProcessSteps)
      .where(eq(serviceProcessSteps.serviceId, serviceId))
      .orderBy(asc(serviceProcessSteps.step)),
    db
      .select()
      .from(servicePricingTiers)
      .where(eq(servicePricingTiers.serviceId, serviceId))
      .orderBy(asc(servicePricingTiers.order)),
    db
      .select()
      .from(serviceTechnologies)
      .where(eq(serviceTechnologies.serviceId, serviceId))
      .orderBy(asc(serviceTechnologies.order)),
    db
      .select()
      .from(serviceDeliverables)
      .where(eq(serviceDeliverables.serviceId, serviceId))
      .orderBy(asc(serviceDeliverables.order)),
    db
      .select()
      .from(serviceGalleryImages)
      .where(eq(serviceGalleryImages.serviceId, serviceId))
      .orderBy(asc(serviceGalleryImages.order)),
    db
      .select()
      .from(serviceTestimonials)
      .where(eq(serviceTestimonials.serviceId, serviceId)),
    db
      .select()
      .from(serviceFaqs)
      .where(eq(serviceFaqs.serviceId, serviceId))
      .orderBy(asc(serviceFaqs.order)),
    db
      .select({
        id: services.id,
        title: services.title,
        slug: services.slug,
        shortDescription: services.shortDescription,
        category: services.category,
        featuredImage: services.featuredImage,
      })
      .from(serviceRelated)
      .innerJoin(services, eq(serviceRelated.relatedServiceId, services.id))
      .where(eq(serviceRelated.serviceId, serviceId)),
  ]);

  // Build pricing tiers with their features
  const pricing: PricingTier[] = [];
  for (const tier of pricingTiers) {
    const tierFeatures = await db
      .select()
      .from(servicePricingFeatures)
      .where(eq(servicePricingFeatures.pricingTierId, tier.id))
      .orderBy(asc(servicePricingFeatures.order));

    pricing.push({
      name: tier.name,
      price: tier.price,
      description: tier.description,
      popular: tier.popular || undefined,
      features: tierFeatures.map((f) => f.feature),
    });
  }

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
    ...(baseService as ServiceWithRelations),
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
    relatedServices: relatedServices,
  };
}
