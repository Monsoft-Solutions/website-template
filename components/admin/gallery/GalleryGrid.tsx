"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import NextImage from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { GalleryImageWithDetails } from "@/lib/types/gallery-with-relations.type";
import {
  Grid3X3,
  List,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Edit,
  ExternalLink,
  Download,
} from "lucide-react";

interface GalleryGridProps {
  images: GalleryImageWithDetails[];
  isLoading?: boolean;
  error?: string;
  selectedImages: string[];
  onSelectionChange: (imageIds: string[]) => void;
  onRefresh: () => void;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onBulkAvailabilityToggle: (makeAvailable: boolean) => void;
  onBulkFeatureToggle: (makeFeatured: boolean) => void;
  onBulkDelete: () => void;
}

/**
 * Gallery grid component for admin interface
 * Displays images in a responsive grid with selection and bulk operations
 */
export function GalleryGrid({
  images,
  isLoading = false,
  error,
  selectedImages,
  onSelectionChange,
  onRefresh,
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onBulkAvailabilityToggle,
  onBulkFeatureToggle,
  onBulkDelete,
}: GalleryGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Handle individual image selection
  const handleImageSelect = (imageId: string) => {
    const newSelection = selectedImages.includes(imageId)
      ? selectedImages.filter((id) => id !== imageId)
      : [...selectedImages, imageId];
    onSelectionChange(newSelection);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedImages.length === images.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(images.map((img) => img.id));
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading gallery images...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (images.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid3X3 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No images found
            </h3>
            <p className="text-gray-600 mb-4">
              Upload some images to get started with your gallery.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isAllSelected = selectedImages.length === images.length;
  const isIndeterminate =
    selectedImages.length > 0 && selectedImages.length < images.length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Selection Info */}
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  className={
                    isIndeterminate ? "data-[state=checked]:bg-blue-600" : ""
                  }
                />
                <span className="text-sm text-gray-600">
                  {selectedImages.length > 0
                    ? `${selectedImages.length} of ${images.length} selected`
                    : `${images.length} images`}
                </span>
              </div>

              {/* Bulk Actions */}
              {selectedImages.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onBulkAvailabilityToggle(true)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Make Available
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onBulkAvailabilityToggle(false)}
                  >
                    <EyeOff className="h-4 w-4 mr-1" />
                    Hide
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onBulkFeatureToggle(true)}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Feature
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onBulkFeatureToggle(false)}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Unfeature
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={onBulkDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button size="sm" variant="outline" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid */}
      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            : "space-y-2"
        )}
      >
        <AnimatePresence mode="popLayout">
          {images.map((image) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={cn(
                  "group relative overflow-hidden cursor-pointer transition-all duration-200",
                  selectedImages.includes(image.id)
                    ? "ring-2 ring-blue-500 shadow-lg"
                    : "hover:shadow-md",
                  viewMode === "list" ? "flex" : ""
                )}
              >
                <div
                  className={cn(
                    "relative",
                    viewMode === "grid"
                      ? "aspect-square"
                      : "w-24 h-24 flex-shrink-0"
                  )}
                >
                  <NextImage
                    src={image.thumbnailUrl || image.originalUrl}
                    alt={image.altText || `Gallery image ${image.id}`}
                    fill
                    className="object-cover"
                  />

                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2">
                    <Checkbox
                      checked={selectedImages.includes(image.id)}
                      onCheckedChange={() => handleImageSelect(image.id)}
                      className="bg-white/80 border-white"
                    />
                  </div>

                  {/* Status Badges */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {image.isFeatured && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge
                      variant={image.isAvailable ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {image.isAvailable ? (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Available
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Hidden
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/admin/gallery/${image.id}`, "_blank");
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(image.originalUrl, "_blank");
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        const a = document.createElement("a");
                        a.href = image.originalUrl;
                        a.download = image.fileName;
                        a.click();
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Image Info */}
                <div
                  className={cn(
                    "p-3",
                    viewMode === "list"
                      ? "flex-1 flex items-center justify-between"
                      : ""
                  )}
                >
                  <div className={viewMode === "list" ? "flex-1" : ""}>
                    <h3 className="font-medium text-sm truncate">
                      {image.name}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      {image.altText}
                    </p>
                    {viewMode === "grid" && (
                      <div className="mt-1 text-xs text-gray-500">
                        {formatFileSize(image.fileSize)}
                        {image.width && image.height && (
                          <>
                            {" "}
                            • {image.width}×{image.height}
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {viewMode === "list" && (
                    <div className="text-right text-xs text-gray-500">
                      <div>{formatFileSize(image.fileSize)}</div>
                      {image.width && image.height && (
                        <div>
                          {image.width}×{image.height}
                        </div>
                      )}
                      <div>
                        {new Date(image.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={!hasPreviousPage}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={!hasNextPage}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
