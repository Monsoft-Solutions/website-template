import { z } from "zod";

// Common validation messages
const validationMessages = {
  required: (field: string) => `${field} is required`,
  min: (field: string, min: number) =>
    `${field} must be at least ${min} characters`,
  max: (field: string, max: number) =>
    `${field} must be at most ${max} characters`,
  url: "Please enter a valid URL",
  slug: "Slug can only contain lowercase letters, numbers, and hyphens",
};

// Individual field schemas
export const titleSchema = z
  .string()
  .min(1, validationMessages.required("Title"))
  .min(3, validationMessages.min("Title", 3))
  .max(200, validationMessages.max("Title", 200));

export const slugSchema = z
  .string()
  .min(1, validationMessages.required("Slug"))
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, validationMessages.slug)
  .max(100, validationMessages.max("Slug", 100));

export const excerptSchema = z
  .string()
  .min(1, validationMessages.required("Excerpt"))
  .min(10, validationMessages.min("Excerpt", 10))
  .max(300, validationMessages.max("Excerpt", 300));

export const contentSchema = z
  .string()
  .min(1, validationMessages.required("Content"))
  .min(50, validationMessages.min("Content", 50));

export const featuredImageSchema = z
  .string()
  .url(validationMessages.url)
  .optional()
  .or(z.literal(""));

export const authorIdSchema = z
  .string()
  .min(1, validationMessages.required("Author"));

export const categoryIdSchema = z
  .string()
  .min(1, validationMessages.required("Category"));

export const statusSchema = z.enum(["draft", "published", "archived"]);

export const metaTitleSchema = z
  .string()
  .max(60, validationMessages.max("Meta Title", 60))
  .optional();

export const metaDescriptionSchema = z
  .string()
  .max(160, validationMessages.max("Meta Description", 160))
  .optional();

export const metaKeywordsSchema = z
  .string()
  .max(200, validationMessages.max("Meta Keywords", 200))
  .optional();

export const tagIdsSchema = z.array(z.string());

// Main blog post form schema
export const blogPostFormSchema = z.object({
  title: titleSchema,
  slug: slugSchema,
  excerpt: excerptSchema,
  content: contentSchema,
  featuredImage: featuredImageSchema,
  authorId: authorIdSchema,
  categoryId: categoryIdSchema,
  status: statusSchema,
  metaTitle: metaTitleSchema,
  metaDescription: metaDescriptionSchema,
  metaKeywords: metaKeywordsSchema,
  tagIds: tagIdsSchema,
});

// Infer the TypeScript type from the schema
export type BlogPostFormData = z.infer<typeof blogPostFormSchema>;

// Schema for creating new tags
export const newTagSchema = z.object({
  name: z
    .string()
    .min(1, validationMessages.required("Tag name"))
    .min(2, validationMessages.min("Tag name", 2))
    .max(50, validationMessages.max("Tag name", 50)),
});

export type NewTagData = z.infer<typeof newTagSchema>;
