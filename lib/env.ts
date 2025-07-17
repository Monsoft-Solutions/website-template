import { config } from "dotenv";

// Declare process global for Node.js environment
declare const process: {
  env: Record<string, string | undefined>;
  exit: (code?: number) => never;
};

// Load environment variables from .env (Next.js convention)
config({ path: ".env" });

/**
 * Environment variable schema definition
 */
type EnvSchema = {
  // Database
  DATABASE_URL: string;

  // Application
  NODE_ENV: "development" | "production" | "test";
  NEXT_PUBLIC_SITE_URL: string;

  // Security
  NEXTAUTH_SECRET?: string;
  NEXTAUTH_URL?: string;

  // Better Auth
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;

  // Email (if needed)
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;

  // Storage (if using cloud storage)
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;

  // Analytics (if needed)
  GOOGLE_ANALYTICS_ID?: string;

  // OpenAI
  OPENAI_API_KEY: string;

  // Anthropic
  ANTHROPIC_API_KEY: string;
};

/**
 * Required environment variables that must be present
 */
const REQUIRED_ENV_VARS: (keyof EnvSchema)[] = [
  "DATABASE_URL",
  "NODE_ENV",
  "NEXT_PUBLIC_SITE_URL",
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
];

/**
 * Validate and parse environment variables
 */
const validateEnv = (): EnvSchema => {
  const env = process.env;
  const errors: string[] = [];

  // Check required variables
  for (const key of REQUIRED_ENV_VARS) {
    if (!env[key]) {
      errors.push(`${key} is required but not defined`);
    }
  }

  // Validate NODE_ENV values
  if (
    env.NODE_ENV &&
    !["development", "production", "test"].includes(env.NODE_ENV)
  ) {
    errors.push("NODE_ENV must be 'development', 'production', or 'test'");
  }

  // Validate DATABASE_URL format
  if (env.DATABASE_URL && !env.DATABASE_URL.startsWith("postgresql://")) {
    errors.push("DATABASE_URL must be a valid PostgreSQL connection string");
  }

  // Validate NEXT_PUBLIC_SITE_URL format
  if (env.NEXT_PUBLIC_SITE_URL) {
    try {
      new URL(env.NEXT_PUBLIC_SITE_URL);
    } catch {
      errors.push("NEXT_PUBLIC_SITE_URL must be a valid URL");
    }
  }

  // Validate SMTP_PORT if provided
  if (env.SMTP_PORT && isNaN(Number(env.SMTP_PORT))) {
    errors.push("SMTP_PORT must be a valid number");
  }

  if (errors.length > 0) {
    console.error("❌ Environment validation failed:");
    errors.forEach((error) => console.error(`  • ${error}`));
    console.error(
      "\n💡 Please check your .env file and ensure all required variables are set."
    );
    console.error("📄 Refer to .env.example for the expected format.");
    process.exit(1);
  }

  return {
    // Database
    DATABASE_URL: env.DATABASE_URL!,

    // Application
    NODE_ENV: (env.NODE_ENV as EnvSchema["NODE_ENV"]) || "development",
    NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL!,

    // Security
    NEXTAUTH_SECRET: env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: env.NEXTAUTH_URL,

    // Better Auth
    BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: env.BETTER_AUTH_URL,

    // Email
    SMTP_HOST: env.SMTP_HOST,
    SMTP_PORT: env.SMTP_PORT,
    SMTP_USER: env.SMTP_USER,
    SMTP_PASS: env.SMTP_PASS,

    // Storage
    CLOUDINARY_CLOUD_NAME: env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: env.CLOUDINARY_API_SECRET,

    // Analytics
    GOOGLE_ANALYTICS_ID: env.GOOGLE_ANALYTICS_ID,

    // AI API Keys
    OPENAI_API_KEY: env.OPENAI_API_KEY!,
    ANTHROPIC_API_KEY: env.ANTHROPIC_API_KEY!,
  };
};

/**
 * Validated environment configuration
 * Use this throughout your application instead of process.env
 */
export const env = validateEnv();

/**
 * Utility functions for environment checks
 */
export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";

/**
 * Type export for external usage
 */
export type { EnvSchema };
