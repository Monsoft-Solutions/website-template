"use client";

import { useState, useEffect } from "react";
import { ApiResponse } from "@/lib/types/api-response.type";
import { ServiceCategory } from "@/lib/types/service-category.type";

/**
 * Custom hook for fetching service categories
 */
export function useServiceCategories() {
  const [data, setData] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/services/categories");
        const result: ApiResponse<ServiceCategory[]> = await response.json();

        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          setError(result.error || "Failed to fetch service categories");
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
  }, []);

  return { data, isLoading, error };
}
