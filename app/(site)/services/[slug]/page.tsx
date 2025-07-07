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

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const baseUrl = getBaseUrl();

  let service: ServiceWithRelations | null = null;

  try {
    // Fetch the service (SSR)
    const serviceResponse = await fetch(
      `${baseUrl}/api/services/${encodeURIComponent(slug)}`,
      {
        // Add revalidation for better performance
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (serviceResponse.status === 404) {
      notFound();
    }

    if (!serviceResponse.ok) {
      throw new Error(`Failed to fetch service: ${serviceResponse.statusText}`);
    }

    const serviceResult = await serviceResponse.json();
    if (!serviceResult.success) {
      throw new Error("Failed to fetch service");
    }

    service = serviceResult.data;
  } catch (error) {
    console.error("Error fetching service:", error);
    notFound();
  }

  if (!service) {
    notFound();
  }

  // Safely access service data with fallbacks
  const serviceData = {
    id: service.id || "",
    title: service.title || "Service",
    slug: service.slug || "",
    shortDescription: service.shortDescription || "",
    fullDescription: service.fullDescription || service.shortDescription || "",
    timeline: service.timeline || "Contact us for timeline",
    category: service.category || "General",
    featuredImage: service.featuredImage || "/images/placeholder-service.jpg",
    features: service.features || [],
    benefits: service.benefits || [],
    process: service.process || [],
    pricing: service.pricing || [],
    technologies: service.technologies || [],
    deliverables: service.deliverables || [],
    gallery: service.gallery || [],
    testimonials: service.testimonials,
    faq: service.faq || [],
    relatedServices: service.relatedServices || [],
  };

  // Generate structured data
  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceData.title,
    description: serviceData.fullDescription,
    category: serviceData.category,
    provider: {
      "@type": "Organization",
      name: "SiteWave",
      url: baseUrl,
    },
    ...(serviceData.pricing.length > 0 && {
      offers: serviceData.pricing.map((tier) => ({
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
        <ServiceHeroSection service={serviceData} />

        {/* Features Section */}
        {serviceData.features.length > 0 && (
          <ServiceFeaturesSection features={serviceData.features} />
        )}

        {/* Benefits Section */}
        {serviceData.benefits.length > 0 && (
          <ServiceBenefitsSection
            benefits={serviceData.benefits}
            serviceInfo={{
              timeline: serviceData.timeline,
              category: serviceData.category,
              technologies: serviceData.technologies,
            }}
          />
        )}

        {/* Process Section */}
        {serviceData.process.length > 0 && (
          <ServiceProcessSection process={serviceData.process} />
        )}

        {/* Technologies Section */}
        {serviceData.technologies.length > 0 && (
          <ServiceTechnologiesSection technologies={serviceData.technologies} />
        )}

        {/* Gallery Section */}
        {serviceData.gallery.length > 0 && (
          <ServiceGallerySection gallery={serviceData.gallery} />
        )}

        {/* Pricing Section */}
        {serviceData.pricing.length > 0 && (
          <ServicePricingSection pricing={serviceData.pricing} />
        )}

        {/* Deliverables Section */}
        {serviceData.deliverables.length > 0 && (
          <ServiceDeliverablesSection deliverables={serviceData.deliverables} />
        )}

        {/* Testimonial Section */}
        {serviceData.testimonials && serviceData.testimonials.length > 0 && (
          <ServiceTestimonialSection testimonials={serviceData.testimonials} />
        )}

        {/* FAQ Section */}
        {serviceData.faq.length > 0 && (
          <ServiceFaqSection faq={serviceData.faq} />
        )}

        {/* Related Services Section */}
        {serviceData.relatedServices.length > 0 && (
          <ServiceRelatedSection
            relatedServices={serviceData.relatedServices}
          />
        )}

        {/* CTA Section */}
        <ServiceCtaSection serviceTitle={serviceData.title} />
      </div>
    </>
  );
}
