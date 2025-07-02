#!/usr/bin/env tsx

import { execSync } from "child_process";
import { existsSync, chmodSync } from "fs";

/**
 * Setup script for git hooks
 * Ensures pre-commit hooks are properly configured
 */
async function setupGitHooks(): Promise<void> {
  console.log("🔧 Setting up git hooks...\n");

  const hookPath = ".git/hooks/pre-commit";

  // Check if git repository exists
  if (!existsSync(".git")) {
    console.error("❌ No git repository found. Please run 'git init' first.");
    process.exit(1);
  }

  // Check if pre-commit hook exists
  if (!existsSync(hookPath)) {
    console.error("❌ Pre-commit hook not found at:", hookPath);
    console.log("Please ensure the pre-commit hook file exists.");
    process.exit(1);
  }

  // Make hook executable
  try {
    chmodSync(hookPath, "755");
    console.log("✅ Pre-commit hook is now executable");
  } catch (error) {
    console.error("❌ Failed to make pre-commit hook executable:", error);
    process.exit(1);
  }

  // Test the hook
  console.log("\n🧪 Testing pre-commit checks...");
  try {
    execSync("npm run check", { stdio: "inherit" });
    console.log("✅ Pre-commit checks are working correctly");
  } catch {
    console.log(
      "⚠️  Pre-commit checks encountered issues. This is normal if there are current linting errors."
    );
  }

  console.log("\n🎉 Git hooks setup complete!");
  console.log("\n📋 Available commands:");
  console.log("  npm run check       - Run pre-commit checks manually");
  console.log("  npm run pre-commit  - Same as above");
  console.log("  npm run lint        - Run only ESLint");
  console.log("  npm run build       - Test build process");

  console.log("\n📝 How it works:");
  console.log("  • The pre-commit hook runs automatically when you commit");
  console.log(
    "  • It checks TypeScript compilation, ESLint, and build process"
  );
  console.log("  • If any check fails, the commit is blocked");
  console.log("  • Only staged TypeScript/JavaScript files are checked");
  console.log("  • Database schema changes trigger additional validation");

  console.log("\n⚡ Pro tips:");
  console.log(
    "  • Run 'npm run check' before committing to catch issues early"
  );
  console.log(
    "  • Use 'git commit --no-verify' to skip hooks (emergency only)"
  );
  console.log("  • The hook only runs on TypeScript/JavaScript file changes");
}

setupGitHooks().catch((error) => {
  console.error("💥 Setup failed:", error);
  process.exit(1);
});
