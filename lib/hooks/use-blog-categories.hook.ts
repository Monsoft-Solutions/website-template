"use client";

import { useState, useEffect } from "react";
import { ApiResponse } from "@/lib/types/api-response.type";
import { getBaseUrl } from "@/lib/utils/url.util";

// Define types
type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

type CategoryWithCount = {
  category: Category;
  postCount: number;
};

/**
 * Hook for fetching blog categories with post counts
 */
export function useBlogCategories() {
  const [data, setData] = useState<CategoryWithCount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = getBaseUrl();

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/blog/categories`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `API error: ${response.status}`);
        }

        const result: ApiResponse<CategoryWithCount[]> = await response.json();

        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          setError(result.error || "Failed to fetch categories");
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

    fetchCategories();
  }, [baseUrl]);

  return { data, isLoading, error };
}
