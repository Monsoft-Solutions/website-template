import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "../db";
import { users } from "../db/schema/user.table";
import { sessions } from "../db/schema/session.table";
import { accounts } from "../db/schema/account.table";
import { verificationTokens } from "../db/schema/verification-token.table";

/**
 * Better Auth configuration with Drizzle adapter
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verificationToken: verificationTokens,
    },
  }),

  // Authentication methods
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,
  },

  // Session configuration
  session: {
    cookieName: "better-auth.session",
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  // Base URL and secret
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL,
  secret: process.env.BETTER_AUTH_SECRET || process.env.NEXTAUTH_SECRET,

  // Email provider configuration
  emailVerification: {
    enabled: true,
    expiresIn: 60 * 60 * 24, // 24 hours
    sendOnSignUp: true,
  },

  // Advanced configuration
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
    generateId: () => {
      return crypto.randomUUID();
    },
  },

  // Plugins
  plugins: [
    nextCookies(), // Must be last plugin
  ],

  // Callbacks can be added later when needed
  // callbacks: {
  //   afterSignUp: async ({ user }) => {
  //     console.log("User signed up:", user.email);
  //     return user;
  //   },
  //   afterSignIn: async ({ user, session }) => {
  //     console.log("User signed in:", user.email);
  //     return { user, session };
  //   },
  // },
});
