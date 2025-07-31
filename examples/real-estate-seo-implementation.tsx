// Example: Real Estate SEO Implementation
// This file demonstrates how to implement the SEO rules for different page types

import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/config/seo";
import { JsonLd, MultipleJsonLd } from "@/components/seo/JsonLd";

// ============================================================================
// EXAMPLE 1: Homepage Implementation
// ============================================================================

export const homepageMetadata: Metadata = generateSeoMetadata({
  title:
    "Sun Gulf Realty - Premier Cape Coral Real Estate Agent | Different by Design",
  description:
    "Experience real estate different by design with Sun Gulf Realty. Your trusted Cape Coral real estate experts specializing in waterfront homes, luxury properties, and investment opportunities.",
  keywords: [
    "Cape Coral real estate agent",
    "Fort Myers realtor",
    "Southwest Florida real estate",
    "Cape Coral homes for sale",
    "waterfront properties Cape Coral",
    "luxury homes Cape Coral",
    "Cape Coral investment properties",
  ],
  canonicalUrl: "https://sungulfrealty.com",
  image: "/images/sun-gulf-realty-hero.jpg",
});

export function HomepageJsonLd() {
  return (
    <MultipleJsonLd
      schemas={[
        {
          type: "WebSite",
          data: {
            name: "Sun Gulf Realty",
            url: "https://sungulfrealty.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://sungulfrealty.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          },
        },
        {
          type: "LocalBusiness",
          data: {}, // Uses defaults from RealEstateAgentJsonLd
        },
      ]}
    />
  );
}

// ============================================================================
// EXAMPLE 2: Property Listing Page Implementation
// ============================================================================

interface PropertyData {
  address: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  description: string;
  images: string[];
  features: string[];
  squareFeet: number;
  neighborhood: string;
  slug: string;
}

export function generatePropertyMetadata(property: PropertyData): Metadata {
  return generateSeoMetadata({
    title: `${property.address} | ${property.bedrooms}BR/${property.bathrooms}BA | $${property.price.toLocaleString()} | Cape Coral`,
    description: `${property.bedrooms} bedroom, ${property.bathrooms} bathroom home in ${property.neighborhood}, Cape Coral. ${property.features?.slice(0, 3).join(", ")}. Contact Sun Gulf Realty today for a showing.`,
    keywords: [
      `${property.neighborhood} homes for sale`,
      `Cape Coral ${property.bedrooms} bedroom homes`,
      `Cape Coral real estate`,
      `Southwest Florida properties`,
      `${property.neighborhood} Cape Coral`,
      "waterfront homes Cape Coral",
    ],
    canonicalUrl: `https://sungulfrealty.com/properties/${property.slug}`,
    image: property.images?.[0] || "/images/default-property.jpg",
  });
}

export function PropertyPageJsonLd({ property }: { property: PropertyData }) {
  return (
    <MultipleJsonLd
      schemas={[
        {
          type: "LocalBusiness",
          data: {}, // Company info
        },
        {
          type: "Product",
          data: {
            "@type": "Accommodation",
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
            floorSize: {
              "@type": "QuantitativeValue",
              value: property.squareFeet,
              unitCode: "SQF",
            },
            amenityFeature: property.features.map((feature) => ({
              "@type": "LocationFeatureSpecification",
              name: feature,
            })),
          },
        },
      ]}
    />
  );
}

// ============================================================================
// EXAMPLE 3: Neighborhood Page Implementation
// ============================================================================

interface NeighborhoodData {
  name: string;
  slug: string;
  description: string;
  averagePrice: number;
  totalListings: number;
  features: string[];
}

export function generateNeighborhoodMetadata(
  neighborhood: NeighborhoodData
): Metadata {
  return generateSeoMetadata({
    title: `${neighborhood.name} Cape Coral Real Estate | Homes for Sale | Sun Gulf Realty`,
    description: `Discover ${neighborhood.name} Cape Coral real estate. Browse ${neighborhood.totalListings} homes for sale, neighborhood insights, and market trends. Average price: $${neighborhood.averagePrice.toLocaleString()}.`,
    keywords: [
      `${neighborhood.name} Cape Coral`,
      `${neighborhood.name} homes for sale`,
      `${neighborhood.name} real estate`,
      "Cape Coral neighborhoods",
      "Southwest Florida communities",
      `${neighborhood.name} properties`,
    ],
    canonicalUrl: `https://sungulfrealty.com/neighborhoods/${neighborhood.slug}`,
    image: `/images/neighborhoods/${neighborhood.slug}-hero.jpg`,
  });
}

export function NeighborhoodPageJsonLd({
  neighborhood,
}: {
  neighborhood: NeighborhoodData;
}) {
  return (
    <MultipleJsonLd
      schemas={[
        {
          type: "LocalBusiness",
          data: {},
        },
        {
          type: "Place",
          data: {
            name: `${neighborhood.name}, Cape Coral`,
            description: neighborhood.description,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Cape Coral",
              addressRegion: "FL",
              addressCountry: "US",
            },
            containedInPlace: {
              "@type": "City",
              name: "Cape Coral",
              addressRegion: "FL",
            },
          },
        },
      ]}
    />
  );
}

// ============================================================================
// EXAMPLE 4: Blog Post Implementation
// ============================================================================

interface BlogPostData {
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  author: {
    name: string;
    slug: string;
  };
  tags: string[];
  featuredImage: string;
}

export function generateBlogPostMetadata(post: BlogPostData): Metadata {
  return generateSeoMetadata({
    title: `${post.title} | Sun Gulf Realty Blog`,
    description: post.excerpt,
    keywords: [
      ...post.tags,
      "Cape Coral real estate",
      "real estate tips",
      "Southwest Florida",
    ],
    canonicalUrl: `https://sungulfrealty.com/blog/${post.slug}`,
    image: post.featuredImage || "/images/blog-default.jpg",
    ogType: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [post.author.name],
  });
}

export function BlogPostJsonLd({ post }: { post: BlogPostData }) {
  return (
    <JsonLd
      type="Article"
      data={{
        headline: post.title,
        description: post.excerpt,
        image: post.featuredImage,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: {
          "@type": "Person",
          name: post.author.name,
          url: `https://sungulfrealty.com/team/${post.author.slug}`,
        },
        publisher: {
          "@type": "Organization",
          name: "Sun Gulf Realty",
          logo: {
            "@type": "ImageObject",
            url: "https://sungulfrealty.com/images/sun-gulf-realty-logo.jpg",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://sungulfrealty.com/blog/${post.slug}`,
        },
        keywords: post.tags.join(", "),
        articleSection: "Real Estate",
        articleBody: post.content,
      }}
    />
  );
}

// ============================================================================
// EXAMPLE 5: Service Page with FAQ Implementation
// ============================================================================

interface ServiceData {
  title: string;
  description: string;
  slug: string;
  benefits: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export function generateServiceMetadata(service: ServiceData): Metadata {
  return generateSeoMetadata({
    title: `${service.title} in Cape Coral | Sun Gulf Realty | Expert Real Estate Services`,
    description: `Expert ${service.title.toLowerCase()} in Cape Coral and Southwest Florida. ${service.description} Transparent, detail-oriented approach with Sun Gulf Realty.`,
    keywords: [
      service.title.toLowerCase(),
      `${service.title.toLowerCase()} Cape Coral`,
      "Cape Coral real estate services",
      "Southwest Florida real estate",
      "real estate agent Cape Coral",
    ],
    canonicalUrl: `https://sungulfrealty.com/services/${service.slug}`,
  });
}

export function ServicePageJsonLd({ service }: { service: ServiceData }) {
  return (
    <MultipleJsonLd
      schemas={[
        {
          type: "LocalBusiness",
          data: {},
        },
        {
          type: "Service",
          data: {
            name: service.title,
            description: service.description,
            provider: {
              "@type": "RealEstateAgent",
              name: "Sun Gulf Realty, LLC",
              url: "https://sungulfrealty.com",
            },
            areaServed: [
              "Cape Coral, FL",
              "Fort Myers, FL",
              "Southwest Florida",
            ],
            serviceType: service.title,
          },
        },
        {
          type: "FAQPage",
          data: {
            mainEntity: service.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          },
        },
      ]}
    />
  );
}

// ============================================================================
// EXAMPLE 6: Contact Page Implementation
// ============================================================================

export const contactMetadata: Metadata = generateSeoMetadata({
  title:
    "Contact Sun Gulf Realty - Cape Coral Real Estate Experts | Get Your Free Consultation",
  description:
    "Contact Sun Gulf Realty for expert real estate services in Cape Coral and Southwest Florida. Call (239) 673-8733 for your free consultation. Different by design approach.",
  keywords: [
    "contact Sun Gulf Realty",
    "Cape Coral real estate agent",
    "real estate consultation Cape Coral",
    "Southwest Florida realtor",
    "(239) 673-8733",
  ],
  canonicalUrl: "https://sungulfrealty.com/contact",
});

export function ContactPageJsonLd() {
  const commonFAQs = [
    {
      question: "How long does it take to sell a home in Cape Coral?",
      answer:
        "The average time to sell a home in Cape Coral is currently 45-60 days, depending on price, condition, and market factors. Sun Gulf Realty's strategic marketing approach often sells homes faster than the market average.",
    },
    {
      question:
        "What makes Sun Gulf Realty different from other Cape Coral real estate agents?",
      answer:
        "Sun Gulf Realty is different by design, focusing on transparency, attention to detail, and personalized service. We obsess about every detail of every transaction and provide fresh ideas and bold thinking for our clients.",
    },
    {
      question: "Do you provide free home valuations?",
      answer:
        "Yes, Sun Gulf Realty provides complimentary home valuations for Cape Coral and Southwest Florida properties. Contact us at (239) 673-8733 to schedule your free consultation.",
    },
    {
      question: "What areas do you serve?",
      answer:
        "Sun Gulf Realty primarily serves Cape Coral, Fort Myers, and the greater Southwest Florida area. We specialize in waterfront properties, luxury homes, and investment opportunities throughout the region.",
    },
  ];

  return (
    <MultipleJsonLd
      schemas={[
        {
          type: "LocalBusiness",
          data: {},
        },
        {
          type: "FAQPage",
          data: {
            mainEntity: commonFAQs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          },
        },
      ]}
    />
  );
}

// ============================================================================
// EXAMPLE 7: Layout-Level Implementation
// ============================================================================

// In your app/layout.tsx, always include the WebSite schema
export function RootLayoutJsonLd() {
  return (
    <JsonLd
      type="WebSite"
      data={{
        name: "Sun Gulf Realty",
        url: "https://sungulfrealty.com",
        description:
          "Cape Coral real estate company specializing in transparent, detail-oriented service for buyers and sellers in Southwest Florida.",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://sungulfrealty.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
        publisher: {
          "@type": "Organization",
          name: "Sun Gulf Realty, LLC",
        },
      }}
    />
  );
}

// ============================================================================
// USAGE NOTES
// ============================================================================

/*
1. Always use generateSeoMetadata for consistent metadata across pages
2. Include local keywords naturally in titles and descriptions
3. Use specific, descriptive titles with location and service/property details
4. Stack multiple schema types when appropriate (LocalBusiness + specific content type)
5. Keep titles under 60 characters and descriptions under 160 characters
6. Always include canonical URLs to prevent duplicate content issues
7. Use property-specific and location-specific images for better relevance
8. Include structured data for better search engine understanding
9. Monitor performance using Google Search Console and Google Analytics
10. Validate schema markup using Google's Rich Results Test tool

PERFORMANCE CHECKLIST:
- [ ] Metadata follows character limits
- [ ] Keywords included naturally without stuffing
- [ ] Canonical URLs set correctly
- [ ] Appropriate schema types used
- [ ] Local Cape Coral/Southwest Florida keywords included
- [ ] Contact information consistent across all pages
- [ ] Images optimized with descriptive alt text
- [ ] Mobile-friendly implementation tested
- [ ] Page speed under 3 seconds
- [ ] Schema markup validated
*/
