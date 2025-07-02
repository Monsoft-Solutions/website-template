#!/usr/bin/env tsx

/**
 * This script manually updates Google's index with URLs from the dynamic sitemap.
 * It's useful for forcing Google to re-index the site after major content updates.
 *
 * Usage:
 *   npm run sitemap:notify
 *
 * Requirements:
 *   - GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY environment variables containing the service account credentials
 *   - Installed @monsoft/google-indexing package
 */

import { GoogleIndexingClient } from "@monsoft/google-indexing";
import sitemap from "@/app/sitemap";
import { siteConfig } from "@/lib/config/site";

// Helper functions for credentials
function getClientEmail() {
  if (!process.env.GOOGLE_CLIENT_EMAIL) {
    throw new Error("GOOGLE_CLIENT_EMAIL environment variable is not set");
  }
  return process.env.GOOGLE_CLIENT_EMAIL;
}

function getPrivateKey() {
  if (!process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error("GOOGLE_PRIVATE_KEY environment variable is not set");
  }
  // Handle newlines in the private key (environment variables can strip newlines)
  return process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log("🚀 Starting Google indexing update...");

    // Get URLs from the dynamic sitemap
    console.log("📋 Fetching URLs from dynamic sitemap...");
    const sitemapData = await sitemap();
    const urls = sitemapData.map((item) => item.url);

    if (urls.length === 0) {
      console.error("❌ No URLs found in sitemap!");
      process.exit(1);
    }

    console.log(`✅ Found ${urls.length} URLs in sitemap:`);
    urls.forEach((url) => console.log(`   - ${url}`));

    // Initialize Google Indexing client
    const client = new GoogleIndexingClient({
      clientEmail: getClientEmail(),
      privateKey: getPrivateKey(),
      baseUrl: siteConfig.url,
    });

    await client.initialize();

    // Create indexable URLs
    const indexableUrls = urls.map((url) => ({
      url,
      type: "URL_UPDATED" as const,
    }));

    // Submit to Google for indexing
    console.log(
      `\n📤 Submitting ${indexableUrls.length} URLs to Google Indexing API...`
    );
    const results = await client.notifyUrlUpdates(indexableUrls);

    // Report results
    const successCount = results.filter((r) => r.success).length;
    const failedCount = results.length - successCount;

    console.log("\n📊 Google Indexing Results:");
    console.log(`   - Total URLs: ${results.length}`);
    console.log(`   - Successfully indexed: ${successCount} ✅`);
    console.log(`   - Failed: ${failedCount} ❌`);

    if (failedCount > 0) {
      console.log("\n❌ Failed URLs:");
      results
        .filter((r) => !r.success)
        .forEach((r) => {
          console.log(`   - ${r.url}: ${r.error}`);
        });
    }

    console.log("\n✨ Google indexing update completed!");

    // Close any database connections
    const { db } = await import("@/lib/db");
    await db.$client.end();
  } catch (error) {
    console.error("❌ Error updating Google index:", error);
    process.exit(1);
  }
}

// Run the script
main();
