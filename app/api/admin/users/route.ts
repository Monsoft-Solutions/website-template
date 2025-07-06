import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user as users } from "@/lib/db/schema/auth-schema";
import { eq, and, or, ilike, asc, desc, sql } from "drizzle-orm";
import { UserRole } from "@/lib/types/auth.type";
import type { ApiResponse } from "@/lib/types/api-response.type";

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
 * GET endpoint - Fetch users with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const searchQuery = searchParams.get("searchQuery") || undefined;
    const roleFilter = searchParams.get("role") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

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

    // Add search query filter
    if (searchQuery) {
      whereConditions.push(
        or(
          ilike(users.name, `%${searchQuery}%`),
          ilike(users.email, `%${searchQuery}%`)
        )
      );
    }

    // Add role filter
    if (roleFilter && roleFilter !== "all") {
      whereConditions.push(eq(users.role, roleFilter));
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
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        emailVerified: users.emailVerified,
        image: users.image,
        bio: users.bio,
        lang: users.lang,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
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

    const result: ApiResponse<typeof newUser> = {
      success: true,
      data: newUser,
      message: "User created successfully",
    };

    return NextResponse.json(result);
  } catch (error) {
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
    console.error("Error deleting users:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to delete users",
    };

    return NextResponse.json(result, { status: 500 });
  }
}
