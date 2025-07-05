"use client";

import { useSession } from "@/lib/auth/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, FileText, Users, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/client";

/**
 * Admin dashboard page
 * Basic dashboard to test authentication and show admin features
 */
export default function AdminDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth/signin");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Show loading state
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show unauthenticated state (this shouldn't happen due to middleware)
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to sign in to access the admin area.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/auth/signin")}
              className="w-full"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {session.user?.name || session.user?.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {session.user?.name}
              </p>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
              {/* <p className="text-xs text-gray-400 capitalize">
                {session.user?.role || "user"}
              </p> */}
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Welcome Message */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication Successful!
            </CardTitle>
            <CardDescription>
              Phase 1 of the admin area implementation is complete. Better Auth
              is working correctly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>User ID:</strong> {session.user?.id}
              </p>
              <p>
                <strong>Email:</strong> {session.user?.email}
              </p>
              <p>
                <strong>Name:</strong> {session.user?.name}
              </p>
              {/* <p>
                <strong>Role:</strong> {(session.user as any)?.role || "user"}
              </p> */}
              <p>
                <strong>Email Verified:</strong>{" "}
                {session.user?.emailVerified ? "Yes" : "No"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Blog Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Manage blog posts and content
              </p>
              <p className="text-xs text-gray-400 mt-2">Coming in Phase 3</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5" />
                Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Manage services and offerings
              </p>
              <p className="text-xs text-gray-400 mt-2">Coming in Phase 4</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Manage user accounts and roles
              </p>
              <p className="text-xs text-gray-400 mt-2">Coming in Phase 6</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Update your profile settings
              </p>
              <p className="text-xs text-gray-400 mt-2">Coming in Phase 6</p>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Status */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Progress</CardTitle>
            <CardDescription>Admin area development phases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-green-900">
                    Phase 1: Authentication & Authorization
                  </h4>
                  <p className="text-sm text-green-700">
                    Better Auth integration, database setup, middleware
                  </p>
                </div>
                <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                  ✓ Complete
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Phase 2: Admin Layout & Navigation
                  </h4>
                  <p className="text-sm text-gray-700">
                    Sidebar, dashboard, navigation components
                  </p>
                </div>
                <span className="bg-gray-500 text-white px-2 py-1 rounded text-sm font-medium">
                  Pending
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Phase 3: Blog Posts Management
                  </h4>
                  <p className="text-sm text-gray-700">
                    CRUD operations, rich text editor, image upload
                  </p>
                </div>
                <span className="bg-gray-500 text-white px-2 py-1 rounded text-sm font-medium">
                  Pending
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Phase 4: Services Management
                  </h4>
                  <p className="text-sm text-gray-700">
                    Services CRUD, multi-step forms, gallery management
                  </p>
                </div>
                <span className="bg-gray-500 text-white px-2 py-1 rounded text-sm font-medium">
                  Pending
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
