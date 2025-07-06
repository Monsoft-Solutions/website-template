import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema/contact-submission.table";
import { and, eq, or, ilike, desc, asc, sql, gte, lte } from "drizzle-orm";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { ContactSubmission } from "@/lib/types/contact/contact-submission.type";

/**
 * Admin contact submissions list response type
 */
export interface AdminContactSubmissionsListResponse {
  submissions: ContactSubmission[];
  totalSubmissions: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  statusCounts: {
    new: number;
    read: number;
    responded: number;
  };
}

/**
 * GET endpoint - Fetch contact submissions with admin filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") as
      | "new"
      | "read"
      | "responded"
      | undefined;
    const searchQuery = searchParams.get("searchQuery") || undefined;
    const projectType = searchParams.get("projectType") || undefined;
    const budget = searchParams.get("budget") || undefined;
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json(
        {
          success: false,
          data: {} as AdminContactSubmissionsListResponse,
          error: "Invalid page number",
        } as ApiResponse<AdminContactSubmissionsListResponse>,
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          data: {} as AdminContactSubmissionsListResponse,
          error: "Invalid limit. Must be between 1 and 100",
        } as ApiResponse<AdminContactSubmissionsListResponse>,
        { status: 400 }
      );
    }

    // Build where conditions
    const whereConditions = [];

    // Add status filter
    if (status) {
      whereConditions.push(eq(contactSubmissions.status, status));
    }

    // Add search query filter
    if (searchQuery) {
      whereConditions.push(
        or(
          ilike(contactSubmissions.name, `%${searchQuery}%`),
          ilike(contactSubmissions.email, `%${searchQuery}%`),
          ilike(contactSubmissions.company, `%${searchQuery}%`),
          ilike(contactSubmissions.subject, `%${searchQuery}%`),
          ilike(contactSubmissions.message, `%${searchQuery}%`)
        )
      );
    }

    // Add project type filter
    if (projectType) {
      whereConditions.push(eq(contactSubmissions.projectType, projectType));
    }

    // Add budget filter
    if (budget) {
      whereConditions.push(eq(contactSubmissions.budget, budget));
    }

    // Add date range filters
    if (dateFrom) {
      whereConditions.push(
        gte(contactSubmissions.createdAt, new Date(dateFrom))
      );
    }

    if (dateTo) {
      // Add 1 day to include the entire end date
      const endDate = new Date(dateTo);
      endDate.setDate(endDate.getDate() + 1);
      whereConditions.push(lte(contactSubmissions.createdAt, endDate));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Build order by clause
    const orderByField =
      sortBy === "name"
        ? contactSubmissions.name
        : sortBy === "email"
        ? contactSubmissions.email
        : sortBy === "status"
        ? contactSubmissions.status
        : sortBy === "company"
        ? contactSubmissions.company
        : contactSubmissions.createdAt;

    const orderByClause =
      sortOrder === "asc" ? asc(orderByField) : desc(orderByField);

    // Get total count
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(contactSubmissions)
      .where(whereClause);

    const totalSubmissions = totalCountResult[0]?.count || 0;

    // Get status counts for dashboard
    const statusCountsResult = await db
      .select({
        status: contactSubmissions.status,
        count: sql<number>`count(*)`,
      })
      .from(contactSubmissions)
      .groupBy(contactSubmissions.status);

    const statusCounts = {
      new: 0,
      read: 0,
      responded: 0,
    };

    statusCountsResult.forEach((item) => {
      statusCounts[item.status as keyof typeof statusCounts] = item.count;
    });

    // Get submissions with pagination
    const submissionsResult = await db
      .select()
      .from(contactSubmissions)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset((page - 1) * limit);

    // Calculate pagination info
    const totalPages = Math.ceil(totalSubmissions / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const response: AdminContactSubmissionsListResponse = {
      submissions: submissionsResult,
      totalSubmissions,
      totalPages,
      currentPage: page,
      hasNextPage,
      hasPreviousPage,
      statusCounts,
    };

    const result: ApiResponse<AdminContactSubmissionsListResponse> = {
      success: true,
      data: response,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching admin contact submissions:", error);

    const result: ApiResponse<AdminContactSubmissionsListResponse> = {
      success: false,
      data: {
        submissions: [],
        totalSubmissions: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        statusCounts: { new: 0, read: 0, responded: 0 },
      },
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch contact submissions",
    };

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * PATCH endpoint - Bulk update contact submissions status
 */
export async function PATCH(request: NextRequest) {
  try {
    const { ids, action } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid submission IDs" },
        { status: 400 }
      );
    }

    // Validate action
    const validActions = ["mark-read", "mark-responded", "mark-new"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }

    // Map action to status
    let status: "new" | "read" | "responded";
    switch (action) {
      case "mark-read":
        status = "read";
        break;
      case "mark-responded":
        status = "responded";
        break;
      case "mark-new":
        status = "new";
        break;
      default:
        throw new Error("Invalid action");
    }

    // Update submissions
    await db
      .update(contactSubmissions)
      .set({ status })
      .where(or(...ids.map((id: string) => eq(contactSubmissions.id, id))));

    const result: ApiResponse<null> = {
      success: true,
      data: null,
      message: `Successfully updated ${ids.length} submission(s) to ${status}`,
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
 * DELETE endpoint - Bulk delete contact submissions (soft delete by marking as archived)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid submission IDs" },
        { status: 400 }
      );
    }

    // Delete submissions (hard delete for now, could be changed to soft delete later)
    await db
      .delete(contactSubmissions)
      .where(or(...ids.map((id: string) => eq(contactSubmissions.id, id))));

    const result: ApiResponse<null> = {
      success: true,
      data: null,
      message: `Successfully deleted ${ids.length} submission(s)`,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting submissions:", error);

    const result: ApiResponse<null> = {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to delete submissions",
    };

    return NextResponse.json(result, { status: 500 });
  }
}
