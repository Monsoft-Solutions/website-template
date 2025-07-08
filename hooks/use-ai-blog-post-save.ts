import { useState } from "react";
import type {
  BlogPost,
  BlogPostSaveRequest,
  BlogPostSaveResponse,
} from "@/lib/types/ai/content-generation.type";

interface UseAIBlogPostSaveResult {
  savePost: (
    blogPost: BlogPost,
    additionalData: {
      authorId: string;
      categoryId: string;
      status?: "draft" | "published" | "archived";
      featuredImage?: string;
    }
  ) => Promise<BlogPostSaveResponse>;
  isSaving: boolean;
  error: string | null;
}

/**
 * Hook for saving AI-generated blog posts to the database
 */
export function useAIBlogPostSave(): UseAIBlogPostSaveResult {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savePost = async (
    blogPost: BlogPost,
    additionalData: {
      authorId: string;
      categoryId: string;
      status?: "draft" | "published" | "archived";
      featuredImage?: string;
    }
  ): Promise<BlogPostSaveResponse> => {
    setIsSaving(true);
    setError(null);

    try {
      const saveRequest: BlogPostSaveRequest = {
        // AI-generated content
        title: blogPost.title,
        content: blogPost.content,
        excerpt: blogPost.excerpt,
        tags: blogPost.tags,
        metaDescription: blogPost.metaDescription,
        metaTitle: blogPost.metaTitle,
        metaKeywords: blogPost.metaKeywords,
        slug: blogPost.slug,
        category: blogPost.category,

        // Additional required data
        authorId: additionalData.authorId,
        categoryId: additionalData.categoryId,
        status: additionalData.status || "draft",
        featuredImage: additionalData.featuredImage,
      };

      const response = await fetch("/api/ai/content/save-blog-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saveRequest),
      });

      const result: BlogPostSaveResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to save blog post");
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    savePost,
    isSaving,
    error,
  };
}
