import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/api/blog.service";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET endpoint - Get related blog posts for a specific post
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const limit = parseInt(searchParams.get("limit") || "3", 10);

    // Validate limit parameter
    if (limit < 1 || limit > 10) {
      return NextResponse.json(
        { error: "Invalid limit. Must be between 1 and 10" },
        { status: 400 }
      );
    }

    // First, get the current post to get its ID
    const currentPost = await getBlogPostBySlug(slug);

    if (!currentPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Get related posts
    const relatedPosts = await getRelatedBlogPosts(currentPost.id, limit);

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
 * Other methods not allowed
 */
export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
