import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema/gallery-image.table";
import { galleryGroups } from "@/lib/db/schema/gallery-group.table";
import { galleryImageGroups } from "@/lib/db/schema/gallery-image-group.table";
import { eq, and, or, ilike, desc, asc, sql, inArray } from "drizzle-orm";
import { requireAdmin, getCurrentUser } from "@/lib/auth/server";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type {
  GalleryImage,
  NewGalleryImage,
  ImageMetadata,
} from "@/lib/types/gallery-image.type";
import type { GalleryImageWithDetails } from "@/lib/types/gallery-with-relations.type";

/**
 * Admin Gallery Images List Response Type
 */
export interface AdminGalleryListResponse {
  images: GalleryImageWithDetails[];
  totalImages: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * GET endpoint - Fetch gallery images with admin filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Add authentication check - only admin users can access gallery management
    await requireAdmin();

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const groupId = searchParams.get("groupId") || undefined;
    const searchQuery = searchParams.get("searchQuery") || undefined;
    const isAvailable = searchParams.get("isAvailable");
    const isFeatured = searchParams.get("isFeatured");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json(
        {
          success: false,
          data: {} as AdminGalleryListResponse,
          error: "Invalid page number",
        } as ApiResponse<AdminGalleryListResponse>,
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        {
          success: false,
          data: {} as AdminGalleryListResponse,
          error: "Invalid limit. Must be between 1 and 50",
        } as ApiResponse<AdminGalleryListResponse>,
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];

    // Add group filter
    if (groupId) {
      // Images that belong to the specified group
      const imagesInGroup = db
        .select({ imageId: galleryImageGroups.imageId })
        .from(galleryImageGroups)
        .where(eq(galleryImageGroups.groupId, groupId));

      whereConditions.push(inArray(galleryImages.id, imagesInGroup));
    }

    // Add search query filter
    if (searchQuery) {
      whereConditions.push(
        or(
          ilike(galleryImages.name, `%${searchQuery}%`),
          ilike(galleryImages.altText, `%${searchQuery}%`),
          ilike(galleryImages.description, `%${searchQuery}%`)
        )
      );
    }

    // Add availability filter
    if (isAvailable === "true") {
      whereConditions.push(eq(galleryImages.isAvailable, true));
    } else if (isAvailable === "false") {
      whereConditions.push(eq(galleryImages.isAvailable, false));
    }

    // Add featured filter
    if (isFeatured === "true") {
      whereConditions.push(eq(galleryImages.isFeatured, true));
    } else if (isFeatured === "false") {
      whereConditions.push(eq(galleryImages.isFeatured, false));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Build order by clause
    const orderByField =
      sortBy === "name"
        ? galleryImages.name
        : sortBy === "displayOrder"
          ? galleryImages.displayOrder
          : sortBy === "fileSize"
            ? galleryImages.fileSize
            : galleryImages.createdAt;

    const orderByClause =
      sortOrder === "asc" ? asc(orderByField) : desc(orderByField);

    // Get total count
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(galleryImages)
      .where(whereClause);

    const totalImages = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalImages / limit);

    // Get images with group information
    const imagesResult = await db
      .select({
        image: galleryImages,
        groupCount:
          sql<number>`count(DISTINCT ${galleryImageGroups.groupId})`.as(
            "group_count"
          ),
      })
      .from(galleryImages)
      .leftJoin(
        galleryImageGroups,
        eq(galleryImages.id, galleryImageGroups.imageId)
      )
      .where(whereClause)
      .groupBy(galleryImages.id)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get group details for each image
    const imageIds = imagesResult.map((item) => item.image.id);
    const groupsData =
      imageIds.length > 0
        ? await db
            .select({
              imageId: galleryImageGroups.imageId,
              group: galleryGroups,
              displayOrder: galleryImageGroups.displayOrder,
            })
            .from(galleryImageGroups)
            .leftJoin(
              galleryGroups,
              eq(galleryImageGroups.groupId, galleryGroups.id)
            )
            .where(inArray(galleryImageGroups.imageId, imageIds))
        : [];

    // Build response with group information
    const imagesWithDetails: GalleryImageWithDetails[] = imagesResult.map(
      (item) => {
        const imageGroups = groupsData
          .filter((g) => g.imageId === item.image.id && g.group)
          .map((g) => ({
            id: g.group!.id,
            name: g.group!.name,
            displayOrder: g.displayOrder,
          }));

        return {
          ...item.image,
          groups: imageGroups,
          groupCount: item.groupCount,
        };
      }
    );

    const response: AdminGalleryListResponse = {
      images: imagesWithDetails,
      totalImages,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return NextResponse.json({
      success: true,
      data: response,
    } as ApiResponse<AdminGalleryListResponse>);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      {
        success: false,
        data: {} as AdminGalleryListResponse,
        error: error instanceof Error ? error.message : "Internal server error",
        message: "Failed to fetch gallery images",
      } as ApiResponse<AdminGalleryListResponse>,
      { status: 500 }
    );
  }
}

/**
 * POST endpoint - Create new gallery image record
 */
export async function POST(request: NextRequest) {
  try {
    // Add authentication check - only admin users can create gallery images
    await requireAdmin();

    // Get current user for metadata
    const currentUser = await getCurrentUser();

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.altText || !data.fileUrl) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Name, alt text, and file URL are required",
        } as ApiResponse<GalleryImage | null>,
        { status: 400 }
      );
    }

    const fileUrl: string = data.fileUrl;

    if (!fileUrl || typeof fileUrl !== "string") {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Invalid file URL. Please upload the file first.",
        } as ApiResponse<GalleryImage | null>,
        { status: 400 }
      );
    }

    // Extract file information from URL
    const fileName = fileUrl.split("/").pop() || "unknown";
    const mimeType = fileName.toLowerCase().endsWith(".png")
      ? "image/png"
      : fileName.toLowerCase().endsWith(".jpg") ||
          fileName.toLowerCase().endsWith(".jpeg")
        ? "image/jpeg"
        : fileName.toLowerCase().endsWith(".webp")
          ? "image/webp"
          : fileName.toLowerCase().endsWith(".gif")
            ? "image/gif"
            : "image/jpeg";

    // Create metadata
    const metadata: ImageMetadata = {
      uploadedBy: currentUser?.id,
      uploadedAt: new Date().toISOString(),
      originalFileName: fileName,
      processingInfo: {
        resized: false,
        compressed: false,
        thumbnailGenerated: false,
      },
    };

    // Create new gallery image record
    const newImageData: NewGalleryImage = {
      name: data.name,
      altText: data.altText,
      description: data.description || null,
      fileName,
      originalUrl: fileUrl,
      thumbnailUrl: null, // TODO: Generate thumbnail
      optimizedUrl: null, // TODO: Generate optimized version
      fileSize: 0, // TODO: Get actual file size
      width: null,
      height: null,
      mimeType,
      displayOrder: 0,
      isAvailable: data.isAvailable,
      isFeatured: data.isFeatured,
      metadata,
    };

    const [newImage] = await db
      .insert(galleryImages)
      .values(newImageData)
      .returning();

    // Associate with groups if provided
    if (data.groupIds && data.groupIds.length > 0) {
      const groupAssociations = data.groupIds.map(
        (groupId: string, index: number) => ({
          imageId: newImage.id,
          groupId,
          displayOrder: index,
        })
      );

      await db.insert(galleryImageGroups).values(groupAssociations);
    }

    return NextResponse.json(
      {
        success: true,
        data: newImage,
        message: "Gallery image created successfully",
      } as ApiResponse<GalleryImage>,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating gallery image:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create gallery image",
      } as ApiResponse<GalleryImage | null>,
      { status: 500 }
    );
  }
}
