import { relations } from "drizzle-orm";
import { categories } from "./category.table";
import { authors } from "./author.table";
import { blogPosts } from "./blog-post.table";
import { tags } from "./tag.table";
import { blogPostsTags } from "./blog-post-tag.table";
import { services } from "./service.table";
import { serviceFeatures } from "./service-feature.table";
import { serviceBenefits } from "./service-benefit.table";
import { serviceProcessSteps } from "./service-process-step.table";
import { servicePricingTiers } from "./service-pricing-tier.table";
import { servicePricingFeatures } from "./service-pricing-feature.table";
import { serviceTechnologies } from "./service-technology.table";
import { serviceDeliverables } from "./service-deliverable.table";
import { serviceGalleryImages } from "./service-gallery-image.table";
import { serviceTestimonials } from "./service-testimonial.table";
import { serviceFaqs } from "./service-faq.table";
import { serviceRelated } from "./service-related.table";
import { user as users } from "./auth-schema";
import { session as sessions, account as accounts } from "./auth-schema";
import { adminActivityLogs } from "./admin-activity-log.table";
import { viewTracking } from "./view-tracking.table";

/**
 * Database relations definitions
 * Defines the relationships between different tables
 */

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(blogPosts),
}));

export const authorsRelations = relations(authors, ({ many }) => ({
  posts: many(blogPosts),
}));

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  author: one(authors, {
    fields: [blogPosts.authorId],
    references: [authors.id],
  }),
  category: one(categories, {
    fields: [blogPosts.categoryId],
    references: [categories.id],
  }),
  tags: many(blogPostsTags),
  views: many(viewTracking),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(blogPostsTags),
}));

export const blogPostsTagsRelations = relations(blogPostsTags, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogPostsTags.postId],
    references: [blogPosts.id],
  }),
  tag: one(tags, {
    fields: [blogPostsTags.tagId],
    references: [tags.id],
  }),
}));

// Service Relations

export const servicesRelations = relations(services, ({ many }) => ({
  features: many(serviceFeatures),
  benefits: many(serviceBenefits),
  processSteps: many(serviceProcessSteps),
  pricingTiers: many(servicePricingTiers),
  technologies: many(serviceTechnologies),
  deliverables: many(serviceDeliverables),
  galleryImages: many(serviceGalleryImages),
  testimonials: many(serviceTestimonials),
  faqs: many(serviceFaqs),
  relatedServices: many(serviceRelated, { relationName: "serviceToRelated" }),
  parentServices: many(serviceRelated, { relationName: "relatedToService" }),
  views: many(viewTracking),
}));

export const serviceFeaturesRelations = relations(
  serviceFeatures,
  ({ one }) => ({
    service: one(services, {
      fields: [serviceFeatures.serviceId],
      references: [services.id],
    }),
  })
);

export const serviceBenefitsRelations = relations(
  serviceBenefits,
  ({ one }) => ({
    service: one(services, {
      fields: [serviceBenefits.serviceId],
      references: [services.id],
    }),
  })
);

export const serviceProcessStepsRelations = relations(
  serviceProcessSteps,
  ({ one }) => ({
    service: one(services, {
      fields: [serviceProcessSteps.serviceId],
      references: [services.id],
    }),
  })
);

export const servicePricingTiersRelations = relations(
  servicePricingTiers,
  ({ one, many }) => ({
    service: one(services, {
      fields: [servicePricingTiers.serviceId],
      references: [services.id],
    }),
    features: many(servicePricingFeatures),
  })
);

export const servicePricingFeaturesRelations = relations(
  servicePricingFeatures,
  ({ one }) => ({
    pricingTier: one(servicePricingTiers, {
      fields: [servicePricingFeatures.pricingTierId],
      references: [servicePricingTiers.id],
    }),
  })
);

export const serviceTechnologiesRelations = relations(
  serviceTechnologies,
  ({ one }) => ({
    service: one(services, {
      fields: [serviceTechnologies.serviceId],
      references: [services.id],
    }),
  })
);

export const serviceDeliverablesRelations = relations(
  serviceDeliverables,
  ({ one }) => ({
    service: one(services, {
      fields: [serviceDeliverables.serviceId],
      references: [services.id],
    }),
  })
);

export const serviceGalleryImagesRelations = relations(
  serviceGalleryImages,
  ({ one }) => ({
    service: one(services, {
      fields: [serviceGalleryImages.serviceId],
      references: [services.id],
    }),
  })
);

export const serviceTestimonialsRelations = relations(
  serviceTestimonials,
  ({ one }) => ({
    service: one(services, {
      fields: [serviceTestimonials.serviceId],
      references: [services.id],
    }),
  })
);

export const serviceFaqsRelations = relations(serviceFaqs, ({ one }) => ({
  service: one(services, {
    fields: [serviceFaqs.serviceId],
    references: [services.id],
  }),
}));

export const serviceRelatedRelations = relations(serviceRelated, ({ one }) => ({
  service: one(services, {
    fields: [serviceRelated.serviceId],
    references: [services.id],
    relationName: "serviceToRelated",
  }),
  relatedService: one(services, {
    fields: [serviceRelated.relatedServiceId],
    references: [services.id],
    relationName: "relatedToService",
  }),
}));

// Auth Relations

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  activityLogs: many(adminActivityLogs),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const adminActivityLogsRelations = relations(
  adminActivityLogs,
  ({ one }) => ({
    user: one(users, {
      fields: [adminActivityLogs.userId],
      references: [users.id],
    }),
  })
);

// View Tracking Relations

export const viewTrackingRelations = relations(viewTracking, ({ one }) => ({
  blogPost: one(blogPosts, {
    fields: [viewTracking.contentId],
    references: [blogPosts.id],
  }),
  service: one(services, {
    fields: [viewTracking.contentId],
    references: [services.id],
  }),
}));
