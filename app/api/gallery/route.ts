import { NextRequest, NextResponse } from "next/server";
import { getPublicGalleryImages } from "@/lib/api/gallery.service";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { PublicGalleryListResponse } from "@/lib/api/gallery.service";

/**
 * GET endpoint - Fetch public gallery images
 * Available to all users, only returns images marked as available
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const groupSlug = searchParams.get("groupSlug") || undefined;
    const featured = searchParams.get("featured") === "true";

    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json(
        {
          success: false,
          data: {} as PublicGalleryListResponse,
          error: "Invalid page number",
        } as ApiResponse<PublicGalleryListResponse>,
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        {
          success: false,
          data: {} as PublicGalleryListResponse,
          error: "Invalid limit. Must be between 1 and 50",
        } as ApiResponse<PublicGalleryListResponse>,
        { status: 400 }
      );
    }

    // Fetch gallery images using the service
    const result = await getPublicGalleryImages({
      page,
      limit,
      groupSlug,
      featured,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          data: {} as PublicGalleryListResponse,
          error: result.error,
        } as ApiResponse<PublicGalleryListResponse>,
        { status: 404 }
      );
    }

    // Add cache headers for better performance
    const response = NextResponse.json(
      {
        success: true,
        data: result.data,
        message: "Gallery images fetched successfully",
      } as ApiResponse<PublicGalleryListResponse>,
      { status: 200 }
    );

    // Cache for 30 minutes
    response.headers.set(
      "Cache-Control",
      "public, max-age=1800, s-maxage=1800"
    );

    return response;
  } catch (error) {
    console.error("Error fetching public gallery images:", error);
    return NextResponse.json(
      {
        success: false,
        data: {} as PublicGalleryListResponse,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch gallery images",
      } as ApiResponse<PublicGalleryListResponse>,
      { status: 500 }
    );
  }
}
