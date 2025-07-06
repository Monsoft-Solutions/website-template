"use client";

import { useState, useEffect } from "react";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { Category } from "@/lib/types/blog/category.type";

type CategoryResponse = {
  category: Category;
  postCount: number;
};

type UseBlogCategoriesReturn = {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

/**
 * Custom hook for fetching blog categories
 * Returns simplified Category[] for form usage
 */
export function useBlogCategories(): UseBlogCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/blog/categories");
      const result: ApiResponse<CategoryResponse[]> = await response.json();

      if (result.success) {
        // Extract just the category objects from the response
        const categoryData = result.data.map((item) => item.category);
        setCategories(categoryData);
      } else {
        setError(result.error || "Failed to fetch categories");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
}
