import { z } from "zod";
import type { ContentType } from "@/lib/types/ai/content-generation.type";

// Common validation messages
export const validationMessages = {
  required: (field: string) => `${field} is required`,
  min: (field: string, length: number) =>
    `${field} must be at least ${length} characters`,
  max: (field: string, length: number) =>
    `${field} must be at most ${length} characters`,
  minItems: (field: string, count: number) =>
    `Please add at least ${count} ${field.toLowerCase()}`,
  invalidEmail: "Please enter a valid email address",
};

// Base content schema
const baseContentSchema = z.object({
  topic: z
    .string()
    .min(1, validationMessages.required("Topic"))
    .min(3, validationMessages.min("Topic", 3))
    .max(200, validationMessages.max("Topic", 200)),
  tone: z.enum([
    "professional",
    "casual",
    "technical",
    "friendly",
    "persuasive",
    "authoritative",
  ] as const),
  length: z.enum(["short", "medium", "long"] as const),
  audience: z
    .string()
    .max(200, validationMessages.max("Target audience", 200))
    .optional(),
  customInstructions: z
    .string()
    .max(500, validationMessages.max("Custom instructions", 500))
    .optional(),
});

// Blog post schema
export const blogPostFormSchema = baseContentSchema.extend({
  keywords: z
    .string()
    .optional()
    .transform(
      (val) =>
        val
          ?.split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0) || []
    ),
});

// Service description schema
export const serviceDescriptionFormSchema = baseContentSchema.extend({
  serviceName: z
    .string()
    .min(1, validationMessages.required("Service name"))
    .min(2, validationMessages.min("Service name", 2))
    .max(100, validationMessages.max("Service name", 100)),
  serviceFeatures: z
    .array(z.string().min(1, "Feature cannot be empty"))
    .min(1, validationMessages.minItems("Features", 1))
    .max(10, "Maximum 10 features allowed"),
  serviceBenefits: z
    .array(z.string().min(1, "Benefit cannot be empty"))
    .min(1, validationMessages.minItems("Benefits", 1))
    .max(10, "Maximum 10 benefits allowed"),
  serviceTargetAudience: z
    .string()
    .min(1, validationMessages.required("Target audience"))
    .max(200, validationMessages.max("Target audience", 200)),
  serviceIndustry: z
    .string()
    .max(100, validationMessages.max("Industry", 100))
    .optional(),
  serviceCompetitiveAdvantage: z
    .string()
    .max(300, validationMessages.max("Competitive advantage", 300))
    .optional(),
  includeCallToAction: z.boolean().default(false),
});

// Page content schema
export const pageContentFormSchema = baseContentSchema.extend({
  pageType: z.enum([
    "homepage",
    "about",
    "contact",
    "landing",
    "product",
    "general",
  ] as const),
  keywords: z
    .string()
    .optional()
    .transform(
      (val) =>
        val
          ?.split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0) || []
    ),
});

// Email template schema
export const emailTemplateFormSchema = baseContentSchema.extend({
  audience: z
    .string()
    .min(1, validationMessages.required("Target audience"))
    .max(200, validationMessages.max("Target audience", 200)),
  includeSubject: z.boolean().default(true),
});

// Marketing copy schema
export const marketingCopyFormSchema = baseContentSchema.extend({
  audience: z
    .string()
    .min(1, validationMessages.required("Target audience"))
    .max(200, validationMessages.max("Target audience", 200)),
  marketingCopyType: z.enum([
    "headline",
    "social-post",
    "ad-copy",
    "landing-page",
  ] as const),
  keyBenefits: z
    .array(z.string().min(1, "Benefit cannot be empty"))
    .max(8, "Maximum 8 benefits allowed"),
});

// Content type form schemas map
export const contentTypeSchemas = {
  "blog-post": blogPostFormSchema,
  "service-description": serviceDescriptionFormSchema,
  "page-content": pageContentFormSchema,
  "email-template": emailTemplateFormSchema,
  "marketing-copy": marketingCopyFormSchema,
} as const;

// Type exports
export type BlogPostFormData = z.infer<typeof blogPostFormSchema>;
export type ServiceDescriptionFormData = z.infer<
  typeof serviceDescriptionFormSchema
>;
export type PageContentFormData = z.infer<typeof pageContentFormSchema>;
export type EmailTemplateFormData = z.infer<typeof emailTemplateFormSchema>;
export type MarketingCopyFormData = z.infer<typeof marketingCopyFormSchema>;

// Union type for all form data
export type ContentFormData =
  | BlogPostFormData
  | ServiceDescriptionFormData
  | PageContentFormData
  | EmailTemplateFormData
  | MarketingCopyFormData;

// Helper function to get schema for content type
export const getSchemaForContentType = (contentType: ContentType) => {
  return contentTypeSchemas[contentType];
};
