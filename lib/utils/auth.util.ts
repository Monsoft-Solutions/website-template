import {
  User,
  UserRole,
  AdminPermissions,
  RolePermissions,
} from "../types/auth.type";

/**
 * Auth utilities for role-based access control and permissions
 */

/**
 * Role-based permissions configuration
 */
export const ROLE_PERMISSIONS: RolePermissions = {
  [UserRole.USER]: {
    canCreatePosts: false,
    canEditPosts: false,
    canDeletePosts: false,
    canPublishPosts: false,
    canManageUsers: false,
    canManageSettings: false,
    canViewAnalytics: false,
    canManageServices: false,
    canManageCategories: false,
    canManageTags: false,
    canManageAuthors: false,
    canExportData: false,
    canImportData: false,
  },
  [UserRole.VIEWER]: {
    canCreatePosts: false,
    canEditPosts: false,
    canDeletePosts: false,
    canPublishPosts: false,
    canManageUsers: false,
    canManageSettings: false,
    canViewAnalytics: true,
    canManageServices: false,
    canManageCategories: false,
    canManageTags: false,
    canManageAuthors: false,
    canExportData: false,
    canImportData: false,
  },
  [UserRole.EDITOR]: {
    canCreatePosts: true,
    canEditPosts: true,
    canDeletePosts: false,
    canPublishPosts: true,
    canManageUsers: false,
    canManageSettings: false,
    canViewAnalytics: true,
    canManageServices: true,
    canManageCategories: true,
    canManageTags: true,
    canManageAuthors: true,
    canExportData: true,
    canImportData: false,
  },
  [UserRole.ADMIN]: {
    canCreatePosts: true,
    canEditPosts: true,
    canDeletePosts: true,
    canPublishPosts: true,
    canManageUsers: true,
    canManageSettings: true,
    canViewAnalytics: true,
    canManageServices: true,
    canManageCategories: true,
    canManageTags: true,
    canManageAuthors: true,
    canExportData: true,
    canImportData: true,
  },
};

/**
 * Check if a user has a specific role
 */
export const hasRole = (user: User | null, role: UserRole): boolean => {
  if (!user) return false;
  return user.role === role;
};

/**
 * Check if a user has admin privileges (admin or editor)
 */
export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === UserRole.ADMIN || user.role === UserRole.EDITOR;
};

/**
 * Check if a user has super admin privileges (admin only)
 */
export const isSuperAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === UserRole.ADMIN;
};

/**
 * Get user permissions based on role
 */
export const getUserPermissions = (user: User | null): AdminPermissions => {
  if (!user) return ROLE_PERMISSIONS[UserRole.USER];
  return (
    ROLE_PERMISSIONS[user.role as UserRole] || ROLE_PERMISSIONS[UserRole.USER]
  );
};

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (
  user: User | null,
  permission: keyof AdminPermissions
): boolean => {
  const permissions = getUserPermissions(user);
  return permissions[permission];
};

/**
 * Require admin role - throw error if user is not admin
 */
export const requireAdmin = (user: User | null): void => {
  if (!isAdmin(user)) {
    throw new Error("Admin access required");
  }
};

/**
 * Require super admin role - throw error if user is not super admin
 */
export const requireSuperAdmin = (user: User | null): void => {
  if (!isSuperAdmin(user)) {
    throw new Error("Super admin access required");
  }
};

/**
 * Require specific permission - throw error if user doesn't have permission
 */
export const requirePermission = (
  user: User | null,
  permission: keyof AdminPermissions
): void => {
  if (!hasPermission(user, permission)) {
    throw new Error(`Permission required: ${permission}`);
  }
};

/**
 * Get user display name
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return "Anonymous";
  return user.name || user.email || "Unknown User";
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = (user: User | null): string => {
  if (!user || !user.name) return "U";
  return user.name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Check if user email is verified
 */
export const isEmailVerified = (user: User | null): boolean => {
  if (!user) return false;
  return user.emailVerified || false;
};

/**
 * Format user role for display
 */
export const formatUserRole = (role: string): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "Administrator";
    case UserRole.EDITOR:
      return "Editor";
    case UserRole.VIEWER:
      return "Viewer";
    case UserRole.USER:
      return "User";
    default:
      return "User";
  }
};

/**
 * Get role color for UI display
 */
export const getRoleColor = (role: string): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "bg-red-100 text-red-800";
    case UserRole.EDITOR:
      return "bg-blue-100 text-blue-800";
    case UserRole.VIEWER:
      return "bg-green-100 text-green-800";
    case UserRole.USER:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Validate user role
 */
export const isValidRole = (role: string): role is UserRole => {
  return Object.values(UserRole).includes(role as UserRole);
};
