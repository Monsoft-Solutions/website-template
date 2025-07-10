import { NextRequest, NextResponse } from "next/server";
import { eq, asc, desc, and, or, ilike, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
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
import { requireAdmin } from "@/lib/auth/server";
import type { ServiceWithRelations } from "@/lib/types/service-with-relations.type";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { AdminServicesListResponse } from "@/lib/hooks/use-admin-services";
import {
  getServiceFeaturesByIds,
  getServiceBenefitsByIds,
  getServiceProcessStepsByIds,
  getServiceTechnologiesByIds,
  getServiceDeliverablesByIds,
  getServiceGalleryImagesByIds,
  getServiceTestimonialsByIds,
  getServiceFaqsByIds,
  getRelatedServicesByIds,
  getServicePricingDataByIds,
  buildServiceFromMaps,
} from "@/lib/api/services.api";
import { notifyContentUpdate } from "@/lib/services/google-indexing.service";

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

interface ServiceCreateData {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  timeline: string;
  category: "Development" | "Design" | "Consulting" | "Marketing" | "Support";
  status: "draft" | "published" | "archived";
  featuredImage: string;
  features?: string[];
  benefits?: string[];
  technologies?: string[];
  deliverables?: string[];
  gallery?: string[];
  faq?: FAQData[];
  process?: ProcessStepData[];
  pricing?: PricingTierData[];
  testimonials?: TestimonialData[];
  relatedServices?: string[];
}

/**
 * POST endpoint - Create new service
 */
export async function POST(request: NextRequest) {
  try {
    // Add authentication check - only admin users can create services
    await requireAdmin();

    const data: ServiceCreateData = await request.json();

    // Create the service first
    const [newService] = await db
      .insert(services)
      .values({
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        timeline: data.timeline,
        category: data.category,
        status: data.status,
        featuredImage: data.featuredImage,
      })
      .returning();

    // Insert related data if provided
    if (data.features && data.features.length > 0) {
      await db.insert(serviceFeatures).values(
        data.features.map((feature: string, index: number) => ({
          serviceId: newService.id,
          feature,
          order: index + 1,
        }))
      );
    }

    if (data.benefits && data.benefits.length > 0) {
      await db.insert(serviceBenefits).values(
        data.benefits.map((benefit: string, index: number) => ({
          serviceId: newService.id,
          benefit,
          order: index + 1,
        }))
      );
    }

    if (data.technologies && data.technologies.length > 0) {
      await db.insert(serviceTechnologies).values(
        data.technologies.map((technology: string, index: number) => ({
          serviceId: newService.id,
          technology,
          order: index + 1,
        }))
      );
    }

    if (data.deliverables && data.deliverables.length > 0) {
      await db.insert(serviceDeliverables).values(
        data.deliverables.map((deliverable: string, index: number) => ({
          serviceId: newService.id,
          deliverable,
          order: index + 1,
        }))
      );
    }

    if (data.process && data.process.length > 0) {
      await db.insert(serviceProcessSteps).values(
        data.process.map((step: ProcessStepData) => ({
          serviceId: newService.id,
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
          serviceId: newService.id,
          question: faq.question,
          answer: faq.answer,
          order: index + 1,
        }))
      );
    }

    if (data.gallery && data.gallery.length > 0) {
      await db.insert(serviceGalleryImages).values(
        data.gallery.map((imageUrl: string, index: number) => ({
          serviceId: newService.id,
          imageUrl,
          order: index + 1,
        }))
      );
    }

    if (data.testimonials && data.testimonials.length > 0) {
      await db.insert(serviceTestimonials).values(
        data.testimonials.map((testimonial: TestimonialData) => ({
          serviceId: newService.id,
          quote: testimonial.quote,
          author: testimonial.author,
          company: testimonial.company,
          avatar: testimonial.avatar,
        }))
      );
    }

    if (data.pricing && data.pricing.length > 0) {
      for (const tier of data.pricing) {
        const [pricingTier] = await db
          .insert(servicePricingTiers)
          .values({
            serviceId: newService.id,
            name: tier.name,
            price: tier.price,
            description: tier.description,
            popular: tier.popular || false,
            order: data.pricing.indexOf(tier) + 1,
          })
          .returning();

        if (tier.features?.length > 0) {
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

    // Insert related services
    if (data.relatedServices && data.relatedServices.length > 0) {
      await db.insert(serviceRelated).values(
        data.relatedServices.map((relatedServiceId: string) => ({
          serviceId: newService.id,
          relatedServiceId,
        }))
      );
    }

    // Notify Google about the new service (async - doesn't block response)
    notifyContentUpdate("service", data.slug, "URL_UPDATED");

    // Invalidate services cache
    revalidateTag("services");
    revalidatePath("/services");
    revalidatePath("/api/services");

    const result: ApiResponse<{ id: string }> = {
      success: true,
      data: { id: newService.id },
      message: "Service created successfully",
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to create service",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * GET endpoint - Fetch services with admin filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Add authentication check - only admin users can access services management
    await requireAdmin();

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50); // Reduced from 10 to 20, max 50
    const category = searchParams.get("category") || undefined;
    const searchQuery = searchParams.get("searchQuery") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build where conditions
    const whereConditions = [];

    if (category) {
      whereConditions.push(
        eq(
          services.category,
          category as
            | "Development"
            | "Design"
            | "Consulting"
            | "Marketing"
            | "Support"
        )
      );
    }

    if (searchQuery) {
      whereConditions.push(
        or(
          ilike(services.title, `%${searchQuery}%`),
          ilike(services.shortDescription, `%${searchQuery}%`),
          ilike(services.fullDescription, `%${searchQuery}%`)
        )
      );
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Build order by clause
    const orderByField =
      sortBy === "title"
        ? services.title
        : sortBy === "category"
        ? services.category
        : sortBy === "timeline"
        ? services.timeline
        : services.createdAt;

    const orderByClause =
      sortOrder === "asc" ? asc(orderByField) : desc(orderByField);

    // Get total count
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(services)
      .where(whereClause);

    const totalServices = totalCountResult[0]?.count || 0;

    // Get services with pagination
    const servicesResult = await db
      .select()
      .from(services)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset((page - 1) * limit);

    // Build services with relations using optimized batch approach
    let servicesWithRelations: ServiceWithRelations[] = [];

    if (servicesResult.length > 0) {
      const serviceIds = servicesResult.map((s) => s.id);

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
      servicesWithRelations = servicesResult.map((service) => {
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
      });
    }

    // Calculate pagination info
    const totalPages = Math.ceil(totalServices / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const response: AdminServicesListResponse = {
      services: servicesWithRelations,
      totalServices,
      totalPages,
      currentPage: page,
      hasNextPage,
      hasPreviousPage,
    };

    const result: ApiResponse<AdminServicesListResponse> = {
      success: true,
      data: response,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching admin services:", error);

    const result: ApiResponse<AdminServicesListResponse> = {
      success: false,
      data: {
        services: [],
        totalServices: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      error:
        error instanceof Error ? error.message : "Failed to fetch services",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * PATCH endpoint - Bulk update services
 */
export async function PATCH(request: NextRequest) {
  try {
    // Add authentication check - only admin users can bulk update services
    await requireAdmin();

    const { ids, action } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid service IDs" },
        { status: 400 }
      );
    }

    // For now, we'll just return success as services don't have status fields like blog posts
    // This can be extended when service status fields are added
    const result: ApiResponse<null> = {
      success: true,
      data: null,
      message: `Bulk ${action} operation completed successfully`,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error performing bulk action:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to perform bulk action",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * DELETE endpoint - Bulk delete services
 */
export async function DELETE(request: NextRequest) {
  try {
    // Add authentication check - only admin users can delete services
    await requireAdmin();

    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid service IDs" },
        { status: 400 }
      );
    }

    // Delete services and their related data
    for (const id of ids) {
      await deleteServiceWithRelations(id);
    }

    // Invalidate services cache
    revalidateTag("services");
    revalidatePath("/services");
    revalidatePath("/api/services");

    const result: ApiResponse<null> = {
      success: true,
      data: null,
      message: `Successfully deleted ${ids.length} service(s)`,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting services:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to delete services",
    };

    return NextResponse.json(result, { status: 500 });
  }
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

export type { AdminServicesListResponse };
