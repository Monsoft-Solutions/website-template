import { getAllServices } from "@/lib/api/services.api";

export async function generateStaticParams() {
  const servicesResult = await getAllServices();
  if (!servicesResult.success) {
    return [];
  }

  return servicesResult.data.map((service) => ({
    slug: service.slug,
  }));
}
