export const siteConfig = {
  name: "Monsoft Solutions",
  description:
    "Monsoft Solutions is a software development company that provides software development services to businesses.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com",
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
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com"
    ),
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
} as const;

export type SiteConfig = typeof siteConfig;
