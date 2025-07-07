import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/config/seo";
import { getBlogPostBySlug } from "@/lib/api/blog.service";

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

  try {
    const post = await getBlogPostBySlug(slug);
    if (!post) {
      return generateSeoMetadata({
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found.",
      });
    }

    const postDateString = post.publishedAt || post.createdAt;

    return generateSeoMetadata({
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      keywords: post.tags.map((tag: { name: string }) => tag.name),
      type: "article",
      publishedTime: postDateString.toISOString(),
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
