import { JsonLd } from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/utils/url.util";
import type { BlogListOptions, BlogListResponse } from "@/lib/types";

// Import new blog sections
import { BlogHero } from "@/components/blog/sections/blog-hero";
import { FeaturedArticles } from "@/components/blog/sections/featured-articles";
import { CategoryHub } from "@/components/blog/sections/category-hub";
import { ArticlesGrid } from "@/components/blog/sections/articles-grid";
import { NewsletterCTA } from "@/components/blog/sections/newsletter-cta";

// Import client component for filters (interactive features only)
import { BlogFilters } from "@/components/blog/BlogFilters";
import { getBlogCategories, getBlogPosts } from "@/lib/api/blog.service";

// Force dynamic rendering for cache invalidation
export const dynamic = "force-dynamic";

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page, category, search } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const currentCategory = category || "all";
  const currentSearch = search || "";
  const baseUrl = getBaseUrl();

  // Initialize with fallback data
  let blogData: BlogListResponse = {
    posts: [],
    totalPages: 0,
    totalPosts: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };
  let categories: Array<{ name: string; slug: string; count: number }> = [];

  try {
    // Build query parameters
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: "12",
    });

    if (currentCategory !== "all") {
      params.set("categorySlug", currentCategory);
    }

    if (currentSearch) {
      params.set("searchQuery", currentSearch);
    }

    const options: BlogListOptions = {
      page: currentPage,
      limit: 12,
      categorySlug: currentCategory,
      searchQuery: currentSearch,
      status: "published",
    };

    // Get blog posts
    const result = await getBlogPosts(options);

    blogData = result;

    // Fetch categories with counts (SSR)
    const categoriesResponse = await getBlogCategories();
    categories = categoriesResponse.map((category) => ({
      name: category.category.name,
      slug: category.category.slug,
      count: category.postCount,
    }));
  } catch (error) {
    console.error("Error fetching blog data:", error);
    // Continue with empty data - better than crashing
  }

  // Transform data for our new components
  const transformedPosts = blogData.posts.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    category: {
      name: post.category.name,
      slug: post.category.slug,
    },
    author: {
      name: post.author.name,
      avatar: post.author.avatarUrl || undefined,
    },
    publishedAt: (post.publishedAt || post.createdAt).toString(),
    readingTime: post.readingTime,
    featuredImage: post.featuredImage || undefined,
    slug: post.slug,
    featured:
      blogData.posts.indexOf(post) === 0 &&
      currentPage === 1 &&
      !currentSearch &&
      currentCategory === "all",
    trending: Math.random() > 0.7, // Random trending for demo
    likes: Math.floor(Math.random() * 100) + 10,
    comments: Math.floor(Math.random() * 50) + 2,
  }));

  const transformedCategories = categories.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    count: cat.count,
    description: getCategoryDescription(cat.name),
    color: getCategoryColor(cat.name),
    icon: getCategoryIcon(cat.name),
    trending: Math.random() > 0.6,
  }));

  // Show different layouts based on filters
  const isFiltered =
    !!currentSearch || currentCategory !== "all" || currentPage > 1;
  const showHero = !isFiltered;
  const showFeatured = !isFiltered && transformedPosts.length > 0;
  const showCategories = !isFiltered;

  return (
    <>
      <JsonLd
        type="WebSite"
        data={{
          name: "Blog",
          description:
            "Insights, tutorials, and industry trends in technology and design",
          url: `${baseUrl}/blog`,
        }}
      />

      <div className="min-h-screen">
        {/* Hero Section - Only on main page */}
        {showHero && (
          <BlogHero
            totalPosts={blogData.totalPosts}
            totalAuthors={25}
            totalReads={blogData.totalPosts * 347} // Estimated reads
          />
        )}

        {/* Featured Articles - Only on main page */}
        {showFeatured && <FeaturedArticles articles={transformedPosts} />}

        {/* Category Hub - Only on main page */}
        {showCategories && <CategoryHub categories={transformedCategories} />}

        {/* Search and Filter Section - Client Component */}
        <section className="py-8 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-6xl">
              <BlogFilters
                categories={categories}
                currentCategory={currentCategory}
                currentSearch={currentSearch}
                currentPage={currentPage}
                totalPages={blogData.totalPages}
              />
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <ArticlesGrid
          articles={transformedPosts}
          title={getGridTitle(currentSearch, currentCategory, categories)}
          description={getGridDescription(
            currentSearch,
            currentCategory,
            blogData.totalPosts
          )}
          showHeader={isFiltered}
          className={
            isFiltered
              ? "bg-background"
              : "bg-gradient-to-br from-background via-muted/10 to-background"
          }
        />

        {/* Newsletter CTA */}
        <NewsletterCTA
          subscriberCount={50000}
          className="bg-gradient-to-br from-muted/20 via-background to-muted/20"
        />
      </div>
    </>
  );
}

// Helper functions for category data
function getCategoryDescription(name: string): string {
  const descriptions: Record<string, string> = {
    Development: "Code tutorials, frameworks, and best practices",
    Design: "UI/UX, visual design, and creative workflows",
    Performance: "Optimization, speed, and efficiency techniques",
    Strategy: "Business insights and growth strategies",
    Innovation: "Emerging tech and future trends",
    "AI & ML": "Artificial intelligence and machine learning",
    Technology: "Latest tech trends and innovations",
    Tutorial: "Step-by-step guides and how-tos",
    Opinion: "Thought leadership and industry perspectives",
    News: "Industry news and updates",
  };
  return descriptions[name] || "Expert insights and valuable content";
}

function getCategoryColor(name: string): string {
  const colors: Record<string, string> = {
    Development: "from-blue-500 to-cyan-500",
    Design: "from-purple-500 to-pink-500",
    Performance: "from-green-500 to-emerald-500",
    Strategy: "from-orange-500 to-red-500",
    Innovation: "from-indigo-500 to-purple-500",
    "AI & ML": "from-teal-500 to-blue-500",
    Technology: "from-blue-600 to-indigo-600",
    Tutorial: "from-green-600 to-teal-600",
    Opinion: "from-purple-600 to-pink-600",
    News: "from-red-500 to-orange-500",
  };
  return colors[name] || "from-gray-500 to-slate-500";
}

function getCategoryIcon(name: string): string {
  const icons: Record<string, string> = {
    Development: "code",
    Design: "palette",
    Performance: "zap",
    Strategy: "target",
    Innovation: "rocket",
    "AI & ML": "brain",
    Technology: "layers",
    Tutorial: "code",
    Opinion: "brain",
    News: "zap",
  };
  return icons[name] || "code";
}

function getGridTitle(
  currentSearch: string,
  currentCategory: string,
  categories: Array<{ name: string; slug: string; count: number }>
): string {
  if (currentSearch) {
    return `Search Results`;
  }
  if (currentCategory !== "all") {
    const category = categories.find((c) => c.slug === currentCategory);
    return `${category?.name || currentCategory} Articles`;
  }
  return "Latest Articles";
}

function getGridDescription(
  currentSearch: string,
  currentCategory: string,
  totalPosts: number
): string {
  if (currentSearch) {
    return `${
      totalPosts === 0
        ? "No results"
        : `${totalPosts} ${totalPosts === 1 ? "result" : "results"}`
    } found for "${currentSearch}"`;
  }
  if (currentCategory !== "all") {
    return `Explore our collection of expert articles and insights`;
  }
  return "Stay updated with our latest articles and insights";
}
