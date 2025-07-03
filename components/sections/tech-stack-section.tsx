"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/utils/analytics";
import { ExternalLink, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Technology {
  name: string;
  description: string;
  logo: string;
  category: string;
  link: string;
  version?: string;
  features: string[];
}

const technologies: Technology[] = [
  {
    name: "Next.js",
    description:
      "The React framework for production with App Router and Server Components",
    logo: "/images/tech/nextjs.svg",
    category: "Framework",
    link: "https://nextjs.org/",
    version: "15.0",
    features: ["App Router", "Server Components", "Image Optimization"],
  },
  {
    name: "TypeScript",
    description:
      "Static type checking for JavaScript with enhanced developer experience",
    logo: "/images/tech/typescript.svg",
    category: "Language",
    link: "https://www.typescriptlang.org/",
    version: "5.0+",
    features: ["Type Safety", "IntelliSense", "Error Prevention"],
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first CSS framework for rapid UI development",
    logo: "/images/tech/tailwind.svg",
    category: "Styling",
    link: "https://tailwindcss.com/",
    version: "3.4",
    features: ["Utility Classes", "Dark Mode", "Responsive Design"],
  },
  {
    name: "PostgreSQL",
    description:
      "Advanced open-source relational database with excellent performance",
    logo: "/images/tech/postgresql.svg",
    category: "Database",
    link: "https://www.postgresql.org/",
    features: ["ACID Compliance", "JSON Support", "Extensible"],
  },
  {
    name: "Drizzle ORM",
    description: "TypeScript ORM with zero-runtime overhead and excellent DX",
    logo: "/images/tech/drizzle.svg",
    category: "ORM",
    link: "https://orm.drizzle.team/",
    features: ["Type Safety", "Zero Overhead", "SQL-like Syntax"],
  },
  {
    name: "Shadcn/ui",
    description: "Copy & paste components built on Radix UI and Tailwind CSS",
    logo: "/images/tech/shadcn.svg",
    category: "Components",
    link: "https://ui.shadcn.com/",
    features: ["Radix UI", "Accessible", "Customizable"],
  },
];

const categories = [
  "All",
  "Framework",
  "Language",
  "Styling",
  "Database",
  "ORM",
  "Components",
];

export function TechStackSection() {
  const handleTechClick = (techName: string) => {
    trackEvent({
      action: "tech_explore",
      category: "engagement",
      label: techName,
    });
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Star className="w-3 h-3 mr-2" />
              Technology Stack
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Built with{" "}
              <span className="text-primary">Modern & Battle-tested</span>{" "}
              Technologies
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every technology in our stack has been carefully chosen for
              performance, developer experience, and long-term maintainability.
            </p>
          </div>

          {/* Categories */}
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

          {/* Technology Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {technologies.map((tech) => (
              <Card
                key={tech.name}
                className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-background/80 backdrop-blur-sm"
                onClick={() => handleTechClick(tech.name)}
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                <div className="absolute inset-[1px] bg-background rounded-lg" />

                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-card rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                        <Image
                          src={tech.logo}
                          alt={`${tech.name} logo`}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-2">
                        {tech.category}
                      </Badge>
                      {tech.version && (
                        <div className="text-xs text-muted-foreground">
                          v{tech.version}
                        </div>
                      )}
                    </div>
                  </div>

                  <CardTitle className="text-xl group-hover:text-primary transition-colors mb-2">
                    {tech.name}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {tech.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative">
                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {tech.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Learn More Link */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto font-normal text-primary hover:text-primary/80"
                    asChild
                  >
                    <Link
                      href={tech.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn more
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">6</div>
              <div className="text-sm text-muted-foreground">
                Core Technologies
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Type Safe</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">0ms</div>
              <div className="text-sm text-muted-foreground">
                Runtime Overhead
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
              <div className="text-sm text-muted-foreground">Scalability</div>
            </div>
          </div>

          {/* Tech Stack Benefits */}
          <div className="mt-16 text-center">
            <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold">Developer Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Modern tooling with excellent TypeScript support and hot
                  reload
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold">Performance</h3>
                <p className="text-sm text-muted-foreground">
                  Optimized bundle sizes and runtime performance out of the box
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold">Future Proof</h3>
                <p className="text-sm text-muted-foreground">
                  Latest stable versions with active maintenance and updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
