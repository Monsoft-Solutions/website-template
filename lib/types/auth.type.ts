import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { users } from "../db/schema/user.table";
import { sessions } from "../db/schema/session.table";
import { accounts } from "../db/schema/account.table";
import { verificationTokens } from "../db/schema/verification-token.table";
import { adminActivityLogs } from "../db/schema/admin-activity-log.table";
import {
  UserRole,
  AccountType,
  AdminAction,
  EntityType,
} from "../db/schema/auth-enums";

/**
 * Auth-related types for Better Auth integration
 */

// User types
export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;
export type UserUpdate = Partial<UserInsert>;

// Session types
export type Session = InferSelectModel<typeof sessions>;
export type SessionInsert = InferInsertModel<typeof sessions>;
export type SessionUpdate = Partial<SessionInsert>;

// Account types
export type Account = InferSelectModel<typeof accounts>;
export type AccountInsert = InferInsertModel<typeof accounts>;
export type AccountUpdate = Partial<AccountInsert>;

// Verification token types
export type VerificationToken = InferSelectModel<typeof verificationTokens>;
export type VerificationTokenInsert = InferInsertModel<
  typeof verificationTokens
>;

// Admin activity log types
export type AdminActivityLog = InferSelectModel<typeof adminActivityLogs>;
export type AdminActivityLogInsert = InferInsertModel<typeof adminActivityLogs>;

// Auth session with user information
export type AuthSession = {
  user: User;
  session: Session;
};

// Auth context type for components
export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (data: UserRegistrationData) => Promise<void>;
  updateProfile: (data: UserUpdateData) => Promise<void>;
};

// Registration data type
export type UserRegistrationData = {
  name: string;
  email: string;
  password: string;
  image?: string;
};

// Profile update data type
export type UserUpdateData = {
  name?: string;
  email?: string;
  image?: string;
  bio?: string;
};

// Admin permissions type
export type AdminPermissions = {
  canCreatePosts: boolean;
  canEditPosts: boolean;
  canDeletePosts: boolean;
  canPublishPosts: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
  canViewAnalytics: boolean;
  canManageServices: boolean;
  canManageCategories: boolean;
  canManageTags: boolean;
  canManageAuthors: boolean;
  canExportData: boolean;
  canImportData: boolean;
};

// Role-based permissions mapping
export type RolePermissions = {
  [K in UserRole]: AdminPermissions;
};

// Auth error types
export type AuthError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

// Auth response types
export type AuthResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: AuthError;
};

// Login credentials type
export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

// Password reset types
export type PasswordResetRequest = {
  email: string;
};

export type PasswordResetData = {
  token: string;
  password: string;
  confirmPassword: string;
};

// Email verification types
export type EmailVerificationRequest = {
  email: string;
};

export type EmailVerificationData = {
  token: string;
};

// Activity log data type
export type ActivityLogData = {
  action: AdminAction;
  entityType: EntityType;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
};

// Export enums for convenience
export { UserRole, AccountType, AdminAction, EntityType };
