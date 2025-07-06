import { db } from "../db";
import { siteConfigs } from "../db/schema/site-config.table";
import { eq } from "drizzle-orm";
import { clientEnv } from "../env-client";
import type { SiteConfigData } from "../types/site-config.type";

/**
 * Get the active site configuration from database
 * Returns the first active configuration or null if none exists
 */
export const getSiteConfig = async (): Promise<SiteConfigData | null> => {
  try {
    const result = await db
      .select()
      .from(siteConfigs)
      .where(eq(siteConfigs.isActive, true))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const config = result[0];

    // Transform database config to frontend format
    return {
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
      metadata: config.metadata,
    };
  } catch (error) {
    console.error("Failed to fetch site configuration:", error);
    return null;
  }
};

/**
 * Get site configuration with fallback to default values
 * This ensures the site always has a valid configuration
 */
export const getSiteConfigWithDefaults = async (): Promise<SiteConfigData> => {
  const config = await getSiteConfig();

  if (config) {
    return config;
  }

  // Fallback to default configuration
  return {
    name: "Monsoft Solutions",
    description:
      "Monsoft Solutions is a software development company that provides software development services to businesses.",
    ogImage: "/og-image.jpg",
    links: {
      twitter: "https://twitter.com/yourhandle",
      github: "https://github.com/yourhandle",
      linkedin: "https://linkedin.com/in/yourhandle",
      facebook: "https://facebook.com/yourpage",
      instagram: "https://instagram.com/yourhandle",
    },
    creator: {
      name: "Your Name",
      email: "contact@yoursite.com",
      twitter: "@yourhandle",
      url: "https://yoursite.com",
    },
    keywords: ["nextjs", "react", "template", "website", "seo", "blog"],
    language: "en",
    locale: "en_US",
    theme: {
      primaryColor: "#000000",
      secondaryColor: "#ffffff",
    },
    socialMedia: {
      twitter: {
        card: "summary_large_image",
        site: "@yourhandle",
        creator: "@yourhandle",
      },
    },
    metadata: {
      generator: "Next.js",
      applicationName: "Your Site Name",
      referrer: "origin-when-cross-origin",
      authors: [{ name: "Your Name", url: "https://yoursite.com" }],
      colorScheme: "light dark",
      themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#000000" },
      ],
      viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 5,
        userScalable: true,
      },
      verification: {
        google: clientEnv.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        yandex: clientEnv.NEXT_PUBLIC_YANDEX_VERIFICATION,
        bing: clientEnv.NEXT_PUBLIC_BING_VERIFICATION,
      },
    },
  };
};

/**
 * Enhanced site configuration with computed values for Next.js metadata
 */
export const getEnhancedSiteConfig = async () => {
  const config = await getSiteConfigWithDefaults();

  return {
    ...config,
    url: clientEnv.NEXT_PUBLIC_SITE_URL,
    metadata: {
      ...config.metadata,
      metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
      verification: {
        ...config.metadata.verification,
        google: clientEnv.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        yandex: clientEnv.NEXT_PUBLIC_YANDEX_VERIFICATION,
        bing: clientEnv.NEXT_PUBLIC_BING_VERIFICATION,
      },
    },
  };
};
