import { clientEnv } from "../env-client";
import type { SiteConfigData } from "../types/site-config.type";

/**
 * Synchronous site config for server-side compatibility and fallback
 * For client-side usage, use the useSiteConfig hook instead
 * For server-side dynamic config, use getSiteConfigFromDB from site-config.util.ts
 */
export const siteConfig = {
  name: "Sun Gulf Realty",
  description:
    "Sun Gulf Realty is a Cape Coral-based real estate company that emphasizes being 'different by design.' We are real and transparent, obsessing about every detail of every transaction.",
  url: clientEnv.NEXT_PUBLIC_SITE_URL,
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
    metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
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
      google: clientEnv.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: clientEnv.NEXT_PUBLIC_YANDEX_VERIFICATION,
      bing: clientEnv.NEXT_PUBLIC_BING_VERIFICATION,
    },
  },
} as const;

export type SiteConfig = SiteConfigData & {
  url: string;
  metadata: SiteConfigData["metadata"] & {
    metadataBase: URL;
  };
};
