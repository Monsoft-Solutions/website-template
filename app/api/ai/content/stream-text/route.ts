import { NextRequest } from "next/server";
import { streamText } from "ai";
import { requireAdmin } from "@/lib/auth/server";
import { ModelManager } from "@/lib/ai/core/model-manager";
import {
  serviceDescriptionPrompt,
  pageContentPrompt,
  emailTemplatePrompt,
  marketingCopyPrompt,
} from "@/lib/ai/prompts";
import type { ContentGenerationRequest } from "@/lib/types/ai/content-generation.type";

/**
 * POST /api/ai/content/stream-text - Stream text generation for non-blog content
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    const requestData: ContentGenerationRequest = await request.json();

    // Validate required fields
    if (requestData.type === "blog-post" || !requestData.topic) {
      return new Response(
        "Invalid request: non-blog content type and topic are required",
        {
          status: 400,
        }
      );
    }

    const modelManager = new ModelManager();
    const model = modelManager.getModel();

    let prompt: string;

    // Generate appropriate prompt based on content type
    switch (requestData.type) {
      case "service-description":
        if (!requestData.service) {
          return new Response(
            "Service information is required for service description",
            {
              status: 400,
            }
          );
        }
        prompt = serviceDescriptionPrompt({
          name: requestData.service.name,
          features: requestData.service.features,
          benefits: requestData.service.benefits,
          targetAudience: requestData.service.targetAudience,
          industry: requestData.service.industry,
          competitiveAdvantage: requestData.service.competitiveAdvantage,
          tone: requestData.tone,
          length: requestData.length || "medium",
          includeCallToAction: requestData.includeCallToAction || false,
        });
        break;

      case "page-content":
        prompt = pageContentPrompt({
          pageType: requestData.pageType || "general",
          topic: requestData.topic,
          keywords: requestData.keywords,
          tone: requestData.tone,
          customInstructions: requestData.customInstructions,
        });
        break;

      case "email-template":
        prompt = emailTemplatePrompt({
          purpose: requestData.topic,
          audience: requestData.audience || "general audience",
          tone: requestData.tone,
          includeSubject: requestData.includeSubject !== false,
        });
        break;

      case "marketing-copy":
        prompt = marketingCopyPrompt({
          productOrService: requestData.topic,
          copyType: requestData.copyType || "landing-page",
          targetAudience: requestData.audience || "general audience",
          tone: requestData.tone,
          keyBenefits: requestData.keyBenefits || [],
        });
        break;

      default:
        return new Response(`Unsupported content type: ${requestData.type}`, {
          status: 400,
        });
    }

    // Stream the text generation
    const result = streamText({
      model,
      prompt,
      temperature: requestData.type === "marketing-copy" ? 0.8 : 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Stream text generation failed:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
