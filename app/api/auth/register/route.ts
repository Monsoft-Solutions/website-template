import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user as users } from "@/lib/db/schema/auth-schema";
import { account as accounts } from "@/lib/db/schema/auth-schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { z } from "zod";

// Validation schema for registration
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

/**
 * POST endpoint - Handle user registration (invitation-only)
 * Users must already exist in the database to register
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          message: validationResult.error.errors
            .map((e) => e.message)
            .join(", "),
        },
        { status: 400 }
      );
    }

    const { email, password, name } = validationResult.data;

    // Check if user exists in database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
          message:
            "This email is not registered for an account. Please contact an administrator to get invited.",
        },
        { status: 404 }
      );
    }

    const user = existingUser[0];

    // Check if user already has a password (already registered)
    // We'll check if they have any credential accounts
    const existingAccount = await db
      .select()
      .from(accounts)
      .where(
        and(eq(accounts.userId, user.id), eq(accounts.providerId, "credential"))
      )
      .limit(1);

    if (existingAccount.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "User already registered",
          message:
            "This user has already set up their password. Please use the sign-in page instead.",
        },
        { status: 409 }
      );
    }

    // Update user name if provided and different
    if (name && name !== user.name) {
      await db
        .update(users)
        .set({
          name,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));
    }

    // Delete existing user and create new user with Better Auth
    try {
      // Store user info before deletion
      const userInfo = {
        email: user.email,
        name: name || user.name,
        role: user.role,
        bio: user.bio,
        lang: user.lang,
      };

      // Delete existing user record (this will cascade to related records)
      await db.delete(users).where(eq(users.id, user.id));

      // Create new user with Better Auth's signUpEmail
      const result = await auth.api.signUpEmail({
        body: {
          email: userInfo.email,
          password,
          name: userInfo.name,
          bio: userInfo.bio,
          lang: userInfo.lang,
          role: userInfo.role,
        },
      });

      // Better Auth's signUpEmail returns user and session on success
      if (result && result.user) {
        // Update the newly created user with the original role
        await db
          .update(users)
          .set({
            emailVerified: true,
            updatedAt: new Date(),
          })
          .where(eq(users.email, userInfo.email));

        return NextResponse.json({
          success: true,
          message:
            "Registration successful! You can now sign in with your credentials.",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Registration failed",
            message: "Failed to create account. Please try again.",
          },
          { status: 400 }
        );
      }
    } catch (authError) {
      console.error("Registration error:", authError);
      return NextResponse.json(
        {
          success: false,
          error: "Registration failed",
          message: "Failed to create account. Please try again.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint - Check if email exists (for validation)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email parameter is required",
        },
        { status: 400 }
      );
    }

    // Check if user exists in database
    const existingUser = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({
        success: false,
        exists: false,
        message: "This email is not registered for an account.",
      });
    }

    const user = existingUser[0];

    // Check if user already has a password
    const existingAccount = await db
      .select()
      .from(accounts)
      .where(
        and(eq(accounts.userId, user.id), eq(accounts.providerId, "credential"))
      )
      .limit(1);

    if (existingAccount.length > 0) {
      return NextResponse.json({
        success: false,
        exists: true,
        alreadyRegistered: true,
        message: "This user has already set up their password.",
      });
    }

    return NextResponse.json({
      success: true,
      exists: true,
      alreadyRegistered: false,
      userName: user.name,
      message: "Email found. You can proceed with registration.",
    });
  } catch (error) {
    console.error("Email check error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to check email. Please try again.",
      },
      { status: 500 }
    );
  }
}

/**
 * Other methods not allowed
 */
export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
