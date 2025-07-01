import Script from "next/script";
import { generateJsonLd, type JsonLdProps } from "@/lib/config/seo";

export function JsonLd({ type, data }: JsonLdProps) {
  const jsonLd = generateJsonLd({ type, data });

  return (
    <Script
      id={`json-ld-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
      strategy="beforeInteractive"
    />
  );
}
