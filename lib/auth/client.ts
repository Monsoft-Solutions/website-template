import { createAuthClient } from "better-auth/react";
import { getClientAuthUrl } from "../env-client";

/**
 * Better Auth client for React components
 */
export const authClient = createAuthClient({
  baseURL: getClientAuthUrl(),
  // Additional client configuration can be added here
});

// Type-safe auth client hooks and methods
export const { useSession, signIn, signOut, signUp, getSession } = authClient;
