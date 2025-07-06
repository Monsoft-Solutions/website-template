import { auth } from "./auth";
import { headers } from "next/headers";
import type { User, Session } from "../types/auth.type";

/**
 * Server-side authentication utilities for Better Auth
 */

/**
 * Get the current session and user from Better Auth on the server side
 * This can be used in API routes and server components
 */
export async function getSession(): Promise<{
  user: User | null;
  session: Session | null;
}> {
  try {
    // Get the session from Better Auth using the request headers
    const result = await auth.api.getSession({
      headers: await headers(),
    });

    if (!result || !result.user || !result.session) {
      return { user: null, session: null };
    }

    return {
      user: result.user as User,
      session: result.session as Session,
    };
  } catch (error) {
    console.error("Error getting session:", error);
    return { user: null, session: null };
  }
}

/**
 * Get the current user from Better Auth on the server side
 * Convenience function that returns only the user
 */
export async function getCurrentUser(): Promise<User | null> {
  const { user } = await getSession();
  return user;
}

/**
 * Check if the current user has admin privileges
 */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  if (user.role !== "admin" && user.role !== "editor") {
    throw new Error("Admin privileges required");
  }

  return user;
}

/**
 * Check if the current user is authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}
