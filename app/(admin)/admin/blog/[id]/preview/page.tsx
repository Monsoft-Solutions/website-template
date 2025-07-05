"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { PageHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Markdown } from "@/components/ui/markdown";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils/date.util";
import type { BlogPostWithRelations } from "@/lib/types/blog-post-with-relations.type";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Edit,
  ExternalLink,
  Loader2,
  AlertCircle,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";

/**
 * Blog Post Preview Page - Phase 3.4 Implementation
 * Shows how the blog post will look on the frontend with draft/published toggle
 */
export default function BlogPostPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const [blogPost, setBlogPost] = useState<BlogPostWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"draft" | "published">("draft");

  const postId = params.id as string;

  // Fetch blog post data
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/blog/${postId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch blog post");
        }

        const data = await response.json();
        if (data.success) {
          setBlogPost(data.data);
          // Set initial view mode based on post status
          setViewMode(data.data.status === "published" ? "published" : "draft");
        } else {
          throw new Error(data.error || "Failed to fetch blog post");
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchBlogPost();
    }
  }, [postId]);

  // Handle navigation
  const handleBack = () => {
    router.push("/admin/blog");
  };

  const handleEdit = () => {
    router.push(`/admin/blog/${postId}/edit`);
  };

  const handleViewOnSite = () => {
    if (blogPost && blogPost.status === "published") {
      window.open(`/blog/${blogPost.slug}`, "_blank");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full overflow-auto">
        <PageHeader
          title="Blog Post Preview"
          description="Loading preview..."
          breadcrumbs={[
            { label: "Blog Posts", href: "/admin/blog" },
            { label: "Preview", active: true },
          ]}
        />
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading preview...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full overflow-auto">
        <PageHeader
          title="Blog Post Preview"
          description="Error loading preview"
          breadcrumbs={[
            { label: "Blog Posts", href: "/admin/blog" },
            { label: "Preview", active: true },
          ]}
          actions={
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Posts
            </Button>
          }
        />
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // No blog post found
  if (!blogPost) {
    return (
      <div className="h-full overflow-auto">
        <PageHeader
          title="Blog Post Preview"
          description="Blog post not found"
          breadcrumbs={[
            { label: "Blog Posts", href: "/admin/blog" },
            { label: "Preview", active: true },
          ]}
          actions={
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Posts
            </Button>
          }
        />
        <div className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Blog post not found.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Determine if we should show the post based on view mode
  const shouldShowPost =
    viewMode === "draft" || blogPost.status === "published";
  const showPublishedWarning =
    viewMode === "published" && blogPost.status !== "published";

  return (
    <div className="h-full overflow-auto">
      <PageHeader
        title={`Preview: ${blogPost.title}`}
        description="See how your blog post will look on the frontend"
        breadcrumbs={[
          { label: "Blog Posts", href: "/admin/blog" },
          { label: blogPost.title, href: `/admin/blog/${postId}` },
          { label: "Preview", active: true },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Post
            </Button>
            {blogPost.status === "published" && (
              <Button
                variant="default"
                onClick={handleViewOnSite}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View on Site
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Posts
            </Button>
          </div>
        }
      />

      <div className="p-6">
        {/* Preview Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Preview Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">View Mode:</Label>
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant={viewMode === "draft" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("draft")}
                      className="rounded-r-none"
                    >
                      Draft
                    </Button>
                    <Button
                      variant={viewMode === "published" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("published")}
                      className="rounded-l-none"
                    >
                      Published
                    </Button>
                  </div>
                </div>
                <Badge
                  variant={
                    blogPost.status === "published"
                      ? "default"
                      : blogPost.status === "draft"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  Current Status: {blogPost.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {formatDate(blogPost.updatedAt)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Published Warning */}
        {showPublishedWarning && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This post is currently in <strong>{blogPost.status}</strong>{" "}
              status. The published view shown here is a preview of how it would
              look once published.
            </AlertDescription>
          </Alert>
        )}

        {/* Blog Post Preview */}
        {shouldShowPost && (
          <div className="bg-background border rounded-lg">
            {/* Preview Header */}
            <div className="p-4 border-b bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>Frontend Preview</span>
                <span className="text-xs bg-background px-2 py-1 rounded">
                  {viewMode === "published" ? "Published View" : "Draft View"}
                </span>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-8">
              {/* Article Header */}
              <div className="max-w-4xl mx-auto mb-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <span>Home</span>
                  <span>/</span>
                  <span>Blog</span>
                  <span>/</span>
                  <span>{blogPost.category.name}</span>
                  <span>/</span>
                  <span className="text-foreground">{blogPost.title}</span>
                </nav>

                {/* Post Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge variant="secondary">{blogPost.category.name}</Badge>
                    {blogPost.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>

                  <h1 className="text-4xl font-bold tracking-tight mb-4 sm:text-5xl">
                    {blogPost.title}
                  </h1>

                  <p className="text-xl text-muted-foreground mb-8">
                    {blogPost.excerpt}
                  </p>

                  <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={blogPost.author.avatarUrl || undefined}
                        />
                        <AvatarFallback>
                          {blogPost.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>By {blogPost.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(
                          viewMode === "published" && blogPost.publishedAt
                            ? blogPost.publishedAt
                            : blogPost.createdAt
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{blogPost.readingTime} min read</span>
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                {blogPost.featuredImage && (
                  <div className="mb-8">
                    <Image
                      src={blogPost.featuredImage}
                      alt={blogPost.title}
                      width={800}
                      height={400}
                      className="w-full h-[400px] object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Main Content */}
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Article Content */}
                  <div className="lg:col-span-3">
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      <Markdown content={blogPost.content} />
                    </div>

                    {/* Article Footer */}
                    <div className="mt-12 pt-8 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button variant="outline" size="sm" className="gap-2">
                            <ThumbsUp className="w-4 h-4" />
                            Helpful
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Bookmark className="w-4 h-4" />
                            Save
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Discuss
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Last updated: {formatDate(blogPost.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-8 space-y-6">
                      {/* Author Info */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            About the Author
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage
                                src={blogPost.author.avatarUrl || undefined}
                              />
                              <AvatarFallback>
                                {blogPost.author.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {blogPost.author.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {blogPost.author.bio || "Content Creator"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Share */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Share Article
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              Twitter
                            </Button>
                            <Button variant="outline" size="sm">
                              LinkedIn
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Tags */}
                      {blogPost.tags.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Tags</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {blogPost.tags.map((tag) => (
                                <Badge key={tag.id} variant="outline">
                                  {tag.name}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Footer */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Preview Mode: {viewMode === "published" ? "Published" : "Draft"}
            </span>
            <span>
              Status: {blogPost.status} | Created:{" "}
              {formatDate(blogPost.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
