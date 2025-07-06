import { NextResponse } from "next/server";
import { getSiteConfigWithDefaults } from "@/lib/utils/site-config.util";

/**
 * GET - Retrieve public site configuration
 * This endpoint provides site configuration for client-side use
 */
export async function GET() {
  try {
    const config = await getSiteConfigWithDefaults();

    // Return only the data needed for client-side rendering
    const publicConfig = {
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
    };

    return NextResponse.json({ data: publicConfig });
  } catch (error) {
    console.error("Failed to fetch site configuration:", error);

    // Return fallback configuration if database fails
    const fallbackConfig = {
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
    };

    return NextResponse.json({ data: fallbackConfig });
  }
}
