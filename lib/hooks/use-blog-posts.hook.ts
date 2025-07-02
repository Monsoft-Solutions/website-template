"use client";

import { useState, useEffect } from "react";
import { ApiResponse } from "@/lib/types/api-response.type";
import type { BlogListOptions, BlogListResponse } from "@/lib/types";
import { getBaseUrl } from "@/lib/utils/url.util";

/**
 * Hook for fetching blog posts with filtering and pagination
 */
export function useBlogPosts(options: BlogListOptions = {}) {
  const [data, setData] = useState<BlogListResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = getBaseUrl();

  useEffect(() => {
    async function fetchBlogPosts() {
      setIsLoading(true);
      try {
        // Build API URL with search parameters
        const apiParams = new URLSearchParams();

        if (options.page) {
          apiParams.set("page", options.page.toString());
        }

        if (options.limit) {
          apiParams.set("limit", options.limit.toString());
        }

        if (options.categorySlug && options.categorySlug !== "all") {
          apiParams.set("categorySlug", options.categorySlug);
        }

        if (options.tagSlug) {
          apiParams.set("tagSlug", options.tagSlug);
        }

        if (options.searchQuery) {
          apiParams.set("searchQuery", options.searchQuery);
        }

        if (options.status) {
          apiParams.set("status", options.status);
        }

        // Fetch data
        const response = await fetch(
          `${baseUrl}/api/blog/posts?${apiParams.toString()}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `API error: ${response.status}`);
        }

        const result: ApiResponse<BlogListResponse> = await response.json();

        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          setError(result.error || "Failed to fetch blog posts");
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

    fetchBlogPosts();
  }, [
    options.page,
    options.limit,
    options.categorySlug,
    options.tagSlug,
    options.searchQuery,
    options.status,
    baseUrl,
  ]);

  return { data, isLoading, error };
}
