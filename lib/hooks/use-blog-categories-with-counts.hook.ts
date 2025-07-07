"use client";

import { useState, useEffect, useCallback } from "react";
import { ApiResponse } from "@/lib/types/api-response.type";
import { getBaseUrl } from "@/lib/utils/url.util";

type CategoryWithCount = {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
  postCount: number;
};

type SimplifiedCategoryWithCount = {
  name: string;
  slug: string;
  count: number;
};

type UseBlogCategoriesWithCountsReturn = {
  categories: SimplifiedCategoryWithCount[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

/**
 * Hook for fetching blog categories with post counts
 * Returns simplified format for UI components
 */
export function useBlogCategoriesWithCounts(): UseBlogCategoriesWithCountsReturn {
  const [data, setData] = useState<SimplifiedCategoryWithCount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = getBaseUrl();

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/api/blog/categories`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const result: ApiResponse<CategoryWithCount[]> = await response.json();

      if (result.success) {
        // Transform to simplified format
        const transformedCategories = result.data.map((item) => ({
          name: item.category.name,
          slug: item.category.slug,
          count: item.postCount,
        }));

        setData(transformedCategories);
        setError(null);
      } else {
        setError(result.error || "Failed to fetch blog categories");
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
  }, [baseUrl]);

  useEffect(() => {
    fetchCategories();
  }, [baseUrl, fetchCategories]);

  return {
    categories: data,
    isLoading,
    error,
    refetch: fetchCategories,
  };
}
