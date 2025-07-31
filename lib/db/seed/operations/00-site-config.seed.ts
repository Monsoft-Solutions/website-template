import { db } from "../../index";
import { siteConfigs } from "../../schema/index";
import type { NewSiteConfig } from "@/lib/types/site-config.type";
import type { SeedOperation } from "../types/seed-config.type";

/**
 * Site configuration data based on current hardcoded values
 */
const siteConfigData: NewSiteConfig = {
  name: "Sun Gulf Realty",
  description:
    "Sun Gulf Realty is a Cape Coral-based real estate company that emphasizes being 'different by design.' We are real and transparent, obsessing about every detail of every transaction.",
  ogImage: "/og-image.jpg",
  links: {
    facebook: "https://www.facebook.com/sungulfrealty",
    instagram: "https://www.instagram.com/sungulfrealty/",
  },
  creator: {
    name: "Sun Gulf Realty, LLC",
    email: "info@sungulfrealty.com",
    url: "https://sungulfrealty.com",
  },
  keywords: [
    "Cape Coral real estate",
    "Southwest Florida real estate",
    "waterfront homes",
    "property management",
    "real estate investments",
    "Cape Coral realtor",
    "Florida real estate",
    "luxury homes",
    "property rentals",
  ],
  language: "en",
  locale: "en_US",
  theme: {
    primaryColor: "#1E3A8A", // Gulf Coast blue
    secondaryColor: "#F8FAFC", // Warm white
  },
  socialMedia: {
    twitter: {
      card: "summary_large_image",
      site: "@sungulfrealty",
      creator: "@sungulfrealty",
    },
  },
  metadata: {
    generator: "Next.js",
    applicationName: "Sun Gulf Realty",
    referrer: "origin-when-cross-origin",
    authors: [
      { name: "Sun Gulf Realty, LLC", url: "https://sungulfrealty.com" },
    ],
    colorScheme: "light dark",
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
      { media: "(prefers-color-scheme: dark)", color: "#1E3A8A" },
    ],
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 5,
      userScalable: true,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
    },
  },
  isActive: true,
};

/**
 * Execute site configuration seeding operation
 */
const execute = async (): Promise<number> => {
  // Check if site config already exists
  const existingConfig = await db.select().from(siteConfigs).limit(1);

  if (existingConfig.length === 0) {
    const insertedConfig = await db
      .insert(siteConfigs)
      .values(siteConfigData)
      .returning();

    return insertedConfig.length;
  }

  // Return 0 if already exists to avoid duplicates
  return 0;
};

/**
 * Clear site configuration data
 */
const clear = async (): Promise<void> => {
  await db.delete(siteConfigs);
};

/**
 * Site configuration seed operation
 */
export const siteConfigSeed: SeedOperation = {
  config: {
    name: "site-config",
    order: 0,
    description: "Seed site configuration data",
  },
  execute,
  clear,
};
