import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/api/blog.service";
import type { BlogListOptions } from "@/lib/types";

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
    const status =
      (searchParams.get("status") as "published" | "draft" | "archived") ||
      "published";

    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json(
        { error: "Invalid page number" },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid limit. Must be between 1 and 100" },
        { status: 400 }
      );
    }

    const options: BlogListOptions = {
      page,
      limit,
      categorySlug,
      status,
    };

    // Get blog posts
    const result = await getBlogPosts(options);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch blog posts",
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint - Method not allowed
 */
export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
