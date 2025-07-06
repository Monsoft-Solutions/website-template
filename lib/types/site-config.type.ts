import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { siteConfigs } from "../db/schema/site-config.table";

/**
 * Site configuration database entity types
 */
export type SiteConfig = InferSelectModel<typeof siteConfigs>;
export type NewSiteConfig = InferInsertModel<typeof siteConfigs>;

/**
 * Site configuration for frontend use (without database fields)
 */
export type SiteConfigData = {
  name: string;
  description: string;
  ogImage: string;
  links: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  creator: {
    name: string;
    email: string;
    twitter?: string;
    url?: string;
  };
  keywords: string[];
  language: string;
  locale: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  socialMedia: {
    twitter: {
      card: string;
      site?: string;
      creator?: string;
    };
  };
  metadata: {
    generator: string;
    applicationName: string;
    referrer: string;
    authors: Array<{ name: string; url?: string }>;
    colorScheme: string;
    themeColor: Array<{ media: string; color: string }>;
    viewport: {
      width: string;
      initialScale: number;
      maximumScale: number;
      userScalable: boolean;
    };
    verification: {
      google?: string;
      yandex?: string;
      bing?: string;
    };
  };
};

/**
 * Site configuration form data for admin editing
 */
export type SiteConfigFormData = Omit<SiteConfigData, "metadata"> & {
  // Flattened metadata for easier form handling
  generator: string;
  applicationName: string;
  referrer: string;
  authors: Array<{ name: string; url?: string }>;
  colorScheme: string;
  themeColor: Array<{ media: string; color: string }>;
  viewport: {
    width: string;
    initialScale: number;
    maximumScale: number;
    userScalable: boolean;
  };
  verification: {
    google?: string;
    yandex?: string;
    bing?: string;
  };
};
