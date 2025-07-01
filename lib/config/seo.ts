import { Metadata } from "next";
import { siteConfig } from "./site";

export interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
}

export function generateSeoMetadata({
  title,
  description,
  keywords = [...siteConfig.keywords],
  image = siteConfig.ogImage,
  url = siteConfig.url,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
  noFollow = false,
}: SeoProps = {}): Metadata {
  const finalTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const finalDescription = description || siteConfig.description;
  const finalUrl = url.startsWith("http") ? url : `${siteConfig.url}${url}`;
  const finalImage = image.startsWith("http")
    ? image
    : `${siteConfig.url}${image}`;

  const metadata: Metadata = {
    title: {
      default: finalTitle,
      template: `%s | ${siteConfig.name}`,
    },
    description: finalDescription,
    keywords: keywords.join(", "),
    authors: [...siteConfig.metadata.authors],
    creator: siteConfig.creator.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: siteConfig.metadata.metadataBase,
    alternates: {
      canonical: finalUrl,
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: finalUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
      locale: siteConfig.locale,
      type: type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [finalImage],
      creator: siteConfig.socialMedia.twitter.creator,
      site: siteConfig.socialMedia.twitter.site,
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: siteConfig.metadata.verification,
  };

  return metadata;
}

export const defaultMetadata: Metadata = generateSeoMetadata();

// JSON-LD Schema helpers
export interface JsonLdProps {
  type:
    | "WebSite"
    | "BlogPosting"
    | "Article"
    | "Product"
    | "Organization"
    | "Person"
    | "LocalBusiness";
  data: Record<string, unknown>;
}

export function generateJsonLd({ type, data }: JsonLdProps) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
  };

  switch (type) {
    case "WebSite":
      return {
        ...baseSchema,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
        ...data,
      };

    case "BlogPosting":
    case "Article":
      return {
        ...baseSchema,
        headline: data.title,
        description: data.description,
        image: data.image || siteConfig.ogImage,
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime || data.publishedTime,
        author: {
          "@type": "Person",
          name: data.author || siteConfig.creator.name,
          url: siteConfig.creator.url,
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          logo: {
            "@type": "ImageObject",
            url: `${siteConfig.url}/logo.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": data.url,
        },
        ...data,
      };

    case "Organization":
      return {
        ...baseSchema,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        description: siteConfig.description,
        sameAs: Object.values(siteConfig.links),
        ...data,
      };

    default:
      return {
        ...baseSchema,
        ...data,
      };
  }
}
