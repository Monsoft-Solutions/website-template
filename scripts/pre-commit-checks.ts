#!/usr/bin/env tsx

import { execSync } from "child_process";
import { exit } from "process";
import { existsSync } from "fs";

// Constants for file extensions and patterns
const FILE_PATTERNS = {
  TYPESCRIPT_EXTENSIONS: [".ts", ".tsx", ".js", ".jsx"],
  SIGNIFICANT_DIRECTORIES: ["app/", "components/", "lib/", "next.config"],
  SCHEMA_PATTERNS: ["schema", "migration"],
  EXCLUDED_PATHS: ["lib/data/"],
} as const;

// Command configurations
const COMMANDS = {
  GIT_STAGED: "git diff --cached --name-only",
  TYPESCRIPT_CHECK: "npx tsc --noEmit --skipLibCheck",
  ESLINT_CHECK: "npx eslint",
  ESLINT_OPTIONS: "--max-warnings 0",
  BUILD_CHECK: "npm run build",
  DB_GENERATE: "npm run db:generate",
} as const;

// Console messages
const MESSAGES = {
  RUNNING_CHECKS: "🚀 Running pre-commit checks...\n",
  NO_FILES_STAGED: "ℹ️  No TypeScript/JavaScript files staged, skipping checks",
  FILES_FOUND: (count: number) => `📁 Found ${count} staged files to check\n`,
  RUNNING_CHECK: (description: string) => `🔍 Running ${description}...`,
  CHECK_PASSED: (description: string) => `✅ ${description} passed`,
  CHECK_FAILED: (description: string) => `❌ ${description} failed`,
  RESULTS_HEADER: "\n📊 Pre-commit check results:",
  RESULTS_SEPARATOR: "================================",
  PASSED_CHECKS: "\n✅ Passed checks:",
  FAILED_CHECKS: "\n❌ Failed checks:",
  COMMIT_BLOCKED: "\n🚫 Commit blocked due to failed checks.",
  FIX_ISSUES: "Please fix the issues above and try again.",
  ALL_PASSED: "\n🎉 All checks passed! Proceeding with commit...",
  SCRIPT_ERROR: "💥 Pre-commit checks failed with error:",
} as const;

// Check descriptions
const CHECK_DESCRIPTIONS = {
  TYPESCRIPT: "TypeScript type checking",
  ESLINT: "ESLint validation",
  BUILD: "Next.js build verification",
  DATABASE: "Database schema validation",
} as const;

// Type definitions
interface CheckResult {
  name: string;
  success: boolean;
  output?: string;
  error?: string;
}

interface ExecError {
  stdout?: string;
  stderr?: string;
  message?: string;
}

/**
 * Executes a shell command and returns the result
 */
const runCommand = (command: string, description: string): CheckResult => {
  console.log(MESSAGES.RUNNING_CHECK(description));

  try {
    const output = execSync(command, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });

    console.log(MESSAGES.CHECK_PASSED(description));
    return {
      name: description,
      success: true,
      output: output.toString(),
    };
  } catch (error: unknown) {
    const execError = error as ExecError;
    console.log(MESSAGES.CHECK_FAILED(description));

    // Log stdout and stderr if available
    if (execError.stdout) {
      console.log(execError.stdout.toString());
    }
    if (execError.stderr) {
      console.error(execError.stderr.toString());
    }

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
    const output = execSync(COMMANDS.GIT_STAGED, {
      encoding: "utf-8",
    });
    const files = output.trim().split("\n").filter(Boolean);

    return files
      .filter((file) => extensions.some((ext) => file.endsWith(ext)))
      .filter((file) => existsSync(file)); // Only include files that actually exist
  } catch (error) {
    console.error("Error getting staged files:", error);
    return [];
  }
};

/**
 * Check if files include significant directories that require build verification
 */
const hasSignificantChanges = (files: string[]): boolean => {
  return files.some((file) =>
    FILE_PATTERNS.SIGNIFICANT_DIRECTORIES.some((dir) => file.includes(dir))
  );
};

/**
 * Check if files include schema or migration files
 */
const hasSchemaChanges = (files: string[]): boolean => {
  return files.some((file) =>
    FILE_PATTERNS.SCHEMA_PATTERNS.some((pattern) => file.includes(pattern))
  );
};

/**
 * Filter out excluded paths from file list
 */
const filterExcludedPaths = (files: string[]): string[] => {
  return files.filter(
    (file) => !FILE_PATTERNS.EXCLUDED_PATHS.some((path) => file.includes(path))
  );
};

/**
 * Escape file paths for shell command
 */
const escapeFilePaths = (files: string[]): string => {
  return files.map((file) => `"${file}"`).join(" ");
};

/**
 * Display check results
 */
const displayResults = (results: CheckResult[]): void => {
  console.log(MESSAGES.RESULTS_HEADER);
  console.log(MESSAGES.RESULTS_SEPARATOR);

  const failed = results.filter((r) => !r.success);
  const passed = results.filter((r) => r.success);

  if (passed.length > 0) {
    console.log(MESSAGES.PASSED_CHECKS);
    passed.forEach((result) => console.log(`  • ${result.name}`));
  }

  if (failed.length > 0) {
    console.log(MESSAGES.FAILED_CHECKS);
    failed.forEach((result) => console.log(`  • ${result.name}`));

    console.log(MESSAGES.COMMIT_BLOCKED);
    console.log(MESSAGES.FIX_ISSUES);
    exit(1);
  }

  console.log(MESSAGES.ALL_PASSED);
};

/**
 * Main function to run all pre-commit checks
 */
async function runPreCommitChecks(): Promise<void> {
  console.log(MESSAGES.RUNNING_CHECKS);

  const results: CheckResult[] = [];

  // Get staged TypeScript/JavaScript files
  const stagedFiles = getStagedFiles([...FILE_PATTERNS.TYPESCRIPT_EXTENSIONS]);

  if (stagedFiles.length === 0) {
    console.log(MESSAGES.NO_FILES_STAGED);
    return;
  }

  console.log(MESSAGES.FILES_FOUND(stagedFiles.length));

  // 1. TypeScript type checking
  results.push(
    runCommand(COMMANDS.TYPESCRIPT_CHECK, CHECK_DESCRIPTIONS.TYPESCRIPT)
  );

  // 2. ESLint check - filter out excluded paths
  const filesToLint = filterExcludedPaths(stagedFiles);
  if (filesToLint.length > 0) {
    const escapedFiles = escapeFilePaths(filesToLint);
    const eslintCommand = `${COMMANDS.ESLINT_CHECK} ${escapedFiles} ${COMMANDS.ESLINT_OPTIONS}`;
    results.push(runCommand(eslintCommand, CHECK_DESCRIPTIONS.ESLINT));
  }

  // 3. Next.js build check (only if there are significant changes)
  if (hasSignificantChanges(stagedFiles)) {
    results.push(runCommand(COMMANDS.BUILD_CHECK, CHECK_DESCRIPTIONS.BUILD));
  }

  // 4. Database schema check (if schema files are modified)
  if (hasSchemaChanges(stagedFiles)) {
    results.push(runCommand(COMMANDS.DB_GENERATE, CHECK_DESCRIPTIONS.DATABASE));
  }

  // Display results
  displayResults(results);
}

// Run the checks
runPreCommitChecks().catch((error) => {
  console.error(MESSAGES.SCRIPT_ERROR, error);
  exit(1);
});
