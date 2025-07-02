import { NextResponse } from "next/server";
import { getServiceBySlug } from "@/lib/api/services.api";

/**
 * GET endpoint - Fetch a service by slug with all relations
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const result = await getServiceBySlug(slug);

  const status = result.success
    ? 200
    : result.error === "Service not found"
    ? 404
    : 500;

  return NextResponse.json(result, { status });
}
