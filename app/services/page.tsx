"use client";

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
import {
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Lightbulb,
  Target,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { useServices } from "@/lib/hooks/use-services.hook";
import { useServiceCategories } from "@/lib/hooks/use-service-categories.hook";
import { useState } from "react";

export default function ServicesPage() {
  const { data: services, isLoading, error } = useServices();
  const { data: categories, isLoading: categoriesLoading } =
    useServiceCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredServices = selectedCategory
    ? services.filter((service) => service.category === selectedCategory)
    : services;

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
    serviceType: services.map((service) => service.title),
    areaServed: "Global",
  };
  return (
    <>
      <JsonLd type="Organization" data={serviceStructuredData} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section className="relative py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Our Services
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Transform your business with our comprehensive digital
                solutions. From web development to cloud infrastructure, we
                deliver results that drive growth.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg">
                  <Link href="#services">Explore Services</Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link href="/contact">Get Free Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  200+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Happy Clients
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  500+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Projects Completed
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  10+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Years Experience
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  98%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Success Rate
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                What We Do
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                We offer a comprehensive suite of digital services to help your
                business thrive in the digital age.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <Badge
                variant={selectedCategory === null ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(null)}
              >
                All Services
              </Badge>
              {categoriesLoading ? (
                <div className="py-2 px-4">Loading categories...</div>
              ) : (
                categories.map((category) => (
                  <Badge
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "secondary"
                    }
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))
              )}
            </div>

            {/* Services Grid */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <p>Loading services...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center py-12">
                <p className="text-red-500">Error loading services: {error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service) => (
                  <Card
                    key={service.id}
                    className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline">{service.category}</Badge>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {service.timeline}
                        </div>
                      </div>
                      <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        {service.shortDescription}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Key Features */}
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                            Key Features:
                          </h4>
                          <ul className="space-y-1">
                            {service.features
                              .slice(0, 3)
                              .map((feature, index) => (
                                <li
                                  key={index}
                                  className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                          </ul>
                        </div>

                        {/* Pricing Range */}
                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Starting from
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {service.pricing[0]?.price || "Contact us"}
                            </span>
                          </div>
                        </div>

                        {/* CTA */}
                        <Button asChild className="w-full group/btn">
                          <Link href={`/services/${service.slug}`}>
                            Learn More
                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Why Choose Us?
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                We bring expertise, innovation, and dedication to every project.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Expert Team
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our experienced professionals bring years of industry
                  expertise to your project.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900 rounded-full">
                  <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Results-Driven
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We focus on delivering measurable results that drive your
                  business forward.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Lightbulb className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Innovation
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We stay ahead of technology trends to provide cutting-edge
                  solutions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Let us help you choose the right service for your business
                needs.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  <Link href="/contact">Get Free Consultation</Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link href="/about">Learn About Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
