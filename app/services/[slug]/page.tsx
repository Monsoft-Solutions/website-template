"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { useService } from "@/lib/hooks/use-services.hook";
import { clientEnv } from "@/lib/env-client";

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

// Loading and error components
import { ServicePageSkeleton } from "@/components/services/service-detail/service-page-skeleton";
import { ServiceError } from "@/components/services/service-detail/service-error";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ServicePage({ params }: ServicePageProps) {
  const [slug, setSlug] = useState<string>("");
  const { data: service, isLoading, error } = useService(slug);
  const router = useRouter();

  useEffect(() => {
    async function resolveParams() {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
      } catch (error) {
        console.error("Failed to resolve params:", error);
        router.push("/services");
      }
    }

    resolveParams();
  }, [params, router]);

  // Show loading state
  if (!slug || (slug && isLoading)) {
    return <ServicePageSkeleton />;
  }

  // Handle error state
  if (error || !service) {
    return (
      <ServiceError
        error={error || "Service not found"}
        onRetry={() => window.location.reload()}
      />
    );
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
    testimonial: service.testimonial,
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
      name: clientEnv.NEXT_PUBLIC_SITE_NAME || "SiteWave",
      url: clientEnv.NEXT_PUBLIC_SITE_URL,
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
        {serviceData.testimonial && (
          <ServiceTestimonialSection testimonial={serviceData.testimonial} />
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
