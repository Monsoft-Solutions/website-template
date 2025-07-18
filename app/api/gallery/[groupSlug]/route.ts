import { NextRequest, NextResponse } from "next/server";
import { getPublicGalleryGroupWithImages } from "@/lib/api/gallery.service";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { GalleryGroupWithImages } from "@/lib/types/gallery-with-relations.type";

/**
 * GET endpoint - Fetch a specific gallery group with its images
 * Available to all users, only returns active group with available images
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupSlug: string }> }
) {
  try {
    const { groupSlug } = await params;
    const { searchParams } = new URL(request.url);

    // Parse pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Invalid page number",
        } as ApiResponse<GalleryGroupWithImages | null>,
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Invalid limit. Must be between 1 and 50",
        } as ApiResponse<GalleryGroupWithImages | null>,
        { status: 400 }
      );
    }

    // Fetch gallery group with images using the service
    const result = await getPublicGalleryGroupWithImages(
      groupSlug,
      page,
      limit
    );

    if (!result.success || !result.data) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: result.error || "Gallery group not found",
        } as ApiResponse<GalleryGroupWithImages | null>,
        { status: 404 }
      );
    }

    // Add cache headers for better performance
    const response = NextResponse.json(
      {
        success: true,
        data: result.data,
        message: "Gallery group fetched successfully",
      } as ApiResponse<GalleryGroupWithImages>,
      { status: 200 }
    );

    // Cache for 30 minutes
    response.headers.set(
      "Cache-Control",
      "public, max-age=1800, s-maxage=1800"
    );

    return response;
  } catch (error) {
    console.error("Error fetching public gallery group:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch gallery group",
      } as ApiResponse<GalleryGroupWithImages | null>,
      { status: 500 }
    );
  }
}
