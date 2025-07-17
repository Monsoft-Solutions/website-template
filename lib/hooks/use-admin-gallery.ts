import { useState, useEffect, useCallback } from "react";
import type { GalleryImageWithDetails } from "@/lib/types/gallery-with-relations.type";
import type { ApiResponse } from "@/lib/types/api-response.type";

export interface AdminGalleryListResponse {
  images: GalleryImageWithDetails[];
  totalImages: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface UseAdminGalleryOptions {
  page?: number;
  limit?: number;
  groupId?: string;
  searchQuery?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  sortBy?: "name" | "createdAt" | "displayOrder" | "fileSize";
  sortOrder?: "asc" | "desc";
}

interface UseAdminGalleryReturn {
  images: GalleryImageWithDetails[];
  totalImages: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching admin gallery images with pagination and filtering
 */
export function useAdminGallery(
  options: UseAdminGalleryOptions = {}
): UseAdminGalleryReturn {
  const [data, setData] = useState<AdminGalleryListResponse>({
    images: [],
    totalImages: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      // Add pagination parameters
      if (options.page) params.append("page", options.page.toString());
      if (options.limit) params.append("limit", options.limit.toString());

      // Add filter parameters
      if (options.groupId) params.append("groupId", options.groupId);
      if (options.searchQuery)
        params.append("searchQuery", options.searchQuery);
      if (options.isAvailable !== undefined) {
        params.append("isAvailable", options.isAvailable.toString());
      }
      if (options.isFeatured !== undefined) {
        params.append("isFeatured", options.isFeatured.toString());
      }

      // Add sorting parameters
      if (options.sortBy) params.append("sortBy", options.sortBy);
      if (options.sortOrder) params.append("sortOrder", options.sortOrder);

      const response = await fetch(`/api/admin/gallery?${params.toString()}`);
      const result: ApiResponse<AdminGalleryListResponse> =
        await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch gallery images");
      }

      if (result.data) {
        setData(result.data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching gallery images:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    options.page,
    options.limit,
    options.groupId,
    options.searchQuery,
    options.isAvailable,
    options.isFeatured,
    options.sortBy,
    options.sortOrder,
  ]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    images: data.images,
    totalImages: data.totalImages,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
    hasNextPage: data.hasNextPage,
    hasPreviousPage: data.hasPreviousPage,
    isLoading,
    error,
    refetch: fetchImages,
  };
}
