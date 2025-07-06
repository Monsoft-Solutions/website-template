import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema/contact-submission.table";
import { sql, gte, count, desc, and, lte } from "drizzle-orm";
import type { ApiResponse } from "@/lib/types/api-response.type";

/**
 * Contact submission analytics data types
 */
export interface ContactSubmissionAnalyticsStats {
  totalSubmissions: number;
  newSubmissions: number;
  readSubmissions: number;
  respondedSubmissions: number;
  submissionsToday: number;
  submissionsThisWeek: number;
  submissionsThisMonth: number;
  avgResponseTime: number; // in hours
  topProjectTypes: Array<{ projectType: string; count: number }>;
  topBudgetRanges: Array<{ budget: string; count: number }>;
  recentSubmissions: Array<{
    id: string;
    name: string;
    email: string;
    subject: string | null;
    status: "new" | "read" | "responded";
    createdAt: Date;
  }>;
}

export interface ContactSubmissionChartData {
  date: string;
  submissions: number;
  newSubmissions: number;
  respondedSubmissions: number;
}

export interface ContactSubmissionAnalyticsResponse {
  stats: ContactSubmissionAnalyticsStats;
  chartData: ContactSubmissionChartData[];
  period: string;
}

type AnalyticsTimePeriod = "today" | "week" | "month" | "quarter" | "year";

/**
 * Helper function to get date range for analytics period
 */
function getDateRange(period: AnalyticsTimePeriod): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  switch (period) {
    case "today":
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "week":
      start.setDate(now.getDate() - 7);
      break;
    case "month":
      start.setMonth(now.getMonth() - 1);
      break;
    case "quarter":
      start.setMonth(now.getMonth() - 3);
      break;
    case "year":
      start.setFullYear(now.getFullYear() - 1);
      break;
  }

  return { start, end };
}

/**
 * Helper function to get chart data grouping based on period
 */
function getChartGrouping(period: AnalyticsTimePeriod): string {
  switch (period) {
    case "today":
      return "hour";
    case "week":
      return "day";
    case "month":
      return "day";
    case "quarter":
      return "week";
    case "year":
      return "month";
    default:
      return "day";
  }
}

/**
 * GET endpoint - Get contact submission analytics statistics
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
              totalSubmissions: 0,
              newSubmissions: 0,
              readSubmissions: 0,
              respondedSubmissions: 0,
              submissionsToday: 0,
              submissionsThisWeek: 0,
              submissionsThisMonth: 0,
              avgResponseTime: 0,
              topProjectTypes: [],
              topBudgetRanges: [],
              recentSubmissions: [],
            },
            chartData: [],
            period: "month",
          },
          error:
            "Invalid period. Must be one of: today, week, month, quarter, year",
        } as ApiResponse<ContactSubmissionAnalyticsResponse>,
        { status: 400 }
      );
    }

    const { start: periodStart, end: periodEnd } = getDateRange(period);
    const now = new Date();

    // Get basic statistics
    const [totalSubmissionsResult] = await db
      .select({ count: count() })
      .from(contactSubmissions);

    // Get status distribution
    const statusDistribution = await db
      .select({
        status: contactSubmissions.status,
        count: count(),
      })
      .from(contactSubmissions)
      .groupBy(contactSubmissions.status);

    // Get time-based statistics
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const weekStart = new Date();
    weekStart.setDate(now.getDate() - 7);

    const monthStart = new Date();
    monthStart.setMonth(now.getMonth() - 1);

    const [submissionsTodayResult] = await db
      .select({ count: count() })
      .from(contactSubmissions)
      .where(gte(contactSubmissions.createdAt, todayStart));

    const [submissionsThisWeekResult] = await db
      .select({ count: count() })
      .from(contactSubmissions)
      .where(gte(contactSubmissions.createdAt, weekStart));

    const [submissionsThisMonthResult] = await db
      .select({ count: count() })
      .from(contactSubmissions)
      .where(gte(contactSubmissions.createdAt, monthStart));

    // Get top project types
    const topProjectTypes = await db
      .select({
        projectType: contactSubmissions.projectType,
        count: count(),
      })
      .from(contactSubmissions)
      .where(sql`${contactSubmissions.projectType} IS NOT NULL`)
      .groupBy(contactSubmissions.projectType)
      .orderBy(desc(count()))
      .limit(5);

    // Get top budget ranges
    const topBudgetRanges = await db
      .select({
        budget: contactSubmissions.budget,
        count: count(),
      })
      .from(contactSubmissions)
      .where(sql`${contactSubmissions.budget} IS NOT NULL`)
      .groupBy(contactSubmissions.budget)
      .orderBy(desc(count()))
      .limit(5);

    // Get recent submissions
    const recentSubmissions = await db
      .select({
        id: contactSubmissions.id,
        name: contactSubmissions.name,
        email: contactSubmissions.email,
        subject: contactSubmissions.subject,
        status: contactSubmissions.status,
        createdAt: contactSubmissions.createdAt,
      })
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt))
      .limit(10);

    // Calculate average response time (simplified - time from creation to first status change from 'new')
    // This is a simplified calculation. In a real implementation, you might track status change history
    const avgResponseTimeQuery = await db
      .select({
        avgHours: sql<number>`
          EXTRACT(EPOCH FROM AVG(
            CASE 
              WHEN ${contactSubmissions.status} != 'new' 
              THEN NOW() - ${contactSubmissions.createdAt}
              ELSE NULL 
            END
          )) / 3600
        `,
      })
      .from(contactSubmissions);

    const avgResponseTime = avgResponseTimeQuery[0]?.avgHours || 0;

    // Get chart data - simplified approach for basic aggregation
    // For now, we'll get the submissions for the period and create basic chart data
    const periodSubmissions = await db
      .select({
        createdAt: contactSubmissions.createdAt,
        status: contactSubmissions.status,
      })
      .from(contactSubmissions)
      .where(
        and(
          gte(contactSubmissions.createdAt, periodStart),
          lte(contactSubmissions.createdAt, periodEnd)
        )
      );

    // Process submissions into chart data based on grouping
    const chartDataMap = new Map<
      string,
      {
        submissions: number;
        newSubmissions: number;
        respondedSubmissions: number;
      }
    >();

    periodSubmissions.forEach((submission) => {
      const date = submission.createdAt;
      let dateKey: string;

      switch (getChartGrouping(period)) {
        case "hour":
          dateKey = date.toISOString().substring(0, 13) + ":00";
          break;
        case "day":
          dateKey = date.toISOString().substring(0, 10);
          break;
        case "week":
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          dateKey = weekStart.toISOString().substring(0, 10);
          break;
        case "month":
          dateKey = date.toISOString().substring(0, 7);
          break;
        default:
          dateKey = date.toISOString().substring(0, 10);
      }

      if (!chartDataMap.has(dateKey)) {
        chartDataMap.set(dateKey, {
          submissions: 0,
          newSubmissions: 0,
          respondedSubmissions: 0,
        });
      }

      const entry = chartDataMap.get(dateKey)!;
      entry.submissions++;
      if (submission.status === "new") entry.newSubmissions++;
      if (submission.status === "responded") entry.respondedSubmissions++;
    });

    // Process status distribution
    const statusCounts = {
      new: 0,
      read: 0,
      responded: 0,
    };

    statusDistribution.forEach((item) => {
      statusCounts[item.status as keyof typeof statusCounts] = item.count;
    });

    // Format chart data from the map
    const chartData: ContactSubmissionChartData[] = Array.from(
      chartDataMap.entries()
    )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date,
        submissions: data.submissions,
        newSubmissions: data.newSubmissions,
        respondedSubmissions: data.respondedSubmissions,
      }));

    // Build response
    const stats: ContactSubmissionAnalyticsStats = {
      totalSubmissions: totalSubmissionsResult.count,
      newSubmissions: statusCounts.new,
      readSubmissions: statusCounts.read,
      respondedSubmissions: statusCounts.responded,
      submissionsToday: submissionsTodayResult.count,
      submissionsThisWeek: submissionsThisWeekResult.count,
      submissionsThisMonth: submissionsThisMonthResult.count,
      avgResponseTime: Math.round(avgResponseTime * 10) / 10, // Round to 1 decimal place
      topProjectTypes: topProjectTypes.map((item) => ({
        projectType: item.projectType || "Unknown",
        count: item.count,
      })),
      topBudgetRanges: topBudgetRanges.map((item) => ({
        budget: item.budget || "Unknown",
        count: item.count,
      })),
      recentSubmissions: recentSubmissions,
    };

    const response: ContactSubmissionAnalyticsResponse = {
      stats,
      chartData,
      period,
    };

    const result: ApiResponse<ContactSubmissionAnalyticsResponse> = {
      success: true,
      data: response,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching contact submission analytics:", error);

    const result: ApiResponse<ContactSubmissionAnalyticsResponse> = {
      success: false,
      data: {
        stats: {
          totalSubmissions: 0,
          newSubmissions: 0,
          readSubmissions: 0,
          respondedSubmissions: 0,
          submissionsToday: 0,
          submissionsThisWeek: 0,
          submissionsThisMonth: 0,
          avgResponseTime: 0,
          topProjectTypes: [],
          topBudgetRanges: [],
          recentSubmissions: [],
        },
        chartData: [],
        period: "month",
      },
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch contact submission analytics",
    };

    return NextResponse.json(result, { status: 500 });
  }
}
