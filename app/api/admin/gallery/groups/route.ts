import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { galleryGroups } from "@/lib/db/schema/gallery-group.table";
import { galleryImages } from "@/lib/db/schema/gallery-image.table";
import { galleryImageGroups } from "@/lib/db/schema/gallery-image-group.table";
import { eq, and, or, ilike, desc, asc, sql, inArray } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/server";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type {
  GalleryGroup,
  NewGalleryGroup,
} from "@/lib/types/gallery-group.type";
import type { GalleryGroupWithImages } from "@/lib/types/gallery-with-relations.type";

/**
 * Admin Gallery Groups List Response Type
 */
export interface AdminGalleryGroupsListResponse {
  groups: GalleryGroupWithImages[];
  totalGroups: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * GET endpoint - Fetch gallery groups with admin filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Add authentication check - only admin users can access gallery groups management
    await requireAdmin();

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const searchQuery = searchParams.get("searchQuery") || undefined;
    const isActive = searchParams.get("isActive");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json(
        {
          success: false,
          data: {} as AdminGalleryGroupsListResponse,
          error: "Invalid page number",
        } as ApiResponse<AdminGalleryGroupsListResponse>,
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        {
          success: false,
          data: {} as AdminGalleryGroupsListResponse,
          error: "Invalid limit. Must be between 1 and 50",
        } as ApiResponse<AdminGalleryGroupsListResponse>,
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];

    // Add search query filter
    if (searchQuery) {
      whereConditions.push(
        or(
          ilike(galleryGroups.name, `%${searchQuery}%`),
          ilike(galleryGroups.slug, `%${searchQuery}%`),
          ilike(galleryGroups.description, `%${searchQuery}%`)
        )
      );
    }

    // Add active filter
    if (isActive === "true") {
      whereConditions.push(eq(galleryGroups.isActive, true));
    } else if (isActive === "false") {
      whereConditions.push(eq(galleryGroups.isActive, false));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Build order by clause
    const orderByField =
      sortBy === "name"
        ? galleryGroups.name
        : sortBy === "slug"
          ? galleryGroups.slug
          : sortBy === "displayOrder"
            ? galleryGroups.displayOrder
            : galleryGroups.createdAt;

    const orderByClause =
      sortOrder === "asc" ? asc(orderByField) : desc(orderByField);

    // Get total count
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(galleryGroups)
      .where(whereClause);

    const totalGroups = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalGroups / limit);

    // Get groups with image count
    const groupsResult = await db
      .select({
        group: galleryGroups,
        imageCount:
          sql<number>`count(DISTINCT ${galleryImageGroups.imageId})`.as(
            "image_count"
          ),
      })
      .from(galleryGroups)
      .leftJoin(
        galleryImageGroups,
        eq(galleryGroups.id, galleryImageGroups.groupId)
      )
      .where(whereClause)
      .groupBy(galleryGroups.id)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get cover images for groups that have them
    const coverImageIds = groupsResult
      .map((item) => item.group.coverImageId)
      .filter((id): id is string => id !== null);

    const coverImages =
      coverImageIds.length > 0
        ? await db
            .select()
            .from(galleryImages)
            .where(inArray(galleryImages.id, coverImageIds))
        : [];

    // Build response with cover image information
    const groupsWithDetails: GalleryGroupWithImages[] = groupsResult.map(
      (item) => {
        const coverImage = item.group.coverImageId
          ? coverImages.find((img) => img.id === item.group.coverImageId)
          : undefined;

        return {
          ...item.group,
          images: [], // We're not loading full images list here for performance
          imageCount: item.imageCount,
          coverImage,
        };
      }
    );

    const response: AdminGalleryGroupsListResponse = {
      groups: groupsWithDetails,
      totalGroups,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return NextResponse.json({
      success: true,
      data: response,
    } as ApiResponse<AdminGalleryGroupsListResponse>);
  } catch (error) {
    console.error("Error fetching gallery groups:", error);
    return NextResponse.json(
      {
        success: false,
        data: {} as AdminGalleryGroupsListResponse,
        error: error instanceof Error ? error.message : "Internal server error",
        message: "Failed to fetch gallery groups",
      } as ApiResponse<AdminGalleryGroupsListResponse>,
      { status: 500 }
    );
  }
}

/**
 * POST endpoint - Create new gallery group
 */
export async function POST(request: NextRequest) {
  try {
    // Add authentication check - only admin users can create gallery groups
    await requireAdmin();

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.slug) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Name and slug are required",
        } as ApiResponse<GalleryGroup | null>,
        { status: 400 }
      );
    }

    // Check if group with same name or slug already exists
    const existingGroup = await db
      .select()
      .from(galleryGroups)
      .where(
        or(eq(galleryGroups.name, data.name), eq(galleryGroups.slug, data.slug))
      )
      .limit(1);

    if (existingGroup.length > 0) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Gallery group with this name or slug already exists",
        } as ApiResponse<GalleryGroup | null>,
        { status: 409 }
      );
    }

    // Create new gallery group
    const newGroupData: NewGalleryGroup = {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      coverImageId: data.coverImageId || null,
      displayOrder: data.displayOrder || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
    };

    const [newGroup] = await db
      .insert(galleryGroups)
      .values(newGroupData)
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newGroup,
        message: "Gallery group created successfully",
      } as ApiResponse<GalleryGroup>,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating gallery group:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create gallery group",
      } as ApiResponse<GalleryGroup | null>,
      { status: 500 }
    );
  }
}
