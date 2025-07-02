import { NextResponse } from "next/server";
import { getBlogCategories } from "@/lib/api/blog.service";
import type { ApiResponse } from "@/lib/types/api-response.type";

// Define a type for category with post count
type CategoryWithCount = {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
  postCount: number;
};

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
    } as ApiResponse<CategoryWithCount[]>);
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return NextResponse.json(
      {
        success: false,
        data: [] as CategoryWithCount[],
        error: error instanceof Error ? error.message : "Internal server error",
        message: "Failed to fetch blog categories",
      } as ApiResponse<CategoryWithCount[]>,
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
