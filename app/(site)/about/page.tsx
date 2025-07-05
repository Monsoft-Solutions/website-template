"use client";

import { JsonLd } from "@/components/seo/JsonLd";

// Import new About page sections
import { AboutHeroSection } from "@/components/about/about-hero-section";
import { AboutTimelineSection } from "@/components/about/about-timeline-section";
import { AboutMissionSection } from "@/components/about/about-mission-section";
import { AboutValuesSection } from "@/components/about/about-values-section";
import { AboutTeamSection } from "@/components/about/about-team-section";
import { AboutCultureSection } from "@/components/about/about-culture-section";
import { AboutStatsSection } from "@/components/about/about-stats-section";
import { AboutRecognitionSection } from "@/components/about/about-recognition-section";
import { AboutFutureSection } from "@/components/about/about-future-section";
import { AboutCtaSection } from "@/components/about/about-cta-section";

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
        <AboutHeroSection />

        {/* Interactive Timeline */}
        <AboutTimelineSection />

        {/* Mission & Vision */}
        <AboutMissionSection />

        {/* Core Values */}
        <AboutValuesSection />

        {/* Team Showcase */}
        <AboutTeamSection />

        {/* Culture Gallery */}
        <AboutCultureSection />

        {/* Achievement Stats */}
        <AboutStatsSection />

        {/* Recognition Wall */}
        <AboutRecognitionSection />

        {/* Future Vision */}
        <AboutFutureSection />

        {/* Join Us CTA */}
        <AboutCtaSection />
      </main>
    </>
  );
}
