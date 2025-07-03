"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/utils/analytics";
import {
  Code,
  Search,
  Zap,
  Database,
  BarChart3,
  Palette,
  Shield,
  Smartphone,
  Check,
} from "lucide-react";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  benefits: string[];
  category: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: "Next.js 15 Ready",
    description:
      "Built with the latest Next.js features and best practices for maximum performance",
    benefits: ["App Router", "Server Components", "TypeScript"],
    category: "Technical",
    color: "text-yellow-500",
  },
  {
    icon: Search,
    title: "SEO Optimized",
    description:
      "Advanced SEO with dynamic metadata, sitemaps, and structured data",
    benefits: ["Dynamic Metadata", "JSON-LD Support", "Auto Sitemaps"],
    category: "SEO",
    color: "text-blue-500",
  },
  {
    icon: Code,
    title: "Modern UI",
    description:
      "Beautiful, accessible components with Tailwind CSS and shadcn/ui",
    benefits: ["Shadcn/ui", "Dark Mode", "Responsive"],
    category: "UI/UX",
    color: "text-purple-500",
  },
  {
    icon: Database,
    title: "Database Ready",
    description:
      "PostgreSQL with Drizzle ORM for type-safe database operations",
    benefits: ["Drizzle ORM", "Migrations", "Type Safety"],
    category: "Technical",
    color: "text-green-500",
  },
  {
    icon: BarChart3,
    title: "Analytics Built-in",
    description:
      "Google Analytics 4 with comprehensive event tracking and performance monitoring",
    benefits: ["GA4 Integration", "Event Tracking", "Performance Metrics"],
    category: "Analytics",
    color: "text-orange-500",
  },
  {
    icon: Palette,
    title: "Blog System",
    description:
      "Full-featured blog with categories, tags, search, and content management",
    benefits: ["Dynamic Routing", "Full-text Search", "Content Management"],
    category: "Features",
    color: "text-pink-500",
  },
  {
    icon: Shield,
    title: "Production Ready",
    description:
      "Security best practices, form validation, and error handling built-in",
    benefits: ["Form Validation", "Error Boundaries", "Security Headers"],
    category: "Technical",
    color: "text-red-500",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description:
      "Responsive design with touch-friendly interfaces and optimal mobile experience",
    benefits: ["Touch Optimized", "Progressive Enhancement", "Fast Loading"],
    category: "UI/UX",
    color: "text-indigo-500",
  },
];

const categories = [
  "All",
  "Technical",
  "SEO",
  "UI/UX",
  "Analytics",
  "Features",
];

export function FeaturesSection() {
  const handleFeatureClick = (featureTitle: string, category: string) => {
    trackEvent({
      action: "feature_explore",
      category: "engagement",
      label: `${category}: ${featureTitle}`,
    });
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/30" />

      <div className="container relative">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Features & Capabilities
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Everything You Need to Build{" "}
              <span className="text-primary">Modern Websites</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our template includes all the essential features and tools you
              need to create professional, high-performance websites with
              minimal setup.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() =>
                    handleFeatureClick(feature.title, feature.category)
                  }
                >
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent
                        className={`h-10 w-10 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                      />
                      <Badge variant="outline" className="text-xs">
                        {feature.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative">
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-4">
              Ready to experience all these features?
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>No setup required</span>
              <span className="text-muted-foreground">•</span>
              <Check className="h-4 w-4 text-green-500" />
              <span>Production ready</span>
              <span className="text-muted-foreground">•</span>
              <Check className="h-4 w-4 text-green-500" />
              <span>Full documentation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
