import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/config/seo";
import { HeroSection } from "@/components/home/hero-section";

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
    </div>
  );
}
