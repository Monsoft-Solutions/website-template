import { useState, useEffect, useCallback } from "react";
import type { BlogPostWithRelations } from "@/lib/types/blog-post-with-relations.type";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { AdminBlogListResponse } from "@/app/api/admin/blog/route";

interface UseAdminBlogPostsOptions {
  page?: number;
  limit?: number;
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  status?: "draft" | "published" | "archived";
  searchQuery?: string;
  sortBy?: "title" | "createdAt" | "publishedAt" | "status";
  sortOrder?: "asc" | "desc";
}

interface UseAdminBlogPostsReturn {
  posts: BlogPostWithRelations[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching admin blog posts with pagination and filtering
 */
export function useAdminBlogPosts(
  options: UseAdminBlogPostsOptions = {}
): UseAdminBlogPostsReturn {
  const [data, setData] = useState<AdminBlogListResponse>({
    posts: [],
    totalPosts: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();

      // Add parameters to search params
      if (options.page) searchParams.set("page", options.page.toString());
      if (options.limit) searchParams.set("limit", options.limit.toString());
      if (options.categoryId)
        searchParams.set("categoryId", options.categoryId);
      if (options.tagId) searchParams.set("tagId", options.tagId);
      if (options.authorId) searchParams.set("authorId", options.authorId);
      if (options.status) searchParams.set("status", options.status);
      if (options.searchQuery)
        searchParams.set("searchQuery", options.searchQuery);
      if (options.sortBy) searchParams.set("sortBy", options.sortBy);
      if (options.sortOrder) searchParams.set("sortOrder", options.sortOrder);

      const response = await fetch(
        `/api/admin/blog?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<AdminBlogListResponse> = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch blog posts");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [
    options.page,
    options.limit,
    options.categoryId,
    options.tagId,
    options.authorId,
    options.status,
    options.searchQuery,
    options.sortBy,
    options.sortOrder,
  ]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts: data.posts,
    totalPosts: data.totalPosts,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
    hasNextPage: data.hasNextPage,
    hasPreviousPage: data.hasPreviousPage,
    isLoading,
    error,
    refetch: fetchPosts,
  };
}
