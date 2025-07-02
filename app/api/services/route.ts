import { NextResponse } from "next/server";
import { getAllServices } from "@/lib/api/services.api";

/**
 * GET endpoint - Fetch all services with their relations
 */
export async function GET() {
  const result = await getAllServices();

  const status = result.success ? 200 : 500;
  return NextResponse.json(result, { status });
}
