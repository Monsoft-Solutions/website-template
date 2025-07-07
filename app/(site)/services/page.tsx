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

export default async function ServicesPage() {
  const baseUrl = getBaseUrl();

  // Initialize with fallback data
  let services: ServiceWithRelations[] = [];
  let categories: ServiceCategory[] = [];
  let error: string | null = null;

  try {
    // Fetch services (SSR)
    const servicesResponse = await fetch(`${baseUrl}/api/services`, {
      // Add revalidation for better performance
      next: { revalidate: 1800 }, // Revalidate every 30 minutes
    });

    if (servicesResponse.ok) {
      const servicesResult = await servicesResponse.json();
      if (servicesResult.success) {
        services = servicesResult.data;
      }
    }

    // Fetch service categories (SSR)
    const categoriesResponse = await fetch(
      `${baseUrl}/api/services/categories`,
      {
        next: { revalidate: 1800 },
      }
    );

    if (categoriesResponse.ok) {
      const categoriesResult = await categoriesResponse.json();
      if (categoriesResult.success) {
        categories = categoriesResult.data;
      }
    }
  } catch (fetchError) {
    console.error("Error fetching services data:", fetchError);
    error = "Failed to load services";
    // Continue with empty data - better than crashing
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
