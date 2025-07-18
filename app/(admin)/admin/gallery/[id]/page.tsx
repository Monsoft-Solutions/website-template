"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GalleryImageForm } from "@/components/admin/gallery/GalleryImageForm";
import type { GalleryImageWithGroups } from "@/lib/types/gallery-with-relations.type";
import type { ApiResponse } from "@/lib/types/api-response.type";
import NextImage from "next/image";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Star,
  Download,
  ExternalLink,
} from "lucide-react";

/**
 * Edit Gallery Image Page - Admin Interface
 * Allows editing of image metadata, groups, and status
 */
export default function EditGalleryImagePage() {
  const params = useParams();
  const router = useRouter();
  const imageId = params.id as string;

  const [image, setImage] = useState<GalleryImageWithGroups | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch image data
  useEffect(() => {
    async function fetchImage() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/admin/gallery/${imageId}`);
        const result: ApiResponse<GalleryImageWithGroups> =
          await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch image");
        }

        if (result.data) {
          setImage(result.data);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching image:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (imageId) {
      fetchImage();
    }
  }, [imageId]);

  // Handle form submission
  const handleSubmit = async (formData: {
    name: string;
    altText: string;
    displayOrder: number;
    isAvailable: boolean;
    isFeatured: boolean;
    description?: string;
    groupIds?: string[];
  }) => {
    if (!image) return;

    try {
      setIsSaving(true);

      const response = await fetch(`/api/admin/gallery/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse<GalleryImageWithGroups> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update image");
      }

      if (result.data) {
        setImage(result.data);
        toast.success("Image updated successfully!");
      }
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update image"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle quick actions
  const handleQuickAction = async (
    action: "availability" | "featured",
    value: boolean
  ) => {
    if (!image) return;

    try {
      const response = await fetch(`/api/admin/gallery/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [action === "availability" ? "isAvailable" : "isFeatured"]: value,
        }),
      });

      const result: ApiResponse<GalleryImageWithGroups> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update image");
      }

      if (result.data) {
        setImage(result.data);
        toast.success(
          `Image ${action === "availability" ? (value ? "made available" : "hidden") : value ? "featured" : "unfeatured"} successfully!`
        );
      }
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update image"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading..."
          description="Fetching image details"
          breadcrumbs={[
            { label: "Gallery", href: "/admin/gallery" },
            { label: "Edit Image", active: true },
          ]}
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading image...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Error"
          description="Failed to load image"
          breadcrumbs={[
            { label: "Gallery", href: "/admin/gallery" },
            { label: "Edit Image", active: true },
          ]}
        />
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || "Image not found"}</p>
              <Button
                onClick={() => router.push("/admin/gallery")}
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Gallery
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`Edit: ${image.name}`}
        description="Update image metadata and settings"
        breadcrumbs={[
          { label: "Gallery", href: "/admin/gallery" },
          { label: "Edit Image", active: true },
        ]}
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => window.open(image.originalUrl, "_blank")}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View Original
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const a = document.createElement("a");
                a.href = image.originalUrl;
                a.download = image.fileName;
                a.click();
              }}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Preview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Image Preview
                <div className="flex gap-2">
                  <Badge variant={image.isAvailable ? "default" : "secondary"}>
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
                  {image.isFeatured && (
                    <Badge variant="outline" className="text-yellow-600">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                <NextImage
                  src={image.thumbnailUrl || image.originalUrl}
                  alt={image.altText || `Gallery image ${image.id}`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Image Metadata */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">File Size:</span>
                  <span>{formatFileSize(image.fileSize)}</span>
                </div>
                {image.width && image.height && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions:</span>
                    <span>
                      {image.width} × {image.height}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span>{image.mimeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleQuickAction("availability", !image.isAvailable)
                  }
                  className="w-full"
                >
                  {image.isAvailable ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Image
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Make Available
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleQuickAction("featured", !image.isFeatured)
                  }
                  className="w-full"
                >
                  <Star className="h-4 w-4 mr-2" />
                  {image.isFeatured ? "Remove Featured" : "Make Featured"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Edit Image Details</CardTitle>
            </CardHeader>
            <CardContent>
              <GalleryImageForm
                mode="edit"
                initialData={{
                  ...image,
                  groups: image.groups.map((g) => ({
                    id: g.id,
                    name: g.name,
                    displayOrder: g.displayOrder,
                  })),
                  groupCount: image.groups.length,
                }}
                groups={[]}
                onSubmit={handleSubmit}
                onCancel={() => router.push("/admin/gallery")}
                isLoading={isSaving}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
