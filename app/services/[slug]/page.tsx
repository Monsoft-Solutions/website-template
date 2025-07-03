"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  Clock,
  Users,
  Quote,
  ChevronRight,
  PlayCircle,
  Download,
  MessageCircle,
  Phone,
  Mail,
  AlertCircle,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { useService } from "@/lib/hooks/use-services.hook";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Loading skeleton component
function ServicePageSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="bg-gray-50 dark:bg-gray-800 py-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </nav>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Skeleton className="h-6 w-24 mb-4" />
              <Skeleton className="h-12 w-3/4 mb-6" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-2/3 mb-8" />
              <div className="flex gap-4 mb-8">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-36" />
              </div>
              <div className="flex gap-6">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
            <div>
              <Skeleton className="h-80 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Error component
function ServiceError({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto px-6">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Service Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {error || "We couldn't find the service you're looking for."}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
          <Button asChild>
            <Link href="/services">Browse Services</Link>
          </Button>
        </div>
      </div>
    </div>
  );
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

  // Show loading state - only show skeleton while we're resolving params or actually loading
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
      name: process.env.NEXT_PUBLIC_SITE_NAME || "SiteWave",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://sitewave.com",
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

      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Breadcrumb */}
        <nav className="bg-gray-50 dark:bg-gray-800 py-4">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <li>
                <Link
                  href="/services"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Services
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <li className="text-gray-900 dark:text-white font-medium">
                {serviceData.title}
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4">
                  {serviceData.category}
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                  {serviceData.title}
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  {serviceData.fullDescription}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="/contact">Get Started</Link>
                  </Button>
                  <Button variant="outline" size="lg">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Watch Demo
                  </Button>
                </div>
                <div className="mt-8 flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {serviceData.timeline}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Dedicated Team
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative overflow-hidden rounded-lg shadow-2xl">
                  <Image
                    src={serviceData.featuredImage}
                    alt={serviceData.title}
                    width={600}
                    height={400}
                    className="object-cover"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/placeholder-service.jpg";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        {serviceData.features.length > 0 && (
          <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  What You Get
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                  Comprehensive features designed to meet your business needs.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceData.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Benefits */}
        {serviceData.benefits.length > 0 && (
          <section className="py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-6">
                    Why Choose This Service?
                  </h2>
                  <ul className="space-y-4">
                    {serviceData.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Service Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Timeline:
                      </span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {serviceData.timeline}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Category:
                      </span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {serviceData.category}
                      </span>
                    </div>
                    {serviceData.technologies.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Technologies:
                        </span>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {serviceData.technologies.map((tech, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Process */}
        {serviceData.process.length > 0 && (
          <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  Our Process
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                  A proven methodology that ensures successful project delivery.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {serviceData.process.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {step.description}
                    </p>
                    {step.duration && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {step.duration}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Pricing */}
        {serviceData.pricing.length > 0 && (
          <section className="py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  Choose Your Plan
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                  Flexible pricing options to fit your budget and requirements.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serviceData.pricing.map((tier, index) => (
                  <Card
                    key={index}
                    className={`relative ${
                      tier.popular ? "border-blue-500 border-2 shadow-lg" : ""
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge variant="default">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{tier.name}</CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {tier.price}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {tier.features && tier.features.length > 0 && (
                        <ul className="space-y-3 mb-6">
                          {tier.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-center text-sm"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                      <Button
                        className="w-full"
                        variant={tier.popular ? "default" : "outline"}
                        asChild
                      >
                        <Link href="/contact">Get Started</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonial */}
        {serviceData.testimonial && (
          <section className="py-16 bg-blue-50 dark:bg-blue-900/20">
            <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
              <Quote className="w-12 h-12 text-blue-500 mx-auto mb-6" />
              <blockquote className="text-xl font-medium text-gray-900 dark:text-white mb-6">
                &ldquo;{serviceData.testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                {serviceData.testimonial.avatar && (
                  <Avatar>
                    <AvatarImage
                      src={serviceData.testimonial.avatar}
                      alt={serviceData.testimonial.author}
                    />
                    <AvatarFallback>
                      {serviceData.testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {serviceData.testimonial.author}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {serviceData.testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Deliverables */}
        {serviceData.deliverables.length > 0 && (
          <section className="py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-6">
                    What You&apos;ll Receive
                  </h2>
                  <ul className="space-y-3">
                    {serviceData.deliverables.map((deliverable, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Download className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {deliverable}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                {serviceData.faq.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                      {serviceData.faq.slice(0, 3).map((faq, index) => (
                        <div key={index}>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            {faq.question}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 dark:bg-blue-700">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                Let&apos;s discuss how {serviceData.title.toLowerCase()} can
                transform your business.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contact">Start Your Project</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-blue-600"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Schedule Consultation
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center space-x-8 text-blue-100">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">Call: +1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">Email: hello@company.com</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
