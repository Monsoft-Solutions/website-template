import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env, isDevelopment } from "../env";

// Create PostgreSQL connection
const client = postgres(env.DATABASE_URL, {
  max: 20, // Maximum number of connections
  idle_timeout: 20, // Close connections after 20 seconds of inactivity
  connect_timeout: 10, // Connection timeout in seconds
  prepare: false, // Disable prepared statements for serverless compatibility
});

// Create Drizzle database instance
export const db = drizzle(client, {
  schema,
  logger: isDevelopment, // Enable logging in development
});

// Export the client for direct usage if needed
export { client };

// Export schema types for convenience
export * from "./schema";
