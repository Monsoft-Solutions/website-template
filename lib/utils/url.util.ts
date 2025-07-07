import { clientEnv } from "../env-client";

/**
 * Get the base URL of the application
 * Handles both server and client side rendering
 */
export function getBaseUrl(): string {
  let output = "";
  if (typeof window !== "undefined") {
    // Client-side
    output = window.location.origin;
  }

  // Server-side - use environment variables or fallback
  else if (process.env.VERCEL_URL) {
    output = `https://${process.env.VERCEL_URL}`;
  } else if (clientEnv.NEXT_PUBLIC_SITE_URL) {
    output = clientEnv.NEXT_PUBLIC_SITE_URL;
  } else {
    output = "http://localhost:3000";
  }

  console.log(`Base URL: ${output}`);
  // Default fallback
  return output;
}
