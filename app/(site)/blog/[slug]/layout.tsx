import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/config/seo";
import { getBaseUrl } from "@/lib/utils/url.util";

interface BlogPostLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = getBaseUrl();

  try {
    const response = await fetch(
      `${baseUrl}/api/blog/posts/${encodeURIComponent(slug)}`
    );
    if (!response.ok) {
      return generateSeoMetadata({
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found.",
      });
    }

    const result = await response.json();
    if (!result.success) {
      return generateSeoMetadata({
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found.",
      });
    }

    const post = result.data;

    if (!post) {
      return {
        title: "Post Not Found",
      };
    }

    return generateSeoMetadata({
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      keywords: post.tags.map((tag: { name: string }) => tag.name),
      type: "article",
      publishedTime: (post.publishedAt || post.createdAt).toISOString(),
      authors: [post.author.name],
      url: `/blog/${post.slug}`,
    });
  } catch (error) {
    console.error("Error fetching blog post for metadata:", error);
    return generateSeoMetadata({
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    });
  }
}

/**
 * Blog post layout
 * Handles dynamic metadata generation for individual blog posts
 */
export default function BlogPostLayout({ children }: BlogPostLayoutProps) {
  return <>{children}</>;
}
