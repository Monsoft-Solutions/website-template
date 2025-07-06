import { Metadata } from "next";
import { getServiceBySlug } from "@/lib/api/services.api";

// Generate dynamic metadata for the service detail page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const serviceResult = await getServiceBySlug(slug);

  if (!serviceResult.success || !serviceResult.data) {
    return {
      title: "Service Not Found",
      description: "The requested service could not be found.",
    };
  }

  const service = serviceResult.data;

  return {
    title: `${service.title} | Professional Services`,
    description: service.shortDescription,
    keywords: [
      service.title.toLowerCase(),
      service.category.toLowerCase(),
      ...(service.technologies || []),
      "professional services",
      "digital solutions",
    ].join(", "),
    openGraph: {
      title: service.title,
      description: service.shortDescription,
      images: [service.featuredImage],
      type: "article",
    },
  };
}
