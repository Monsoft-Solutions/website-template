import { useState, useEffect } from "react";

interface Author {
  id: string;
  name: string;
  email: string;
}

interface Category {
  id: string;
  name: string;
}

interface AdminFormDataResult {
  authors: Author[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch authors and categories for admin forms
 */
export function useAdminFormData(): AdminFormDataResult {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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

        if (!authorsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to fetch form data");
        }

        const [authorsData, categoriesData] = await Promise.all([
          authorsResponse.json(),
          categoriesResponse.json(),
        ]);

        if (authorsData.success) {
          setAuthors(authorsData.data.authors || []);
        }

        if (categoriesData.success) {
          setCategories(categoriesData.data.categories || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
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
