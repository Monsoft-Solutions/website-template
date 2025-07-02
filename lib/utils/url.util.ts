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

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Default fallback
  return "http://localhost:3000";
}
