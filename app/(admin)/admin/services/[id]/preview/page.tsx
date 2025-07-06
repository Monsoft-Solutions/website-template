"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ServiceWithRelations } from "@/lib/types/service-with-relations.type";

/**
 * Service preview page - Phase 4.2 Implementation
 * Provides preview interface for services before publishing
 */
export default function PreviewServicePage() {
  const router = useRouter();
  const params = useParams();
  const [service, setService] = useState<ServiceWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serviceId = params.id as string;

  // Fetch service data
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/services/${serviceId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch service");
        }

        const data = await response.json();
        if (data.success) {
          setService(data.data);
        } else {
          throw new Error(data.error || "Failed to fetch service");
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  // Handle cancel action
  const handleCancel = () => {
    router.push("/admin/services");
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full overflow-auto">
        <PageHeader
          title="Service Preview"
          description="Loading service preview..."
          breadcrumbs={[
            { label: "Services", href: "/admin/services" },
            { label: "Preview Service", active: true },
          ]}
        />
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading service preview...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full overflow-auto">
        <PageHeader
          title="Service Preview"
          description="Error loading service preview"
          breadcrumbs={[
            { label: "Services", href: "/admin/services" },
            { label: "Preview Service", active: true },
          ]}
          actions={
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Button>
          }
        />
        <div className="p-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // No service found
  if (!service) {
    return (
      <div className="h-full overflow-auto">
        <PageHeader
          title="Service Preview"
          description="Service not found"
          breadcrumbs={[
            { label: "Services", href: "/admin/services" },
            { label: "Preview Service", active: true },
          ]}
          actions={
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Button>
          }
        />
        <div className="p-6">
          <Alert>
            <AlertDescription>Service not found.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <PageHeader
        title={`Preview: ${service.title}`}
        description="Preview how your service will appear to visitors"
        breadcrumbs={[
          { label: "Services", href: "/admin/services" },
          { label: service.title, href: `/admin/services/${serviceId}` },
          { label: "Preview", active: true },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/services/${service.slug}`)}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Live
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Button>
          </div>
        }
      />

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {/* Service Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{service.title}</h1>
                <p className="text-lg text-muted-foreground">
                  {service.shortDescription}
                </p>
                <div className="flex items-center gap-4">
                  <Badge>{service.category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Timeline: {service.timeline}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {service.featuredImage && (
              <Image
                src={service.featuredImage}
                alt={service.title}
                width={800}
                height={256}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            <div className="prose max-w-none">
              <p>{service.fullDescription}</p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        {service.features.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        {service.benefits.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Process */}
        {service.process.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Our Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {service.process.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{step.title}</h4>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                      {step.duration && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Duration: {step.duration}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing */}
        {service.pricing.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.pricing.map((tier, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-6 ${
                      tier.popular
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    {tier.popular && (
                      <Badge className="mb-4">Most Popular</Badge>
                    )}
                    <h3 className="text-lg font-semibold">{tier.name}</h3>
                    <p className="text-2xl font-bold mt-2">{tier.price}</p>
                    <p className="text-muted-foreground mt-2">
                      {tier.description}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {tier.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Technologies */}
        {service.technologies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Technologies We Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {service.technologies.map((tech, index) => (
                  <Badge key={index} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Deliverables */}
        {service.deliverables.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {service.deliverables.map((deliverable, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    {deliverable}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* FAQ */}
        {service.faq.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {service.faq.map((item, index) => (
                  <div key={index}>
                    <h4 className="font-semibold mb-2">{item.question}</h4>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Testimonial */}
        {service.testimonial && (
          <Card>
            <CardHeader>
              <CardTitle>What Our Clients Say</CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-lg italic border-l-4 border-primary pl-4">
                &ldquo;{service.testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-4 flex items-center gap-3">
                {service.testimonial.avatar && (
                  <Image
                    src={service.testimonial.avatar}
                    alt={service.testimonial.author}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold">{service.testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {service.testimonial.company}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gallery */}
        {service.gallery && service.gallery.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {service.gallery.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
