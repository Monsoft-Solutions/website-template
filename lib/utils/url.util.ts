import { clientEnv } from "../env-client";

/**
 * Get the base URL of the application
 * Handles both server and client side rendering
 */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side
    return window.location.origin;
  }

  // Server-side - use environment variables or fallback
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (clientEnv.NEXT_PUBLIC_SITE_URL) {
    return clientEnv.NEXT_PUBLIC_SITE_URL;
  }

  // Default fallback
  return "http://localhost:3000";
}
