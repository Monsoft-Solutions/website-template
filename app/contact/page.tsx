import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/config/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { HeroContactSection } from "@/components/sections/contact/hero-contact-section";
import { EnhancedContactForm } from "@/components/sections/contact/enhanced-contact-form";
import { TeamContactSection } from "@/components/sections/contact/team-contact-section";
import { EnhancedFaqSection } from "@/components/sections/contact/enhanced-faq-section";

export const metadata: Metadata = generateSeoMetadata({
  title: "Contact Us - Let's Create Something Amazing Together",
  description:
    "Connect with our expert team to bring your vision to life. Multiple ways to reach us, dedicated specialists for every project type, and instant answers to your questions.",
  keywords: [
    "contact",
    "support",
    "consultation",
    "project inquiry",
    "team",
    "expert developers",
    "design consultation",
    "project planning",
  ],
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        type="Organization"
        data={{
          name: "Monsoft Solutions",
          description:
            "A software development company that provides innovative digital solutions with expert team members specializing in web development, mobile apps, UI/UX design, and technical consulting.",
          url: "https://monsoft.com",
          telephone: "+1-555-123-4567",
          email: "hello@monsoft.com",
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: "+1-555-123-4567",
              contactType: "customer service",
              availableLanguage: ["English", "Spanish"],
              areaServed: "US",
            },
            {
              "@type": "ContactPoint",
              email: "hello@monsoft.com",
              contactType: "sales",
              availableLanguage: ["English", "Spanish"],
              areaServed: "Global",
            },
          ],
          address: {
            "@type": "PostalAddress",
            streetAddress: "123 Tech Street",
            addressLocality: "San Francisco",
            addressRegion: "CA",
            postalCode: "94102",
            addressCountry: "US",
          },
        }}
      />

      <div className="min-h-screen">
        {/* Hero Section with Quick Actions */}
        <HeroContactSection />

        {/* Enhanced Multi-Step Contact Form */}
        <EnhancedContactForm />

        {/* Team Contact Directory */}
        <TeamContactSection />

        {/* Enhanced FAQ Section */}
        <EnhancedFaqSection />
      </div>
    </>
  );
}
