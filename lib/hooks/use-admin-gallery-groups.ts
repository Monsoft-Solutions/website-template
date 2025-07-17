import { useState, useEffect, useCallback } from "react";
import type { GalleryGroupWithImages } from "@/lib/types/gallery-with-relations.type";
import type { ApiResponse } from "@/lib/types/api-response.type";

interface AdminGalleryGroupsListResponse {
  groups: GalleryGroupWithImages[];
  totalGroups: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface UseAdminGalleryGroupsReturn {
  groups: GalleryGroupWithImages[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching admin gallery groups
 */
export function useAdminGalleryGroups(): UseAdminGalleryGroupsReturn {
  const [groups, setGroups] = useState<GalleryGroupWithImages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/gallery/groups");
      const result: ApiResponse<AdminGalleryGroupsListResponse> =
        await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch gallery groups");
      }

      if (result.data) {
        setGroups(result.data.groups);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching gallery groups:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    groups,
    isLoading,
    error,
    refetch: fetchGroups,
  };
}
