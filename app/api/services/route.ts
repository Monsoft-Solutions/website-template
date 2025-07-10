import { NextResponse } from "next/server";
import { getAllServices } from "@/lib/api/services.api";

/**
 * GET endpoint - Fetch all services with their relations
 */
export async function GET() {
  const result = await getAllServices();

  const status = result.success ? 200 : 500;

  const response = NextResponse.json(result, { status });

  // Add cache headers
  response.headers.set(
    "Cache-Control",
    "public, max-age=3600, stale-while-revalidate=86400"
  );

  return response;
}
