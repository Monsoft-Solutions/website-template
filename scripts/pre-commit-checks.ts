#!/usr/bin/env tsx

import { execSync } from "child_process";
import { exit } from "process";
import { existsSync } from "fs";

interface CheckResult {
  name: string;
  success: boolean;
  output?: string;
  error?: string;
}

/**
 * Executes a shell command and returns the result
 */
const runCommand = (command: string, description: string): CheckResult => {
  console.log(`🔍 Running ${description}...`);

  try {
    const output = execSync(command, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });

    console.log(`✅ ${description} passed`);
    return {
      name: description,
      success: true,
      output: output.toString(),
    };
  } catch (error: unknown) {
    const execError = error as {
      stdout?: string;
      stderr?: string;
      message?: string;
    };
    console.log(`❌ ${description} failed`);
    console.log(execError.stdout?.toString() || "");
    console.error(execError.stderr?.toString() || "");

    return {
      name: description,
      success: false,
      error:
        execError.stderr?.toString() || execError.message || "Unknown error",
    };
  }
};

/**
 * Get list of staged files for specific extensions
 */
const getStagedFiles = (extensions: string[]): string[] => {
  try {
    const output = execSync("git diff --cached --name-only", {
      encoding: "utf-8",
    });
    const files = output.trim().split("\n").filter(Boolean);

    return files
      .filter((file) => extensions.some((ext) => file.endsWith(ext)))
      .filter((file) => existsSync(file)); // Only include files that actually exist
  } catch {
    return [];
  }
};

/**
 * Main function to run all pre-commit checks
 */
async function runPreCommitChecks(): Promise<void> {
  console.log("🚀 Running pre-commit checks...\n");

  const results: CheckResult[] = [];

  // Get staged TypeScript/JavaScript files
  const stagedFiles = getStagedFiles([".ts", ".tsx", ".js", ".jsx"]);

  if (stagedFiles.length === 0) {
    console.log("ℹ️  No TypeScript/JavaScript files staged, skipping checks");
    return;
  }

  console.log(`📁 Found ${stagedFiles.length} staged files to check\n`);

  // 1. TypeScript type checking
  results.push(
    runCommand("npx tsc --noEmit --skipLibCheck", "TypeScript type checking")
  );

  // 2. ESLint check - filter out lib/data files since they're no longer needed
  const filesToLint = stagedFiles.filter((file) => !file.includes("lib/data/"));
  results.push(
    runCommand(
      `npx eslint ${filesToLint.join(" ")} --max-warnings 0`,
      "ESLint validation"
    )
  );

  // 3. Next.js build check (only if there are significant changes)
  if (
    stagedFiles.some(
      (file) =>
        file.includes("app/") ||
        file.includes("components/") ||
        file.includes("lib/") ||
        file.includes("next.config")
    )
  ) {
    results.push(runCommand("npm run build", "Next.js build verification"));
  }

  // 4. Database schema check (if schema files are modified)
  const schemaFiles = stagedFiles.filter(
    (file) => file.includes("schema") || file.includes("migration")
  );

  if (schemaFiles.length > 0) {
    results.push(
      runCommand("npm run db:generate", "Database schema validation")
    );
  }

  // Report results
  console.log("\n📊 Pre-commit check results:");
  console.log("================================");

  const failed = results.filter((r) => !r.success);
  const passed = results.filter((r) => r.success);

  if (passed.length > 0) {
    console.log("\n✅ Passed checks:");
    passed.forEach((result) => console.log(`  • ${result.name}`));
  }

  if (failed.length > 0) {
    console.log("\n❌ Failed checks:");
    failed.forEach((result) => console.log(`  • ${result.name}`));

    console.log("\n🚫 Commit blocked due to failed checks.");
    console.log("Please fix the issues above and try again.");
    exit(1);
  }

  console.log("\n🎉 All checks passed! Proceeding with commit...");
}

// Run the checks
runPreCommitChecks().catch((error) => {
  console.error("💥 Pre-commit checks failed with error:", error);
  exit(1);
});
