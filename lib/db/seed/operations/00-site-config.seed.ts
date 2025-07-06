import { db } from "../../index";
import { siteConfigs } from "../../schema/index";
import type { NewSiteConfig } from "@/lib/types/site-config.type";
import type { SeedOperation } from "../types/seed-config.type";

/**
 * Site configuration data based on current hardcoded values
 */
const siteConfigData: NewSiteConfig = {
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
