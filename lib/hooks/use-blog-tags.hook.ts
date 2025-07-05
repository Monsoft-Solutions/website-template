"use client";

import { useState, useEffect } from "react";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { Tag } from "@/lib/types/blog/tag.type";

type TagResponse = {
  tag: Tag;
  postCount: number;
};

type UseBlogTagsReturn = {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

/**
 * Custom hook for fetching blog tags
 * Returns simplified Tag[] for form usage
 */
export function useBlogTags(): UseBlogTagsReturn {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/blog/tags");
      const result: ApiResponse<TagResponse[]> = await response.json();

      if (result.success) {
        // Extract just the tag objects from the response
        const tagData = result.data.map((item) => item.tag);
        setTags(tagData);
      } else {
        setError(result.error || "Failed to fetch tags");
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
    fetchTags();
  }, []);

  return {
    tags,
    isLoading,
    error,
    refetch: fetchTags,
  };
}
