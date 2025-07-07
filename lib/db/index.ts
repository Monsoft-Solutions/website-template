import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env, isDevelopment } from "../env";

// Create PostgreSQL connection
const client = postgres(env.DATABASE_URL, {
  max: 50, // Increased from 20 to handle more concurrent connections
  idle_timeout: 20, // Close connections after 20 seconds of inactivity
  connect_timeout: 10, // Connection timeout in seconds
  prepare: false, // Disable prepared statements for serverless compatibility
  debug: isDevelopment, // Log connection info in development
  onnotice: isDevelopment ? console.log : undefined, // Log notices in development
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
