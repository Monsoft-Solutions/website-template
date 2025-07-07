import { Metadata } from "next";
import { getBaseUrl } from "@/lib/utils/url.util";
import type { ServiceWithRelations } from "@/lib/types/service-with-relations.type";

interface ServiceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = getBaseUrl();

  try {
    // Fetch service data for metadata
    const response = await fetch(
      `${baseUrl}/api/services/${encodeURIComponent(slug)}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return {
        title: "Service Not Found",
        description: "The requested service could not be found.",
      };
    }

    const result = await response.json();
    if (!result.success) {
      return {
        title: "Service Not Found",
        description: "The requested service could not be found.",
      };
    }

    const service: ServiceWithRelations = result.data;

    const title = `${service.title} | SiteWave Services`;
    const description =
      service.shortDescription ||
      service.fullDescription?.substring(0, 160) ||
      "Professional digital service";

    return {
      title,
      description,
      keywords: [
        service.title,
        service.category,
        ...service.technologies,
        "digital services",
        "web development",
        "app development",
      ].join(", "),
      openGraph: {
        title,
        description,
        type: "website",
        url: `${baseUrl}/services/${service.slug}`,
        images: service.featuredImage
          ? [
              {
                url: service.featuredImage,
                width: 1200,
                height: 630,
                alt: service.title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: service.featuredImage ? [service.featuredImage] : undefined,
      },
      alternates: {
        canonical: `${baseUrl}/services/${service.slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating service metadata:", error);
    return {
      title: "Service | SiteWave",
      description: "Professional digital services",
    };
  }
}

export default function ServiceLayout({ children }: ServiceLayoutProps) {
  return <>{children}</>;
}
