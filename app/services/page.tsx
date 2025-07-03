"use client";

import { JsonLd } from "@/components/seo/JsonLd";
import { useServices } from "@/lib/hooks/use-services.hook";
import { useServiceCategories } from "@/lib/hooks/use-service-categories.hook";

// Import our new service components
import { ServicesHeroSection } from "@/components/services/services-hero-section";
import { ServicesGrid } from "@/components/services/services-grid";
import { WhyChooseUsSection } from "@/components/services/why-choose-us-section";
import { ServicesCtaSection } from "@/components/services/services-cta-section";

export default function ServicesPage() {
  const { data: services, isLoading, error } = useServices();
  const { data: categories, isLoading: categoriesLoading } =
    useServiceCategories();

  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Digital Services",
    description:
      "Comprehensive digital solutions including web development, mobile apps, design, and consulting",
    provider: {
      "@type": "Organization",
      name: "Your Company Name",
      url: "https://yoursite.com",
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
              services={services || []}
              categories={categories || []}
              isLoading={isLoading || categoriesLoading}
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
