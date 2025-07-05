"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Home,
  Search,
  ArrowLeft,
  Mail,
  Phone,
  HelpCircle,
  FileQuestion,
} from "lucide-react";

// Note: metadata moved to layout or removed since this is now a client component

const quickLinks = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    description: "Back to our homepage",
  },
  {
    href: "/about",
    label: "About Us",
    icon: HelpCircle,
    description: "Learn more about our company",
  },
  {
    href: "/blog",
    label: "Blog",
    icon: FileQuestion,
    description: "Read our latest articles",
  },
  {
    href: "/contact",
    label: "Contact",
    icon: Mail,
    description: "Get in touch with us",
  },
];

const helpfulTips = [
  "Check the URL for typos or misspellings",
  "Try searching for what you're looking for",
  "Use the navigation menu to browse our site",
  "Contact us if you think this is an error",
];

export default function NotFound() {
  return (
    <div className="flex flex-col gap-12 py-16">
      {/* Main 404 Section */}
      <section className="container">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="text-8xl font-bold text-muted-foreground/20 mb-4">
              404
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The page you&apos;re looking for doesn&apos;t exist. It might have
              been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search Our Site
            </CardTitle>
            <CardDescription>
              Can&apos;t find what you&apos;re looking for? Try searching for
              it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Search for pages, articles, or topics..."
                className="flex-1"
              />
              <Button>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Links */}
      <section className="container">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Popular Pages</h2>
          <p className="text-muted-foreground">
            Here are some pages you might be interested in:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Card
                key={link.href}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardHeader className="text-center">
                  <IconComponent className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    <Link href={link.href}>{link.label}</Link>
                  </CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href={link.href}>Visit Page</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Helpful Tips */}
      <section className="container">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">What can you do?</CardTitle>
            <CardDescription>
              Here are some suggestions to help you find what you&apos;re
              looking for:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {helpfulTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Contact Support */}
      <section className="container">
        <Card className="bg-muted/50 max-w-2xl mx-auto">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-semibold mb-4">Still Need Help?</h3>
            <p className="text-muted-foreground mb-6">
              If you believe this is an error or you&apos;re having trouble
              finding what you need, don&apos;t hesitate to reach out to our
              support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="tel:+15551234567">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Us
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
