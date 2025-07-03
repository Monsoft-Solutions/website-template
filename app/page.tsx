import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/config/seo";

// Import all the new section components
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { TechStackSection } from "@/components/sections/tech-stack-section";
import { StatsSection } from "@/components/sections/stats-section";
import { BlogPreviewSection } from "@/components/sections/blog-preview-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";

export const metadata: Metadata = generateSeoMetadata({
  title: "Modern Website Template for Next.js",
  description:
    "Production-ready website template built with Next.js 15, TypeScript, and Tailwind CSS. Features blog system, analytics, SEO optimization, and database integration. Save weeks of development time.",
  keywords: [
    "nextjs template",
    "website template",
    "typescript",
    "tailwind css",
    "blog system",
    "seo optimized",
    "analytics",
    "production ready",
    "modern web development",
  ],
});

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* Statistics Section */}
      <StatsSection />

      {/* Blog Preview Section */}
      <BlogPreviewSection />

      {/* Final CTA Section */}
      <FinalCtaSection />
    </div>
  );
}
