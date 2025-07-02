import { NextResponse } from "next/server";
import { getBlogCategories } from "@/lib/api/blog.service";

/**
 * GET endpoint - Get blog categories with post counts
 */
export async function GET() {
  try {
    // Get blog categories
    const categories = await getBlogCategories();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch blog categories",
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
