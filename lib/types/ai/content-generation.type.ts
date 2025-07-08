import { z } from "zod";

/**
 * Content generation types
 */

/**
 * Content types that can be generated
 */
export type ContentType =
  | "blog-post"
  | "service-description"
  | "page-content"
  | "email-template"
  | "marketing-copy";

/**
 * Content tone options
 */
export type ContentTone =
  | "professional"
  | "casual"
  | "technical"
  | "friendly"
  | "persuasive"
  | "authoritative";

/**
 * Blog post schema and type
 */
export const BlogPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  metaDescription: z.string(),
  slug: z.string().optional(),
  category: z.string().optional(),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;

/**
 * Service description input
 */
export type ServiceDescriptionInput = {
  name: string;
  features: string[];
  benefits: string[];
  targetAudience: string;
  industry?: string;
  competitiveAdvantage?: string;
};

/**
 * Content generation request
 */
export type ContentGenerationRequest = {
  type: ContentType;
  topic: string;
  keywords: string[];
  tone: ContentTone;
  length?: "short" | "medium" | "long";
  audience?: string;
  customInstructions?: string;
  service?: ServiceDescriptionInput;
};

/**
 * Content generation response
 */
export type ContentGenerationResponse = {
  content: string | BlogPost;
  wordCount: number;
  generationTime: number;
  model: string;
  tokensUsed: number;
};

/**
 * Content refinement options
 */
export type ContentRefinementOptions = {
  improvements: string[];
  targetKeywords?: string[];
  tone?: ContentTone;
  length?: "shorter" | "longer" | "same";
};

/**
 * SEO optimization options
 */
export type SEOOptimizationOptions = {
  targetKeywords: string[];
  focusKeyword?: string;
  metaTitle?: string;
  metaDescription?: string;
  readabilityLevel?: "basic" | "intermediate" | "advanced";
};
