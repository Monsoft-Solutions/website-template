import { z } from "zod";

/**
 * Available content types for AI generation
 */
export type ContentType =
  | "blog-post"
  | "service-description"
  | "page-content"
  | "email-template"
  | "marketing-copy";

/**
 * Tone options for generated content
 */
export type ContentTone =
  | "professional"
  | "casual"
  | "technical"
  | "friendly"
  | "persuasive"
  | "authoritative";

/**
 * Enhanced blog post schema for AI generation
 * Now includes all fields needed for database insertion
 */
export const BlogPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  metaDescription: z.string(),
  metaTitle: z.string().optional(),
  metaKeywords: z.string().optional(),
  slug: z.string().optional(),
  category: z.string().optional(),
});

/**
 * Process step schema for service generation
 */
export const ProcessStepSchema = z.object({
  step: z.number(),
  title: z.string(),
  description: z.string(),
  duration: z.string().optional(),
});

/**
 * Pricing tier schema for service generation
 */
export const PricingTierSchema = z.object({
  name: z.string(),
  price: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  popular: z.boolean().optional().default(false),
});

/**
 * FAQ schema for service generation
 */
export const FAQSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

/**
 * Testimonial schema for service generation
 */
export const TestimonialSchema = z.object({
  quote: z.string(),
  author: z.string(),
  company: z.string(),
  avatar: z.string().optional(),
});

/**
 * Enhanced service schema for AI generation
 * Includes all fields needed for database insertion and complete service creation
 */
export const ServiceSchema = z.object({
  // Core service information
  title: z.string(),
  shortDescription: z.string(),
  fullDescription: z.string(),
  timeline: z.string(),
  category: z.enum([
    "Development",
    "Design",
    "Consulting",
    "Marketing",
    "Support",
  ]),
  slug: z.string().optional(),

  // Structured arrays for related data
  features: z.array(z.string()),
  benefits: z.array(z.string()),
  deliverables: z.array(z.string()),
  technologies: z.array(z.string()).optional(),

  // Complex structured data
  process: z.array(ProcessStepSchema),
  pricing: z.array(PricingTierSchema),
  faq: z.array(FAQSchema),
  testimonials: z.array(TestimonialSchema).optional(),

  // Marketing and positioning
  targetAudience: z.string(),
  competitiveAdvantage: z.string().optional(),
  callToAction: z.string().optional(),

  // SEO and content
  metaDescription: z.string().optional(),
  metaTitle: z.string().optional(),

  // Additional content
  galleryImages: z.array(z.string()).optional(),
  relatedServices: z.array(z.string()).optional(),
});

/**
 * Union type for all generated content
 */
export type GeneratedContent = BlogPost | Service;

/**
 * Exported types for the schemas
 */
export type BlogPost = z.infer<typeof BlogPostSchema>;
export type Service = z.infer<typeof ServiceSchema>;

/**
 * Blog post save request for database insertion
 */
export const BlogPostSaveRequestSchema = z.object({
  title: z.string(),
  content: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  metaDescription: z.string(),
  metaTitle: z.string().optional(),
  metaKeywords: z.string().optional(),
  slug: z.string().optional(),
  category: z.string().optional(),
  authorId: z.string(),
  categoryId: z.string(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featuredImage: z.string().optional(),
});

/**
 * Service save request for database insertion
 * Now includes all structured data from AI generation
 */
export const ServiceSaveRequestSchema = z.object({
  // Core service information
  title: z.string(),
  shortDescription: z.string(),
  fullDescription: z.string(),
  timeline: z.string(),
  category: z.enum([
    "Development",
    "Design",
    "Consulting",
    "Marketing",
    "Support",
  ]),
  featuredImage: z.string(),
  slug: z.string().optional(),

  // Structured arrays for related data
  features: z.array(z.string()),
  benefits: z.array(z.string()),
  deliverables: z.array(z.string()),
  technologies: z.array(z.string()).optional(),

  // Complex structured data
  process: z.array(ProcessStepSchema),
  pricing: z.array(PricingTierSchema),
  faq: z.array(FAQSchema),
  testimonials: z.array(TestimonialSchema).optional(),

  // Marketing and positioning
  targetAudience: z.string().optional(),
  competitiveAdvantage: z.string().optional(),
  callToAction: z.string().optional(),

  // SEO and content
  metaDescription: z.string().optional(),
  metaTitle: z.string().optional(),

  // Additional content
  galleryImages: z.array(z.string()).optional(),
  relatedServices: z.array(z.string()).optional(),
});

export type BlogPostSaveRequest = z.infer<typeof BlogPostSaveRequestSchema>;
export type ServiceSaveRequest = z.infer<typeof ServiceSaveRequestSchema>;

/**
 * Response types for save operations
 */
export interface BlogPostSaveResponse {
  success: boolean;
  data?: {
    id: string;
    slug: string;
  } | null;
  error?: string;
  message?: string;
}

export interface ServiceSaveResponse {
  success: boolean;
  data?: {
    id: string;
    slug: string;
  } | null;
  error?: string;
  message?: string;
}

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
 * Content generation request structure
 */
export type ContentGenerationRequest = {
  type: ContentType;
  topic: string;
  keywords: string[];
  tone: ContentTone;
  length: "short" | "medium" | "long";
  audience?: string;
  customInstructions?: string;

  // Service-specific fields
  service?: ServiceDescriptionInput;
  includeCallToAction?: boolean;
  includePricingTiers?: boolean;
  includeProcessSteps?: boolean;
  includeFAQ?: boolean;
  includeTestimonials?: boolean;

  // Page content fields
  pageType?:
    | "homepage"
    | "about"
    | "contact"
    | "landing"
    | "product"
    | "general";

  // Email template fields
  includeSubject?: boolean;

  // Marketing copy fields
  copyType?: "headline" | "social-post" | "ad-copy" | "landing-page";
  keyBenefits?: string[];
};

/**
 * Content generation response structure
 */
export type ContentGenerationResponse = {
  content: string;
  metadata?: {
    contentType: ContentType;
    wordCount: number;
    estimatedReadingTime?: number;
    structuredData?: BlogPost | Service;
  };
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
