import type { BlogPost } from "./blog/blog-post.type";
import type { Author } from "./blog/author.type";
import type { Category } from "./blog/category.type";
import type { Tag } from "./blog/tag.type";

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
