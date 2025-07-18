import { Metadata } from "next";
import Link from "next/link";
import { generateSeoMetadata } from "@/lib/config/seo";
import {
  getPublicGalleryImages,
  getPublicGalleryGroups,
  type PublicGalleryListResponse,
} from "@/lib/api/gallery.service";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/utils/url.util";
import type { GalleryGroupWithImages } from "@/lib/types/gallery-with-relations.type";

// Import gallery components
import { GalleryHero } from "@/components/gallery/gallery-hero";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import {
  GalleryGroupsFilter,
  GalleryGroupsFilterHorizontal,
} from "@/components/gallery/gallery-groups-filter";

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic";

// Generate metadata for the gallery page
export const metadata: Metadata = generateSeoMetadata({
  title: "Gallery - Visual Portfolio & Image Collection",
  description:
    "Explore our beautiful gallery of images and visual stories. Browse through different categories and discover our featured photography and artwork.",
  keywords: [
    "gallery",
    "images",
    "photography",
    "portfolio",
    "visual",
    "artwork",
    "pictures",
    "collection",
  ],
});

interface GalleryPageSearchParams {
  page?: string;
  featured?: string;
}

interface GalleryPageProps {
  searchParams: Promise<GalleryPageSearchParams>;
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const { page, featured } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const showFeatured = featured === "true";
  const baseUrl = getBaseUrl();

  // Initialize with fallback data
  let galleryData: PublicGalleryListResponse = {
    images: [],
    totalImages: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };
  let groups: GalleryGroupWithImages[] = [];
  let error: string | null = null;

  try {
    // Fetch gallery data with SSR
    const [galleryResponse, groupsResponse] = await Promise.all([
      getPublicGalleryImages({
        page: currentPage,
        limit: 20,
        featured: showFeatured,
      }),
      getPublicGalleryGroups(),
    ]);

    if (galleryResponse.success && galleryResponse.data) {
      galleryData = galleryResponse.data;
    } else {
      error = "Failed to load gallery images";
    }

    if (groupsResponse.success && groupsResponse.data) {
      groups = groupsResponse.data;
    }
  } catch (err) {
    console.error("Error fetching gallery data:", err);
    error = "Failed to load gallery";
  }

  // Calculate stats for hero
  const totalImages = galleryData.totalImages;
  const totalGroups = groups.length;
  const featuredCount = galleryData.images.filter(
    (image) => image.isFeatured
  ).length;

  // Generate structured data
  const galleryStructuredData = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Gallery",
    description: "Visual portfolio and image collection",
    url: `${baseUrl}/gallery`,
    ...(galleryData.images.length > 0 && {
      image: galleryData.images.slice(0, 5).map((image) => ({
        "@type": "ImageObject",
        name: image.name,
        description: image.description || image.altText,
        url: image.originalUrl,
        thumbnailUrl: image.thumbnailUrl,
        width: image.width,
        height: image.height,
      })),
    }),
    numberOfItems: totalImages,
  };

  return (
    <>
      <JsonLd type="Organization" data={galleryStructuredData} />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <GalleryHero
          title={showFeatured ? "Featured Images" : "Gallery"}
          description={
            showFeatured
              ? "Discover our carefully curated selection of featured images and highlights."
              : "Explore our collection of beautiful images and visual stories organized by categories."
          }
          totalImages={totalImages}
          totalGroups={totalGroups}
          featuredImages={featuredCount}
          showStats={!showFeatured}
        />

        {/* Main Content */}
        <section className="py-12 lg:py-16">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar - Desktop */}
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <GalleryGroupsFilter
                    groups={groups}
                    totalImages={totalImages}
                    showAllLink={true}
                  />
                </div>
              </div>

              {/* Main Gallery Content */}
              <div className="lg:col-span-3">
                {/* Mobile/Tablet Filter */}
                <div className="lg:hidden mb-8">
                  <GalleryGroupsFilterHorizontal
                    groups={groups}
                    totalImages={totalImages}
                    showAllLink={true}
                  />
                </div>

                {/* Error State */}
                {error && (
                  <div className="text-center py-12">
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
                      <h3 className="text-lg font-semibold text-destructive mb-2">
                        Unable to Load Gallery
                      </h3>
                      <p className="text-destructive/80">
                        {error}. Please try again later.
                      </p>
                    </div>
                  </div>
                )}

                {/* Gallery Grid */}
                {!error && (
                  <div id="gallery">
                    <GalleryGrid
                      images={galleryData.images}
                      title={showFeatured ? "Featured Collection" : undefined}
                      description={
                        showFeatured
                          ? "Our hand-picked selection of outstanding images"
                          : undefined
                      }
                    />
                  </div>
                )}

                {/* Pagination */}
                {!error && galleryData.totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex gap-2">
                      {galleryData.hasPreviousPage && (
                        <a
                          href={`/gallery?page=${currentPage - 1}${
                            showFeatured ? "&featured=true" : ""
                          }`}
                          className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                        >
                          Previous
                        </a>
                      )}

                      <span className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                        Page {currentPage} of {galleryData.totalPages}
                      </span>

                      {galleryData.hasNextPage && (
                        <Link
                          href={`/gallery?page=${currentPage + 1}${
                            showFeatured ? "&featured=true" : ""
                          }`}
                          className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                        >
                          Next
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        {!error && !showFeatured && galleryData.images.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4">
                  Love what you see?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Check out our featured collection or browse images by
                  category.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/gallery?featured=true"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                  >
                    View Featured Images
                  </Link>
                  {groups.length > 0 && (
                    <Link
                      href={`/gallery/${groups[0].slug}`}
                      className="inline-flex items-center justify-center px-6 py-3 border border-border text-base font-medium rounded-lg text-foreground bg-background hover:bg-muted transition-colors"
                    >
                      Browse {groups[0].name}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
