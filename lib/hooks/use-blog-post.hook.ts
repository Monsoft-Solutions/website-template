"use client";

import { useState, useEffect } from "react";
import { ApiResponse } from "@/lib/types/api-response.type";
import type { BlogPostWithRelations } from "@/lib/types";
import { getBaseUrl } from "@/lib/utils/url.util";

/**
 * Hook for fetching a single blog post by slug
 */
export function useBlogPost(slug: string | null) {
  const [data, setData] = useState<BlogPostWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = getBaseUrl();

  useEffect(() => {
    async function fetchBlogPost() {
      // Reset state when slug changes
      setIsLoading(true);
      setError(null);

      if (!slug) {
        setData(null);
        setIsLoading(false);
        return;
      }

      try {
        // Fetch data
        const response = await fetch(
          `${baseUrl}/api/blog/posts/${encodeURIComponent(slug)}`
        );

        if (response.status === 404) {
          setError("Blog post not found");
          setData(null);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `API error: ${response.status}`);
        }

        const result: ApiResponse<BlogPostWithRelations> =
          await response.json();

        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          setError(result.error || "Failed to fetch blog post");
          setData(null);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogPost();
  }, [slug, baseUrl]);

  // Return related posts function
  const getRelatedPosts = async (
    limit: number = 3
  ): Promise<BlogPostWithRelations[]> => {
    if (!slug) return [];

    try {
      const response = await fetch(
        `${baseUrl}/api/blog/posts/${encodeURIComponent(
          slug
        )}/related?limit=${limit}`
      );

      if (!response.ok) {
        return [];
      }

      const result: ApiResponse<BlogPostWithRelations[]> =
        await response.json();

      if (result.success) {
        return result.data;
      }

      return [];
    } catch (error) {
      console.error("Error fetching related posts:", error);
      return [];
    }
  };

  return { data, isLoading, error, getRelatedPosts };
}
