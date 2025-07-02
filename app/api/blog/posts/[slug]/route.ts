import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/api/blog.service";

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
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    // Get blog post by slug
    const post = await getBlogPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch blog post",
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
