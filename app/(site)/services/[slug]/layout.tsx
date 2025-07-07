import { Metadata } from "next";
import { getBaseUrl } from "@/lib/utils/url.util";
import { getServiceBySlug } from "@/lib/api/services.api";

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

  try {
    const serviceResponse = await getServiceBySlug(slug);
    const baseUrl = getBaseUrl();

    if (!serviceResponse || !serviceResponse.data) {
      return {
        title: "Service Not Found",
        description: "The requested service could not be found.",
      };
    }

    const service = serviceResponse.data;

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
