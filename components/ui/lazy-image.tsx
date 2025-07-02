"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/lib/utils/performance.util";
import { LazyImageProps } from "@/lib/types";

/**
 * Performance-optimized lazy loading image component
 * Uses intersection observer to load images only when they're in viewport
 */
export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = "blur",
  blurDataURL,
  sizes,
  fill = false,
  quality = 85,
  onLoad,
  onError,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Use intersection observer for lazy loading (unless priority is true)
  const isInView = useIntersectionObserver(
    imageRef as React.RefObject<Element>,
    {
      threshold: 0.1,
      rootMargin: "50px",
    }
  );

  // Load image if it's priority or in view
  const shouldLoad = priority || isInView;

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate placeholder blur data URL if not provided
  const getBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;

    // Generate a simple base64 placeholder
    const canvas = document.createElement("canvas");
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#f3f4f6";
      ctx.fillRect(0, 0, 10, 10);
    }
    return canvas.toDataURL();
  };

  return (
    <div
      ref={imageRef}
      className={cn("relative overflow-hidden", className)}
      style={fill ? {} : { width, height }}
    >
      {/* Error state */}
      {hasError && (
        <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {!isLoaded && !hasError && shouldLoad && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      {/* Placeholder when not in view */}
      {!shouldLoad && (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <div className="text-muted-foreground">
            <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* Actual image */}
      {shouldLoad && !hasError && (
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={placeholder === "blur" ? getBlurDataURL() : undefined}
          sizes={sizes}
          quality={quality}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            fill ? "object-cover" : ""
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}

/**
 * Hero image component with priority loading
 */
export function HeroImage(props: Omit<LazyImageProps, "priority">) {
  return <LazyImage {...props} priority={true} />;
}

/**
 * Background image component with fill behavior
 */
export function BackgroundImage(props: Omit<LazyImageProps, "fill">) {
  return <LazyImage {...props} fill={true} />;
}
