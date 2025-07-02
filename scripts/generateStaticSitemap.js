import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory using ESM compatible approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const PUBLIC_DIR = path.join(__dirname, "../public");
const SITEMAP_PATH = path.join(PUBLIC_DIR, "sitemap_static.xml");
const APP_DIR = path.join(__dirname, "../app");

// Base URL from environment or default
const baseUrl = process.env.SITE_URL || "https://www.praxisnotes.com";

// Function to recursively find all page.tsx files
function findPages(dir, relativePath = "") {
  const pages = [];

  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip directories that start with _ or are dynamic routes (contain brackets)
        if (item.startsWith("_") || item.includes("[") || item === "api") {
          continue;
        }

        // Recursively search subdirectories
        const subPath = relativePath ? `${relativePath}/${item}` : item;
        pages.push(...findPages(fullPath, subPath));
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

// Convert file paths to routes with priority and change frequency
function generateRoutes() {
  const pagePaths = findPages(APP_DIR);

  return pagePaths.map((pagePath) => {
    // Convert empty string (root) to /
    const url = pagePath === "" ? baseUrl : `${baseUrl}/${pagePath}`;

    // Assign priority based on depth and importance
    let priority = 0.5;
    let changeFreq = "weekly";

    if (pagePath === "") {
      // Home page
      priority = 1.0;
      changeFreq = "daily";
    } else if (pagePath === "blog") {
      priority = 0.9;
      changeFreq = "daily";
    } else if (["about", "services", "contact"].includes(pagePath)) {
      priority = 0.8;
      changeFreq = "monthly";
    } else {
      // Calculate priority based on depth (fewer segments = higher priority)
      const depth = pagePath.split("/").length;
      priority = Math.max(0.3, 0.8 - depth * 0.1);
    }

    return {
      url,
      priority,
      changeFreq,
    };
  });
}

// Generate sitemap XML content
function generateSitemapXml() {
  const today = new Date().toISOString();
  const routes = generateRoutes();

  console.log(`Found ${routes.length} static pages:`);
  routes.forEach((route) => console.log(`  - ${route.url}`));

  const urlElements = routes
    .map(
      (route) => `
    <url>
      <loc>${route.url}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>${route.changeFreq}</changefreq>
      <priority>${route.priority}</priority>
    </url>
  `
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
    ${urlElements}
</urlset>`;
}

// Write sitemap to file
function writeSitemap() {
  const xmlContent = generateSitemapXml();

  try {
    fs.writeFileSync(SITEMAP_PATH, xmlContent);
    console.log(`✅ Static sitemap successfully written to ${SITEMAP_PATH}`);
  } catch (error) {
    console.error("❌ Error writing sitemap:", error);
  }
}

// Run the script
writeSitemap();
