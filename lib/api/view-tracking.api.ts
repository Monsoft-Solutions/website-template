import { db } from "@/lib/db";
import { viewTracking } from "@/lib/db/schema/view-tracking.table";
import { blogPosts } from "@/lib/db/schema/blog-post.table";
import { services } from "@/lib/db/schema/service.table";
import { eq, sql, desc, and, gte } from "drizzle-orm";
import type {
  ApiResponse,
  ViewTracking,
  NewViewTracking,
  AnalyticsStats,
  ContentViewStats,
  AnalyticsDataPoint,
  AnalyticsResponse,
  AnalyticsTimePeriod,
} from "@/lib/types";

/**
 * Record a view for blog post or service
 */
export async function recordView(data: {
  contentType: "blog_post" | "service";
  contentId: string;
  ipAddress?: string;
  userAgent?: string;
  referer?: string;
}): Promise<ApiResponse<ViewTracking | null>> {
  try {
    // Check if this IP has already viewed this content today to prevent spam
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (data.ipAddress) {
      const existingView = await db
        .select()
        .from(viewTracking)
        .where(
          and(
            eq(viewTracking.contentType, data.contentType),
            eq(viewTracking.contentId, data.contentId),
            eq(viewTracking.ipAddress, data.ipAddress),
            gte(viewTracking.viewedAt, today)
          )
        )
        .limit(1);

      // If already viewed today by this IP, don't record another view
      if (existingView.length > 0) {
        return {
          success: true,
          data: null,
          message: "View already recorded for this IP today",
        };
      }
    }

    // Record the view
    const viewData: NewViewTracking = {
      contentType: data.contentType,
      contentId: data.contentId,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      referer: data.referer || null,
    };

    const [newView] = await db
      .insert(viewTracking)
      .values(viewData)
      .returning();

    return {
      success: true,
      data: newView,
      message: "View recorded successfully",
    };
  } catch (error) {
    console.error("Error recording view:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to record view",
    };
  }
}

/**
 * Get analytics statistics for dashboard
 */
export async function getAnalyticsStats(
  period: AnalyticsTimePeriod = "month"
): Promise<ApiResponse<AnalyticsResponse>> {
  try {
    // Calculate date ranges
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const periodStart = getPeriodStartDate(period);

    // Get total counts
    const [
      totalBlogPostsResult,
      totalServicesResult,
      totalViewsResult,
      uniqueViewsResult,
      viewsTodayResult,
      viewsThisWeekResult,
      viewsThisMonthResult,
    ] = await Promise.all([
      // Total blog posts
      db
        .select({ count: sql<number>`count(*)` })
        .from(blogPosts)
        .where(eq(blogPosts.status, "published")),

      // Total services
      db.select({ count: sql<number>`count(*)` }).from(services),

      // Total views
      db.select({ count: sql<number>`count(*)` }).from(viewTracking),

      // Unique views (unique IP addresses)
      db
        .select({
          count: sql<number>`count(distinct ${viewTracking.ipAddress})`,
        })
        .from(viewTracking),

      // Views today
      db
        .select({ count: sql<number>`count(*)` })
        .from(viewTracking)
        .where(gte(viewTracking.viewedAt, today)),

      // Views this week
      db
        .select({ count: sql<number>`count(*)` })
        .from(viewTracking)
        .where(gte(viewTracking.viewedAt, startOfWeek)),

      // Views this month
      db
        .select({ count: sql<number>`count(*)` })
        .from(viewTracking)
        .where(gte(viewTracking.viewedAt, startOfMonth)),
    ]);

    // Get top blog posts by views
    const topBlogPostsData = await db
      .select({
        contentId: viewTracking.contentId,
        totalViews: sql<number>`count(*)`,
        uniqueViews: sql<number>`count(distinct ${viewTracking.ipAddress})`,
        title: blogPosts.title,
        slug: blogPosts.slug,
        createdAt: blogPosts.createdAt,
      })
      .from(viewTracking)
      .innerJoin(blogPosts, eq(viewTracking.contentId, blogPosts.id))
      .where(eq(viewTracking.contentType, "blog_post"))
      .groupBy(
        viewTracking.contentId,
        blogPosts.title,
        blogPosts.slug,
        blogPosts.createdAt
      )
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    // Get top services by views
    const topServicesData = await db
      .select({
        contentId: viewTracking.contentId,
        totalViews: sql<number>`count(*)`,
        uniqueViews: sql<number>`count(distinct ${viewTracking.ipAddress})`,
        title: services.title,
        slug: services.slug,
        createdAt: services.createdAt,
      })
      .from(viewTracking)
      .innerJoin(services, eq(viewTracking.contentId, services.id))
      .where(eq(viewTracking.contentType, "service"))
      .groupBy(
        viewTracking.contentId,
        services.title,
        services.slug,
        services.createdAt
      )
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    // Get recent views
    const recentViews = await db
      .select()
      .from(viewTracking)
      .orderBy(desc(viewTracking.viewedAt))
      .limit(10);

    // Format top blog posts with additional stats
    const topBlogPosts: ContentViewStats[] = await Promise.all(
      topBlogPostsData.map(async (post) => {
        const [todayViews, weekViews, monthViews] = await Promise.all([
          db
            .select({ count: sql<number>`count(*)` })
            .from(viewTracking)
            .where(
              and(
                eq(viewTracking.contentId, post.contentId),
                eq(viewTracking.contentType, "blog_post"),
                gte(viewTracking.viewedAt, today)
              )
            ),
          db
            .select({ count: sql<number>`count(*)` })
            .from(viewTracking)
            .where(
              and(
                eq(viewTracking.contentId, post.contentId),
                eq(viewTracking.contentType, "blog_post"),
                gte(viewTracking.viewedAt, startOfWeek)
              )
            ),
          db
            .select({ count: sql<number>`count(*)` })
            .from(viewTracking)
            .where(
              and(
                eq(viewTracking.contentId, post.contentId),
                eq(viewTracking.contentType, "blog_post"),
                gte(viewTracking.viewedAt, startOfMonth)
              )
            ),
        ]);

        return {
          contentId: post.contentId,
          contentType: "blog_post" as const,
          totalViews: post.totalViews,
          uniqueViews: post.uniqueViews,
          viewsToday: todayViews[0].count,
          viewsThisWeek: weekViews[0].count,
          viewsThisMonth: monthViews[0].count,
          title: post.title,
          slug: post.slug,
          createdAt: post.createdAt,
        };
      })
    );

    // Format top services with additional stats
    const topServices: ContentViewStats[] = await Promise.all(
      topServicesData.map(async (service) => {
        const [todayViews, weekViews, monthViews] = await Promise.all([
          db
            .select({ count: sql<number>`count(*)` })
            .from(viewTracking)
            .where(
              and(
                eq(viewTracking.contentId, service.contentId),
                eq(viewTracking.contentType, "service"),
                gte(viewTracking.viewedAt, today)
              )
            ),
          db
            .select({ count: sql<number>`count(*)` })
            .from(viewTracking)
            .where(
              and(
                eq(viewTracking.contentId, service.contentId),
                eq(viewTracking.contentType, "service"),
                gte(viewTracking.viewedAt, startOfWeek)
              )
            ),
          db
            .select({ count: sql<number>`count(*)` })
            .from(viewTracking)
            .where(
              and(
                eq(viewTracking.contentId, service.contentId),
                eq(viewTracking.contentType, "service"),
                gte(viewTracking.viewedAt, startOfMonth)
              )
            ),
        ]);

        return {
          contentId: service.contentId,
          contentType: "service" as const,
          totalViews: service.totalViews,
          uniqueViews: service.uniqueViews,
          viewsToday: todayViews[0].count,
          viewsThisWeek: weekViews[0].count,
          viewsThisMonth: monthViews[0].count,
          title: service.title,
          slug: service.slug,
          createdAt: service.createdAt,
        };
      })
    );

    // Generate chart data for the specified period
    const chartData = await generateChartData(period, periodStart);

    const stats: AnalyticsStats = {
      totalBlogPosts: totalBlogPostsResult[0].count,
      totalServices: totalServicesResult[0].count,
      totalViews: totalViewsResult[0].count,
      totalUniqueViews: uniqueViewsResult[0].count,
      viewsToday: viewsTodayResult[0].count,
      viewsThisWeek: viewsThisWeekResult[0].count,
      viewsThisMonth: viewsThisMonthResult[0].count,
      topBlogPosts,
      topServices,
      recentViews,
    };

    return {
      success: true,
      data: {
        stats,
        chartData,
        period,
      },
    };
  } catch (error) {
    console.error("Error fetching analytics stats:", error);
    return {
      success: false,
      data: {
        stats: {} as AnalyticsStats,
        chartData: [],
        period,
      },
      error:
        error instanceof Error ? error.message : "Failed to fetch analytics",
    };
  }
}

/**
 * Helper function to get period start date
 */
function getPeriodStartDate(period: AnalyticsTimePeriod): Date {
  const now = new Date();

  switch (period) {
    case "today":
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      return today;

    case "week":
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return startOfWeek;

    case "month":
      return new Date(now.getFullYear(), now.getMonth(), 1);

    case "quarter":
      const quarter = Math.floor(now.getMonth() / 3);
      return new Date(now.getFullYear(), quarter * 3, 1);

    case "year":
      return new Date(now.getFullYear(), 0, 1);

    default:
      return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}

/**
 * Generate chart data for analytics
 */
async function generateChartData(
  period: AnalyticsTimePeriod,
  startDate: Date
): Promise<AnalyticsDataPoint[]> {
  const endDate = new Date();
  const dataPoints: AnalyticsDataPoint[] = [];

  // Get daily data for the period
  const dailyData = await db
    .select({
      date: sql<string>`date(${viewTracking.viewedAt})`,
      views: sql<number>`count(*)`,
      uniqueViews: sql<number>`count(distinct ${viewTracking.ipAddress})`,
    })
    .from(viewTracking)
    .where(gte(viewTracking.viewedAt, startDate))
    .groupBy(sql`date(${viewTracking.viewedAt})`)
    .orderBy(sql`date(${viewTracking.viewedAt})`);

  // Create a map for easy lookup
  const dataMap = new Map(
    dailyData.map((item) => [
      item.date,
      { views: item.views, uniqueViews: item.uniqueViews },
    ])
  );

  // Generate date range and fill in missing days with 0 views
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split("T")[0];
    const data = dataMap.get(dateString) || { views: 0, uniqueViews: 0 };

    dataPoints.push({
      date: dateString,
      views: data.views,
      uniqueViews: data.uniqueViews,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dataPoints;
}
