"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Folder, Grid3x3, Filter } from "lucide-react";
import type { GalleryGroupWithImages } from "@/lib/types/gallery-with-relations.type";

interface GalleryGroupsFilterProps {
  groups: GalleryGroupWithImages[];
  currentGroupSlug?: string;
  showAllLink?: boolean;
  totalImages?: number;
  className?: string;
}

export function GalleryGroupsFilter({
  groups,
  currentGroupSlug,
  showAllLink = true,
  totalImages = 0,
  className = "",
}: GalleryGroupsFilterProps) {
  // Build URL for gallery links
  const buildGalleryUrl = (groupSlug?: string) => {
    if (!groupSlug) {
      return "/gallery";
    }
    return `/gallery/${groupSlug}`;
  };

  if (groups.length === 0 && !showAllLink) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter header */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Gallery Categories</h3>
      </div>

      {/* Navigation links */}
      <div className="space-y-2">
        {/* All galleries link */}
        {showAllLink && (
          <Link href={buildGalleryUrl()} className="block">
            <Card
              className={`transition-all duration-200 hover:shadow-md ${
                !currentGroupSlug
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        !currentGroupSlug
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </div>
                    <div>
                      <h4
                        className={`font-medium ${
                          !currentGroupSlug ? "text-primary" : "text-foreground"
                        }`}
                      >
                        All Images
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        View all gallery images
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={!currentGroupSlug ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {totalImages}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Individual group links */}
        {groups.map((group) => (
          <Link
            key={group.id}
            href={buildGalleryUrl(group.slug)}
            className="block"
          >
            <Card
              className={`transition-all duration-200 hover:shadow-md ${
                currentGroupSlug === group.slug
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        currentGroupSlug === group.slug
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Folder className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-medium truncate ${
                          currentGroupSlug === group.slug
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {group.name}
                      </h4>
                      {group.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {group.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={
                      currentGroupSlug === group.slug ? "default" : "secondary"
                    }
                    className="ml-2 flex-shrink-0"
                  >
                    {group.imageCount}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {groups.length === 0 && showAllLink && (
        <div className="text-center py-8 text-muted-foreground">
          <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No gallery categories available</p>
        </div>
      )}
    </div>
  );
}

/**
 * Simplified horizontal groups filter for mobile/compact layouts
 */
export function GalleryGroupsFilterHorizontal({
  groups,
  currentGroupSlug,
  showAllLink = true,
  totalImages = 0,
  className = "",
}: GalleryGroupsFilterProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter header */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Filter by category:
        </span>
      </div>

      {/* Horizontal scroll container */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* All galleries button */}
        {showAllLink && (
          <Link href="/gallery">
            <Button
              variant={!currentGroupSlug ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap flex-shrink-0"
            >
              <Grid3x3 className="h-3 w-3 mr-1.5" />
              All ({totalImages})
            </Button>
          </Link>
        )}

        {/* Individual group buttons */}
        {groups.map((group) => (
          <Link key={group.id} href={`/gallery/${group.slug}`}>
            <Button
              variant={currentGroupSlug === group.slug ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap flex-shrink-0"
            >
              <Folder className="h-3 w-3 mr-1.5" />
              {group.name} ({group.imageCount})
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
