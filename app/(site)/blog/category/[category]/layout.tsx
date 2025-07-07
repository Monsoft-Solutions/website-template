import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/config/seo";

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const categoryName = category.replace(/-/g, " ");

  return generateSeoMetadata({
    title: `${categoryName} - Blog Category`,
    description: `Explore all blog posts in the ${categoryName} category. Discover insights, tutorials, and articles about ${categoryName}.`,
    keywords: [categoryName, "blog", "articles", "category"],
  });
}

/**
 * Blog category layout
 * Handles dynamic metadata generation for category pages
 */
export default function CategoryLayout({ children }: CategoryLayoutProps) {
  return <>{children}</>;
}
