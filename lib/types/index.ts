// Service-related types (UI/Application types)
export type { Service } from "./service.type";
export type { ServiceCategory } from "./service-category.type";
export type { ProcessStep } from "./process-step.type";
export type { PricingTier } from "./pricing-tier.type";
export type { FAQ } from "./faq.type";
export type { Testimonial } from "./testimonial.type";

// Blog-related types (UI/Application types)
export type { BlogPostWithRelations } from "./blog-post-with-relations.type";
export type { BlogListOptions, BlogListResponse } from "./blog-list.type";

// UI Component types
export type { LazyImageProps } from "./lazy-image.type";

// Shared types
export type { ApiResponse } from "./api-response.type";
export type {
  ViewTracking,
  NewViewTracking,
  ContentViewStats,
  AnalyticsStats,
  AnalyticsTimePeriod,
  AnalyticsDataPoint,
  AnalyticsResponse,
} from "./view-tracking.type";
export type {
  ContactSubmissionResponse,
  ContactFormResponse,
} from "./contact-submission.type";

// Google Indexing types
export type {
  GoogleIndexingUrlType,
  GoogleIndexingUrl,
  GoogleIndexingResult,
  GoogleIndexingConfig,
  IndexableContentType,
  IndexingNotificationStatus,
  IndexingNotification,
  BulkIndexingRequest,
  IndexingOperationResponse,
} from "./google-indexing.type";

// Site configuration types
export type {
  SiteConfig,
  NewSiteConfig,
  SiteConfigData,
  SiteConfigFormData,
} from "./site-config.type";

// Gallery types
export type {
  GalleryImage,
  NewGalleryImage,
  GalleryImageCreateData,
  GalleryImageUpdateData,
  ImageMetadata,
} from "./gallery-image.type";
export type {
  GalleryGroup,
  NewGalleryGroup,
  GalleryGroupFormData,
} from "./gallery-group.type";
export type {
  GalleryImageWithGroups,
  GalleryGroupWithImages,
  GalleryImageWithDetails,
} from "./gallery-with-relations.type";

// Database entity types
export * from "./service";
export * from "./blog";
export * from "./contact";

// Enums
export * from "./enums";
