"use client";

import { useRouter } from "next/navigation";
import { PageHeader, BlogPostForm } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

/**
 * Create new blog post page - Phase 3.2 Implementation
 * Provides form interface for creating new blog posts with markdown editor
 */
export default function NewBlogPostPage() {
  const router = useRouter();

  // Handle cancel action
  const handleCancel = () => {
    router.push("/admin/blog");
  };

  return (
    <div className="h-full overflow-auto">
      <PageHeader
        title="Create New Blog Post"
        description="Write and publish a new blog post"
        breadcrumbs={[
          { label: "Blog Posts", href: "/admin/blog" },
          { label: "New Post", active: true },
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
        <BlogPostForm mode="create" onCancel={handleCancel} />
      </div>
    </div>
  );
}
