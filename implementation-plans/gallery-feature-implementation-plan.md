# Gallery Feature Implementation Plan

## 📖 Overview

This implementation plan outlines the creation of a comprehensive gallery management system for website admins. The gallery will allow administrators to upload, organize, and manage images for their business website with full CRUD operations, grouping capabilities, and availability controls.

## 🎯 Feature Requirements

### Core Features

- **Image Upload**: Upload new images with file validation and processing
- **Image Management**: Edit image metadata (name, alt text, availability status)
- **Image Grouping**: Organize images into logical groups/categories
- **Availability Control**: Toggle image visibility on the public website
- **Admin Interface**: Full CRUD operations through the admin dashboard
- **Responsive Design**: Mobile-friendly gallery management interface
- **Search & Filter**: Find images by name, group, or availability status
- **Bulk Operations**: Select and manage multiple images at once

### Technical Requirements

- **File Upload**: Support for common image formats (JPEG, PNG, WebP, GIF)
- **Image Optimization**: Automatic resizing and compression
- **Storage**: Cloud storage integration (AWS S3/Cloudinary/Vercel Blob)
- **Database**: Proper schema with relations and indexing
- **API Routes**: RESTful endpoints following Next.js 15 patterns
- **Type Safety**: Full TypeScript implementation
- **Authentication**: Admin-only access with proper auth checks
- **Performance**: Pagination and lazy loading for large galleries

## 📁 Project Structure

```
lib/db/schema/
├── gallery-image.table.ts        # Main gallery images table
├── gallery-group.table.ts        # Gallery groups/categories table
└── gallery-image-group.table.ts  # Many-to-many junction table

lib/types/
├── gallery-image.type.ts          # Gallery image types
├── gallery-group.type.ts          # Gallery group types
└── gallery-with-relations.type.ts # Extended types with relations

app/api/admin/gallery/
├── route.ts                       # List and create gallery images
├── [id]/route.ts                  # Update and delete individual images
├── groups/route.ts                # Manage gallery groups
├── groups/[id]/route.ts           # Update and delete groups
└── upload/route.ts                # Handle file uploads

app/(admin)/admin/gallery/
├── page.tsx                       # Main gallery management page
├── new/page.tsx                   # Create new gallery image
├── [id]/edit/page.tsx             # Edit gallery image
└── groups/page.tsx                # Manage gallery groups

components/admin/gallery/
├── GalleryGrid.tsx                # Gallery image grid component
├── GalleryImageCard.tsx           # Individual image card component
├── GalleryImageForm.tsx           # Image creation/edit form
├── GalleryUpload.tsx              # File upload component
├── GalleryGroupForm.tsx           # Group management form
├── GalleryFilters.tsx             # Search and filter controls
└── GalleryBulkActions.tsx         # Bulk operations component

lib/services/
└── image-upload.service.ts        # Image upload and processing service
```

---

## 🚀 Implementation Phases

### **Phase 1: Database Schema and Types**

#### 1.1 Create Database Schema Files

**File: `lib/db/schema/gallery-group.table.ts`**

```typescript
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

/**
 * Gallery groups for organizing images into logical categories
 * Examples: "Portfolio", "Team Photos", "Event Images", "Product Shots"
 */
export const galleryGroups = pgTable("gallery_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  coverImageId: uuid("cover_image_id"), // References a gallery image
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
```

**File: `lib/db/schema/gallery-image.table.ts`**

```typescript
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

/**
 * Gallery images for business website
 * Stores all uploaded images with metadata and organization
 */
export const galleryImages = pgTable("gallery_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  altText: varchar("alt_text", { length: 500 }).notNull(),
  description: text("description"),

  // File information
  fileName: varchar("file_name", { length: 500 }).notNull(),
  originalUrl: varchar("original_url", { length: 1000 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 1000 }),
  optimizedUrl: varchar("optimized_url", { length: 1000 }),

  // File metadata
  fileSize: integer("file_size").notNull(), // in bytes
  width: integer("width"),
  height: integer("height"),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),

  // Organization and availability
  displayOrder: integer("display_order").notNull().default(0),
  isAvailable: boolean("is_available").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),

  // Additional metadata (EXIF data, upload info, etc.)
  metadata: jsonb("metadata"),

  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
```

**File: `lib/db/schema/gallery-image-group.table.ts`**

```typescript
import {
  pgTable,
  uuid,
  foreignKey,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import { galleryImages } from "./gallery-image.table";
import { galleryGroups } from "./gallery-group.table";

/**
 * Junction table for many-to-many relationship between gallery images and groups
 * Allows images to belong to multiple groups
 */
export const galleryImageGroups = pgTable(
  "gallery_image_groups",
  {
    imageId: uuid("image_id").notNull(),
    groupId: uuid("group_id").notNull(),
    displayOrder: integer("display_order").notNull().default(0),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.imageId, table.groupId] }),
    imageFk: foreignKey({
      columns: [table.imageId],
      foreignColumns: [galleryImages.id],
      name: "gallery_image_groups_image_id_fk",
    }),
    groupFk: foreignKey({
      columns: [table.groupId],
      foreignColumns: [galleryGroups.id],
      name: "gallery_image_groups_group_id_fk",
    }),
  })
);
```

#### 1.2 Create Type Definitions

**File: `lib/types/gallery-image.type.ts`**

```typescript
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { galleryImages } from "@/lib/db/schema/gallery-image.table";

/**
 * Type definitions for gallery images
 */
export type GalleryImage = InferSelectModel<typeof galleryImages>;
export type NewGalleryImage = InferInsertModel<typeof galleryImages>;

/**
 * Gallery image creation data (for forms)
 */
export type GalleryImageCreateData = {
  name: string;
  altText: string;
  description?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  groupIds: string[];
  file: File;
};

/**
 * Gallery image update data (for forms)
 */
export type GalleryImageUpdateData = {
  name: string;
  altText: string;
  description?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  displayOrder: number;
  groupIds: string[];
};

/**
 * Image metadata interface
 */
export interface ImageMetadata {
  uploadedBy?: string;
  uploadedAt?: string;
  originalFileName?: string;
  exifData?: Record<string, any>;
  processingInfo?: {
    resized: boolean;
    compressed: boolean;
    thumbnailGenerated: boolean;
  };
}
```

**File: `lib/types/gallery-group.type.ts`**

```typescript
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { galleryGroups } from "@/lib/db/schema/gallery-group.table";

/**
 * Type definitions for gallery groups
 */
export type GalleryGroup = InferSelectModel<typeof galleryGroups>;
export type NewGalleryGroup = InferInsertModel<typeof galleryGroups>;

/**
 * Gallery group creation/update data
 */
export type GalleryGroupFormData = {
  name: string;
  slug: string;
  description?: string;
  coverImageId?: string;
  displayOrder: number;
  isActive: boolean;
};
```

**File: `lib/types/gallery-with-relations.type.ts`**

```typescript
import { GalleryImage } from "./gallery-image.type";
import { GalleryGroup } from "./gallery-group.type";

/**
 * Gallery image with associated groups
 */
export type GalleryImageWithGroups = GalleryImage & {
  groups: (GalleryGroup & { displayOrder: number })[];
};

/**
 * Gallery group with associated images
 */
export type GalleryGroupWithImages = GalleryGroup & {
  images: (GalleryImage & { displayOrder: number })[];
  imageCount: number;
  coverImage?: GalleryImage;
};

/**
 * Extended gallery image for admin list view
 */
export type GalleryImageWithDetails = GalleryImage & {
  groups: { id: string; name: string; displayOrder: number }[];
  groupCount: number;
};
```

#### 1.3 Update Schema Relations

**Add to `lib/db/schema/relations.ts`**

```typescript
// Gallery relations
export const galleryImagesRelations = relations(galleryImages, ({ many }) => ({
  imageGroups: many(galleryImageGroups),
}));

export const galleryGroupsRelations = relations(
  galleryGroups,
  ({ many, one }) => ({
    imageGroups: many(galleryImageGroups),
    coverImage: one(galleryImages, {
      fields: [galleryGroups.coverImageId],
      references: [galleryImages.id],
    }),
  })
);

export const galleryImageGroupsRelations = relations(
  galleryImageGroups,
  ({ one }) => ({
    image: one(galleryImages, {
      fields: [galleryImageGroups.imageId],
      references: [galleryImages.id],
    }),
    group: one(galleryGroups, {
      fields: [galleryImageGroups.groupId],
      references: [galleryGroups.id],
    }),
  })
);
```

#### 1.4 Update Schema Index

**Update `lib/db/schema/index.ts`**

```typescript
// Add gallery exports
export * from "./gallery-image.table";
export * from "./gallery-group.table";
export * from "./gallery-image-group.table";
```

---

### **Phase 2: File Upload Integration**

#### 2.1 Use Existing Blob Upload Service

**Requirements:**

- Integrate with existing `lib/utils/blob-upload.ts` service
- Upload images to `gallery` folder instead of `blog` folder
- Validate image files using existing validation logic
- Store upload metadata in gallery database schema

**Key Integration Points:**

- Use `uploadToBlob()` function with `folder: "gallery"` option
- Leverage existing file validation and size limits (5MB max)
- Support same image formats: JPEG, PNG, WebP, GIF
- Generate thumbnail versions for gallery grid display (optional optimization)

**Upload Flow:**

1. Admin selects image file(s) in gallery upload form
2. Client-side validation using existing blob upload patterns
3. Upload to Vercel Blob with `gallery/` prefix
4. Store returned URL and metadata in gallery images table
5. Generate thumbnails if needed for performance (future enhancement)

---

### **Phase 3: API Routes**

#### 3.1 Gallery Images API Routes

**Requirements:**

- Follow Next.js 15 async params pattern (as established in project)
- Use existing admin authentication via `requireAdmin()`
- Implement standard CRUD operations with proper error handling
- Support pagination, search, and filtering for gallery lists
- Use existing `ApiResponse<T>` wrapper pattern
- Handle file upload integration with blob service

**Endpoints Needed:**

- `GET /api/admin/gallery` - List images with filters/pagination
- `POST /api/admin/gallery` - Create new gallery image record
- `GET /api/admin/gallery/[id]` - Get single image with groups
- `PATCH /api/admin/gallery/[id]` - Update image metadata
- `DELETE /api/admin/gallery/[id]` - Delete image and cleanup files
- `POST /api/admin/gallery/upload` - Handle file upload via blob service

---

### **Phase 4: Frontend Components and Pages**

#### 4.1 Gallery Management Interface

**Requirements:**

- Admin gallery page following existing admin dashboard patterns
- Use existing `PageHeader`, `DataTable`, and admin components
- Responsive grid/list view for images with thumbnails
- Search and filter functionality (by name, group, availability)
- Bulk selection and operations (delete, toggle availability, feature/unfeature)
- Image upload form with drag-and-drop support

**Component Structure:**

- `GalleryGrid` - Main gallery display component
- `GalleryImageCard` - Individual image card for grid/list view
- `GalleryFilters` - Search and filter controls
- `GalleryUpload` - File upload component
- `GalleryImageForm` - Image metadata editing form
- `GalleryGroupForm` - Group management form

#### 4.2 Public Gallery Integration

**Requirements:**

- Create gallery components for (site) pages
- Public gallery display with filtering by group
- Responsive image grid with lightbox/modal view
- Only show images marked as "available"
- SEO-optimized image rendering with proper alt text
- Integration with existing site components and styling

**Public Components:**

- `PublicGallery` - Main public gallery display
- `GalleryImageModal` - Lightbox for image viewing
- `GalleryGroupFilter` - Filter by group on public site

---

### **Phase 5: Site Integration**

#### 5.1 Public Gallery Pages

**Requirements:**

- Create gallery pages in `app/(site)/gallery/`
- Main gallery page listing all available images
- Individual group pages (e.g., `/gallery/portfolio`, `/gallery/team`)
- Dynamic routing for gallery groups using slugs
- SEO metadata for gallery pages
- Integration with existing site layout and navigation

**Page Structure:**

- `app/(site)/gallery/page.tsx` - Main gallery page
- `app/(site)/gallery/[slug]/page.tsx` - Individual group pages

#### 5.2 API Routes for Public Gallery

**Requirements:**

- `GET /api/gallery` - Public API for available images
- `GET /api/gallery/groups` - Public API for gallery groups
- `GET /api/gallery/[groupSlug]` - Images for specific group
- Cached responses for better performance
- Only return images with `isAvailable: true`

---

### **Phase 6: Additional Features and Hooks**

#### 6.1 Custom React Hooks

**Requirements:**

- `useAdminGallery` - Hook for admin gallery management with filtering/pagination
- `usePublicGallery` - Hook for public gallery display
- Follow existing hook patterns in the project
- Include proper error handling and loading states

---

## 🧪 Testing Strategy

### Testing Requirements

- **Unit Tests** - Components, hooks, and utility functions
- **Integration Tests** - API routes and database operations
- **E2E Tests** - Complete admin workflow (upload, edit, delete, organize)
- **Visual Tests** - Gallery layouts and responsive behavior
- Follow existing testing patterns in the project

---

## 📊 Performance Considerations

### Optimization Requirements

- **Image Loading** - Lazy loading, progressive enhancement, WebP format
- **Database Performance** - Proper indexing on frequently queried columns
- **Caching** - CDN for images, API response caching where appropriate
- **Pagination** - Limit large data sets for better load times

---

## 🔒 Security Considerations

### Security Requirements

- **Admin Authentication** - Use existing `requireAdmin()` for all admin operations
- **File Upload Validation** - Leverage existing blob upload validation
- **Access Control** - Proper permissions for image management
- **Input Sanitization** - Validate all user inputs for image metadata

---

## 🚀 Deployment and Migration

### Migration Requirements

- **Database Schema** - Generate and test migrations in staging
- **File Storage** - Configure blob storage for gallery folder
- **Environment Variables** - Update for any new configuration needed
- **Testing** - Full functionality testing before production deployment

---

## 📈 Future Enhancements

### Potential Phase 7+ Features

- **AI-powered tagging** for automatic image categorization
- **Bulk import** from external sources
- **Image editing tools** (crop, filters, text overlay)
- **Advanced analytics** (view counts, popular images)
- **Multi-language support** for image metadata
- **Public API** for frontend gallery widgets

---

This streamlined implementation plan focuses on high-level requirements and integration points while leveraging your existing codebase patterns and infrastructure. The plan emphasizes:

1. **Database Schema** - Following your Drizzle ORM patterns
2. **File Upload Integration** - Using your existing blob upload service
3. **Admin Interface** - Following your established admin dashboard patterns
4. **Public Gallery** - Integration with your (site) pages
5. **API Design** - Following your Next.js 15 and authentication patterns

Each phase builds upon the previous one while maintaining compatibility with your existing codebase structure and conventions.
