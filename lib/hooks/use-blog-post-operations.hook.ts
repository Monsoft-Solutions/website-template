import { useState } from "react";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { BlogPostWithRelations } from "@/lib/types/blog-post-with-relations.type";
import type { BlogPostFormData } from "@/lib/utils/blog-post-form-validation";

type UseBlogPostOperationsReturn = {
  isLoading: boolean;
  error: string | null;
  createPost: (data: BlogPostFormData) => Promise<void>;
  updatePost: (id: string, data: BlogPostFormData) => Promise<void>;
};

/**
 * Custom hook for blog post operations (create/update)
 * Handles API calls for creating and updating blog posts
 */
export function useBlogPostOperations(): UseBlogPostOperationsReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = async (data: BlogPostFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<BlogPostWithRelations | null> =
        await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create blog post");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePost = async (
    id: string,
    data: BlogPostFormData
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<BlogPostWithRelations | null> =
        await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update blog post");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createPost,
    updatePost,
  };
}
