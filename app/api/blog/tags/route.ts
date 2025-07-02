import { NextResponse } from "next/server";
import { getBlogTags } from "@/lib/api/blog.service";

/**
 * GET endpoint - Get all blog tags with post counts
 */
export async function GET() {
  try {
    const tags = await getBlogTags();

    return NextResponse.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error("Error fetching blog tags:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch blog tags",
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
