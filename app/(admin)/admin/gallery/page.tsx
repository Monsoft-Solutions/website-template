"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminGallery } from "@/lib/hooks/use-admin-gallery.hook";
import { GalleryGrid } from "@/components/admin/gallery/GalleryGrid";
import { GalleryFilters } from "@/components/admin/gallery/GalleryFilters";
import { GalleryUpload } from "@/components/admin/gallery/GalleryUpload";
import type { ApiResponse } from "@/lib/types/api-response.type";
import { Upload, ImageIcon, Folder, Star, Eye, EyeOff } from "lucide-react";

/**
 * Gallery Management Page - Admin Interface
 * Features: Image grid view, filtering, search, bulk operations, upload
 */
export default function AdminGalleryPage() {
  const router = useRouter();

  // Gallery state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>();
  const [availabilityFilter, setAvailabilityFilter] = useState<
    boolean | undefined
  >();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch gallery images with current filters
  const {
    images,
    totalImages,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    error,
    refetch,
  } = useAdminGallery({
    page: currentPage,
    limit: 20,
    searchQuery: searchQuery || undefined,
    groupId: selectedGroupId,
    isAvailable: availabilityFilter,
  });

  // Handle search change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle filter changes
  const handleGroupFilterChange = (groupId: string | undefined) => {
    setSelectedGroupId(groupId);
    setCurrentPage(1);
  };

  const handleAvailabilityFilterChange = (isAvailable: boolean | undefined) => {
    setAvailabilityFilter(isAvailable);
    setCurrentPage(1);
  };

  // Handle bulk operations
  const handleBulkAvailabilityToggle = async (makeAvailable: boolean) => {
    if (selectedImages.length === 0) {
      toast.error("No images selected");
      return;
    }

    try {
      const response = await fetch("/api/admin/gallery/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageIds: selectedImages,
          operation: "availability",
          value: makeAvailable,
        }),
      });

      const result: ApiResponse<{ updated: number }> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update images");
      }

      toast.success(
        `Successfully ${makeAvailable ? "made available" : "hidden"} ${result.data?.updated} image(s)`
      );
      setSelectedImages([]);
      refetch();
    } catch (error) {
      console.error("Error updating image availability:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update images"
      );
    }
  };

  const handleBulkFeatureToggle = async (makeFeatured: boolean) => {
    if (selectedImages.length === 0) {
      toast.error("No images selected");
      return;
    }

    try {
      const response = await fetch("/api/admin/gallery/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageIds: selectedImages,
          operation: "featured",
          value: makeFeatured,
        }),
      });

      const result: ApiResponse<{ updated: number }> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update images");
      }

      toast.success(
        `Successfully ${makeFeatured ? "featured" : "unfeatured"} ${result.data?.updated} image(s)`
      );
      setSelectedImages([]);
      refetch();
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update images"
      );
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) {
      toast.error("No images selected");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${selectedImages.length} image(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/admin/gallery/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageIds: selectedImages }),
      });

      const result: ApiResponse<{ deleted: number }> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete images");
      }

      toast.success(`Successfully deleted ${result.data?.deleted} image(s)`);
      setSelectedImages([]);
      refetch();
    } catch (error) {
      console.error("Error deleting images:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete images"
      );
    }
  };

  // Handle image upload completion
  const handleUploadComplete = (
    files: { id: string; file: File; result?: { url: string } }[]
  ) => {
    setIsUploading(false);
    refetch();
    toast.success(`${files.length} image(s) uploaded successfully!`);
  };

  // Get statistics
  const totalAvailable = images.filter((img) => img.isAvailable).length;
  const totalFeatured = images.filter((img) => img.isFeatured).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Gallery Management"
        description="Manage your gallery images, organize into groups, and control visibility"
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => setIsUploading(true)}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Images
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/gallery/groups")}
              className="flex items-center gap-2"
            >
              <Folder className="h-4 w-4" />
              Manage Groups
            </Button>
          </div>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalAvailable}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hidden</CardTitle>
            <EyeOff className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalImages - totalAvailable}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {totalFeatured}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Modal */}
      {isUploading && (
        <Card className="border-dashed border-2">
          <CardContent className="p-6">
            <GalleryUpload
              onUploadComplete={handleUploadComplete}
              onClose={() => setIsUploading(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <GalleryFilters
        searchTerm={searchQuery}
        onSearchChange={handleSearchChange}
        selectedGroup={selectedGroupId || ""}
        onGroupChange={(groupId: string) => {
          handleGroupFilterChange(groupId === "" ? undefined : groupId);
        }}
        availabilityFilter={
          availabilityFilter === undefined ? "" : availabilityFilter.toString()
        }
        onAvailabilityFilterChange={(filter: string) => {
          if (filter === "") {
            handleAvailabilityFilterChange(undefined);
          } else {
            handleAvailabilityFilterChange(filter === "true");
          }
        }}
      />

      {/* Gallery Grid */}
      <GalleryGrid
        images={images}
        isLoading={isLoading}
        error={error || undefined}
        selectedImages={selectedImages}
        onSelectionChange={setSelectedImages}
        onRefresh={refetch}
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onPageChange={setCurrentPage}
        onBulkAvailabilityToggle={handleBulkAvailabilityToggle}
        onBulkFeatureToggle={handleBulkFeatureToggle}
        onBulkDelete={handleBulkDelete}
      />
    </div>
  );
}
