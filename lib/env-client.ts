/**
 * Client-side environment configuration for Next.js
 * Only includes variables prefixed with NEXT_PUBLIC_ that are safe for client-side use
 *
 * Note: This file safely handles environment variables in both server and client environments.
 */

/**
 * Client-side environment variable schema
 */
type ClientEnvSchema = {
  // Site Configuration
  NEXT_PUBLIC_SITE_URL: string;
  NEXT_PUBLIC_SITE_NAME?: string;
  NEXT_PUBLIC_SITE_DESCRIPTION?: string;

  // Authentication
  NEXT_PUBLIC_BETTER_AUTH_URL?: string;

  // Analytics
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?: string;

  // Site Verification
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
  NEXT_PUBLIC_YANDEX_VERIFICATION?: string;
  NEXT_PUBLIC_BING_VERIFICATION?: string;

  // Application Environment
  NODE_ENV: "development" | "production" | "test";
};

/**
 * Safe getter for environment variables
 */
const getEnvVar = (key: string): string | undefined => {
  try {
    // In Next.js, NEXT_PUBLIC_ variables are replaced at build time and should be available
    return process.env[key];
  } catch {
    // Fallback for browser environments where process might not be available
    return undefined;
  }
};

/**
 * Get environment variables safely
 */
const getEnvVars = (): ClientEnvSchema => {
  const siteUrl = getEnvVar("NEXT_PUBLIC_SITE_URL");
  const siteName = getEnvVar("NEXT_PUBLIC_SITE_NAME");
  const siteDescription = getEnvVar("NEXT_PUBLIC_SITE_DESCRIPTION");
  const betterAuthUrl = getEnvVar("NEXT_PUBLIC_BETTER_AUTH_URL");
  const googleAnalyticsId = getEnvVar("NEXT_PUBLIC_GOOGLE_ANALYTICS_ID");
  const googleSiteVerification = getEnvVar(
    "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"
  );
  const yandexVerification = getEnvVar("NEXT_PUBLIC_YANDEX_VERIFICATION");
  const bingVerification = getEnvVar("NEXT_PUBLIC_BING_VERIFICATION");
  const nodeEnv = getEnvVar("NODE_ENV") as ClientEnvSchema["NODE_ENV"];

  return {
    NEXT_PUBLIC_SITE_URL:
      siteUrl ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000"),
    NEXT_PUBLIC_SITE_NAME: siteName,
    NEXT_PUBLIC_SITE_DESCRIPTION: siteDescription,
    NEXT_PUBLIC_BETTER_AUTH_URL: betterAuthUrl,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: googleAnalyticsId,
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: googleSiteVerification,
    NEXT_PUBLIC_YANDEX_VERIFICATION: yandexVerification,
    NEXT_PUBLIC_BING_VERIFICATION: bingVerification,
    NODE_ENV: nodeEnv || "development",
  };
};

/**
 * Validate environment variables (only in server environment)
 */
const validateEnvVars = (env: ClientEnvSchema): void => {
  // Only validate in server environment
  if (typeof window !== "undefined") return;

  const errors: string[] = [];

  // Check required variables
  if (!env.NEXT_PUBLIC_SITE_URL) {
    errors.push("NEXT_PUBLIC_SITE_URL is required but not defined");
  }

  if (!env.NODE_ENV) {
    errors.push("NODE_ENV is required but not defined");
  }

  // Validate NODE_ENV values
  if (
    env.NODE_ENV &&
    !["development", "production", "test"].includes(env.NODE_ENV)
  ) {
    errors.push("NODE_ENV must be 'development', 'production', or 'test'");
  }

  // Validate NEXT_PUBLIC_SITE_URL format
  if (env.NEXT_PUBLIC_SITE_URL) {
    try {
      new URL(env.NEXT_PUBLIC_SITE_URL);
    } catch {
      errors.push("NEXT_PUBLIC_SITE_URL must be a valid URL");
    }
  }

  // Validate NEXT_PUBLIC_BETTER_AUTH_URL format if provided
  if (env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    try {
      new URL(env.NEXT_PUBLIC_BETTER_AUTH_URL);
    } catch {
      errors.push("NEXT_PUBLIC_BETTER_AUTH_URL must be a valid URL");
    }
  }

  if (errors.length > 0) {
    console.error("❌ Client-side environment validation failed:");
    errors.forEach((error) => console.error(`  • ${error}`));
    console.error(
      "\n💡 Please check your .env file and ensure all required variables are set."
    );
    console.error(
      "📄 Make sure client-side variables are prefixed with NEXT_PUBLIC_"
    );
    throw new Error("Client-side environment validation failed");
  }
};

/**
 * Get and validate client-side environment configuration
 */
const createClientEnv = (): ClientEnvSchema => {
  const env = getEnvVars();
  validateEnvVars(env);
  return env;
};

/**
 * Validated client-side environment configuration
 * Use this in React components and client-side code
 */
export const clientEnv = createClientEnv();

/**
 * Utility functions for client-side environment checks
 */
export const isDevelopment = clientEnv.NODE_ENV === "development";
export const isProduction = clientEnv.NODE_ENV === "production";
export const isTest = clientEnv.NODE_ENV === "test";

/**
 * Helper function to get the base URL for client-side usage
 */
export const getClientBaseUrl = (): string => {
  return clientEnv.NEXT_PUBLIC_SITE_URL;
};

/**
 * Helper function to get the Better Auth URL for client-side usage
 */
export const getClientAuthUrl = (): string => {
  return (
    clientEnv.NEXT_PUBLIC_BETTER_AUTH_URL || clientEnv.NEXT_PUBLIC_SITE_URL
  );
};

/**
 * Type export for external usage
 */
export type { ClientEnvSchema };
