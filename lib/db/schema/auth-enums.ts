/**
 * Auth-related enums for Better Auth integration
 */

/**
 * User roles for authorization
 */
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  EDITOR = "editor",
  VIEWER = "viewer",
}

/**
 * Account types for OAuth providers
 */
export enum AccountType {
  OAUTH = "oauth",
  OIDC = "oidc",
}

/**
 * Admin actions for activity logging
 */
export enum AdminAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  PUBLISH = "publish",
  UNPUBLISH = "unpublish",
  BULK_DELETE = "bulk_delete",
  BULK_UPDATE = "bulk_update",
  LOGIN = "login",
  LOGOUT = "logout",
  EXPORT = "export",
  IMPORT = "import",
}

/**
 * Entity types for activity logging
 */
export enum EntityType {
  USER = "user",
  BLOG_POST = "blog_post",
  SERVICE = "service",
  CATEGORY = "category",
  TAG = "tag",
  AUTHOR = "author",
  CONTACT_SUBMISSION = "contact_submission",
  SYSTEM = "system",
}
