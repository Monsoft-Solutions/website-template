import { db } from "../../index";
import { user as users } from "../../schema/auth-schema";
import { UserRole } from "../../schema/auth-enums";
import { SeedOperation } from "../types/seed-config.type";
import { eq } from "drizzle-orm";

/**
 * Admin user seed operation
 * Creates an initial admin user for the system
 */
export const adminUserSeed: SeedOperation = {
  config: {
    name: "Admin User",
    order: 1,
    description: "Create initial admin user account",
  },

  async execute() {
    console.log("🔧 Creating admin user...");

    const adminEmail = "admin@site-wave.com";
    const adminName = "Site Wave Admin";

    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log("⚠️  Admin user already exists, skipping creation");
      return 0;
    }

    // Create admin user
    const [adminUser] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        email: adminEmail,
        name: adminName,
        role: UserRole.ADMIN,
        emailVerified: true,
        bio: "System administrator account",
        // Password will need to be set through the auth system
        // User will need to use password reset to set initial password
      })
      .returning();

    console.log(`✅ Admin user created:`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   ⚠️  Use password reset to set initial password`);

    return 1; // Return number of records created
  },

  async clear() {
    console.log("🧹 Cleaning up admin user...");

    const adminEmail = "admin@site-wave.com";

    await db.delete(users).where(eq(users.email, adminEmail));

    console.log(`✅ Deleted admin user records`);
  },
};
