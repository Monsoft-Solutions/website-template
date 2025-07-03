"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/utils/analytics";
import {
  ArrowRight,
  Github,
  BookOpen,
  MessageCircle,
  Download,
  Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function FinalCtaSection() {
  const handleCtaClick = (ctaType: string, ctaLocation: string) => {
    trackEvent({
      action: "final_cta_click",
      category: "conversion",
      label: `${ctaType} - ${ctaLocation}`,
    });
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container relative">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <Badge variant="outline" className="mb-6">
                <Star className="w-3 h-3 mr-2" />
                Ready to Get Started?
              </Badge>

              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                Start Building Your{" "}
                <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Dream Website
                </span>{" "}
                Today
              </h2>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Don&apos;t spend months building what&apos;s already been
                perfected. Get our production-ready template and launch your
                website in minutes, not months.
              </p>

              {/* Benefits List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  <span>Save 2-3 months of development</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                  <span>Production-ready from day one</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                  <span>Best practices built-in</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                  <span>Ongoing support & updates</span>
                </div>
              </div>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="group bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => handleCtaClick("get-started", "primary")}
                  asChild
                >
                  <Link href="/contact">
                    <Download className="mr-2 h-4 w-4" />
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="group"
                  onClick={() => handleCtaClick("view-demo", "primary")}
                  asChild
                >
                  <Link href="/blog">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Live Demo
                  </Link>
                </Button>
              </div>

              {/* Secondary CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleCtaClick("github", "secondary")}
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

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleCtaClick("contact", "secondary")}
                  asChild
                >
                  <Link href="/contact">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Get Support
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-8 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-4">
                  Trusted by developers worldwide
                </p>
                <div className="flex items-center justify-center lg:justify-start gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">1.2k+</div>
                    <div className="text-xs text-muted-foreground">
                      GitHub Stars
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      5.4k+
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Downloads
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">890+</div>
                    <div className="text-xs text-muted-foreground">
                      Active Users
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative lg:pl-8">
              {/* Main Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border bg-card">
                  <Image
                    src="/images/cta-mockup.png"
                    alt="Website Template Preview"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  {/* Overlay Elements */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium animate-bounce delay-500">
                  ✓ SEO Ready
                </div>

                <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium animate-bounce delay-1000">
                  ⚡ Fast Loading
                </div>

                <div className="absolute top-1/2 -right-6 bg-purple-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium animate-bounce delay-700">
                  🎨 Modern UI
                </div>
              </div>

              {/* Background Decorations */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Bottom Section - Additional Information */}
          <div className="mt-24 text-center">
            <div className="mx-auto max-w-4xl">
              <h3 className="text-2xl font-bold mb-4">What&apos;s Included?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-1">Complete Source</h4>
                  <p className="text-sm text-muted-foreground">
                    Full Next.js codebase
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-medium mb-1">Documentation</h4>
                  <p className="text-sm text-muted-foreground">
                    Setup & customization
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-medium mb-1">Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Community & email
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Download className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-medium mb-1">Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    Free lifetime updates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
