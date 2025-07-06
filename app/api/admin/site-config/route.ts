import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteConfigs } from "@/lib/db/schema/site-config.table";
import { eq } from "drizzle-orm";
import type { SiteConfigFormData } from "@/lib/types/site-config.type";

/**
 * GET - Retrieve site configuration
 */
export async function GET() {
  try {
    const result = await db
      .select()
      .from(siteConfigs)
      .where(eq(siteConfigs.isActive, true))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Site configuration not found" },
        { status: 404 }
      );
    }

    const config = result[0];

    // Transform to form data format
    const formData: SiteConfigFormData = {
      name: config.name,
      description: config.description,
      ogImage: config.ogImage,
      links: config.links,
      creator: config.creator,
      keywords: config.keywords,
      language: config.language,
      locale: config.locale,
      theme: config.theme,
      socialMedia: config.socialMedia,
      // Flatten metadata for form handling
      generator: config.metadata.generator,
      applicationName: config.metadata.applicationName,
      referrer: config.metadata.referrer,
      authors: config.metadata.authors,
      colorScheme: config.metadata.colorScheme,
      themeColor: config.metadata.themeColor,
      viewport: config.metadata.viewport,
      verification: config.metadata.verification,
    };

    return NextResponse.json({ data: formData });
  } catch (error) {
    console.error("Failed to fetch site configuration:", error);
    return NextResponse.json(
      { error: "Failed to fetch site configuration" },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update site configuration
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const formData = body as SiteConfigFormData;

    // Transform form data back to database format
    const updateData = {
      name: formData.name,
      description: formData.description,
      ogImage: formData.ogImage,
      links: formData.links,
      creator: formData.creator,
      keywords: formData.keywords,
      language: formData.language,
      locale: formData.locale,
      theme: formData.theme,
      socialMedia: formData.socialMedia,
      metadata: {
        generator: formData.generator,
        applicationName: formData.applicationName,
        referrer: formData.referrer,
        authors: formData.authors,
        colorScheme: formData.colorScheme,
        themeColor: formData.themeColor,
        viewport: formData.viewport,
        verification: formData.verification,
      },
    };

    // Get current active configuration
    const currentConfig = await db
      .select()
      .from(siteConfigs)
      .where(eq(siteConfigs.isActive, true))
      .limit(1);

    if (currentConfig.length === 0) {
      return NextResponse.json(
        { error: "Site configuration not found" },
        { status: 404 }
      );
    }

    // Update the configuration
    const result = await db
      .update(siteConfigs)
      .set(updateData)
      .where(eq(siteConfigs.id, currentConfig[0].id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Failed to update site configuration" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: result[0],
      message: "Site configuration updated successfully",
    });
  } catch (error) {
    console.error("Failed to update site configuration:", error);
    return NextResponse.json(
      { error: "Failed to update site configuration" },
      { status: 500 }
    );
  }
}
