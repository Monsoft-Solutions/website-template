"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Github, BookOpen, Zap } from "lucide-react";
import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { trackEvent } from "@/lib/utils/analytics";

export function HeroSection() {
  const handleCTAClick = (cta: string) => {
    trackEvent({
      action: "hero_cta_click",
      category: "conversion",
      label: cta,
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

      <div className="container relative">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 lg:py-32">
            {/* Content */}
            <div className="text-center lg:text-left">
              <Badge variant="outline" className="mb-6">
                <Zap className="w-3 h-3 mr-2" />
                Next.js 15 Ready
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
                Build Modern{" "}
                <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Websites
                </span>{" "}
                in Minutes
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Production-ready website template with blog system, analytics,
                SEO optimization, and database integration. Save weeks of
                development time with modern best practices built-in.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  TypeScript Ready
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  SEO Optimized
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  Analytics Built-in
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="group"
                  onClick={() => handleCTAClick("get-started")}
                  asChild
                >
                  <Link href="/contact">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleCTAClick("view-demo")}
                  asChild
                >
                  <Link href="/blog">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Demo
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => handleCTAClick("github")}
                  asChild
                >
                  <Link
                    href="https://github.com/Monsoft-Solutions/website-template"
                    target="_blank"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Star on GitHub
                  </Link>
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border bg-card">
                <PlaceholderImage
                  src="/images/hero-dashboard.png"
                  alt="Website Template Dashboard Preview"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000" />
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-6 -left-6 bg-card border shadow-lg rounded-lg p-4 animate-bounce delay-500">
                <div className="text-2xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Components</div>
              </div>

              <div className="absolute -bottom-4 -right-8 bg-card border shadow-lg rounded-lg p-4 animate-bounce delay-1000">
                <div className="text-2xl font-bold text-green-600">100%</div>
                <div className="text-sm text-muted-foreground">Type Safe</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
