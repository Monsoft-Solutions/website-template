/**
 * Main schema export file
 * Centralized exports for database tables and relations only
 * Types and enums have been moved to /lib/types
 */

// Tables
export * from "./category.table";
export * from "./author.table";
export * from "./blog-post.table";
export * from "./tag.table";
export * from "./blog-post-tag.table";
export * from "./contact-submission.table";
export * from "./admin-comment.table";

// Enums
export * from "./enums/comment-entity-type.enum";
export * from "./service.table";
export * from "./service-feature.table";
export * from "./service-benefit.table";
export * from "./service-process-step.table";
export * from "./service-pricing-tier.table";
export * from "./service-pricing-feature.table";
export * from "./service-technology.table";
export * from "./service-deliverable.table";
export * from "./service-gallery-image.table";
export * from "./service-testimonial.table";
export * from "./service-faq.table";
export * from "./service-related.table";
export * from "./view-tracking.table";

// Site configuration
export * from "./site-config.table";

// Gallery tables
export * from "./gallery-image.table";
export * from "./gallery-group.table";
export * from "./gallery-image-group.table";

// Auth tables
export * from "./auth-schema";
export * from "./admin-activity-log.table";

// Relations
export * from "./relations";

// enums
export * from "./enums";
export * from "./auth-enums";
