"use client";

import { AboutSection } from "./about-section";
import { Testimonials } from "@/components/ui/testimonials";

/**
 * Phase 4 Homepage Section
 * Combines About Sun Gulf Realty and Client Testimonials sections
 * as specified in the implementation plan
 */
export function Phase4Section() {
  return (
    <>
      {/* Component 6: About Sun Gulf Realty */}
      <AboutSection />

      {/* Component 7: Client Testimonials */}
      <Testimonials
        title="What Our Clients Say"
        subtitle="Real reviews from real Cape Coral families"
        showStats={true}
        autoRotate={true}
        rotationInterval={8000}
        backgroundVariant="light"
      />
    </>
  );
}
