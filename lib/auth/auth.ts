import { betterAuth, Session } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "../db";
import { User, UserRole } from "../types/auth.type";
import { user, session, account, verification } from "../db/schema/auth-schema";

/**
 * Better Auth configuration with Drizzle adapter
 */
export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.USER,
      },
      bio: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      lang: {
        type: "string",
        required: false,
        defaultValue: "en",
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
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
  callbacks: {
    afterSignUp: async ({ user }: { user: User }) => {
      console.log("User signed up:", user.email);
      return user;
    },
    afterSignIn: async ({
      user,
      session,
    }: {
      user: User;
      session: Session;
    }) => {
      console.log("User signed in:", user.email);
      return { user, session };
    },
  },
});
