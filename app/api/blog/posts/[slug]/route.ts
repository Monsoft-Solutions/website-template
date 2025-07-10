import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/api/blog.service";
import { recordView } from "@/lib/api/view-tracking.api";
import type { BlogPostWithRelations } from "@/lib/types";
import type { ApiResponse } from "@/lib/types/api-response.type";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET endpoint - Get a single blog post by slug
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          data: {} as BlogPostWithRelations,
          error: "Slug parameter is required",
        } as ApiResponse<BlogPostWithRelations>,
        { status: 400 }
      );
    }

    // Get blog post by slug
    const post = await getBlogPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          data: {} as BlogPostWithRelations,
          error: "Blog post not found",
        } as ApiResponse<BlogPostWithRelations>,
        { status: 404 }
      );
    }

    // Record view asynchronously (don't wait for it)
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined;
    const userAgent = request.headers.get("user-agent") || undefined;
    const referer = request.headers.get("referer") || undefined;

    // Record view without blocking the response
    recordView({
      contentType: "blog_post",
      contentId: post.id,
      ipAddress,
      userAgent,
      referer,
    }).catch((error) => {
      console.warn("Failed to record blog post view:", error);
    });

    const response = NextResponse.json({
      success: true,
      data: post,
    } as ApiResponse<BlogPostWithRelations>);

    // Add cache headers
    response.headers.set(
      "Cache-Control",
      "public, max-age=3600, stale-while-revalidate=86400"
    );

    return response;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      {
        success: false,
        data: {} as BlogPostWithRelations,
        error: error instanceof Error ? error.message : "Internal server error",
        message: "Failed to fetch blog post",
      } as ApiResponse<BlogPostWithRelations>,
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
