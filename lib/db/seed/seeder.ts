import type { SeedOperation, SeedResult } from "./types/seed-config.type";

/**
 * Import all seed operations - this will automatically discover new seeds
 * when they are added to the operations/index.ts file
 */
import * as seedOperations from "./operations/index";

/**
 * Get all seed operations sorted by execution order
 */
const getAllSeedOperations = (): SeedOperation[] => {
  const operations = Object.values(seedOperations) as SeedOperation[];
  return operations.sort((a, b) => a.config.order - b.config.order);
};

/**
 * Execute a single seed operation with timing and error handling
 */
const executeSeedOperation = async (
  operation: SeedOperation
): Promise<SeedResult> => {
  const startTime = performance.now();

  try {
    console.log(`🌱 Seeding ${operation.config.name}...`);
    console.log(`   Description: ${operation.config.description}`);

    const recordsCreated = await operation.execute();
    const executionTime = performance.now() - startTime;

    console.log(
      `✅ Created ${recordsCreated} ${
        operation.config.name
      } records (${executionTime.toFixed(2)}ms)`
    );

    return {
      name: operation.config.name,
      recordsCreated,
      executionTime,
      success: true,
    };
  } catch (error) {
    const executionTime = performance.now() - startTime;
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error(
      `❌ Failed to seed ${operation.config.name}: ${errorMessage}`
    );

    return {
      name: operation.config.name,
      recordsCreated: 0,
      executionTime,
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Clear all data in reverse order of dependencies
 */
const clearAllData = async (): Promise<void> => {
  console.log("🗑️  Clearing existing data...");

  const operations = getAllSeedOperations().reverse(); // Clear in reverse order

  for (const operation of operations) {
    try {
      await operation.clear();
      console.log(`   Cleared ${operation.config.name}`);
    } catch (error) {
      console.warn(
        `   Warning: Could not clear ${operation.config.name}:`,
        error
      );
    }
  }
};

/**
 * Execute all seed operations in the correct order
 */
const executeAllSeeds = async (): Promise<SeedResult[]> => {
  const operations = getAllSeedOperations();
  const results: SeedResult[] = [];

  console.log(`📝 Found ${operations.length} seed operations to execute:`);
  operations.forEach((op) => {
    console.log(
      `   ${op.config.order}. ${op.config.name} - ${op.config.description}`
    );
  });
  console.log("");

  for (const operation of operations) {
    const result = await executeSeedOperation(operation);
    results.push(result);

    // Stop execution if a seed fails
    if (!result.success) {
      console.error(`🛑 Stopping execution due to failed seed: ${result.name}`);
      break;
    }
  }

  return results;
};

/**
 * Print summary of seed execution results
 */
const printSummary = (results: SeedResult[]): void => {
  console.log("\n🎉 Database seeding completed!");
  console.log("\n📊 Summary:");

  const totalRecords = results.reduce((sum, r) => sum + r.recordsCreated, 0);
  const totalTime = results.reduce((sum, r) => sum + r.executionTime, 0);
  const successCount = results.filter((r) => r.success).length;
  const failureCount = results.filter((r) => !r.success).length;

  console.log(`   Operations: ${successCount}/${results.length} successful`);
  console.log(`   Total records: ${totalRecords}`);
  console.log(`   Total time: ${totalTime.toFixed(2)}ms`);

  if (failureCount > 0) {
    console.log(`\n❌ Failed operations (${failureCount}):`);
    results
      .filter((r) => !r.success)
      .forEach((r) => console.log(`   - ${r.name}: ${r.error}`));
  }

  console.log("\n📋 Detailed results:");
  results.forEach((result) => {
    const status = result.success ? "✅" : "❌";
    console.log(
      `   ${status} ${result.name}: ${
        result.recordsCreated
      } records (${result.executionTime.toFixed(2)}ms)`
    );
  });
};

/**
 * Main orchestrator function
 */
export const runSeeds = async (): Promise<void> => {
  console.log("🌱 Starting database seeding...\n");

  try {
    // Clear existing data
    await clearAllData();
    console.log("");

    // Execute all seeds
    const results = await executeAllSeeds();

    // Print summary
    printSummary(results);

    // Check if all operations succeeded
    const hasFailures = results.some((r) => !r.success);
    if (hasFailures) {
      throw new Error("Some seed operations failed");
    }
  } catch (error) {
    console.error("❌ Seed orchestration failed:", error);
    throw error;
  }
};
