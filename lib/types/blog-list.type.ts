import type { BlogPostWithRelations } from "./blog-post-with-relations.type";

/**
 * Blog listing filters and pagination options
 */
export type BlogListOptions = {
  page?: number;
  limit?: number;
  categorySlug?: string;
  tagSlug?: string;
  searchQuery?: string;
  status?: "published" | "draft" | "archived";
};

/**
 * Blog listing response with pagination metadata
 */
export type BlogListResponse = {
  posts: BlogPostWithRelations[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
