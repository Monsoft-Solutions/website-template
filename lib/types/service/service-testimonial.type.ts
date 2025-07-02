import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { serviceTestimonials } from "@/lib/db/schema/service-testimonial.table";

/**
 * Type definitions for the service testimonials table
 */
export type ServiceTestimonial = InferSelectModel<typeof serviceTestimonials>;
export type NewServiceTestimonial = InferInsertModel<
  typeof serviceTestimonials
>;
