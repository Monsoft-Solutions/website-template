import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/api/blog.service";
import type { BlogListOptions, BlogListResponse } from "@/lib/types";
import type { ApiResponse } from "@/lib/types/api-response.type";

/**
 * GET endpoint - Get blog posts with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    console.log("searchParams", searchParams);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const categorySlug = searchParams.get("categorySlug") || undefined;
    const tagSlug = searchParams.get("tagSlug") || undefined;
    const searchQuery = searchParams.get("searchQuery") || undefined;
    const status =
      (searchParams.get("status") as "published" | "draft" | "archived") ||
      "published";

    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json(
        {
          success: false,
          data: {} as BlogListResponse,
          error: "Invalid page number",
        } as ApiResponse<BlogListResponse>,
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          data: {} as BlogListResponse,
          error: "Invalid limit. Must be between 1 and 100",
        } as ApiResponse<BlogListResponse>,
        { status: 400 }
      );
    }

    const options: BlogListOptions = {
      page,
      limit,
      categorySlug,
      tagSlug,
      searchQuery,
      status,
    };

    // Get blog posts
    const result = await getBlogPosts(options);

    const response = NextResponse.json({
      success: true,
      data: result,
    } as ApiResponse<BlogListResponse>);

    // Add cache headers
    response.headers.set(
      "Cache-Control",
      "public, max-age=3600, stale-while-revalidate=86400"
    );

    return response;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      {
        success: false,
        data: {} as BlogListResponse,
        error: error instanceof Error ? error.message : "Internal server error",
        message: "Failed to fetch blog posts",
      } as ApiResponse<BlogListResponse>,
      { status: 500 }
    );
  }
}

/**
 * POST endpoint - Method not allowed
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      data: {} as BlogListResponse,
      error: "Method not allowed",
    } as ApiResponse<BlogListResponse>,
    { status: 405 }
  );
}
