import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/config/seo";
import { BlogPreviewSection } from "@/components/home/blog-preview-section";

// Import all the new section components
// import { HeroSection } from "@/components/home/hero-section";

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

      {/* Blog Preview Section */}
      <BlogPreviewSection />
    </div>
  );
}
