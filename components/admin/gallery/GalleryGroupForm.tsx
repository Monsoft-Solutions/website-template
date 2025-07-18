"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdminForm } from "@/components/admin/AdminForm";
import { Folder, Info } from "lucide-react";
import type { GalleryGroup } from "@/lib/types/gallery-group.type";

// Form validation schema
const galleryGroupFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug is too long")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  description: z.string().optional(),
  displayOrder: z.number().min(0, "Display order must be 0 or greater"),
  isActive: z.boolean(),
});

type GalleryGroupFormData = z.infer<typeof galleryGroupFormSchema>;

interface GalleryGroupFormProps {
  initialData?: GalleryGroup;
  mode: "create" | "edit";
  onSubmit: (data: GalleryGroupFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

/**
 * Gallery group form component for creating/editing gallery groups
 */
export function GalleryGroupForm({
  initialData,
  mode,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
  className,
}: GalleryGroupFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize form
  const form = useForm<GalleryGroupFormData>({
    resolver: zodResolver(galleryGroupFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      displayOrder: initialData?.displayOrder ?? 0,
      isActive: initialData?.isActive ?? true,
    },
  });

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Handle name change to auto-generate slug (only in create mode)
  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    if (mode === "create" && !form.formState.dirtyFields.slug) {
      const slug = generateSlug(value);
      form.setValue("slug", slug);
    }
  };

  // Watch form values for preview
  const formValues = form.watch();

  // Handle form submission
  const handleSubmit = async (data: GalleryGroupFormData) => {
    try {
      setSubmitError(null);
      await onSubmit(data);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to save group"
      );
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <AdminForm
        title={
          mode === "create" ? "Create Gallery Group" : "Edit Gallery Group"
        }
        description={
          mode === "create"
            ? "Create a new group to organize your gallery images"
            : "Update group details and settings"
        }
        onSubmit={form.handleSubmit(handleSubmit)}
        isLoading={isLoading}
        error={error || submitError || undefined}
        onCancel={onCancel}
        submitLabel={mode === "create" ? "Create Group" : "Update Group"}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column - Basic info */}
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Group Name *</Label>
              <Input
                id="name"
                value={formValues.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter group name (e.g., Portfolio, Team Photos)"
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

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                {...form.register("slug")}
                placeholder="url-friendly-name"
                className={
                  form.formState.errors.slug ? "border-destructive" : ""
                }
              />
              {form.formState.errors.slug && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.slug.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Used in URLs and navigation. Will be auto-generated from the
                name.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Optional description for this group..."
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Optional description to help organize and identify this group
              </p>
            </div>
          </div>

          {/* Right column - Settings and preview */}
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
                Lower numbers appear first in group listings
              </p>
            </div>

            {/* Active Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">Active Status</Label>
                  <p className="text-xs text-muted-foreground">
                    Control whether this group appears on the public website
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formValues.isActive}
                  onCheckedChange={(checked) =>
                    form.setValue("isActive", checked)
                  }
                />
              </div>
            </div>

            {/* Preview Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div>
                    <p className="font-medium text-sm">
                      {formValues.name || "Group Name"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      URL: /gallery/{formValues.slug || "slug"}
                    </p>
                  </div>
                  {formValues.description && (
                    <p className="text-xs text-gray-600">
                      {formValues.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Order:</span>
                    <span>{formValues.displayOrder}</span>
                    <span className="text-muted-foreground">•</span>
                    <span
                      className={
                        formValues.isActive ? "text-green-600" : "text-gray-500"
                      }
                    >
                      {formValues.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Alert */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                After creating this group, you can assign images to it from the
                gallery management page.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </AdminForm>
    </div>
  );
}
