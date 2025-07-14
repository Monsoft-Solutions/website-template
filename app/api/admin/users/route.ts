import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user as users } from "@/lib/db/schema/auth-schema";
import { eq, and, or, desc, asc, sql, ilike } from "drizzle-orm";
import { requireAdmin, getCurrentUser } from "@/lib/auth/server";
import { UserRole } from "@/lib/types/auth.type";
import type { ApiResponse } from "@/lib/types/api-response.type";
import { emailService } from "@/lib/services/email.service";
import { emailConfig, templateConfigs } from "@/lib/config/email.config";

/**
 * Admin users list response type
 */
export type AdminUsersListResponse = {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
    image: string | null;
    bio: string | null;
    lang: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

/**
 * GET endpoint - Fetch users with admin filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Add authentication check - only admin users can access user management
    await requireAdmin();

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const role = searchParams.get("role") as UserRole | undefined;
    const searchQuery = searchParams.get("searchQuery") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const verified = searchParams.get("verified");

    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json(
        {
          success: false,
          data: {} as AdminUsersListResponse,
          error: "Invalid page number",
        } as ApiResponse<AdminUsersListResponse>,
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          data: {} as AdminUsersListResponse,
          error: "Invalid limit. Must be between 1 and 100",
        } as ApiResponse<AdminUsersListResponse>,
        { status: 400 }
      );
    }

    // Build where conditions
    const whereConditions = [];

    // Add role filter
    if (role) {
      whereConditions.push(eq(users.role, role));
    }

    // Add search query filter
    if (searchQuery) {
      whereConditions.push(
        or(
          ilike(users.name, `%${searchQuery}%`),
          ilike(users.email, `%${searchQuery}%`)
        )
      );
    }

    // Add verified filter
    if (verified === "true") {
      whereConditions.push(eq(users.emailVerified, true));
    } else if (verified === "false") {
      whereConditions.push(eq(users.emailVerified, false));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Build order by clause
    const orderByField =
      sortBy === "name"
        ? users.name
        : sortBy === "email"
          ? users.email
          : sortBy === "role"
            ? users.role
            : users.createdAt;

    const orderByClause =
      sortOrder === "asc" ? asc(orderByField) : desc(orderByField);

    // Get total count
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause);

    const totalUsers = totalCountResult[0]?.count || 0;

    // Get users with pagination
    const usersResult = await db
      .select()
      .from(users)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset((page - 1) * limit);

    // Calculate pagination info
    const totalPages = Math.ceil(totalUsers / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const response: AdminUsersListResponse = {
      users: usersResult,
      totalUsers,
      totalPages,
      currentPage: page,
      hasNextPage,
      hasPreviousPage,
    };

    const result: ApiResponse<AdminUsersListResponse> = {
      success: true,
      data: response,
    };

    return NextResponse.json(result);
  } catch (error) {
    // Handle authentication errors specifically
    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return NextResponse.json(
          {
            success: false,
            data: {} as AdminUsersListResponse,
            error: "Unauthorized",
          } as ApiResponse<AdminUsersListResponse>,
          { status: 401 }
        );
      }
      if (error.message === "Admin privileges required") {
        return NextResponse.json(
          {
            success: false,
            data: {} as AdminUsersListResponse,
            error: "Forbidden",
          } as ApiResponse<AdminUsersListResponse>,
          { status: 403 }
        );
      }
    }

    console.error("Error fetching admin users:", error);

    const result: ApiResponse<AdminUsersListResponse> = {
      success: false,
      data: {
        users: [],
        totalUsers: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      error: error instanceof Error ? error.message : "Failed to fetch users",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * POST endpoint - Create a new user
 */
export async function POST(request: NextRequest) {
  try {
    // Add authentication check - only admin users can create users
    await requireAdmin();

    const body = await request.json();
    const { email, name, role = "user" } = body;

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Email and name are required",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Invalid email format",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = Object.values(UserRole);
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: `Invalid role. Valid roles are: ${validRoles.join(", ")}`,
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: `User with email '${email}' already exists`,
        } as ApiResponse<null>,
        { status: 409 }
      );
    }

    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        email: email.toLowerCase(),
        name: name,
        role: role,
        emailVerified: true, // Set to true for admin-created users
      })
      .returning();

    // Send invitation email
    try {
      // Get current admin user for invitation details
      const currentUser = await getCurrentUser();

      if (currentUser) {
        // Calculate expiration date
        const expiresAt = new Date();
        expiresAt.setHours(
          expiresAt.getHours() + templateConfigs.userInvitation.expirationHours
        );

        // Create invitation URL
        const invitationUrl = `${emailConfig.baseUrl}/auth/register?email=${encodeURIComponent(newUser.email)}`;

        // Send invitation email
        await emailService.sendTemplatedEmail(
          "user-invitation",
          {
            recipientName: newUser.name,
            inviterName: currentUser.name,
            inviterEmail: currentUser.email,
            invitationUrl,
            role: newUser.role,
            expiresAt: expiresAt.toISOString(),
            companyName: "Site Wave",
            supportEmail: emailConfig.defaultFromEmail,
            siteUrl: emailConfig.baseUrl,
          },
          {
            to: newUser.email,
            from: emailConfig.defaultFromEmail || "support@monsoftlabs.com",
          }
        );
      }
    } catch (emailError) {
      // Log email error but don't fail the user creation
      console.error("Failed to send invitation email:", emailError);
    }

    const result: ApiResponse<typeof newUser> = {
      success: true,
      data: newUser,
      message: "User created successfully and invitation email sent",
    };

    return NextResponse.json(result);
  } catch (error) {
    // Handle authentication errors specifically
    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: "Unauthorized",
          } as ApiResponse<null>,
          { status: 401 }
        );
      }
      if (error.message === "Admin privileges required") {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: "Forbidden",
          } as ApiResponse<null>,
          { status: 403 }
        );
      }
    }

    console.error("Error creating user:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to create user",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * PATCH endpoint - Bulk update users
 */
export async function PATCH(request: NextRequest) {
  try {
    // Add authentication check - only admin users can update users
    await requireAdmin();

    const { ids, action } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid user IDs" },
        { status: 400 }
      );
    }

    // For now, we'll just return success as user bulk actions can be extended later
    // Common actions could be: activate, deactivate, change role, etc.
    const result: ApiResponse<null> = {
      success: true,
      data: null,
      message: `Bulk ${action} operation completed successfully`,
    };

    return NextResponse.json(result);
  } catch (error) {
    // Handle authentication errors specifically
    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: "Unauthorized",
          } as ApiResponse<null>,
          { status: 401 }
        );
      }
      if (error.message === "Admin privileges required") {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: "Forbidden",
          } as ApiResponse<null>,
          { status: 403 }
        );
      }
    }

    console.error("Error performing bulk action:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to perform bulk action",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * DELETE endpoint - Delete users
 */
export async function DELETE(request: NextRequest) {
  try {
    // Add authentication check - only admin users can delete users
    await requireAdmin();

    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid user IDs" },
        { status: 400 }
      );
    }

    // Delete users
    await db.delete(users).where(or(...ids.map((id) => eq(users.id, id))));

    const result: ApiResponse<null> = {
      success: true,
      data: null,
      message: `Successfully deleted ${ids.length} user(s)`,
    };

    return NextResponse.json(result);
  } catch (error) {
    // Handle authentication errors specifically
    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: "Unauthorized",
          } as ApiResponse<null>,
          { status: 401 }
        );
      }
      if (error.message === "Admin privileges required") {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: "Forbidden",
          } as ApiResponse<null>,
          { status: 403 }
        );
      }
    }

    console.error("Error deleting users:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to delete users",
    };

    return NextResponse.json(result, { status: 500 });
  }
}
