"use client";

import { useSession } from "@/lib/auth/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Briefcase,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Settings,
  BarChart3,
  Shield,
  Activity,
} from "lucide-react";

/**
 * Admin Dashboard Page - Phase 2 Implementation
 * Features responsive layout with sidebar navigation and dashboard metrics
 */
export default function AdminDashboard() {
  const { data: session, isPending } = useSession();

  // Mock data for demonstration (will be replaced with real data in later phases)
  const mockStats = {
    totalPosts: 24,
    totalServices: 8,
    totalUsers: 156,
    monthlyViews: 12450,
  };

  const mockRecentActivity = [
    {
      id: 1,
      action: "Blog post published",
      item: "Getting Started with Next.js",
      time: "2 hours ago",
      type: "success",
    },
    {
      id: 2,
      action: "Service updated",
      item: "Web Development Service",
      time: "4 hours ago",
      type: "info",
    },
    {
      id: 3,
      action: "New user registered",
      item: "john.doe@example.com",
      time: "6 hours ago",
      type: "info",
    },
    {
      id: 4,
      action: "Blog post drafted",
      item: "Advanced React Patterns",
      time: "1 day ago",
      type: "warning",
    },
  ];

  const quickActions = [
    {
      title: "Create Blog Post",
      description: "Write and publish a new blog post",
      icon: FileText,
      href: "/admin/blog/new",
      badge: "Phase 3",
      disabled: true,
    },
    {
      title: "Add Service",
      description: "Create a new service offering",
      icon: Briefcase,
      href: "/admin/services/new",
      badge: "Phase 4",
      disabled: true,
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      icon: Users,
      href: "/admin/users",
      badge: "Phase 5",
      disabled: true,
    },
    {
      title: "Analytics",
      description: "View site analytics and reports",
      icon: BarChart3,
      href: "/admin/analytics",
      badge: "Phase 6",
      disabled: true,
    },
  ];

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Welcome to your admin dashboard. Manage your content and monitor your site performance."
        badge="Phase 2 Complete"
      />

      {/* Welcome Alert */}
      <Alert className="border-green-200 bg-green-50">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Phase 2 Complete!</strong> Admin layout and navigation system
          is now fully functional. User:{" "}
          <strong>{session?.user?.name || session?.user?.email}</strong>
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Blog Posts"
          value={mockStats.totalPosts}
          description="Published articles"
          icon={FileText}
          trend={{ value: 12, label: "vs last month" }}
        />
        <StatsCard
          title="Services"
          value={mockStats.totalServices}
          description="Active services"
          icon={Briefcase}
          trend={{ value: 8, label: "vs last month" }}
        />
        <StatsCard
          title="Users"
          value={mockStats.totalUsers}
          description="Registered users"
          icon={Users}
          trend={{ value: -2, label: "vs last month" }}
        />
        <StatsCard
          title="Monthly Views"
          value={mockStats.monthlyViews.toLocaleString()}
          description="Page views this month"
          icon={TrendingUp}
          trend={{ value: 23, label: "vs last month" }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
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
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    action.disabled
                      ? "bg-muted/50 opacity-60 cursor-not-allowed"
                      : "bg-background hover:bg-accent transition-colors cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{action.title}</p>
                      <p className="text-xs text-muted-foreground">
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
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-2 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {activity.type === "success" && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    {activity.type === "info" && (
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                    )}
                    {activity.type === "warning" && (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.item}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Implementation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Implementation Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">
                  Phase 1: Authentication & Authorization
                </span>
              </div>
              <Badge variant="default">Complete</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">
                  Phase 2: Admin Layout & Navigation
                </span>
              </div>
              <Badge variant="default">Complete</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">
                  Phase 3: Blog Posts Management
                </span>
              </div>
              <Badge variant="secondary">Next</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Phase 4: Services Management
                </span>
              </div>
              <Badge variant="outline">Upcoming</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
