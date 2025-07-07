import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/config/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Blog",
  description:
    "Discover insights, tutorials, and industry trends. Stay updated with our latest articles on technology, design, and digital innovation.",
  keywords: [
    "blog",
    "articles",
    "tutorials",
    "technology",
    "design",
    "insights",
  ],
});

interface BlogLayoutProps {
  children: React.ReactNode;
}

/**
 * Blog section layout
 * Handles metadata and provides consistent structure for blog pages
 */
export default function BlogLayout({ children }: BlogLayoutProps) {
  return <>{children}</>;
}
