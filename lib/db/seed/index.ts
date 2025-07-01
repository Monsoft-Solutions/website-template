#!/usr/bin/env node

import { runSeeds } from "./seeder";

/**
 * Main entry point for the seed command
 * This file will be executed when running the seed script
 */
const main = async (): Promise<void> => {
  try {
    await runSeeds();
    console.log("\n🎉 All seeds completed successfully!");
  } catch (error) {
    console.error("\n❌ Seed script failed:", error);
    throw error;
  }
};

// Run the main function
main().catch((error) => {
  console.error("Unexpected error:", error);
  throw error;
});
