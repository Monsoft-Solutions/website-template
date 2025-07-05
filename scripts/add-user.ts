#!/usr/bin/env node

/**
 * Add User Script
 *
 * This script allows admins to add new users to the database
 * for the invitation-only registration system.
 *
 * Usage:
 *   npx tsx scripts/add-user.ts --email user@example.com --name "John Doe" --role editor
 *
 * Options:
 *   --email    User's email address (required)
 *   --name     User's full name (required)
 *   --role     User's role (optional, defaults to 'user')
 */

import { UserRole } from "@/lib/types/auth.type";
import { db } from "../lib/db";
import { user as users } from "../lib/db/schema/auth-schema";
import { eq } from "drizzle-orm";

// Parse command line arguments
const args = process.argv.slice(2);
const getArgValue = (flag: string): string | undefined => {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : undefined;
};

const email = getArgValue("--email");
const name = getArgValue("--name");
const role = getArgValue("--role") || "user";

// Validate required arguments
if (!email || !name) {
  console.error("❌ Error: Both --email and --name are required");
  console.log("\nUsage:");
  console.log(
    '  npx tsx scripts/add-user.ts --email user@example.com --name "John Doe" --role editor'
  );
  console.log("\nOptions:");
  console.log("  --email    User's email address (required)");
  console.log("  --name     User's full name (required)");
  console.log("  --role     User's role (optional, defaults to 'user')");
  console.log("\nValid roles: user, viewer, editor, admin");
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error("❌ Error: Invalid email format");
  process.exit(1);
}

// Validate role
const validRoles = Object.keys(UserRole).map((role) => role.toLowerCase());
if (!validRoles.includes(role)) {
  console.error(
    `❌ Error: Invalid role '${role}'. Valid roles are: ${validRoles.join(
      ", "
    )}`
  );
  process.exit(1);
}

async function addUser() {
  try {
    console.log("🔍 Checking if user already exists...");

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email!.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      console.error(`❌ Error: User with email '${email}' already exists`);
      console.log("\nExisting user details:");
      console.log(`  ID: ${existingUser[0].id}`);
      console.log(`  Name: ${existingUser[0].name}`);
      console.log(`  Email: ${existingUser[0].email}`);
      console.log(`  Role: ${existingUser[0].role}`);
      console.log(`  Created: ${existingUser[0].createdAt}`);
      process.exit(1);
    }

    console.log("➕ Adding new user...");

    // Add new user
    const [newUser] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        email: email!.toLowerCase(),
        name: name!,
        role,
        emailVerified: true,
      })
      .returning();

    console.log("✅ User added successfully!");
    console.log("\nUser details:");
    console.log(`  ID: ${newUser.id}`);
    console.log(`  Name: ${newUser.name}`);
    console.log(`  Email: ${newUser.email}`);
    console.log(`  Role: ${newUser.role}`);
    console.log(`  Created: ${newUser.createdAt}`);

    console.log("\n📧 Next steps:");
    console.log("1. Share the registration URL with the user:");
    console.log(
      `   ${
        process.env.BETTER_AUTH_URL || "http://localhost:3000"
      }/auth/register`
    );
    console.log("2. They will verify their email and set their password");
    console.log("3. Once registered, they can sign in normally");
  } catch (error) {
    console.error("❌ Error adding user:", error);
    process.exit(1);
  }
}

// Run the script
addUser()
  .then(() => {
    console.log("\n🎉 Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  });
