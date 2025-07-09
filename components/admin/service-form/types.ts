import { z } from "zod";
import type { UseFormReturn } from "react-hook-form";

// Form validation schema
export const serviceFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  fullDescription: z.string().min(1, "Full description is required"),
  timeline: z.string().min(1, "Timeline is required"),
  category: z.enum([
    "Development",
    "Design",
    "Consulting",
    "Marketing",
    "Support",
  ]),
  featuredImage: z.string().min(1, "Featured image is required"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  benefits: z.array(z.string()).min(1, "At least one benefit is required"),
  technologies: z
    .array(z.string())
    .min(1, "At least one technology is required"),
  deliverables: z
    .array(z.string())
    .min(1, "At least one deliverable is required"),
  gallery: z.array(z.string()).optional(),
  faq: z
    .array(
      z.object({
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
      })
    )
    .optional(),
  process: z
    .array(
      z.object({
        step: z.number(),
        title: z.string().min(1, "Step title is required"),
        description: z.string().min(1, "Step description is required"),
        duration: z.string().optional(),
      })
    )
    .optional(),
  pricing: z
    .array(
      z.object({
        name: z.string().min(1, "Pricing tier name is required"),
        price: z.string().min(1, "Price is required"),
        description: z.string().min(1, "Description is required"),
        popular: z.boolean().optional(),
        features: z
          .array(z.string())
          .min(1, "At least one feature is required"),
      })
    )
    .optional(),
  testimonials: z
    .array(
      z.object({
        quote: z.string().min(1, "Quote is required"),
        author: z.string().min(1, "Author is required"),
        company: z.string().min(1, "Company is required"),
        avatar: z.string().optional(),
      })
    )
    .optional(),
  relatedServices: z.array(z.string()).optional(),
  status: z.enum(["draft", "published", "archived"]),
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;

// Step component props type
export interface StepProps {
  form: UseFormReturn<ServiceFormData>;
}

// Basic information step props
export interface BasicInformationStepProps extends StepProps {
  onTitleChange: (value: string) => void;
}

// Related services step props
export interface RelatedServicesStepProps extends StepProps {
  currentServiceId?: string;
}

// Pricing tier card props
export interface PricingTierCardProps {
  form: UseFormReturn<ServiceFormData>;
  index: number;
  onRemove: () => void;
}

// Testimonial card props
export interface TestimonialCardProps {
  form: UseFormReturn<ServiceFormData>;
  index: number;
  onRemove: () => void;
}

// Step configuration
export interface StepConfig {
  id: number;
  title: string;
  description: string;
}

export const STEPS: StepConfig[] = [
  {
    id: 1,
    title: "Basic Information",
    description: "Service title, description, and category",
  },
  {
    id: 2,
    title: "Features & Benefits",
    description: "Key features and benefits of the service",
  },
  {
    id: 3,
    title: "Process & Timeline",
    description: "Service delivery process and timeline",
  },
  {
    id: 4,
    title: "Pricing Tiers",
    description: "Service pricing options and packages",
  },
  { id: 5, title: "Technologies", description: "Technologies and tools used" },
  {
    id: 6,
    title: "Gallery & Media",
    description: "Service gallery images and media",
  },
  { id: 7, title: "FAQs", description: "Frequently asked questions" },
  {
    id: 8,
    title: "Testimonials",
    description: "Customer testimonials and reviews",
  },
  {
    id: 9,
    title: "Related Services",
    description: "Services related to this offering",
  },
];
