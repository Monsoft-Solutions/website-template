"use client";

import { useSession } from "@/lib/auth/client";
import { AnalyticsStatsCard } from "@/components/admin/analytics-stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle,
  Plus,
  Settings,
  BarChart3,
  Shield,
  Activity,
  Eye,
  Calendar,
  Globe,
  Edit,
  ArrowRight,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAnalytics } from "@/lib/hooks/use-analytics.hook";
import { useAdminBlogPosts } from "@/lib/hooks/use-admin-blog-posts";
import { useAdminServices } from "@/lib/hooks/use-admin-services";
import Link from "next/link";

/**
 * Admin Dashboard Page - Main Overview
 * Features responsive layout with key metrics, quick actions, and activity overview
 */
export default function AdminDashboard() {
  const { data: session, isPending } = useSession();
  const { data: analyticsData } = useAnalytics("month");
  const { totalPosts } = useAdminBlogPosts({ limit: 1 });
  const { totalServices } = useAdminServices({ limit: 1 });

  // Mock data for demonstration - this would be replaced with real data
  const quickActions = [
    {
      title: "Create Blog Post",
      description: "Write and publish a new blog post",
      icon: FileText,
      href: "/admin/blog/new",
      badge: "Ready",
      disabled: false,
      color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
    },
    {
      title: "Add Service",
      description: "Create a new service offering",
      icon: Briefcase,
      href: "/admin/services/new",
      badge: "Ready",
      disabled: false,
      color: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
    },
    {
      title: "View Analytics",
      description: "Monitor site performance and metrics",
      icon: BarChart3,
      href: "/admin/analytics",
      badge: "Live",
      disabled: false,
      color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      icon: Users,
      href: "/admin/users",
      badge: "Available",
      disabled: false,
      color: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20",
    },
  ];

  const systemStatus = [
    {
      label: "Website Status",
      status: "operational",
      icon: Globe,
      description: "All systems running smoothly",
    },
    {
      label: "Database",
      status: "operational",
      icon: Shield,
      description: "Connected and optimized",
    },
    {
      label: "API Performance",
      status: "good",
      icon: Zap,
      description: "Response times under 200ms",
    },
    {
      label: "Content Delivery",
      status: "operational",
      icon: Target,
      description: "CDN performing optimally",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "good":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "error":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </motion.div>
      </div>
    );
  }

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
              <Shield className="h-8 w-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {session?.user?.name || session?.user?.email}.
              Here&apos;s your site overview.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild size="sm">
              <Link href="/admin/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Welcome Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>System Status:</strong> All services operational. Dashboard
            ready for content management and analytics monitoring.
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsStatsCard
          title="Total Blog Posts"
          value={totalPosts || 0}
          icon={FileText}
          description="Published articles"
          delay={0.15}
        />
        <AnalyticsStatsCard
          title="Total Services"
          value={totalServices || 0}
          icon={Briefcase}
          description="Active services"
          delay={0.2}
        />
        <AnalyticsStatsCard
          title="Total Views"
          value={analyticsData?.stats?.totalViews || 0}
          icon={Eye}
          description="All-time page views"
          delay={0.25}
        />
        <AnalyticsStatsCard
          title="This Month"
          value={analyticsData?.stats?.viewsThisMonth || 0}
          icon={TrendingUp}
          description="Views this month"
          delay={0.3}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    href={action.href}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors hover:shadow-md ${
                      action.disabled
                        ? "bg-muted/50 opacity-60 cursor-not-allowed pointer-events-none"
                        : "bg-background hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${action.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {action.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {action.badge}
                        </Badge>
                      )}
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemStatus.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getStatusColor(item.status)}`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Analytics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Performance
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/analytics">
                  View Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {analyticsData?.stats?.viewsToday || 0}
                </p>
                <p className="text-sm text-muted-foreground">Views Today</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {analyticsData?.stats?.viewsThisWeek || 0}
                </p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Eye className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {analyticsData?.stats?.totalUniqueViews || 0}
                </p>
                <p className="text-sm text-muted-foreground">Unique Visitors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Management Quick Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Content Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-blue-500/10">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Blog Posts</p>
                    <p className="text-sm text-muted-foreground">
                      {totalPosts || 0} total posts
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/blog">
                    <Edit className="h-4 w-4 mr-2" />
                    Manage
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-green-500/10">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Services</p>
                    <p className="text-sm text-muted-foreground">
                      {totalServices || 0} active services
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/services">
                    <Edit className="h-4 w-4 mr-2" />
                    Manage
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
