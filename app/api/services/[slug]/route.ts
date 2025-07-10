import { NextResponse } from "next/server";
import { getServiceBySlug } from "@/lib/api/services.api";
import { recordView } from "@/lib/api/view-tracking.api";

/**
 * GET endpoint - Fetch a service by slug with all relations
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const result = await getServiceBySlug(slug);

  // If service found successfully, record the view
  if (result.success && result.data) {
    // Get visitor metadata from request
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined;
    const userAgent = request.headers.get("user-agent") || undefined;
    const referer = request.headers.get("referer") || undefined;

    // Record view without blocking the response
    recordView({
      contentType: "service",
      contentId: result.data.id,
      ipAddress,
      userAgent,
      referer,
    }).catch((error) => {
      console.warn("Failed to record service view:", error);
    });
  }

  const status = result.success
    ? 200
    : result.error === "Service not found"
    ? 404
    : 500;

  const response = NextResponse.json(result, { status });

  // Add cache headers
  if (result.success) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=3600, stale-while-revalidate=86400"
    );
  }

  return response;
}
