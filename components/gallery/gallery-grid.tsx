"use client";

import { useRef, useCallback, useState } from "react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ZoomIn,
  Eye,
  Grid3X3,
  LayoutGrid,
  Layers,
  Sparkles,
} from "lucide-react";
import type { GalleryImageWithGroups } from "@/lib/types/gallery-with-relations.type";

// LightGallery imports
import LightGallery from "lightgallery/react";
import type { LightGallery as LightGalleryType } from "lightgallery/lightgallery";

// LightGallery plugins
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgAutoplay from "lightgallery/plugins/autoplay";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgShare from "lightgallery/plugins/share";
import lgRotate from "lightgallery/plugins/rotate";

// LightGallery styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-autoplay.css";
import "lightgallery/css/lg-fullscreen.css";
import "lightgallery/css/lg-share.css";
import "lightgallery/css/lg-rotate.css";

interface GalleryGridProps {
  images: GalleryImageWithGroups[];
  title?: string;
  description?: string;
  className?: string;
}

type LayoutType = "masonry" | "mixed" | "creative" | "classic";

/**
 * Gallery grid component using LightGallery for enhanced image viewing
 */
export function GalleryGrid({
  images,
  title,
  description,
  className = "",
}: GalleryGridProps) {
  const lightGalleryRef = useRef<LightGalleryType | null>(null);
  const [layout, setLayout] = useState<LayoutType>("masonry");

  const onInit = useCallback((detail: { instance: LightGalleryType }) => {
    if (detail?.instance) {
      lightGalleryRef.current = detail.instance;
    }
  }, []);

  if (images.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No images found
        </h3>
        <p className="text-muted-foreground">
          {title
            ? `No images available in this gallery yet.`
            : "No images available yet."}
        </p>
      </div>
    );
  }

  // Get layout-specific classes and sizing
  const getImageClasses = (index: number, isFeatured: boolean) => {
    switch (layout) {
      case "masonry":
        // Masonry with varying heights
        const heights = [
          "aspect-square",
          "aspect-[4/5]",
          "aspect-[3/4]",
          "aspect-[5/4]",
        ];
        return `${heights[index % heights.length]} group relative overflow-hidden`;

      case "mixed":
        // Mixed grid with some large items
        if (isFeatured || index % 7 === 0) {
          return "col-span-2 row-span-2 aspect-square group relative overflow-hidden";
        }
        if (index % 5 === 0) {
          return "col-span-2 aspect-[2/1] group relative overflow-hidden";
        }
        return "aspect-square group relative overflow-hidden";

      case "creative":
        // Creative alternating pattern
        if (index % 8 === 0) {
          return "col-span-2 aspect-[2/1] group relative overflow-hidden";
        }
        if (index % 6 === 0) {
          return "row-span-2 aspect-[1/2] group relative overflow-hidden";
        }
        if (isFeatured) {
          return "col-span-2 row-span-2 aspect-square group relative overflow-hidden";
        }
        return "aspect-square group relative overflow-hidden";

      default:
        return "aspect-square group relative overflow-hidden";
    }
  };

  const getGridClasses = () => {
    switch (layout) {
      case "masonry":
        return "columns-1 sm:columns-2 lg:columns-3 gap-2 space-y-2";
      case "mixed":
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 auto-rows-min";
      case "creative":
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 auto-rows-min";
      default:
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2";
    }
  };

  const layoutOptions = [
    { type: "masonry" as LayoutType, name: "Masonry", icon: Layers },
    { type: "mixed" as LayoutType, name: "Mixed", icon: LayoutGrid },
    { type: "creative" as LayoutType, name: "Creative", icon: Sparkles },
    { type: "classic" as LayoutType, name: "Classic", icon: Grid3X3 },
  ];

  return (
    <div className={className}>
      {/* Header */}
      {(title || description) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
          )}
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Layout Selector */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
          {layoutOptions.map(({ type, name, icon: Icon }) => (
            <Button
              key={type}
              variant={layout === type ? "default" : "ghost"}
              size="sm"
              onClick={() => setLayout(type)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* LightGallery Container */}
      <LightGallery
        onInit={onInit}
        speed={500}
        plugins={[
          lgThumbnail,
          lgZoom,
          lgAutoplay,
          lgFullscreen,
          lgShare,
          lgRotate,
        ]}
        mode="lg-fade"
        thumbnail={true}
        animateThumb={true}
        zoomFromOrigin={false}
        allowMediaOverlap={true}
        toggleThumb={true}
        download={false}
        selector=".gallery-item"
        mobileSettings={{
          controls: false,
          showCloseIcon: false,
          download: false,
          rotate: false,
        }}
      >
        {/* Grid */}
        <div className={getGridClasses()}>
          {images.map((image, index) => {
            const imageClasses = getImageClasses(index, image.isFeatured);

            return (
              <div
                key={image.id}
                className={
                  layout === "masonry" ? "break-inside-avoid mb-2" : ""
                }
              >
                <div
                  className="gallery-item group cursor-pointer"
                  data-src={image.originalUrl}
                  data-sub-html={`
                    <div class="lg-sub-html">
                      <h4 class="text-lg font-semibold mb-2">${image.name}</h4>
                      ${image.description ? `<p class="text-sm mb-3">${image.description}</p>` : ""}
                      ${
                        image.groups.length > 0
                          ? `
                        <div class="flex flex-wrap gap-1">
                          ${image.groups
                            .map(
                              (group) => `
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white/20 text-white">
                              ${group.name}
                            </span>
                          `
                            )
                            .join("")}
                        </div>
                      `
                          : ""
                      }
                    </div>
                  `}
                  data-pinterest-text={image.name}
                  data-tweet-text={image.name}
                >
                  {/* Image container - no card wrapper */}
                  <div
                    className={`${imageClasses} rounded-lg overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
                  >
                    <Image
                      src={image.thumbnailUrl || image.originalUrl}
                      alt={image.altText}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />

                    {/* Enhanced Overlay with Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                          <ZoomIn className="h-6 w-6 text-gray-800" />
                        </div>
                      </div>
                    </div>

                    {/* Featured badge with animation */}
                    {image.isFeatured && (
                      <Badge
                        variant="default"
                        className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg animate-pulse"
                      >
                        ✨ Featured
                      </Badge>
                    )}

                    {/* Creative corner accent for special layouts */}
                    {(layout === "creative" || layout === "mixed") &&
                      (index % 7 === 0 || image.isFeatured) && (
                        <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary/20" />
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </LightGallery>
    </div>
  );
}
