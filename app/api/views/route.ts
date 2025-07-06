import { NextRequest, NextResponse } from "next/server";
import { recordView } from "@/lib/api/view-tracking.api";
import type { ApiResponse, ViewTracking } from "@/lib/types";

/**
 * POST endpoint - Record a view for blog post or service
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType, contentId } = body;

    // Validate required fields
    if (!contentType || !contentId) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "contentType and contentId are required",
        } as ApiResponse<ViewTracking | null>,
        { status: 400 }
      );
    }

    // Validate content type
    if (!["blog_post", "service"].includes(contentType)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "contentType must be 'blog_post' or 'service'",
        } as ApiResponse<ViewTracking | null>,
        { status: 400 }
      );
    }

    // Get visitor metadata from request
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined;
    const userAgent = request.headers.get("user-agent") || undefined;
    const referer = request.headers.get("referer") || undefined;

    // Record the view
    const result = await recordView({
      contentType,
      contentId,
      ipAddress,
      userAgent,
      referer,
    });

    const status = result.success ? (result.data ? 201 : 200) : 500;
    return NextResponse.json(result, { status });
  } catch (error) {
    console.error("Error recording view:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Internal server error",
        message: "Failed to record view",
      } as ApiResponse<ViewTracking | null>,
      { status: 500 }
    );
  }
}

/**
 * GET endpoint - Method not allowed
 */
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: "Method not allowed",
    } as ApiResponse<ViewTracking | null>,
    { status: 405 }
  );
}
