import { NextResponse } from "next/server";
import { getBlogTags } from "@/lib/api/blog.service";
import type { ApiResponse } from "@/lib/types/api-response.type";

// Define a type for tags with post count
type TagWithCount = {
  tag: {
    id: string;
    name: string;
    slug: string;
  };
  postCount: number;
};

/**
 * GET endpoint - Get all blog tags with post counts
 */
export async function GET() {
  try {
    const tags = await getBlogTags();

    return NextResponse.json({
      success: true,
      data: tags,
    } as ApiResponse<TagWithCount[]>);
  } catch (error) {
    console.error("Error fetching blog tags:", error);
    return NextResponse.json(
      {
        success: false,
        data: [] as TagWithCount[],
        error: error instanceof Error ? error.message : "Internal server error",
        message: "Failed to fetch blog tags",
      } as ApiResponse<TagWithCount[]>,
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
