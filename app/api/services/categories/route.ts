import { NextResponse } from "next/server";
import { getAllServiceCategories } from "@/lib/api/service-categories.api";

/**
 * GET endpoint - Fetch all service categories
 */
export async function GET() {
  const result = await getAllServiceCategories();

  const status = result.success ? 200 : 500;
  return NextResponse.json(result, { status });
}
