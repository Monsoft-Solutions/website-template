# Service Database Migration Guide

This document outlines the migration from static service data to a normalized database structure.

## What Was Created

### Database Schema

- **Main service table**: `services` - Core service information
- **Related tables**: 12 normalized tables for features, benefits, process steps, pricing, etc.
- **Relationships**: Proper foreign key relationships between all tables
- **Many-to-many**: Service relationships for related services

### Files Created

```
lib/db/schema/
├── service-category.enum.ts          # Service category enum
├── service.table.ts                  # Main services table
├── service-feature.table.ts          # Service features
├── service-benefit.table.ts          # Service benefits
├── service-process-step.table.ts     # Process steps
├── service-pricing-tier.table.ts     # Pricing tiers
├── service-pricing-feature.table.ts  # Pricing tier features
├── service-technology.table.ts       # Technologies used
├── service-deliverable.table.ts      # Service deliverables
├── service-gallery-image.table.ts    # Gallery images
├── service-testimonial.table.ts      # Customer testimonials
├── service-faq.table.ts              # FAQ entries
├── service-related.table.ts          # Related services (M:M)
├── service*.type.ts                  # Type definitions for all tables
└── service-with-relations.type.ts    # Complete service with relations

lib/db/seed/operations/
└── 06-services.seed.ts               # Seed file with all service data
```

## Migration Steps

### 1. Generate Migrations

```bash
npm run db:generate
```

### 2. Review Generated Migrations

Check the generated migration files in `lib/db/migrations/` to ensure they look correct.

### 3. Run Migrations

```bash
npm run db:migrate
```

### 4. Seed the Database

```bash
npm run db:seed
```

## Usage Examples

### Basic Service Query

```typescript
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";

const allServices = await db.select().from(services);
```

### Service with All Relations

```typescript
import { db } from "@/lib/db";
import { services, serviceFeatures, serviceBenefits } from "@/lib/db/schema";

const serviceWithDetails = await db
  .select()
  .from(services)
  .leftJoin(serviceFeatures, eq(services.id, serviceFeatures.serviceId))
  .leftJoin(serviceBenefits, eq(services.id, serviceBenefits.serviceId))
  .where(eq(services.slug, "web-development"));
```

### Using the Relations (Recommended)

```typescript
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";

const serviceWithRelations = await db.query.services.findFirst({
  where: eq(services.slug, "web-development"),
  with: {
    features: true,
    benefits: true,
    processSteps: true,
    pricingTiers: {
      with: {
        features: true,
      },
    },
    technologies: true,
    deliverables: true,
    galleryImages: true,
    testimonials: true,
    faqs: true,
    relatedServices: true,
  },
});
```

### Transform to Original Format

If you need to maintain backward compatibility with the original Service interface:

```typescript
import type {
  ServiceWithRelations,
  TransformedService,
} from "@/lib/types/service";

function transformServiceForBackwardCompatibility(
  serviceWithRelations: ServiceWithRelations
): TransformedService {
  return {
    id: serviceWithRelations.id,
    title: serviceWithRelations.title,
    slug: serviceWithRelations.slug,
    shortDescription: serviceWithRelations.shortDescription,
    fullDescription: serviceWithRelations.fullDescription,
    features: serviceWithRelations.features.map((f) => f.feature),
    benefits: serviceWithRelations.benefits.map((b) => b.benefit),
    process: serviceWithRelations.processSteps.map((ps) => ({
      step: ps.step,
      title: ps.title,
      description: ps.description,
      duration: ps.duration || undefined,
    })),
    pricing: serviceWithRelations.pricingTiers.map((pt) => ({
      name: pt.name,
      price: pt.price,
      description: pt.description,
      features: pt.features.map((f) => f.feature),
      popular: pt.popular || undefined,
    })),
    technologies: serviceWithRelations.technologies?.map((t) => t.technology),
    deliverables: serviceWithRelations.deliverables.map((d) => d.deliverable),
    timeline: serviceWithRelations.timeline,
    category: serviceWithRelations.category,
    featuredImage: serviceWithRelations.featuredImage,
    gallery: serviceWithRelations.galleryImages?.map((gi) => gi.imageUrl),
    testimonial: serviceWithRelations.testimonials[0]
      ? {
          quote: serviceWithRelations.testimonials[0].quote,
          author: serviceWithRelations.testimonials[0].author,
          company: serviceWithRelations.testimonials[0].company,
          avatar: serviceWithRelations.testimonials[0].avatar || undefined,
        }
      : undefined,
    faq: serviceWithRelations.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
    relatedServices: serviceWithRelations.relatedServices.map((rs) => rs.slug),
  };
}
```

## Benefits of the New Structure

1. **Normalization**: No more duplicate data
2. **Scalability**: Easy to add new services and modify existing ones
3. **Performance**: Efficient queries with proper indexing
4. **Maintainability**: Clear separation of concerns
5. **Extensibility**: Easy to add new fields or relationships
6. **Data Integrity**: Foreign key constraints ensure consistency

## Next Steps

1. Run the migration commands above
2. Update your service-related API routes to use the new database queries
3. Consider creating helper functions for common service queries
4. Remove the old `lib/data/services.ts` file once everything is working

## Rollback

If you need to rollback the changes:

```bash
npm run db:rollback
```

Then restore the original service data file.
