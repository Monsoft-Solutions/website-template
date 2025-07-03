"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  fill?: boolean;
}

export function PlaceholderImage({
  src,
  alt,
  width,
  height,
  className,
  placeholder,
  blurDataURL,
  fill = false,
  ...props
}: PlaceholderImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-muted-foreground border rounded-lg",
          className
        )}
        style={{
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
          minHeight: fill ? "200px" : height,
        }}
      >
        <div className="text-center p-4">
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-sm font-medium">Image</div>
          <div className="text-xs opacity-75">{alt}</div>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onError={() => setImageError(true)}
      {...props}
    />
  );
}
