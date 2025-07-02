import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import {
  getBlogPosts,
  getBlogCategories,
  getBlogTags,
} from "@/lib/api/blog.service";
import fs from "fs";
import path from "path";

// Configuration for page discovery
const pageConfig = {
  // Directories to exclude (in addition to dynamic routes and api)
  excludeDirs: ["_app", "_document", "_error"],

  // Priority rules - first matching rule wins
  priorityRules: [
    { path: "", priority: 1.0 }, // Home page
    { path: "blog", priority: 0.9 },
    { paths: ["about", "services", "contact"], priority: 0.8 },
    { default: true, priority: 0.7 }, // Default priority for other pages
  ],

  // Change frequency rules - first matching rule wins
  changeFreqRules: [
    { path: "", changeFreq: "daily" }, // Home page
    { path: "blog", changeFreq: "daily" },
    { paths: ["about", "services", "contact"], changeFreq: "monthly" },
    { default: true, changeFreq: "weekly" }, // Default frequency
  ],
};

// Function to recursively find all page.tsx files
function findStaticPages(dir: string, relativePath: string = ""): string[] {
  const pages: string[] = [];

  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip directories that start with _ or are dynamic routes (contain brackets)
        if (
          item.startsWith("_") ||
          item.includes("[") ||
          item === "api" ||
          pageConfig.excludeDirs.includes(item)
        ) {
          continue;
        }

        // Recursively search subdirectories
        const subPath = relativePath ? `${relativePath}/${item}` : item;
        pages.push(...findStaticPages(fullPath, subPath));
      } else if (item === "page.tsx" || item === "page.js") {
        // Found a page file
        pages.push(relativePath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return pages;
}

// Convert discovered pages to sitemap entries
function generateStaticPages(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Discover pages from the app directory
  const appDir = path.join(process.cwd(), "app");
  const discoveredPaths = findStaticPages(appDir);

  return discoveredPaths.map((pagePath) => {
    // Convert empty string (root) to base URL
    const url =
      pagePath === "" ? siteConfig.url : `${siteConfig.url}/${pagePath}`;

    // Find matching priority rule
    let priority = 0.7;
    for (const rule of pageConfig.priorityRules) {
      if (rule.default) {
        priority = rule.priority;
        break;
      }
      if (rule.path !== undefined && rule.path === pagePath) {
        priority = rule.priority;
        break;
      }
      if (rule.paths !== undefined && rule.paths.includes(pagePath)) {
        priority = rule.priority;
        break;
      }
    }

    // Find matching change frequency rule
    let changeFrequency: "daily" | "weekly" | "monthly" = "weekly";
    for (const rule of pageConfig.changeFreqRules) {
      if (rule.default) {
        changeFrequency = rule.changeFreq as "daily" | "weekly" | "monthly";
        break;
      }
      if (rule.path !== undefined && rule.path === pagePath) {
        changeFrequency = rule.changeFreq as "daily" | "weekly" | "monthly";
        break;
      }
      if (rule.paths !== undefined && rule.paths.includes(pagePath)) {
        changeFrequency = rule.changeFreq as "daily" | "weekly" | "monthly";
        break;
      }
    }

    return {
      url,
      lastModified: currentDate,
      changeFrequency,
      priority,
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Generate static pages dynamically
  const staticPages = generateStaticPages();

  try {
    // Fetch all published blog posts
    const blogResult = await getBlogPosts({
      limit: 1000, // Get all posts
      status: "published",
    });

    // Generate blog post URLs
    const blogPostPages: MetadataRoute.Sitemap = blogResult.posts.map(
      (post) => ({
        url: `${siteConfig.url}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })
    );

    // Fetch all categories
    const categories = await getBlogCategories();
    const categoryPages: MetadataRoute.Sitemap = categories
      .filter((cat) => cat.category.slug !== "all") // Skip the "all" category
      .map((cat) => ({
        url: `${siteConfig.url}/blog/category/${cat.category.slug}`,
        lastModified: cat.category.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      }));

    // Fetch all tags
    const tags = await getBlogTags();
    const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
      url: `${siteConfig.url}/blog/tag/${tag.tag.slug}`,
      lastModified: tag.tag.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    }));

    return [...staticPages, ...blogPostPages, ...categoryPages, ...tagPages];
  } catch (error) {
    console.error("Error generating dynamic sitemap entries:", error);
    // Return at least the static pages if there's an error
    return staticPages;
  }
}
