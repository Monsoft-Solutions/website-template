import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { viewTracking } from "@/lib/db/schema/view-tracking.table";

/**
 * Type definitions for view tracking
 */
export type ViewTracking = InferSelectModel<typeof viewTracking>;
export type NewViewTracking = InferInsertModel<typeof viewTracking>;

/**
 * Content view statistics
 */
export type ContentViewStats = {
  contentId: string;
  contentType: "blog_post" | "service";
  totalViews: number;
  uniqueViews: number;
  viewsToday: number;
  viewsThisWeek: number;
  viewsThisMonth: number;
  title: string;
  slug: string;
  createdAt: Date;
};

/**
 * Analytics dashboard statistics
 */
export type AnalyticsStats = {
  totalBlogPosts: number;
  totalServices: number;
  totalViews: number;
  totalUniqueViews: number;
  viewsToday: number;
  viewsThisWeek: number;
  viewsThisMonth: number;
  topBlogPosts: ContentViewStats[];
  topServices: ContentViewStats[];
  recentViews: ViewTracking[];
};

/**
 * Analytics time period options
 */
export type AnalyticsTimePeriod =
  | "today"
  | "week"
  | "month"
  | "quarter"
  | "year";

/**
 * Analytics chart data point
 */
export type AnalyticsDataPoint = {
  date: string;
  views: number;
  uniqueViews: number;
};

/**
 * Analytics response data
 */
export type AnalyticsResponse = {
  stats: AnalyticsStats;
  chartData: AnalyticsDataPoint[];
  period: AnalyticsTimePeriod;
};
