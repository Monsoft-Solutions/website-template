import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import {
  ArrowRight,
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
} from "lucide-react";

import { JsonLd } from "@/components/seo/JsonLd";
import {
  getAllServiceSlugs,
  getServiceBySlug,
  getRelatedServices,
} from "@/lib/utils";
import { services } from "@/lib/data/services";
import type { Service } from "@/lib/types";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllServiceSlugs(services);
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(services, slug);

  if (!service) {
    return {
      title: "Service Not Found",
      description: "The requested service could not be found.",
    };
  }

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

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(services, slug);

  if (!service) {
    notFound();
  }

  const relatedServices = getRelatedServices(services, slug);

  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.fullDescription,
    category: service.category,
    provider: {
      "@type": "Organization",
      name: "Your Company Name",
      url: "https://yoursite.com",
    },
    offers: service.pricing.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      price: tier.price,
      description: tier.description,
      category: "Service",
    })),
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
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <li>
                <Link
                  href="/services"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Services
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <li className="text-gray-900 dark:text-white font-medium">
                {service.title}
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
                  {service.category}
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                  {service.title}
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  {service.fullDescription}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button size="lg">
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
                    {service.timeline}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Dedicated Team
                  </div>
                </div>
              </div>
              <div className="relative">
                <Image
                  src={service.featuredImage}
                  alt={service.title}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.features.map((feature, index) => (
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

        {/* Benefits */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-6">
                  Why Choose This Service?
                </h2>
                <ul className="space-y-4">
                  {service.benefits.map((benefit, index) => (
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
                  Quick Facts
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Timeline:
                    </span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {service.timeline}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Category:
                    </span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {service.category}
                    </span>
                  </div>
                  {service.technologies && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Technologies:
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {service.technologies.map((tech, index) => (
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

        {/* Process */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {service.process.map((step, index) => (
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

        {/* Pricing */}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {service.pricing.map((tier, index) => (
                <Card
                  key={index}
                  className={`relative ${
                    tier.popular ? "border-blue-500 border-2" : ""
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
                    <Button
                      className="w-full"
                      variant={tier.popular ? "default" : "outline"}
                    >
                      <Link href="/contact">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        {service.testimonial && (
          <section className="py-16 bg-blue-50 dark:bg-blue-900/20">
            <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
              <Quote className="w-12 h-12 text-blue-500 mx-auto mb-6" />
              <blockquote className="text-xl font-medium text-gray-900 dark:text-white mb-6">
                &ldquo;{service.testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                {service.testimonial.avatar && (
                  <Avatar>
                    <AvatarImage
                      src={service.testimonial.avatar}
                      alt={service.testimonial.author}
                    />
                    <AvatarFallback>
                      {service.testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {service.testimonial.author}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {service.testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Deliverables */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-6">
                  What You&apos;ll Receive
                </h2>
                <ul className="space-y-3">
                  {service.deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {deliverable}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {service.faq.slice(0, 3).map((faq, index) => (
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
            </div>
          </div>
        </section>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  Related Services
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                  Discover other services that complement this solution.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedServices.map((relatedService: Service) => (
                  <Card
                    key={relatedService.id}
                    className="group hover:shadow-lg transition-all duration-300"
                  >
                    <CardHeader>
                      <Badge variant="outline" className="w-fit mb-2">
                        {relatedService.category}
                      </Badge>
                      <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {relatedService.title}
                      </CardTitle>
                      <CardDescription>
                        {relatedService.shortDescription}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full group/btn"
                      >
                        <Link href={`/services/${relatedService.slug}`}>
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
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
                Let&apos;s discuss how {service.title.toLowerCase()} can
                transform your business.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
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
