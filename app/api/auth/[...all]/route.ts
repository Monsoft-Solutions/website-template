import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth API route handler
 * Handles all auth-related API endpoints
 */
export const { GET, POST } = toNextJsHandler(auth.handler);
