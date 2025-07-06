import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsStats } from "@/lib/api/view-tracking.api";
import type {
  ApiResponse,
  AnalyticsResponse,
  AnalyticsTimePeriod,
} from "@/lib/types";

/**
 * GET endpoint - Get analytics statistics for dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period =
      (searchParams.get("period") as AnalyticsTimePeriod) || "month";

    // Validate period parameter
    const validPeriods: AnalyticsTimePeriod[] = [
      "today",
      "week",
      "month",
      "quarter",
      "year",
    ];
    if (!validPeriods.includes(period)) {
      return NextResponse.json(
        {
          success: false,
          data: {
            stats: {
              totalBlogPosts: 0,
              totalServices: 0,
              totalViews: 0,
              totalUniqueViews: 0,
              viewsToday: 0,
              viewsThisWeek: 0,
              viewsThisMonth: 0,
              topBlogPosts: [],
              topServices: [],
              recentViews: [],
            },
            chartData: [],
            period: "month",
          },
          error:
            "Invalid period. Must be one of: today, week, month, quarter, year",
        } as ApiResponse<AnalyticsResponse>,
        { status: 400 }
      );
    }

    // Get analytics data
    const result = await getAnalyticsStats(period);

    const status = result.success ? 200 : 500;
    return NextResponse.json(result, { status });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      {
        success: false,
        data: {
          stats: {
            totalBlogPosts: 0,
            totalServices: 0,
            totalViews: 0,
            totalUniqueViews: 0,
            viewsToday: 0,
            viewsThisWeek: 0,
            viewsThisMonth: 0,
            topBlogPosts: [],
            topServices: [],
            recentViews: [],
          },
          chartData: [],
          period: "month",
        },
        error: error instanceof Error ? error.message : "Internal server error",
        message: "Failed to fetch analytics data",
      } as ApiResponse<AnalyticsResponse>,
      { status: 500 }
    );
  }
}

/**
 * POST endpoint - Method not allowed
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      data: {
        stats: {
          totalBlogPosts: 0,
          totalServices: 0,
          totalViews: 0,
          totalUniqueViews: 0,
          viewsToday: 0,
          viewsThisWeek: 0,
          viewsThisMonth: 0,
          topBlogPosts: [],
          topServices: [],
          recentViews: [],
        },
        chartData: [],
        period: "month",
      },
      error: "Method not allowed",
    } as ApiResponse<AnalyticsResponse>,
    { status: 405 }
  );
}
