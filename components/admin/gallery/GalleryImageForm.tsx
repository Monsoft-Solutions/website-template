"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdminForm } from "@/components/admin/AdminForm";
import { MultiSelect } from "@/components/ui/multi-select";
import { Eye, EyeOff, Star, Image as ImageIcon, Info } from "lucide-react";
import NextImage from "next/image";
import type { GalleryImageWithDetails } from "@/lib/types/gallery-with-relations.type";
import type { GalleryGroup } from "@/lib/types/gallery-group.type";

// Form validation schema
const galleryImageFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  altText: z
    .string()
    .min(1, "Alt text is required")
    .max(500, "Alt text is too long"),
  description: z.string().optional(),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
  displayOrder: z.number().min(0, "Display order must be 0 or greater"),
  groupIds: z.array(z.string()).optional(),
});

type GalleryImageFormData = z.infer<typeof galleryImageFormSchema>;

interface GalleryImageFormProps {
  initialData?: GalleryImageWithDetails;
  groups: GalleryGroup[];
  mode: "create" | "edit";
  onSubmit: (data: GalleryImageFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

/**
 * Gallery image form component for creating/editing image metadata
 */
export function GalleryImageForm({
  initialData,
  groups,
  mode,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
  className,
}: GalleryImageFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize form
  const form = useForm<GalleryImageFormData>({
    resolver: zodResolver(galleryImageFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      altText: initialData?.altText || "",
      description: initialData?.description || "",
      isAvailable: initialData?.isAvailable ?? true,
      isFeatured: initialData?.isFeatured ?? false,
      displayOrder: initialData?.displayOrder ?? 0,
      groupIds: initialData?.groups?.map((g) => g.id) || [],
    },
  });

  // Watch form values for preview
  const watchedValues = form.watch();

  // Handle form submission
  const handleSubmit = async (data: GalleryImageFormData) => {
    try {
      setSubmitError(null);
      await onSubmit(data);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to save image"
      );
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

  // Transform groups for MultiSelect
  const groupOptions = groups.map((group) => ({
    value: group.id,
    label: group.name,
  }));

  return (
    <div className={cn("space-y-6", className)}>
      {/* Image preview card (for edit mode) */}
      {mode === "edit" && initialData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Image Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              {/* Image */}
              <div className="relative w-48 h-48 flex-shrink-0">
                <div className="w-full h-full bg-muted rounded-lg overflow-hidden relative">
                  <NextImage
                    src={initialData.thumbnailUrl || initialData.originalUrl}
                    alt={
                      initialData.altText || `Gallery image ${initialData.id}`
                    }
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Status badges */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {watchedValues.isFeatured && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Badge
                    variant={
                      watchedValues.isAvailable ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {watchedValues.isAvailable ? (
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
                </div>
              </div>

              {/* Image details */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">File name</Label>
                    <p className="font-medium">{initialData.fileName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">File size</Label>
                    <p className="font-medium">
                      {formatFileSize(initialData.fileSize)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Dimensions</Label>
                    <p className="font-medium">
                      {initialData.width && initialData.height
                        ? `${initialData.width} × ${initialData.height}px`
                        : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Type</Label>
                    <p className="font-medium">{initialData.mimeType}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">URL</Label>
                  <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                    {initialData.originalUrl}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <AdminForm
        title={mode === "create" ? "Add Image Details" : "Edit Image"}
        description={
          mode === "create"
            ? "Add metadata and organize your uploaded image"
            : "Update image metadata and settings"
        }
        onSubmit={form.handleSubmit(handleSubmit)}
        isLoading={isLoading}
        error={error || submitError || undefined}
        onCancel={onCancel}
        submitLabel={mode === "create" ? "Save Image" : "Update Image"}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column - Basic info */}
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Image Name *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Enter a descriptive name for the image"
                className={
                  form.formState.errors.name ? "border-destructive" : ""
                }
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Alt Text */}
            <div className="space-y-2">
              <Label htmlFor="altText">Alt Text *</Label>
              <Textarea
                id="altText"
                {...form.register("altText")}
                placeholder="Describe the image for accessibility"
                rows={3}
                className={
                  form.formState.errors.altText ? "border-destructive" : ""
                }
              />
              {form.formState.errors.altText && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.altText.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                This text is shown to screen readers and when the image fails to
                load
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Optional description or caption"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Optional extended description for the image
              </p>
            </div>
          </div>

          {/* Right column - Settings */}
          <div className="space-y-4">
            {/* Display Order */}
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                min="0"
                {...form.register("displayOrder", { valueAsNumber: true })}
                placeholder="0"
                className={
                  form.formState.errors.displayOrder ? "border-destructive" : ""
                }
              />
              {form.formState.errors.displayOrder && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.displayOrder.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first in galleries
              </p>
            </div>

            {/* Groups */}
            <div className="space-y-2">
              <Label>Image Groups</Label>
              <Controller
                name="groupIds"
                control={form.control}
                render={({ field }) => (
                  <MultiSelect
                    options={groupOptions}
                    value={field.value || []}
                    onValueChange={field.onChange}
                    placeholder="Select groups..."
                    emptyText="No groups available"
                  />
                )}
              />
              <p className="text-xs text-muted-foreground">
                Organize images by adding them to groups
              </p>
            </div>

            {/* Status toggles */}
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Visibility & Status</Label>

                {/* Available toggle */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <Label htmlFor="isAvailable" className="font-medium">
                        Available on website
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      When enabled, this image will be visible to website
                      visitors
                    </p>
                  </div>
                  <Controller
                    name="isAvailable"
                    control={form.control}
                    render={({ field }) => (
                      <Switch
                        id="isAvailable"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                {/* Featured toggle */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <Label htmlFor="isFeatured" className="font-medium">
                        Featured image
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Featured images are highlighted and may appear in special
                      sections
                    </p>
                  </div>
                  <Controller
                    name="isFeatured"
                    control={form.control}
                    render={({ field }) => (
                      <Switch
                        id="isFeatured"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {mode === "create"
              ? "After saving, you can continue to upload more images or return to the gallery."
              : "Changes will be applied immediately after saving."}
          </AlertDescription>
        </Alert>
      </AdminForm>
    </div>
  );
}
