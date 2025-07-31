import Script from "next/script";
import { generateJsonLd, type JsonLdProps } from "@/lib/config/seo";

export function JsonLd({ type, data }: JsonLdProps) {
  const jsonLd = generateJsonLd({ type, data });

  return (
    <Script
      id={`json-ld-${type.toLowerCase()}-${Math.random().toString(36).substr(2, 9)}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd, null, 0),
      }}
      strategy="afterInteractive"
    />
  );
}

// Helper component for multiple schema types on a single page
export function MultipleJsonLd({ schemas }: { schemas: JsonLdProps[] }) {
  return (
    <>
      {schemas.map((schema, index) => (
        <JsonLd
          key={`${schema.type}-${index}`}
          type={schema.type}
          data={schema.data}
        />
      ))}
    </>
  );
}

// Real Estate specific JsonLd components for easier use
export function RealEstateAgentJsonLd({
  data = {},
}: {
  data?: Record<string, unknown>;
}) {
  return (
    <JsonLd
      type="LocalBusiness"
      data={{
        name: "Sun Gulf Realty, LLC",
        description:
          "Cape Coral real estate company specializing in transparent, detail-oriented service for buyers and sellers in Southwest Florida.",
        url: "https://sungulfrealty.com",
        image: "https://sungulfrealty.com/images/sun-gulf-realty-logo.jpg",
        address: {
          "@type": "PostalAddress",
          streetAddress: "1222 SE 47th St, Unit 118",
          addressLocality: "Cape Coral",
          addressRegion: "FL",
          postalCode: "33904",
          addressCountry: "US",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "26.5629",
          longitude: "-81.9495",
        },
        telephone: "(239) 673-8733",
        faxNumber: "(866) 881-9722",
        email: "info@sungulfrealty.com",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "17:00",
          },
        ],
        sameAs: [
          "https://www.facebook.com/sungulfrealty",
          "https://www.instagram.com/sungulfrealty/",
        ],
        areaServed: ["Cape Coral, FL", "Fort Myers, FL", "Southwest Florida"],
        serviceType: [
          "Real Estate Sales",
          "Property Rentals",
          "Real Estate Investments",
          "Property Management",
        ],
        priceRange: "$$",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "127",
        },
        ...data,
      }}
    />
  );
}

export function PropertyListingJsonLd({
  property,
}: {
  property: {
    address: string;
    bedrooms: number;
    bathrooms: number;
    price: number;
    description: string;
    images?: string[];
    features?: string[];
    squareFeet?: number;
    neighborhood?: string;
  };
}) {
  return (
    <JsonLd
      type="Product"
      data={{
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
      }}
    />
  );
}

export function RealEstateFAQJsonLd({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  return (
    <JsonLd
      type="FAQPage"
      data={{
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }}
    />
  );
}
