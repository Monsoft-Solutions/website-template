import { NextRequest } from "next/server";
import { streamObject } from "ai";
import { requireAdmin } from "@/lib/auth/server";
import { ModelManager } from "@/lib/ai/core/model-manager";
import {
  BlogPostSchema,
  ServiceSchema,
} from "@/lib/types/ai/content-generation.type";
import { blogPostPrompt, servicePrompt } from "@/lib/ai/prompts";
import type { ContentGenerationRequest } from "@/lib/types/ai/content-generation.type";

/**
 * POST /api/ai/content/stream-object - Stream object generation for structured content
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    const body: ContentGenerationRequest = await request.json();

    // Validate required fields and content type
    if (!body.type || !body.topic) {
      return new Response(
        "Invalid request: content type and topic are required",
        {
          status: 400,
        }
      );
    }

    const modelManager = new ModelManager();
    const model = modelManager.getModel();

    let prompt: string;
    let schema: typeof BlogPostSchema | typeof ServiceSchema;

    // Generate the appropriate prompt and schema based on content type
    if (body.type === "blog-post") {
      schema = BlogPostSchema;
      prompt = blogPostPrompt({
        topic: body.topic,
        keywords: body.keywords,
        tone: body.tone,
        length: body.length || "medium",
        audience: body.audience,
      });
    } else if (body.type === "service-description") {
      if (!body.service) {
        return new Response(
          "Invalid request: service details are required for service generation",
          {
            status: 400,
          }
        );
      }

      schema = ServiceSchema;
      prompt = servicePrompt({
        name: body.service.name,
        features: body.service.features,
        benefits: body.service.benefits,
        targetAudience: body.service.targetAudience,
        industry: body.service.industry,
        competitiveAdvantage: body.service.competitiveAdvantage,
        tone: body.tone,
        length: body.length || "medium",
        includeCallToAction: body.includeCallToAction,
        includePricingTiers: body.includePricingTiers,
        includeProcessSteps: body.includeProcessSteps,
        includeFAQ: body.includeFAQ,
        includeTestimonials: body.includeTestimonials,
      });
    } else {
      return new Response(
        "Invalid request: only blog-post and service-description are supported for structured generation",
        {
          status: 400,
        }
      );
    }

    // Stream the object generation
    const result = await streamObject({
      model,
      schema,
      prompt,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Stream object generation failed:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
