import { useState, useEffect } from "react";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type {
  AdminAuthorsListResponse,
  AuthorWithUsage,
} from "@/app/api/admin/authors/route";
import type {
  AdminCategoriesListResponse,
  CategoryWithUsage,
} from "@/app/api/admin/categories/route";

interface AdminFormDataResult {
  authors: AuthorWithUsage[];
  categories: CategoryWithUsage[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch authors and categories for admin forms
 */
export function useAdminFormData(): AdminFormDataResult {
  const [authors, setAuthors] = useState<AuthorWithUsage[]>([]);
  const [categories, setCategories] = useState<CategoryWithUsage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [authorsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/admin/authors"),
          fetch("/api/admin/categories"),
        ]);

        // Check if the HTTP responses are OK first
        if (!authorsResponse.ok) {
          throw new Error(
            `Failed to fetch authors: HTTP ${authorsResponse.status} ${authorsResponse.statusText}`
          );
        }

        if (!categoriesResponse.ok) {
          throw new Error(
            `Failed to fetch categories: HTTP ${categoriesResponse.status} ${categoriesResponse.statusText}`
          );
        }

        // Parse JSON responses as ApiResponse types
        let authorsData: ApiResponse<AdminAuthorsListResponse>;
        let categoriesData: ApiResponse<AdminCategoriesListResponse>;

        try {
          authorsData = await authorsResponse.json();
        } catch (parseError) {
          throw new Error(
            `Failed to parse authors response: ${
              parseError instanceof Error ? parseError.message : "Invalid JSON"
            }`
          );
        }

        try {
          categoriesData = await categoriesResponse.json();
        } catch (parseError) {
          throw new Error(
            `Failed to parse categories response: ${
              parseError instanceof Error ? parseError.message : "Invalid JSON"
            }`
          );
        }

        // Validate API response structure
        if (typeof authorsData.success !== "boolean") {
          throw new Error(
            "Authors API response is malformed: missing or invalid 'success' field"
          );
        }

        if (typeof categoriesData.success !== "boolean") {
          throw new Error(
            "Categories API response is malformed: missing or invalid 'success' field"
          );
        }

        // Check API success status and handle specific failures
        if (!authorsData.success) {
          throw new Error(
            `Authors API returned failure: ${
              authorsData.error || "Unknown error from authors endpoint"
            }`
          );
        }

        if (!categoriesData.success) {
          throw new Error(
            `Categories API returned failure: ${
              categoriesData.error || "Unknown error from categories endpoint"
            }`
          );
        }

        // Validate data structure
        if (!authorsData.data || !Array.isArray(authorsData.data.authors)) {
          throw new Error(
            "Authors API response is malformed: invalid data structure"
          );
        }

        if (
          !categoriesData.data ||
          !Array.isArray(categoriesData.data.categories)
        ) {
          throw new Error(
            "Categories API response is malformed: invalid data structure"
          );
        }

        // Set the data with proper typing
        setAuthors(authorsData.data.authors);
        setCategories(categoriesData.data.categories);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load admin form data"
        );
        console.error("Failed to fetch admin form data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    authors,
    categories,
    isLoading,
    error,
  };
}
