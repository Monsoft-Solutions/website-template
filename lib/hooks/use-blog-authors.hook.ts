import { useState, useEffect } from "react";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { Author } from "@/lib/types/blog/author.type";

type UseBlogAuthorsReturn = {
  authors: Author[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

/**
 * Custom hook for fetching blog authors
 * Fetches from the admin authors endpoint
 */
export function useBlogAuthors(): UseBlogAuthorsReturn {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthors = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/authors");
      const result: ApiResponse<Author[]> = await response.json();

      if (result.success) {
        setAuthors(result.data);
      } else {
        setError(result.error || "Failed to fetch authors");
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
    fetchAuthors();
  }, []);

  return {
    authors,
    isLoading,
    error,
    refetch: fetchAuthors,
  };
}
