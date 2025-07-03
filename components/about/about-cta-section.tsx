"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MessageSquare,
  Users,
  Heart,
  Star,
  Rocket,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface CtaOption {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  buttonText: string;
  href: string;
  color: string;
  bgColor: string;
  featured?: boolean;
}

const ctaOptions: CtaOption[] = [
  {
    icon: Rocket,
    title: "Start Your Project",
    description:
      "Ready to transform your business? Let&apos;s discuss your vision and create something extraordinary together.",
    buttonText: "Get Started",
    href: "/contact",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    featured: true,
  },
  {
    icon: Users,
    title: "Join Our Team",
    description:
      "Passionate about innovation? Explore career opportunities and become part of our growing family.",
    buttonText: "View Careers",
    href: "/careers",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Heart,
    title: "Partner With Us",
    description:
      "Looking for a strategic partnership? Let&apos;s explore how we can grow together.",
    buttonText: "Become a Partner",
    href: "/partnership",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: MessageSquare,
    title: "Just Say Hello",
    description:
      "Have questions or want to learn more? We&apos;d love to hear from you and share our story.",
    buttonText: "Contact Us",
    href: "/contact",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

export function AboutCtaSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        {/* Floating Shapes */}
        <div className="absolute top-20 right-20 w-8 h-8 bg-primary/20 rounded-full animate-bounce" />
        <div className="absolute bottom-20 left-20 w-6 h-6 bg-accent/20 rotate-45 animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-primary/30 rounded-full animate-float" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              Let&apos;s Connect
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Create Magic
              </span>{" "}
              Together?
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Your journey with us starts here. Whether you&apos;re ready to
              launch your next big idea, join our innovative team, or simply
              want to explore possibilities, we&apos;re excited to connect with
              you.
            </p>
          </div>

          {/* Main CTA Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {ctaOptions.map((option, index) => {
              const IconComponent = option.icon;

              return (
                <Card
                  key={option.title}
                  className={`group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-pointer ${
                    option.featured
                      ? "border-2 border-primary/30 shadow-lg hover:shadow-xl"
                      : "border-2 border-transparent hover:border-primary/20"
                  }`}
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  {/* Background Effects */}
                  <div
                    className={`absolute inset-0 ${option.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  {option.featured && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" />
                  )}

                  <CardContent className="p-8 relative">
                    {/* Featured Badge */}
                    {option.featured && (
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-primary text-primary-foreground">
                          Popular
                        </Badge>
                      </div>
                    )}

                    {/* Icon */}
                    <div className="mb-6">
                      <div
                        className={`w-16 h-16 ${option.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
                      >
                        <IconComponent className={`w-8 h-8 ${option.color}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4 mb-6">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                        {option.title}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {option.description}
                      </p>
                    </div>

                    {/* CTA Button */}
                    <Button
                      className={`w-full group-hover:scale-105 transition-transform duration-300 ${
                        option.featured ? "bg-primary hover:bg-primary/90" : ""
                      }`}
                      variant={option.featured ? "default" : "outline"}
                      asChild
                    >
                      <Link href={option.href}>
                        {option.buttonText}
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Direct Contact Options */}
          <Card className="mb-16 bg-gradient-to-br from-background via-accent/5 to-background border-primary/20">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold mb-4">
                  Prefer Direct Contact?
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Sometimes it&apos;s easier to just pick up the phone or send
                  an email. We&apos;re here and ready to chat whenever you are.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-8 h-8 text-blue-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Email Us</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drop us a line anytime. We typically respond within 2 hours.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="mailto:hello@monsoft.com">
                      hello@monsoft.com
                    </Link>
                  </Button>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Call Us</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Speak directly with our team. Available 9 AM - 6 PM PST.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="tel:+1-555-123-4567">+1 (555) 123-4567</Link>
                  </Button>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-8 h-8 text-purple-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Schedule a Call</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Book a time that works for you. Free 30-minute consultation.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/schedule">Book Meeting</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Final Message */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-none">
            <CardContent className="p-8 lg:p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-8">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-6">
                Thank You for Reading Our Story
              </h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                Every great partnership starts with a conversation. We
                can&apos;t wait to learn about your vision, understand your
                challenges, and explore how we can help you achieve something
                extraordinary.
              </p>
              <blockquote className="text-xl italic text-muted-foreground mb-8">
                &ldquo;The best time to plant a tree was 20 years ago. The
                second best time is now.&rdquo;
              </blockquote>
              <p className="text-muted-foreground">
                Let&apos;s plant the seeds of your next big success together.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
