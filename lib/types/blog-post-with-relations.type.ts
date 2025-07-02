import type { BlogPost } from "@/lib/db/schema/blog-post.type";
import type { Author } from "@/lib/db/schema/author.type";
import type { Category } from "@/lib/db/schema/category.type";
import type { Tag } from "@/lib/db/schema/tag.type";

/**
 * Extended blog post type that includes computed fields and relations
 * Combines database types with frontend-specific data
 */
export type BlogPostWithRelations = BlogPost & {
  author: Author;
  category: Category;
  tags: Tag[];
  readingTime: number;
};
