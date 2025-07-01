import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "dotenv";
import * as schema from "./schema";

// Load environment variables
config({ path: ".env.local" });

// Validate database URL
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL environment variable is required. Please add it to your .env.local file."
  );
}

// Create PostgreSQL connection
const client = postgres(databaseUrl, {
  max: 20, // Maximum number of connections
  idle_timeout: 20, // Close connections after 20 seconds of inactivity
  connect_timeout: 10, // Connection timeout in seconds
  prepare: false, // Disable prepared statements for serverless compatibility
});

// Create Drizzle database instance
export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV === "development", // Enable logging in development
});

// Export the client for direct usage if needed
export { client };

// Export schema types for convenience
export * from "./schema";
