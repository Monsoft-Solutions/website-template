"use client";

import { JsonLd } from "@/components/seo/JsonLd";

// Import new About page sections
// import { AboutHeroSection } from "@/components/about/about-hero-section";

export default function AboutPage() {
  return (
    <>
      <JsonLd
        type="Organization"
        data={{
          name: "Monsoft Solutions",
          description:
            "A forward-thinking software development company that creates innovative digital solutions for the modern world.",
          url: "https://monsoft.com",
          logo: "https://monsoft.com/logo.png",
          foundingDate: "2014",
          founders: [
            {
              "@type": "Person",
              name: "Alex Johnson",
            },
          ],
          numberOfEmployees: "25",
          location: {
            "@type": "Place",
            name: "San Francisco, CA",
          },
          sameAs: [
            "https://linkedin.com/company/monsoft-solutions",
            "https://twitter.com/monsoft",
            "https://github.com/monsoft-solutions",
          ],
        }}
      />

      <main className="relative overflow-hidden">
        {/* Dynamic Hero Section */}
      </main>
    </>
  );
}
