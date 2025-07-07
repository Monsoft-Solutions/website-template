import { JsonLd } from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/utils/url.util";
import { transformServicesWithRelationsToServices } from "@/lib/utils/service-transform.util";
import type { ServiceWithRelations } from "@/lib/types/service-with-relations.type";
import type { ServiceCategory } from "@/lib/types";

// Import our new service components
import { ServicesHeroSection } from "@/components/services/services-hero-section";
import { ServicesGrid } from "@/components/services/services-grid";
import { WhyChooseUsSection } from "@/components/services/why-choose-us-section";
import { ServicesCtaSection } from "@/components/services/services-cta-section";
import { getAllServices } from "@/lib/api/services.api";
import { getAllServiceCategories } from "@/lib/api/service-categories.api";

export default async function ServicesPage() {
  const baseUrl = getBaseUrl();

  console.log(`Base URL: ${baseUrl}`);

  // Initialize with fallback data
  let services: ServiceWithRelations[] = [];
  let categories: ServiceCategory[] = [];
  let error: string | null = null;

  // Fetch services (SSR)
  // const servicesResponse = await fetch(`${baseUrl}/api/services`, {
  //   // Add revalidation for better performance
  //   next: { revalidate: 1800 }, // Revalidate every 30 minutes
  // });

  const servicesResponse = await getAllServices();

  if (servicesResponse.success && servicesResponse.data) {
    services = servicesResponse.data;
  } else {
    error = "Failed to load services";
  }

  // Fetch service categories (SSR)
  const categoriesResponse = await getAllServiceCategories();

  if (categoriesResponse.success && categoriesResponse.data) {
    categories = categoriesResponse.data;
  }

  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Digital Services",
    description:
      "Comprehensive digital solutions including web development, mobile apps, design, and consulting",
    provider: {
      "@type": "Organization",
      name: "SiteWave",
      url: baseUrl,
    },
    serviceType: services?.map((service) => service.title) || [],
    areaServed: "Global",
  };

  return (
    <>
      <JsonLd type="Organization" data={serviceStructuredData} />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <ServicesHeroSection />

        {/* Services Grid Section */}
        <section id="services" className="py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Our Services
              </h2>
              <p className="text-lg text-muted-foreground">
                We offer a comprehensive suite of digital services to help your
                business thrive in the digital age.
              </p>
            </div>

            <ServicesGrid
              services={transformServicesWithRelationsToServices(services)}
              categories={categories}
              isLoading={false} // No loading state in SSR
              error={error}
            />
          </div>
        </section>

        {/* Why Choose Us Section */}
        <WhyChooseUsSection />

        {/* CTA Section */}
        <ServicesCtaSection />
      </div>
    </>
  );
}
