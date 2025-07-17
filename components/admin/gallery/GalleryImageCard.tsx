"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Eye,
  EyeOff,
  Star,
  StarOff,
  Edit,
  Trash2,
  MoreHorizontal,
  Download,
  Copy,
  Calendar,
  HardDrive,
  Tag,
} from "lucide-react";
import type { GalleryImageWithDetails } from "@/lib/types/gallery-with-relations.type";

interface GalleryImageCardProps {
  image: GalleryImageWithDetails;
  viewMode: "grid" | "list";
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
  onToggleFeatured: () => void;
  className?: string;
}

/**
 * Gallery image card component for admin interface
 * Supports both grid and list view modes with actions
 */
export function GalleryImageCard({
  image,
  viewMode,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onToggleAvailability,
  onToggleFeatured,
  className,
}: GalleryImageCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  // Copy URL to clipboard
  const copyImageUrl = async () => {
    try {
      await navigator.clipboard.writeText(image.originalUrl);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  // Download image
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = image.originalUrl;
    link.download = image.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (viewMode === "list") {
    return (
      <Card
        className={cn(
          "transition-all duration-200",
          selected && "ring-2 ring-primary",
          className
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Selection checkbox */}
            <Checkbox
              checked={selected}
              onCheckedChange={onSelect}
              aria-label={`Select ${image.name}`}
            />

            {/* Image thumbnail */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <div className="w-full h-full bg-muted rounded-md overflow-hidden">
                {imageError ? (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-xl">🖼️</div>
                  </div>
                ) : (
                  <Image
                    src={image.thumbnailUrl || image.originalUrl}
                    alt={image.altText}
                    fill
                    className={cn(
                      "object-cover transition-opacity duration-300",
                      imageLoading ? "opacity-0" : "opacity-100"
                    )}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageError(true);
                      setImageLoading(false);
                    }}
                  />
                )}
              </div>
            </div>

            {/* Image details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium truncate">{image.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {image.altText}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3" />
                      {formatFileSize(image.fileSize)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(image.createdAt)}
                    </span>
                    {image.width && image.height && (
                      <span>
                        {image.width}×{image.height}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status badges */}
                <div className="flex items-center gap-2 ml-4">
                  {image.isFeatured && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Badge
                    variant={image.isAvailable ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {image.isAvailable ? (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Available
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Hidden
                      </>
                    )}
                  </Badge>
                  {image.groups.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {image.groups.length}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Quick actions */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggleAvailability}
                      className="h-8 w-8 p-0"
                    >
                      {image.isAvailable ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {image.isAvailable ? "Hide" : "Show"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggleFeatured}
                      className="h-8 w-8 p-0"
                    >
                      {image.isFeatured ? (
                        <StarOff className="w-4 h-4" />
                      ) : (
                        <Star className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {image.isFeatured ? "Unfeature" : "Feature"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* More actions menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copyImageUrl}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadImage}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn("relative group", className)}
    >
      <Card
        className={cn(
          "overflow-hidden transition-all duration-200 hover:shadow-md",
          selected && "ring-2 ring-primary"
        )}
      >
        {/* Image container */}
        <div className="relative aspect-square">
          {/* Selection checkbox */}
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={selected}
              onCheckedChange={onSelect}
              aria-label={`Select ${image.name}`}
              className="bg-background/80 backdrop-blur-sm"
            />
          </div>

          {/* Status badges */}
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
            {image.isFeatured && (
              <Badge variant="secondary" className="text-xs">
                <Star className="w-3 h-3" />
              </Badge>
            )}
            <Badge
              variant={image.isAvailable ? "default" : "secondary"}
              className="text-xs"
            >
              {image.isAvailable ? (
                <Eye className="w-3 h-3" />
              ) : (
                <EyeOff className="w-3 h-3" />
              )}
            </Badge>
          </div>

          {/* Image */}
          <div className="w-full h-full bg-muted">
            {imageError ? (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="text-3xl mb-2">🖼️</div>
                  <p className="text-sm">Failed to load</p>
                </div>
              </div>
            ) : (
              <Image
                src={image.thumbnailUrl || image.originalUrl}
                alt={image.altText}
                fill
                className={cn(
                  "object-cover transition-all duration-300",
                  imageLoading ? "opacity-0" : "opacity-100",
                  "group-hover:scale-105"
                )}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onEdit}
                      className="bg-background/90 hover:bg-background"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-background/90 hover:bg-background"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onToggleAvailability}>
                    {image.isAvailable ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Show
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onToggleFeatured}>
                    {image.isFeatured ? (
                      <>
                        <StarOff className="w-4 h-4 mr-2" />
                        Unfeature
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4 mr-2" />
                        Feature
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={copyImageUrl}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadImage}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Image info */}
        <CardContent className="p-3">
          <div className="space-y-1">
            <h3 className="font-medium text-sm truncate">{image.name}</h3>
            <p className="text-xs text-muted-foreground truncate">
              {image.altText}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatFileSize(image.fileSize)}</span>
              {image.width && image.height && (
                <span>
                  {image.width}×{image.height}
                </span>
              )}
            </div>
            {image.groups.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <Tag className="w-3 h-3" />
                <span className="text-xs text-muted-foreground">
                  {image.groups.length} group
                  {image.groups.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
