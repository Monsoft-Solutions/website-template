import { NextRequest, NextResponse } from "next/server";
import { ContentCreator } from "@/lib/ai/content/creator";
import { requireAdmin } from "@/lib/auth/server";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type {
  ContentGenerationRequest,
  ContentGenerationResponse,
} from "@/lib/types/ai/content-generation.type";

interface ExtendedContentGenerationRequest extends ContentGenerationRequest {
  pageType?: string;
  copyType?: "headline" | "social-post" | "ad-copy" | "landing-page";
  includeSubject?: boolean;
  includeCallToAction?: boolean;
  keyBenefits?: string[];
}

/**
 * POST /api/ai/content/generate - Generate content using AI
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication for AI content generation
    await requireAdmin();

    const body: ExtendedContentGenerationRequest = await request.json();

    // Validate required fields
    if (!body.type || !body.topic) {
      return NextResponse.json(
        {
          success: false,
          data: {} as ContentGenerationResponse,
          error: "Content type and topic are required",
        } as ApiResponse<ContentGenerationResponse>,
        { status: 400 }
      );
    }

    const contentCreator = new ContentCreator();
    let result: ContentGenerationResponse;

    const startTime = Date.now();

    try {
      switch (body.type) {
        case "blog-post":
          const blogPost = await contentCreator.generateBlogPost(
            body.topic,
            body.keywords,
            body.tone,
            { length: body.length, audience: body.audience }
          );
          result = {
            content: blogPost,
            wordCount: blogPost.content.split(/\s+/).length,
            generationTime: Date.now() - startTime,
            model: contentCreator["modelManager"].getModelConfig().provider,
            tokensUsed: 0, // TODO: Implement actual token counting
          };
          break;

        case "service-description":
          if (!body.service) {
            throw new Error(
              "Service information is required for service description generation"
            );
          }
          const serviceDesc = await contentCreator.generateServiceDescription(
            body.service,
            body.tone,
            {
              length: body.length,
              includeCallToAction: body.includeCallToAction,
            }
          );
          result = {
            content: serviceDesc,
            wordCount: serviceDesc.split(/\s+/).length,
            generationTime: Date.now() - startTime,
            model: contentCreator["modelManager"].getModelConfig().provider,
            tokensUsed: 0,
          };
          break;

        case "page-content":
          const pageContent = await contentCreator.generatePageContent(
            body.pageType || "general",
            body.topic,
            body.keywords,
            body.tone,
            body.customInstructions
          );
          result = {
            content: pageContent,
            wordCount: pageContent.split(/\s+/).length,
            generationTime: Date.now() - startTime,
            model: contentCreator["modelManager"].getModelConfig().provider,
            tokensUsed: 0,
          };
          break;

        case "email-template":
          const emailResult = await contentCreator.generateEmailTemplate(
            body.topic,
            body.audience || "general audience",
            body.tone,
            body.includeSubject !== false
          );
          const emailContent = emailResult.subject
            ? `Subject: ${emailResult.subject}\n\n${emailResult.body}`
            : emailResult.body;
          result = {
            content: emailContent,
            wordCount: emailContent.split(/\s+/).length,
            generationTime: Date.now() - startTime,
            model: contentCreator["modelManager"].getModelConfig().provider,
            tokensUsed: 0,
          };
          break;

        case "marketing-copy":
          const marketingCopy = await contentCreator.generateMarketingCopy(
            body.topic,
            body.copyType || "landing-page",
            body.audience || "general audience",
            body.tone,
            body.keyBenefits || []
          );
          result = {
            content: marketingCopy,
            wordCount: marketingCopy.split(/\s+/).length,
            generationTime: Date.now() - startTime,
            model: contentCreator["modelManager"].getModelConfig().provider,
            tokensUsed: 0,
          };
          break;

        default:
          throw new Error(`Unsupported content type: ${body.type}`);
      }

      return NextResponse.json({
        success: true,
        data: result,
        message: "Content generated successfully",
      } as ApiResponse<ContentGenerationResponse>);
    } catch (generationError) {
      console.error("Content generation error:", generationError);
      throw new Error(
        generationError instanceof Error
          ? generationError.message
          : "Content generation failed"
      );
    }
  } catch (error) {
    console.error("AI content generation error:", error);
    return NextResponse.json(
      {
        success: false,
        data: {} as ContentGenerationResponse,
        error:
          error instanceof Error ? error.message : "Failed to generate content",
      } as ApiResponse<ContentGenerationResponse>,
      { status: 500 }
    );
  }
}
