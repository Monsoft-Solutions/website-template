import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/api/blog.service";
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

    return NextResponse.json({
      success: true,
      data: post,
    } as ApiResponse<BlogPostWithRelations>);
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
