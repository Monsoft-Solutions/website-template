import { NextResponse } from "next/server";
import { getPublicGalleryGroups } from "@/lib/api/gallery.service";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { GalleryGroupWithImages } from "@/lib/types/gallery-with-relations.type";

/**
 * GET endpoint - Fetch public gallery groups
 * Available to all users, only returns active groups with available images
 */
export async function GET() {
  try {
    // Fetch gallery groups using the service
    const result = await getPublicGalleryGroups();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          data: [],
          error: result.error,
        } as ApiResponse<GalleryGroupWithImages[]>,
        { status: 500 }
      );
    }

    // Add cache headers for better performance
    const response = NextResponse.json(
      {
        success: true,
        data: result.data,
        message: "Gallery groups fetched successfully",
      } as ApiResponse<GalleryGroupWithImages[]>,
      { status: 200 }
    );

    // Cache for 1 hour
    response.headers.set(
      "Cache-Control",
      "public, max-age=3600, s-maxage=3600"
    );

    return response;
  } catch (error) {
    console.error("Error fetching public gallery groups:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch gallery groups",
      } as ApiResponse<GalleryGroupWithImages[]>,
      { status: 500 }
    );
  }
}
