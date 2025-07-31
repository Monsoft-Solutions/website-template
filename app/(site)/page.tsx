import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/config/seo";
import {
  HeroSection,
  ValuePropositionSection,
  FeaturedPropertiesSection,
  AboutSection,
  MarketInsightsSection,
} from "@/components/home";
import { Testimonials } from "@/components/ui/testimonials";

export const metadata: Metadata = generateSeoMetadata({
  title: "Sun Gulf Realty - Real Estate Different by Design | Cape Coral, FL",
  description:
    "Experience Cape Coral real estate differently. Transparent, innovative, and obsessed with every detail of your real estate journey. Local expertise meets modern technology.",
  keywords: [
    "cape coral real estate",
    "sun gulf realty",
    "cape coral homes for sale",
    "florida real estate",
    "cape coral realtor",
    "home valuation",
    "property search",
    "real estate agent",
    "cape coral properties",
    "florida homes",
  ],
});

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Properties Section */}
      <FeaturedPropertiesSection />

      {/* Property Search Bar - Overlapping hero section */}
      {/* <PropertySearchBar /> */}

      {/* Value Proposition Section */}
      <ValuePropositionSection />

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

      <MarketInsightsSection />
    </div>
  );
}
