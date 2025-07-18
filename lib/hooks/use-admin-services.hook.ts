import { useState, useEffect, useCallback } from "react";
import type { ServiceWithRelations } from "@/lib/types/service-with-relations.type";
import type { ApiResponse } from "@/lib/types/api-response.type";

export interface AdminServicesListResponse {
  services: ServiceWithRelations[];
  totalServices: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface UseAdminServicesOptions {
  page?: number;
  limit?: number;
  category?: string;
  searchQuery?: string;
  sortBy?: "title" | "createdAt" | "category" | "timeline";
  sortOrder?: "asc" | "desc";
}

interface UseAdminServicesReturn {
  services: ServiceWithRelations[];
  totalServices: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching admin services with pagination and filtering
 */
export function useAdminServices(
  options: UseAdminServicesOptions = {}
): UseAdminServicesReturn {
  const [data, setData] = useState<AdminServicesListResponse>({
    services: [],
    totalServices: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();

      // Add parameters to search params
      if (options.page) searchParams.set("page", options.page.toString());
      if (options.limit) searchParams.set("limit", options.limit.toString());
      if (options.category) searchParams.set("category", options.category);
      if (options.searchQuery)
        searchParams.set("searchQuery", options.searchQuery);
      if (options.sortBy) searchParams.set("sortBy", options.sortBy);
      if (options.sortOrder) searchParams.set("sortOrder", options.sortOrder);

      const response = await fetch(
        `/api/admin/services?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<AdminServicesListResponse> =
        await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch services");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [
    options.page,
    options.limit,
    options.category,
    options.searchQuery,
    options.sortBy,
    options.sortOrder,
  ]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services: data.services,
    totalServices: data.totalServices,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
    hasNextPage: data.hasNextPage,
    hasPreviousPage: data.hasPreviousPage,
    isLoading,
    error,
    refetch: fetchServices,
  };
}
