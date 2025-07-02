import { db } from "@/lib/db";
import { services } from "@/lib/db/schema/service.table";
import { ApiResponse } from "@/lib/types/api-response.type";
import { ServiceCategory } from "@/lib/types/service-category.type";

/**
 * Get all unique service categories from the database
 */
export async function getAllServiceCategories(): Promise<
  ApiResponse<ServiceCategory[]>
> {
  try {
    // Query all distinct categories from the services table
    const result = await db
      .selectDistinct({ category: services.category })
      .from(services);

    // Extract categories from result
    const categories = result.map((item) => item.category as ServiceCategory);

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch service categories",
    };
  }
}
