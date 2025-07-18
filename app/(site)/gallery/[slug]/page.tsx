import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateSeoMetadata } from "@/lib/config/seo";
import {
  getPublicGalleryGroupWithImages,
  getPublicGalleryGroups,
} from "@/lib/api/gallery.service";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/utils/url.util";
import type { GalleryGroupWithImages } from "@/lib/types/gallery-with-relations.type";

// Import gallery components
import { GalleryGroupHero } from "@/components/gallery/gallery-hero";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import {
  GalleryGroupsFilter,
  GalleryGroupsFilterHorizontal,
} from "@/components/gallery/gallery-groups-filter";

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic";

// Generate dynamic metadata for the gallery group page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const groupResponse = await getPublicGalleryGroupWithImages(slug, 1, 1);

    if (!groupResponse.success || !groupResponse.data) {
      return {
        title: "Gallery Group Not Found",
        description: "The requested gallery group could not be found.",
      };
    }

    const group = groupResponse.data;

    return generateSeoMetadata({
      title: `${group.name} - Gallery`,
      description:
        group.description ||
        `Explore images in the ${group.name} gallery collection.`,
      keywords: [
        "gallery",
        group.name.toLowerCase(),
        "images",
        "photography",
        "portfolio",
        "collection",
      ],
    });
  } catch (error) {
    console.error("Error generating metadata for gallery group:", error);
    return {
      title: "Gallery Group",
      description: "Gallery group page",
    };
  }
}

interface GalleryGroupPageSearchParams {
  page?: string;
}

interface GalleryGroupPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<GalleryGroupPageSearchParams>;
}

export default async function GalleryGroupPage({
  params,
  searchParams,
}: GalleryGroupPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const baseUrl = getBaseUrl();

  // Initialize with fallback data
  let groupData: GalleryGroupWithImages | null = null;
  let allGroups: GalleryGroupWithImages[] = [];
  let error: string | null = null;

  try {
    // Fetch gallery group and all groups in parallel
    const [groupResponse, allGroupsResponse] = await Promise.all([
      getPublicGalleryGroupWithImages(slug, currentPage, 20),
      getPublicGalleryGroups(),
    ]);

    if (groupResponse.success && groupResponse.data) {
      groupData = groupResponse.data;
    } else {
      // Group not found, return 404
      notFound();
    }

    if (allGroupsResponse.success && allGroupsResponse.data) {
      allGroups = allGroupsResponse.data;
    }
  } catch (err) {
    console.error("Error fetching gallery group data:", err);
    error = "Failed to load gallery group";
  }

  if (!groupData) {
    notFound();
  }

  // Calculate pagination data
  const imagesPerPage = 20;
  const totalImages = groupData.imageCount;
  const totalPages = Math.ceil(totalImages / imagesPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Get total images count for all groups filter
  const totalImagesAllGroups = allGroups.reduce(
    (acc, group) => acc + group.imageCount,
    0
  );

  // Generate structured data
  const groupStructuredData = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: groupData.name,
    description:
      groupData.description || `${groupData.name} gallery collection`,
    url: `${baseUrl}/gallery/${slug}`,
    ...(groupData.images.length > 0 && {
      image: groupData.images.slice(0, 5).map((image) => ({
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
    ...(groupData.coverImage && {
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: groupData.coverImage.originalUrl,
        width: groupData.coverImage.width,
        height: groupData.coverImage.height,
      },
    }),
  };

  return (
    <>
      <JsonLd type="Organization" data={groupStructuredData} />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <GalleryGroupHero
          groupName={groupData.name}
          groupDescription={groupData.description || undefined}
          imageCount={totalImages}
          coverImageUrl={groupData.coverImage?.originalUrl}
        />

        {/* Main Content */}
        <section className="py-12 lg:py-16">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar - Desktop */}
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <GalleryGroupsFilter
                    groups={allGroups}
                    currentGroupSlug={slug}
                    totalImages={totalImagesAllGroups}
                    showAllLink={true}
                  />
                </div>
              </div>

              {/* Main Gallery Content */}
              <div className="lg:col-span-3">
                {/* Mobile/Tablet Filter */}
                <div className="lg:hidden mb-8">
                  <GalleryGroupsFilterHorizontal
                    groups={allGroups}
                    currentGroupSlug={slug}
                    totalImages={totalImagesAllGroups}
                    showAllLink={true}
                  />
                </div>

                {/* Error State */}
                {error && (
                  <div className="text-center py-12">
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
                      <h3 className="text-lg font-semibold text-destructive mb-2">
                        Unable to Load Gallery Group
                      </h3>
                      <p className="text-destructive/80">
                        {error}. Please try again later.
                      </p>
                    </div>
                  </div>
                )}

                {/* Gallery Grid */}
                {!error && groupData && (
                  <div id="gallery">
                    <GalleryGrid
                      images={groupData.images.map((image) => ({
                        ...image,
                        groups: [{ ...groupData, displayOrder: 0 }],
                      }))}
                    />
                  </div>
                )}

                {/* Pagination */}
                {!error && totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex gap-2">
                      {hasPreviousPage && (
                        <a
                          href={`/gallery/${slug}?page=${currentPage - 1}`}
                          className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                        >
                          Previous
                        </a>
                      )}

                      <span className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                        Page {currentPage} of {totalPages}
                      </span>

                      {hasNextPage && (
                        <a
                          href={`/gallery/${slug}?page=${currentPage + 1}`}
                          className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                        >
                          Next
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* No images message */}
                {!error && groupData && groupData.images.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      No images in this category yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      This gallery group doesn&apos;t have any images at the
                      moment.
                    </p>
                    <Link
                      href="/gallery"
                      className="inline-flex items-center justify-center px-4 py-2 border border-border text-sm font-medium rounded-lg text-foreground bg-background hover:bg-muted transition-colors"
                    >
                      Browse All Images
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Groups Section */}
        {!error && allGroups.length > 1 && (
          <section className="py-16 bg-muted/30">
            <div className="container">
              <div className="mx-auto max-w-4xl">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4">
                    Explore Other Categories
                  </h2>
                  <p className="text-muted-foreground">
                    Discover more images in our other gallery collections.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allGroups
                    .filter(
                      (group) => group.slug !== slug && group.imageCount > 0
                    )
                    .slice(0, 6)
                    .map((group) => (
                      <a
                        key={group.id}
                        href={`/gallery/${group.slug}`}
                        className="group block p-4 bg-background rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <span className="text-primary font-semibold">
                              {group.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                              {group.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {group.imageCount}{" "}
                              {group.imageCount === 1 ? "image" : "images"}
                            </p>
                          </div>
                        </div>
                      </a>
                    ))}
                </div>

                {allGroups.filter(
                  (group) => group.slug !== slug && group.imageCount > 0
                ).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No other categories available.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
