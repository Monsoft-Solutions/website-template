import { z } from "zod";

// Common validation messages
export const validationMessages = {
  required: (field: string) => `${field} is required`,
  email: "Please enter a valid email address",
  min: (field: string, length: number) =>
    `${field} must be at least ${length} characters`,
  max: (field: string, length: number) =>
    `${field} must be at most ${length} characters`,
  url: "Please enter a valid URL",
  phone: "Please enter a valid phone number",
};

// Common field schemas
export const emailSchema = z
  .string()
  .min(1, validationMessages.required("Email"))
  .email(validationMessages.email);

export const nameSchema = z
  .string()
  .min(1, validationMessages.required("Name"))
  .min(2, validationMessages.min("Name", 2))
  .max(100, validationMessages.max("Name", 100));

export const phoneSchema = z
  .string()
  .regex(/^[\d\s()+-]+$/, validationMessages.phone)
  .optional();

export const urlSchema = z.string().url(validationMessages.url).optional();

// Contact form schema
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(1, validationMessages.required("Subject")).optional(),
  message: z
    .string()
    .min(1, validationMessages.required("Message"))
    .min(10, validationMessages.min("Message", 10))
    .max(1000, validationMessages.max("Message", 1000)),
});

// Blog comment schema
export const blogCommentSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  comment: z
    .string()
    .min(1, validationMessages.required("Comment"))
    .min(3, validationMessages.min("Comment", 3))
    .max(500, validationMessages.max("Comment", 500)),
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: emailSchema,
});

// Type exports
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type BlogCommentData = z.infer<typeof blogCommentSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;
