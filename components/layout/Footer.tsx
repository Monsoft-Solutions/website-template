"use client";

import Link from "next/link";
import { useSiteConfig } from "@/lib/hooks/use-site-config.hook";
import { Github, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

const footerLinks = {
  company: [
    { href: "/about", label: "About" },
    { href: "/gallery", label: "Gallery" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  resources: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
    { href: "/sitemap.xml", label: "Sitemap" },
  ],
};

export function Footer() {
  const { config: siteConfig } = useSiteConfig();
  const currentYear = new Date().getFullYear();

  // Create social links dynamically based on site config, filtering out undefined links
  const allSocialLinks = [
    {
      href: siteConfig.links.github,
      label: "GitHub",
      icon: Github,
    },
    {
      href: siteConfig.links.twitter,
      label: "Twitter",
      icon: Twitter,
    },
    {
      href: siteConfig.links.linkedin,
      label: "LinkedIn",
      icon: Linkedin,
    },
    {
      href: siteConfig.links.facebook,
      label: "Facebook",
      icon: Facebook,
    },
    {
      href: siteConfig.links.instagram,
      label: "Instagram",
      icon: Instagram,
    },
  ];

  // Filter out undefined/empty links and ensure type safety
  const socialLinks = allSocialLinks.filter(
    (link): link is typeof link & { href: string } =>
      link.href != null && link.href.length > 0
  );

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="flex items-center space-x-2 font-bold text-xl hover:opacity-80 transition-opacity"
            >
              <span>{siteConfig.name}</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              {siteConfig.description}
            </p>
            {/* Social Links */}
            <div className="flex items-center space-x-4 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>
                Built with ❤️ by{" "}
                <Link href="https://monsoftsolutions.com">
                  Monsoft Solutions
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
