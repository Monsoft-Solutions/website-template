import { generateText, generateObject } from "ai";
import { ModelManager } from "../core/model-manager";
import {
  BlogPostSchema,
  BlogPost,
  ContentGenerationRequest,
  ContentGenerationResponse,
  ServiceDescriptionInput,
  ContentTone,
} from "@/lib/types/ai/content-generation.type";
import {
  blogPostPrompt,
  serviceDescriptionPrompt,
  pageContentPrompt,
  emailTemplatePrompt,
  marketingCopyPrompt,
} from "../prompts";

/**
 * Content Creator class for generating various types of content
 */
export class ContentCreator {
  private modelManager: ModelManager;

  constructor() {
    this.modelManager = new ModelManager();
  }

  /**
   * Generate a blog post with structured data
   */
  async generateBlogPost(
    topic: string,
    keywords: string[],
    tone: ContentTone = "professional",
    options?: { length?: "short" | "medium" | "long"; audience?: string }
  ): Promise<BlogPost> {
    const prompt = blogPostPrompt({
      topic,
      keywords,
      tone,
      length: options?.length || "medium",
      audience: options?.audience,
    });

    try {
      const result = await generateObject({
        model: this.modelManager.getModel(),
        prompt,
        schema: BlogPostSchema,
        temperature: 0.7,
      });

      return {
        ...result.object,
        slug: this.generateSlug(result.object.title),
      };
    } catch (error) {
      console.error("Blog post generation failed:", error);
      throw new Error("Failed to generate blog post");
    }
  }

  /**
   * Generate a service description
   */
  async generateServiceDescription(
    service: ServiceDescriptionInput,
    tone: ContentTone = "professional",
    options?: {
      length?: "short" | "medium" | "long";
      includeCallToAction?: boolean;
    }
  ): Promise<string> {
    const prompt = serviceDescriptionPrompt({
      name: service.name,
      features: service.features,
      benefits: service.benefits,
      targetAudience: service.targetAudience,
      industry: service.industry,
      competitiveAdvantage: service.competitiveAdvantage,
      tone,
      length: options?.length || "medium",
      includeCallToAction: options?.includeCallToAction,
    });

    try {
      const result = await generateText({
        model: this.modelManager.getModel(),
        prompt,
        temperature: 0.7,
      });

      return result.text;
    } catch (error) {
      console.error("Service description generation failed:", error);
      throw new Error("Failed to generate service description");
    }
  }

  /**
   * Generate page content
   */
  async generatePageContent(
    pageType: string,
    topic: string,
    keywords: string[],
    tone: ContentTone = "professional",
    customInstructions?: string
  ): Promise<string> {
    const prompt = pageContentPrompt({
      pageType,
      topic,
      keywords,
      tone,
      customInstructions,
    });

    try {
      const result = await generateText({
        model: this.modelManager.getModel(),
        prompt,
        temperature: 0.7,
      });

      return result.text;
    } catch (error) {
      console.error("Page content generation failed:", error);
      throw new Error("Failed to generate page content");
    }
  }

  /**
   * Generate email template
   */
  async generateEmailTemplate(
    purpose: string,
    audience: string,
    tone: ContentTone = "professional",
    includeSubject: boolean = true
  ): Promise<{ subject?: string; body: string }> {
    const prompt = emailTemplatePrompt({
      purpose,
      audience,
      tone,
      includeSubject,
    });

    try {
      const result = await generateText({
        model: this.modelManager.getModel(),
        prompt,
        temperature: 0.7,
      });

      if (includeSubject) {
        // Try to parse subject and body from the response
        const text = result.text;
        const subjectMatch = text.match(/Subject:?\s*(.+)/i);
        const subject = subjectMatch ? subjectMatch[1].trim() : undefined;

        // Remove subject line from body if found
        const body = subject
          ? text.replace(/Subject:?\s*.+/i, "").trim()
          : text;

        return { subject, body };
      }

      return { body: result.text };
    } catch (error) {
      console.error("Email template generation failed:", error);
      throw new Error("Failed to generate email template");
    }
  }

  /**
   * Generate marketing copy
   */
  async generateMarketingCopy(
    productOrService: string,
    copyType: "headline" | "social-post" | "ad-copy" | "landing-page",
    targetAudience: string,
    tone: ContentTone = "persuasive",
    keyBenefits: string[] = []
  ): Promise<string> {
    const prompt = marketingCopyPrompt({
      productOrService,
      copyType,
      targetAudience,
      tone,
      keyBenefits,
    });

    try {
      const result = await generateText({
        model: this.modelManager.getModel(),
        prompt,
        temperature: 0.8, // Higher temperature for more creative marketing copy
      });

      return result.text;
    } catch (error) {
      console.error("Marketing copy generation failed:", error);
      throw new Error("Failed to generate marketing copy");
    }
  }

  /**
   * Universal content generation method
   */
  async generateContent(
    request: ContentGenerationRequest
  ): Promise<ContentGenerationResponse> {
    const startTime = Date.now();
    let content: string | BlogPost;
    const tokensUsed = 0;

    try {
      switch (request.type) {
        case "blog-post":
          content = await this.generateBlogPost(
            request.topic,
            request.keywords,
            request.tone,
            { length: request.length, audience: request.audience }
          );
          break;

        case "service-description":
          if (!request.service) {
            throw new Error(
              "Service information is required for service description generation"
            );
          }
          content = await this.generateServiceDescription(
            request.service,
            request.tone,
            { length: request.length }
          );
          break;

        case "page-content":
          content = await this.generatePageContent(
            "general",
            request.topic,
            request.keywords,
            request.tone,
            request.customInstructions
          );
          break;

        case "email-template":
          const emailResult = await this.generateEmailTemplate(
            request.topic,
            request.audience || "general audience",
            request.tone
          );
          content = emailResult.subject
            ? `Subject: ${emailResult.subject}\n\n${emailResult.body}`
            : emailResult.body;
          break;

        case "marketing-copy":
          content = await this.generateMarketingCopy(
            request.topic,
            "landing-page",
            request.audience || "general audience",
            request.tone
          );
          break;

        default:
          throw new Error(`Unsupported content type: ${request.type}`);
      }

      const generationTime = Date.now() - startTime;
      const wordCount =
        typeof content === "string"
          ? content.split(/\s+/).length
          : content.content.split(/\s+/).length;

      return {
        content,
        wordCount,
        generationTime,
        model: this.modelManager.getModelConfig().provider,
        tokensUsed, // TODO: Implement actual token counting
      };
    } catch (error) {
      console.error("Content generation failed:", error);
      throw error;
    }
  }

  /**
   * Generate a URL-friendly slug from a title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
      .substring(0, 50);
  }
}
