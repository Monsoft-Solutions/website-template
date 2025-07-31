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
  canonicalUrl?: string;
  ogType?: "website" | "article" | "profile";
  twitterCard?: "summary" | "summary_large_image";
  additionalMeta?: Record<string, string>;
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
  canonicalUrl,
  ogType,
  twitterCard = "summary_large_image",
  additionalMeta = {},
}: SeoProps = {}): Metadata {
  // Enhanced title generation for real estate
  const finalTitle = title ? `${title}` : siteConfig.name;
  const finalDescription = description || siteConfig.description;
  const finalUrl =
    canonicalUrl || (url?.startsWith("http") ? url : `${siteConfig.url}${url}`);
  const finalImage = image?.startsWith("http")
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
      type: ogType || type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: twitterCard,
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
    // Add any additional custom meta tags
    other: additionalMeta,
  };

  return metadata;
}

export const defaultMetadata: Metadata = generateSeoMetadata();

// Enhanced JSON-LD Schema helpers for real estate
export interface JsonLdProps {
  type:
    | "WebSite"
    | "BlogPosting"
    | "Article"
    | "Product"
    | "Organization"
    | "Person"
    | "LocalBusiness"
    | "RealEstateAgent"
    | "Accommodation"
    | "FAQPage"
    | "Place"
    | "Review"
    | "AggregateRating"
    | "Service"
    | "Offer"
    | "PostalAddress"
    | "GeoCoordinates"
    | "OpeningHoursSpecification";
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
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
        },
        ...data,
      };

    case "LocalBusiness":
    case "RealEstateAgent":
      return {
        ...baseSchema,
        "@type": "RealEstateAgent",
        name: data.name || siteConfig.name,
        description: data.description || siteConfig.description,
        url: data.url || siteConfig.url,
        image: data.image || `${siteConfig.url}/logo.png`,
        telephone: data.telephone || "(239) 673-8733",
        email: data.email || "info@sungulfrealty.com",
        address: data.address || {
          "@type": "PostalAddress",
          streetAddress: "1222 SE 47th St, Unit 118",
          addressLocality: "Cape Coral",
          addressRegion: "FL",
          postalCode: "33904",
          addressCountry: "US",
        },
        geo: data.geo || {
          "@type": "GeoCoordinates",
          latitude: "26.5629",
          longitude: "-81.9495",
        },
        areaServed: data.areaServed || [
          "Cape Coral, FL",
          "Fort Myers, FL",
          "Southwest Florida",
        ],
        sameAs: data.sameAs || [
          siteConfig.links.facebook,
          siteConfig.links.instagram,
        ],
        priceRange: data.priceRange || "$$",
        ...data,
      };

    case "BlogPosting":
    case "Article":
      return {
        ...baseSchema,
        headline: data.title || data.headline,
        description: data.description,
        image: data.image || siteConfig.ogImage,
        datePublished: data.publishedTime || data.datePublished,
        dateModified:
          data.modifiedTime ||
          data.dateModified ||
          data.publishedTime ||
          data.datePublished,
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
        keywords: data.keywords,
        ...data,
      };

    case "Product":
    case "Accommodation":
      return {
        ...baseSchema,
        "@type": "Accommodation",
        name: data.name,
        description: data.description,
        image: data.image,
        address: data.address,
        numberOfRooms: data.numberOfRooms,
        floorSize: data.floorSize,
        amenityFeature: data.amenityFeature,
        offers: data.offers || {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        ...data,
      };

    case "FAQPage":
      return {
        ...baseSchema,
        mainEntity: data.mainEntity,
        ...data,
      };

    case "Organization":
      return {
        ...baseSchema,
        name: data.name || siteConfig.name,
        url: data.url || siteConfig.url,
        logo: data.logo || `${siteConfig.url}/logo.png`,
        description: data.description || siteConfig.description,
        sameAs: data.sameAs || Object.values(siteConfig.links),
        address: data.address,
        telephone: data.telephone,
        email: data.email,
        ...data,
      };

    case "Service":
      return {
        ...baseSchema,
        name: data.name,
        description: data.description,
        provider: data.provider || {
          "@type": "RealEstateAgent",
          name: siteConfig.name,
          url: siteConfig.url,
        },
        areaServed: data.areaServed,
        serviceType: data.serviceType,
        ...data,
      };

    case "Review":
      return {
        ...baseSchema,
        reviewRating: data.reviewRating,
        author: data.author,
        itemReviewed: data.itemReviewed,
        reviewBody: data.reviewBody,
        datePublished: data.datePublished,
        ...data,
      };

    case "AggregateRating":
      return {
        ...baseSchema,
        ratingValue: data.ratingValue,
        reviewCount: data.reviewCount,
        bestRating: data.bestRating || "5",
        worstRating: data.worstRating || "1",
        ...data,
      };

    case "Place":
      return {
        ...baseSchema,
        name: data.name,
        address: data.address,
        geo: data.geo,
        description: data.description,
        ...data,
      };

    default:
      return {
        ...baseSchema,
        ...data,
      };
  }
}

// Real Estate specific schema generation helpers
export const realEstateSchemas = {
  // Generate LocalBusiness schema for Sun Gulf Realty
  generateLocalBusinessSchema: (additionalData: Record<string, unknown> = {}) =>
    generateJsonLd({
      type: "LocalBusiness",
      data: {
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "17:00",
          },
        ],
        serviceType: [
          "Real Estate Sales",
          "Property Rentals",
          "Real Estate Investments",
          "Property Management",
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "127",
        },
        ...additionalData,
      },
    }),

  // Generate property listing schema
  generatePropertySchema: (property: {
    address: string;
    bedrooms: number;
    bathrooms: number;
    price: number;
    description: string;
    images?: string[];
    features?: string[];
    squareFeet?: number;
    neighborhood?: string;
  }) =>
    generateJsonLd({
      type: "Product",
      data: {
        name: `${property.address} - ${property.bedrooms}BR/${property.bathrooms}BA`,
        description: property.description,
        image: property.images,
        offers: {
          "@type": "Offer",
          price: property.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "RealEstateAgent",
            name: "Sun Gulf Realty, LLC",
          },
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: property.address,
          addressLocality: "Cape Coral",
          addressRegion: "FL",
          addressCountry: "US",
        },
        numberOfRooms: property.bedrooms,
        ...(property.squareFeet && {
          floorSize: {
            "@type": "QuantitativeValue",
            value: property.squareFeet,
            unitCode: "SQF",
          },
        }),
        ...(property.features && {
          amenityFeature: property.features.map((feature) => ({
            "@type": "LocationFeatureSpecification",
            name: feature,
          })),
        }),
      },
    }),

  // Generate FAQ schema for service pages
  generateFAQSchema: (faqs: Array<{ question: string; answer: string }>) =>
    generateJsonLd({
      type: "FAQPage",
      data: {
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    }),

  // Generate WebSite schema with search functionality
  generateWebSiteSchema: (additionalData: Record<string, unknown> = {}) =>
    generateJsonLd({
      type: "WebSite",
      data: {
        ...additionalData,
      },
    }),
};
