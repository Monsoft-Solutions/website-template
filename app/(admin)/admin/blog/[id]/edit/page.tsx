"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader, BlogPostForm } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { BlogPostWithRelations } from "@/lib/types/blog-post-with-relations.type";

/**
 * Edit blog post page - Phase 3.2 Implementation
 * Provides form interface for editing existing blog posts with markdown editor
 */
export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const [blogPost, setBlogPost] = useState<BlogPostWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Handle cancel action
  const handleCancel = () => {
    router.push("/admin/blog");
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full overflow-auto">
        <PageHeader
          title="Edit Blog Post"
          description="Loading blog post..."
          breadcrumbs={[
            { label: "Blog Posts", href: "/admin/blog" },
            { label: "Edit Post", active: true },
          ]}
        />
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading blog post...</p>
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
          title="Edit Blog Post"
          description="Error loading blog post"
          breadcrumbs={[
            { label: "Blog Posts", href: "/admin/blog" },
            { label: "Edit Post", active: true },
          ]}
          actions={
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Posts
            </Button>
          }
        />
        <div className="p-6">
          <Alert variant="destructive">
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
          title="Edit Blog Post"
          description="Blog post not found"
          breadcrumbs={[
            { label: "Blog Posts", href: "/admin/blog" },
            { label: "Edit Post", active: true },
          ]}
          actions={
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Posts
            </Button>
          }
        />
        <div className="p-6">
          <Alert>
            <AlertDescription>Blog post not found.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <PageHeader
        title={`Edit: ${blogPost.title}`}
        description="Modify and update your blog post"
        breadcrumbs={[
          { label: "Blog Posts", href: "/admin/blog" },
          { label: blogPost.title, href: `/admin/blog/${postId}` },
          { label: "Edit", active: true },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Posts
          </Button>
        }
      />

      <div className="p-6">
        <BlogPostForm
          mode="edit"
          initialData={blogPost}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
