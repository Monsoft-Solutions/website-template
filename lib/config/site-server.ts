import { getEnhancedSiteConfig } from "../utils/site-config.util";
import type { SiteConfigData } from "../types/site-config.type";

/**
 * Server-side site configuration getter
 * This function safely imports database utilities and should only be used server-side
 */
export const getSiteConfigFromDB = async (): Promise<
  SiteConfigData & { url: string }
> => {
  return await getEnhancedSiteConfig();
};

/**
 * Get site configuration for server-side metadata generation
 * This is safe to use in metadata generation functions and server components
 */
export const getServerSiteConfig = async () => {
  try {
    return await getSiteConfigFromDB();
  } catch (error) {
    console.error("Failed to fetch site configuration from database:", error);

    // Return the static fallback configuration if database fails
    const { siteConfig } = await import("./site");
    return {
      ...siteConfig,
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
    };
  }
};
