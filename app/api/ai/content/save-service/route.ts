import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema/service.table";
import { serviceFeatures } from "@/lib/db/schema/service-feature.table";
import { serviceBenefits } from "@/lib/db/schema/service-benefit.table";
import { serviceDeliverables } from "@/lib/db/schema/service-deliverable.table";
import { serviceTechnologies } from "@/lib/db/schema/service-technology.table";
import { serviceProcessSteps } from "@/lib/db/schema/service-process-step.table";
import { servicePricingTiers } from "@/lib/db/schema/service-pricing-tier.table";
import { servicePricingFeatures } from "@/lib/db/schema/service-pricing-feature.table";
import { serviceFaqs } from "@/lib/db/schema/service-faq.table";
import { serviceTestimonials } from "@/lib/db/schema/service-testimonial.table";
import { serviceGalleryImages } from "@/lib/db/schema/service-gallery-image.table";
import { eq } from "drizzle-orm";
import {
  ServiceSaveRequestSchema,
  type ServiceSaveResponse,
} from "@/lib/types/ai/content-generation.type";

/**
 * Generate a unique slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 255);
}

/**
 * Generate a unique slug by checking database and adding suffix if needed
 */
async function generateUniqueSlug(
  title: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db
      .select({ id: services.id })
      .from(services)
      .where(eq(services.slug, slug))
      .limit(1);

    // If no existing service with this slug, or it's the same service we're updating
    if (existing.length === 0 || (excludeId && existing[0].id === excludeId)) {
      break;
    }

    // Generate a new slug with counter
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * POST /api/ai/content/save-service - Save AI-generated service with all related data to database
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    const body = await request.json();

    // Validate the request data
    const validation = ServiceSaveRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Validation failed: ${validation.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(", ")}`,
        },
        { status: 400 }
      );
    }

    const serviceData = validation.data;

    // Generate unique slug
    const slug = serviceData.slug
      ? await generateUniqueSlug(serviceData.slug)
      : await generateUniqueSlug(serviceData.title);

    // Use a transaction to ensure all data is saved consistently
    const result = await db.transaction(async (tx) => {
      // Insert the main service record
      const [insertedService] = await tx
        .insert(services)
        .values({
          title: serviceData.title,
          slug,
          shortDescription: serviceData.shortDescription,
          fullDescription: serviceData.fullDescription,
          timeline: serviceData.timeline,
          category: serviceData.category,
          featuredImage: serviceData.featuredImage,
          status: "draft",
        })
        .returning({
          id: services.id,
          slug: services.slug,
        });

      const serviceId = insertedService.id;

      // Insert features
      if (serviceData.features && serviceData.features.length > 0) {
        await tx.insert(serviceFeatures).values(
          serviceData.features.map((feature, index) => ({
            serviceId,
            feature,
            order: index + 1,
          }))
        );
      }

      // Insert benefits
      if (serviceData.benefits && serviceData.benefits.length > 0) {
        await tx.insert(serviceBenefits).values(
          serviceData.benefits.map((benefit, index) => ({
            serviceId,
            benefit,
            order: index + 1,
          }))
        );
      }

      // Insert deliverables
      if (serviceData.deliverables && serviceData.deliverables.length > 0) {
        await tx.insert(serviceDeliverables).values(
          serviceData.deliverables.map((deliverable, index) => ({
            serviceId,
            deliverable,
            order: index + 1,
          }))
        );
      }

      // Insert technologies
      if (serviceData.technologies && serviceData.technologies.length > 0) {
        await tx.insert(serviceTechnologies).values(
          serviceData.technologies.map((technology, index) => ({
            serviceId,
            technology,
            order: index + 1,
          }))
        );
      }

      // Insert process steps
      if (serviceData.process && serviceData.process.length > 0) {
        await tx.insert(serviceProcessSteps).values(
          serviceData.process.map((processStep) => ({
            serviceId,
            step: processStep.step,
            title: processStep.title,
            description: processStep.description,
            duration: processStep.duration,
          }))
        );
      }

      // Insert pricing tiers and their features
      if (serviceData.pricing && serviceData.pricing.length > 0) {
        for (let index = 0; index < serviceData.pricing.length; index++) {
          const pricingTier = serviceData.pricing[index];

          // Insert pricing tier
          const [insertedTier] = await tx
            .insert(servicePricingTiers)
            .values({
              serviceId,
              name: pricingTier.name,
              price: pricingTier.price,
              description: pricingTier.description,
              popular: pricingTier.popular || false,
              order: index + 1,
            })
            .returning({ id: servicePricingTiers.id });

          // Insert pricing tier features
          if (pricingTier.features && pricingTier.features.length > 0) {
            await tx.insert(servicePricingFeatures).values(
              pricingTier.features.map((feature, featureIndex) => ({
                pricingTierId: insertedTier.id,
                feature,
                order: featureIndex + 1,
              }))
            );
          }
        }
      }

      // Insert FAQs
      if (serviceData.faq && serviceData.faq.length > 0) {
        await tx.insert(serviceFaqs).values(
          serviceData.faq.map((faq, index) => ({
            serviceId,
            question: faq.question,
            answer: faq.answer,
            order: index + 1,
          }))
        );
      }

      // Insert testimonials
      if (serviceData.testimonials && serviceData.testimonials.length > 0) {
        await tx.insert(serviceTestimonials).values(
          serviceData.testimonials.map((testimonial) => ({
            serviceId,
            quote: testimonial.quote,
            author: testimonial.author,
            company: testimonial.company,
            avatar: testimonial.avatar,
          }))
        );
      }

      // Insert gallery images
      if (serviceData.galleryImages && serviceData.galleryImages.length > 0) {
        await tx.insert(serviceGalleryImages).values(
          serviceData.galleryImages.map((imageUrl, index) => ({
            serviceId,
            imageUrl,
            order: index + 1,
          }))
        );
      }

      // TODO: Handle related services - this would require existing service IDs
      // For now, we'll skip this as it requires finding existing services by slug/title

      return insertedService;
    });

    const response: ServiceSaveResponse = {
      success: true,
      data: {
        id: result.id,
        slug: result.slug,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to save service:", error);

    const response: ServiceSaveResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
