"use client";

import { useState } from "react";
import { AnalyticsStatsCard } from "@/components/admin/analytics-stats-card";
import { AnalyticsChart } from "@/components/admin/analytics-chart";
import { ContentPopularityTable } from "@/components/admin/content-popularity-table";
import { ContactSubmissionStatusChart } from "@/components/admin/contact-submission-status-chart";
import { ContactSubmissionTrendsChart } from "@/components/admin/contact-submission-trends-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/lib/hooks/use-analytics.hook";
import { useContactSubmissionAnalytics } from "@/lib/hooks/use-contact-submission-analytics";
import { AnalyticsTimePeriod } from "@/lib/types";
import {
  FileText,
  Briefcase,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  Activity,
  BarChart3,
  Clock,
  MessageSquare,
  Circle,
  UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";

// Simple loading skeleton component
const AnalyticsLoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>

    {/* Key metrics skeleton */}
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Charts skeleton */}
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<AnalyticsTimePeriod>("month");
  const { data, isLoading, error } = useAnalytics(selectedPeriod);
  const { data: submissionAnalytics } = useContactSubmissionAnalytics({
    period: selectedPeriod,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <AnalyticsLoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your content performance and engagement metrics
            </p>
          </div>
        </div>

        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="text-center py-8 space-y-2">
              <div className="text-4xl">⚠️</div>
              <div>
                <p className="text-lg font-medium text-destructive">
                  Error loading analytics
                </p>
                <p className="text-muted-foreground mt-2">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your content performance and engagement metrics
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 space-y-2">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-lg font-medium text-muted-foreground">
                No analytics data available
              </p>
              <p className="text-sm text-muted-foreground">
                Data will appear here once you start receiving views
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { stats, chartData } = data;

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor your content performance and engagement metrics
            </p>
          </div>

          <Select
            value={selectedPeriod}
            onValueChange={(value: AnalyticsTimePeriod) =>
              setSelectedPeriod(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <SelectValue placeholder="Select period" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsStatsCard
          title="Total Blog Posts"
          value={stats.totalBlogPosts}
          icon={FileText}
          description="Published blog posts"
          delay={0.1}
        />
        <AnalyticsStatsCard
          title="Total Services"
          value={stats.totalServices}
          icon={Briefcase}
          description="Available services"
          delay={0.15}
        />
        <AnalyticsStatsCard
          title="Total Views"
          value={stats.totalViews}
          icon={Eye}
          description="All-time page views"
          delay={0.2}
        />
        <AnalyticsStatsCard
          title="Unique Visitors"
          value={stats.totalUniqueViews}
          icon={Users}
          description="Unique IP addresses"
          delay={0.25}
        />
      </div>

      {/* Time-based Metrics */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <AnalyticsStatsCard
          title="Views Today"
          value={stats.viewsToday}
          icon={Calendar}
          description="Views in last 24 hours"
          delay={0.3}
        />
        <AnalyticsStatsCard
          title="Views This Week"
          value={stats.viewsThisWeek}
          icon={TrendingUp}
          description="Views in last 7 days"
          delay={0.35}
        />
        <AnalyticsStatsCard
          title="Views This Month"
          value={stats.viewsThisMonth}
          icon={Activity}
          description="Views in last 30 days"
          delay={0.4}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <AnalyticsChart
          data={chartData}
          title={`Views Over Time (${selectedPeriod})`}
          type="area"
          showUniqueViews={true}
          delay={0.45}
        />
        <AnalyticsChart
          data={chartData}
          title={`Trend Analysis (${selectedPeriod})`}
          type="line"
          showUniqueViews={false}
          delay={0.5}
        />
      </div>

      {/* Content Popularity Tables */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <ContentPopularityTable
          title="Most Popular Blog Posts"
          data={stats.topBlogPosts}
          contentType="blog_post"
          delay={0.55}
        />
        <ContentPopularityTable
          title="Most Popular Services"
          data={stats.topServices}
          contentType="service"
          delay={0.6}
        />
      </div>

      {/* Contact Submission Analytics */}
      {submissionAnalytics && (
        <>
          {/* Contact Submission Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">
                Contact Submission Analytics
              </h2>
            </div>
          </motion.div>

          {/* Contact Submission Key Metrics */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <AnalyticsStatsCard
              title="Total Submissions"
              value={submissionAnalytics.stats.totalSubmissions}
              icon={MessageSquare}
              description="All contact submissions"
              delay={0.7}
            />
            <AnalyticsStatsCard
              title="New Submissions"
              value={submissionAnalytics.stats.newSubmissions}
              icon={Circle}
              description="Pending review"
              delay={0.75}
            />
            <AnalyticsStatsCard
              title="Avg Response Time"
              value={`${submissionAnalytics.stats.avgResponseTime}h`}
              icon={Clock}
              description="Average response time"
              delay={0.8}
            />
            <AnalyticsStatsCard
              title="Responded"
              value={submissionAnalytics.stats.respondedSubmissions}
              icon={UserCheck}
              description="Completed submissions"
              delay={0.85}
            />
          </div>

          {/* Contact Submission Charts */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <ContactSubmissionStatusChart
              data={{
                newSubmissions: submissionAnalytics.stats.newSubmissions,
                readSubmissions: submissionAnalytics.stats.readSubmissions,
                respondedSubmissions:
                  submissionAnalytics.stats.respondedSubmissions,
              }}
              delay={0.9}
            />
            <ContactSubmissionTrendsChart
              data={submissionAnalytics.chartData}
              period={submissionAnalytics.period}
              delay={0.95}
            />
          </div>
        </>
      )}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentViews.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">No recent activity</p>
                <p className="text-sm text-muted-foreground">
                  Activity will appear here as visitors view your content
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recentViews.slice(0, 10).map((view) => (
                  <div
                    key={view.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">
                        Someone viewed a{" "}
                        <span className="font-medium">
                          {view.contentType === "blog_post"
                            ? "blog post"
                            : "service"}
                        </span>
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(view.viewedAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
