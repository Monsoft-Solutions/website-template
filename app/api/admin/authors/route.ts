import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authors } from "@/lib/db/schema/author.table";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { Author } from "@/lib/types/blog/author.type";

/**
 * GET endpoint - Get all authors for admin filters
 */
export async function GET() {
  try {
    const allAuthors = await db.select().from(authors);

    return NextResponse.json({
      success: true,
      data: allAuthors,
    } as ApiResponse<Author[]>);
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json(
      {
        success: false,
        data: [] as Author[],
        error: error instanceof Error ? error.message : "Internal server error",
        message: "Failed to fetch authors",
      } as ApiResponse<Author[]>,
      { status: 500 }
    );
  }
}
