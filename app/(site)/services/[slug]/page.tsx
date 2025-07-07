import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/utils/url.util";
import type { ServiceWithRelations } from "@/lib/types/service-with-relations.type";

// Import the new service detail components
import { ServiceHeroSection } from "@/components/services/service-detail/service-hero-section";
import { ServiceFeaturesSection } from "@/components/services/service-detail/service-features-section";
import { ServiceBenefitsSection } from "@/components/services/service-detail/service-benefits-section";
import { ServiceProcessSection } from "@/components/services/service-detail/service-process-section";
import { ServicePricingSection } from "@/components/services/service-detail/service-pricing-section";
import { ServiceTechnologiesSection } from "@/components/services/service-detail/service-technologies-section";
import { ServiceDeliverablesSection } from "@/components/services/service-detail/service-deliverables-section";
import { ServiceGallerySection } from "@/components/services/service-detail/service-gallery-section";
import { ServiceTestimonialSection } from "@/components/services/service-detail/service-testimonial-section";
import { ServiceFaqSection } from "@/components/services/service-detail/service-faq-section";
import { ServiceRelatedSection } from "@/components/services/service-detail/service-related-section";
import { ServiceCtaSection } from "@/components/services/service-detail/service-cta-section";
import { getServiceBySlug } from "@/lib/api/services.api";
import type { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/config/seo";

// Generate dynamic metadata for the service detail page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const serviceResult = await getServiceBySlug(slug);

  if (!serviceResult || !serviceResult.data) {
    return {
      title: "Service Not Found",
      description: "The requested service could not be found.",
    };
  }

  const service = serviceResult.data;

  return generateSeoMetadata({
    title: service.title,
    description: service.shortDescription,
    keywords: [
      service.title.toLowerCase(),
      service.category.toLowerCase(),
      ...(service.technologies || []),
    ],
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const baseUrl = getBaseUrl();

  let service: ServiceWithRelations | null = null;

  try {
    // Fetch the service (SSR)

    const serviceResponse = await getServiceBySlug(slug);

    if (!serviceResponse || !serviceResponse.data) {
      notFound();
    }

    service = serviceResponse.data;
  } catch (error) {
    console.error("Error fetching service:", error);
    notFound();
  }

  if (!service) {
    notFound();
  }

  // Generate structured data
  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.fullDescription,
    category: service.category,
    provider: {
      "@type": "Organization",
      name: "SiteWave",
      url: baseUrl,
    },
    ...(service.pricing.length > 0 && {
      offers: service.pricing.map((tier) => ({
        "@type": "Offer",
        name: tier.name,
        price: tier.price,
        description: tier.description,
        category: "Service",
      })),
    }),
    areaServed: "Global",
  };

  return (
    <>
      <JsonLd type="Organization" data={serviceStructuredData} />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <ServiceHeroSection service={service} />

        {/* Features Section */}
        {service.features.length > 0 && (
          <ServiceFeaturesSection features={service.features} />
        )}

        {/* Benefits Section */}
        {service.benefits.length > 0 && (
          <ServiceBenefitsSection
            benefits={service.benefits}
            serviceInfo={{
              timeline: service.timeline,
              category: service.category,
              technologies: service.technologies,
            }}
          />
        )}

        {/* Process Section */}
        {service.process.length > 0 && (
          <ServiceProcessSection process={service.process} />
        )}

        {/* Technologies Section */}
        {service.technologies.length > 0 && (
          <ServiceTechnologiesSection technologies={service.technologies} />
        )}

        {/* Gallery Section */}
        {service.gallery && service.gallery.length > 0 && (
          <ServiceGallerySection gallery={service.gallery} />
        )}

        {/* Pricing Section */}
        {service.pricing.length > 0 && (
          <ServicePricingSection pricing={service.pricing} />
        )}

        {/* Deliverables Section */}
        {service.deliverables.length > 0 && (
          <ServiceDeliverablesSection deliverables={service.deliverables} />
        )}

        {/* Testimonial Section */}
        {service.testimonials && service.testimonials.length > 0 && (
          <ServiceTestimonialSection testimonials={service.testimonials} />
        )}

        {/* FAQ Section */}
        {service.faq.length > 0 && <ServiceFaqSection faq={service.faq} />}

        {/* Related Services Section */}
        {service.relatedServices.length > 0 && (
          <ServiceRelatedSection relatedServices={service.relatedServices} />
        )}

        {/* CTA Section */}
        <ServiceCtaSection serviceTitle={service.title} />
      </div>
    </>
  );
}
