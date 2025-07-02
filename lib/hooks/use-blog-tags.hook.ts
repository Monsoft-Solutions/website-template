"use client";

import { useState, useEffect } from "react";
import { ApiResponse } from "@/lib/types/api-response.type";
import { getBaseUrl } from "@/lib/utils/url.util";

// Define types
type Tag = {
  id: string;
  name: string;
  slug: string;
};

type TagWithCount = {
  tag: Tag;
  postCount: number;
};

/**
 * Hook for fetching blog tags with post counts
 */
export function useBlogTags() {
  const [data, setData] = useState<TagWithCount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = getBaseUrl();

  useEffect(() => {
    async function fetchTags() {
      setIsLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/blog/tags`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `API error: ${response.status}`);
        }

        const result: ApiResponse<TagWithCount[]> = await response.json();

        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          setError(result.error || "Failed to fetch tags");
          setData([]);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTags();
  }, [baseUrl]);

  return { data, isLoading, error };
}
