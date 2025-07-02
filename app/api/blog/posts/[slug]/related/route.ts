import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/api/blog.service";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET endpoint - Get related blog posts by post slug
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);

    if (!slug) {
      return NextResponse.json(
        { error: "Post slug parameter is required" },
        { status: 400 }
      );
    }

    // Parse query parameters
    const limit = parseInt(searchParams.get("limit") || "3", 10);

    // Validate limit parameter
    if (limit < 1 || limit > 10) {
      return NextResponse.json(
        { error: "Invalid limit. Must be between 1 and 10" },
        { status: 400 }
      );
    }

    // First get the post by slug to get its ID
    const post = await getBlogPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Get related blog posts using the post ID
    const relatedPosts = await getRelatedBlogPosts(post.id, limit);

    return NextResponse.json({
      success: true,
      data: relatedPosts,
    });
  } catch (error) {
    console.error("Error fetching related blog posts:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch related blog posts",
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
