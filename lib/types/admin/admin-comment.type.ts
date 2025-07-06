import { adminComments } from "@/lib/db/schema/admin-comment.table";

/**
 * TypeScript types for AdminComment entity
 * Generated from the admin_comments table schema
 */

export type AdminComment = typeof adminComments.$inferSelect;
export type NewAdminComment = typeof adminComments.$inferInsert;

/**
 * Admin comment with author details
 */
export type AdminCommentWithAuthor = AdminComment & {
  author: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
};

/**
 * Entity type for comments
 */
export type CommentEntityType =
  | "contact_submission"
  | "blog_post"
  | "service"
  | "user"
  | "order"
  | "project";

/**
 * Create comment request payload
 */
export type CreateCommentRequest = {
  entityType: CommentEntityType;
  entityId: string;
  content: string;
  isInternal?: boolean;
  isPinned?: boolean;
};

/**
 * Update comment request payload
 */
export type UpdateCommentRequest = {
  content?: string;
  isInternal?: boolean;
  isPinned?: boolean;
};
