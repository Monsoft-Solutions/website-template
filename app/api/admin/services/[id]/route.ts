import { NextRequest, NextResponse } from "next/server";
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
import { serviceTestimonials } from "@/lib/db/schema/service-testimonial.table";
import { serviceFaqs } from "@/lib/db/schema/service-faq.table";
import { serviceRelated } from "@/lib/db/schema/service-related.table";
import type { ServiceWithRelations } from "@/lib/types/service-with-relations.type";
import type { ApiResponse } from "@/lib/types/api-response.type";

// Types for request data
interface ProcessStepData {
  step: number;
  title: string;
  description: string;
  duration?: string;
}

interface FAQData {
  question: string;
  answer: string;
}

interface PricingTierData {
  name: string;
  price: string;
  description: string;
  popular?: boolean;
  features: string[];
}

interface TestimonialData {
  quote: string;
  author: string;
  company: string;
  avatar?: string;
}

interface ServiceUpdateData {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  timeline: string;
  category: "Development" | "Design" | "Consulting" | "Marketing" | "Support";
  featuredImage: string;
  features?: string[];
  benefits?: string[];
  technologies?: string[];
  deliverables?: string[];
  gallery?: string[];
  faq?: FAQData[];
  process?: ProcessStepData[];
  pricing?: PricingTierData[];
  testimonial?: TestimonialData;
  relatedServices?: string[];
}

/**
 * GET endpoint - Get individual service with all relations
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Service ID is required" },
        { status: 400 }
      );
    }

    // Get service
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    // Build service with relations
    const serviceWithRelations = await buildServiceWithRelations(
      service.id,
      service
    );

    const result: ApiResponse<ServiceWithRelations> = {
      success: true,
      data: serviceWithRelations,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching service:", error);

    const result: ApiResponse<ServiceWithRelations | null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch service",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * PUT endpoint - Update service
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data: ServiceUpdateData = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Service ID is required" },
        { status: 400 }
      );
    }

    // Check if service exists
    const [existingService] = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);

    if (!existingService) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    // Update the service
    await db
      .update(services)
      .set({
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        timeline: data.timeline,
        category: data.category,
        featuredImage: data.featuredImage,
        updatedAt: new Date(),
      })
      .where(eq(services.id, id));

    // Delete existing related data and recreate
    await deleteServiceRelations(id);

    // Insert updated related data
    if (data.features && data.features.length > 0) {
      await db.insert(serviceFeatures).values(
        data.features.map((feature: string, index: number) => ({
          serviceId: id,
          feature,
          order: index + 1,
        }))
      );
    }

    if (data.benefits && data.benefits.length > 0) {
      await db.insert(serviceBenefits).values(
        data.benefits.map((benefit: string, index: number) => ({
          serviceId: id,
          benefit,
          order: index + 1,
        }))
      );
    }

    if (data.technologies && data.technologies.length > 0) {
      await db.insert(serviceTechnologies).values(
        data.technologies.map((technology: string, index: number) => ({
          serviceId: id,
          technology,
          order: index + 1,
        }))
      );
    }

    if (data.deliverables && data.deliverables.length > 0) {
      await db.insert(serviceDeliverables).values(
        data.deliverables.map((deliverable: string, index: number) => ({
          serviceId: id,
          deliverable,
          order: index + 1,
        }))
      );
    }

    if (data.process && data.process.length > 0) {
      await db.insert(serviceProcessSteps).values(
        data.process.map((step: ProcessStepData) => ({
          serviceId: id,
          step: step.step,
          title: step.title,
          description: step.description,
          duration: step.duration,
        }))
      );
    }

    if (data.faq && data.faq.length > 0) {
      await db.insert(serviceFaqs).values(
        data.faq.map((faq: FAQData, index: number) => ({
          serviceId: id,
          question: faq.question,
          answer: faq.answer,
          order: index + 1,
        }))
      );
    }

    if (data.gallery && data.gallery.length > 0) {
      await db.insert(serviceGalleryImages).values(
        data.gallery.map((imageUrl: string, index: number) => ({
          serviceId: id,
          imageUrl,
          order: index + 1,
        }))
      );
    }

    if (data.testimonial) {
      await db.insert(serviceTestimonials).values({
        serviceId: id,
        quote: data.testimonial.quote,
        author: data.testimonial.author,
        company: data.testimonial.company,
        avatar: data.testimonial.avatar,
      });
    }

    if (data.pricing && data.pricing.length > 0) {
      for (const tier of data.pricing) {
        const [pricingTier] = await db
          .insert(servicePricingTiers)
          .values({
            serviceId: id,
            name: tier.name,
            price: tier.price,
            description: tier.description,
            popular: tier.popular || false,
            order: data.pricing.indexOf(tier) + 1,
          })
          .returning();

        if (tier.features && tier.features.length > 0) {
          await db.insert(servicePricingFeatures).values(
            tier.features.map((feature: string, index: number) => ({
              pricingTierId: pricingTier.id,
              feature,
              order: index + 1,
            }))
          );
        }
      }
    }

    const result: ApiResponse<{ id: string }> = {
      success: true,
      data: { id },
      message: "Service updated successfully",
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating service:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to update service",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * DELETE endpoint - Delete individual service
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Service ID is required" },
        { status: 400 }
      );
    }

    // Check if service exists
    const [existingService] = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);

    if (!existingService) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    // Delete service with all its relations
    await deleteServiceWithRelations(id);

    const result: ApiResponse<null> = {
      success: true,
      data: null,
      message: "Service deleted successfully",
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting service:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to delete service",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * Helper function to build a service with all its relations
 */
async function buildServiceWithRelations(
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
      .select()
      .from(serviceRelated)
      .where(eq(serviceRelated.serviceId, serviceId)),
  ]);

  // Get pricing features for each pricing tier
  const pricingTiersWithFeatures = await Promise.all(
    pricingTiers.map(async (tier) => {
      const pricingFeatures = await db
        .select()
        .from(servicePricingFeatures)
        .where(eq(servicePricingFeatures.pricingTierId, tier.id))
        .orderBy(asc(servicePricingFeatures.order));

      return {
        name: tier.name,
        price: tier.price,
        description: tier.description,
        popular: tier.popular,
        features: pricingFeatures.map((feature) => feature.feature),
      };
    })
  );

  // Transform to the expected format
  const serviceWithRelations: ServiceWithRelations = {
    ...baseService,
    features: features.map((feature) => feature.feature),
    benefits: benefits.map((benefit) => benefit.benefit),
    process: processSteps.map((step) => ({
      step: step.step,
      title: step.title,
      description: step.description,
      duration: step.duration,
    })),
    pricing: pricingTiersWithFeatures,
    technologies: technologies.map((tech) => tech.technology),
    deliverables: deliverables.map((deliverable) => deliverable.deliverable),
    gallery: galleryImages.map((image) => image.imageUrl),
    testimonial:
      testimonials.length > 0
        ? {
            quote: testimonials[0].quote,
            author: testimonials[0].author,
            company: testimonials[0].company,
            avatar: testimonials[0].avatar,
          }
        : undefined,
    faq: faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
    relatedServices: relatedServices.map((related) => related.relatedServiceId),
  } as ServiceWithRelations;

  return serviceWithRelations;
}

/**
 * Helper function to delete a service with all its relations
 */
async function deleteServiceWithRelations(serviceId: string) {
  // Delete all related data first
  await Promise.all([
    db.delete(serviceFeatures).where(eq(serviceFeatures.serviceId, serviceId)),
    db.delete(serviceBenefits).where(eq(serviceBenefits.serviceId, serviceId)),
    db
      .delete(serviceProcessSteps)
      .where(eq(serviceProcessSteps.serviceId, serviceId)),
    db
      .delete(serviceTechnologies)
      .where(eq(serviceTechnologies.serviceId, serviceId)),
    db
      .delete(serviceDeliverables)
      .where(eq(serviceDeliverables.serviceId, serviceId)),
    db
      .delete(serviceGalleryImages)
      .where(eq(serviceGalleryImages.serviceId, serviceId)),
    db
      .delete(serviceTestimonials)
      .where(eq(serviceTestimonials.serviceId, serviceId)),
    db.delete(serviceFaqs).where(eq(serviceFaqs.serviceId, serviceId)),
    db.delete(serviceRelated).where(eq(serviceRelated.serviceId, serviceId)),
  ]);

  // Delete pricing features first, then pricing tiers
  const pricingTiers = await db
    .select()
    .from(servicePricingTiers)
    .where(eq(servicePricingTiers.serviceId, serviceId));

  for (const tier of pricingTiers) {
    await db
      .delete(servicePricingFeatures)
      .where(eq(servicePricingFeatures.pricingTierId, tier.id));
  }

  await db
    .delete(servicePricingTiers)
    .where(eq(servicePricingTiers.serviceId, serviceId));

  // Finally, delete the service itself
  await db.delete(services).where(eq(services.id, serviceId));
}

/**
 * Helper function to delete only service relations (for updates)
 */
async function deleteServiceRelations(serviceId: string) {
  // Get pricing tiers first to delete their features
  const pricingTiers = await db
    .select()
    .from(servicePricingTiers)
    .where(eq(servicePricingTiers.serviceId, serviceId));

  // Delete pricing features first
  for (const tier of pricingTiers) {
    await db
      .delete(servicePricingFeatures)
      .where(eq(servicePricingFeatures.pricingTierId, tier.id));
  }

  // Delete all related data
  await Promise.all([
    db.delete(serviceFeatures).where(eq(serviceFeatures.serviceId, serviceId)),
    db.delete(serviceBenefits).where(eq(serviceBenefits.serviceId, serviceId)),
    db
      .delete(serviceProcessSteps)
      .where(eq(serviceProcessSteps.serviceId, serviceId)),
    db
      .delete(serviceTechnologies)
      .where(eq(serviceTechnologies.serviceId, serviceId)),
    db
      .delete(serviceDeliverables)
      .where(eq(serviceDeliverables.serviceId, serviceId)),
    db
      .delete(serviceGalleryImages)
      .where(eq(serviceGalleryImages.serviceId, serviceId)),
    db
      .delete(serviceTestimonials)
      .where(eq(serviceTestimonials.serviceId, serviceId)),
    db.delete(serviceFaqs).where(eq(serviceFaqs.serviceId, serviceId)),
    db.delete(serviceRelated).where(eq(serviceRelated.serviceId, serviceId)),
    db
      .delete(servicePricingTiers)
      .where(eq(servicePricingTiers.serviceId, serviceId)),
  ]);
}
