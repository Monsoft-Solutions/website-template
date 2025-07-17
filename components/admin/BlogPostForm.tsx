"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarkdownEditor } from "@/components/admin";
import { AlertCircle, Loader2 } from "lucide-react";
import { LoadingSpinner } from "@/components/layout/Loading";
import { toast } from "sonner";
import {
  TagSelector,
  FeaturedImageUploader,
  SlugGenerator,
} from "@/components/admin/blog-post-form";
import {
  blogPostFormSchema,
  type BlogPostFormData,
} from "@/lib/utils/blog-post-form-validation";
import { useBlogCategories } from "@/lib/hooks/use-blog-categories.hook";
import { useBlogTags } from "@/lib/hooks/use-blog-tags.hook";
import { useBlogAuthors } from "@/lib/hooks/use-blog-authors.hook";
import { useBlogPostOperations } from "@/lib/hooks/use-blog-post-operations.hook";
import type { BlogPostWithRelations } from "@/lib/types/blog-post-with-relations.type";
import type { Tag } from "@/lib/types/blog/tag.type";

interface BlogPostFormV2Props {
  initialData?: BlogPostWithRelations;
  mode: "create" | "edit";
  onCancel: () => void;
  className?: string;
}

/**
 * Rewritten blog post form component
 * Uses React Hook Form with Zod validation and custom hooks
 */
export function BlogPostForm({
  initialData,
  mode,
  onCancel,
  className,
}: BlogPostFormV2Props) {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  // Custom hooks for data fetching
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useBlogCategories();
  const { tags, isLoading: tagsLoading, error: tagsError } = useBlogTags();
  const {
    authors,
    isLoading: authorsLoading,
    error: authorsError,
  } = useBlogAuthors();
  const {
    createPost,
    updatePost,
    isLoading: isSubmitting,
    error: submitError,
  } = useBlogPostOperations();

  // Initialize form with React Hook Form
  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      featuredImage: initialData?.featuredImage || "",
      authorId: initialData?.authorId || "",
      categoryId: initialData?.categoryId || "",
      status: initialData?.status || "draft",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      metaKeywords: initialData?.metaKeywords || "",
      tagIds: initialData?.tags?.map((tag) => tag.id) || [],
    },
  });

  // Initialize selected tags for edit mode
  useEffect(() => {
    if (initialData && "tags" in initialData && mode === "edit") {
      setSelectedTags(initialData.tags);
      form.setValue(
        "tagIds",
        initialData.tags.map((tag) => tag.id)
      );
    }
  }, [initialData, mode, form]);

  // Watch title for slug generation and AI image generation
  const watchedTitle = form.watch("title");
  const watchedContent = form.watch("content");
  const watchedExcerpt = form.watch("excerpt");

  // Handle form submission
  const onSubmit = async (data: BlogPostFormData) => {
    try {
      // Include selected tag IDs in the submission data
      const submitData = {
        ...data,
        tagIds: selectedTags.map((tag) => tag.id),
      };

      if (mode === "create") {
        await createPost(submitData);
        toast.success("Blog post created successfully!");
      } else if (initialData) {
        await updatePost(initialData.id, submitData);
        toast.success("Blog post updated successfully!");
      }

      // Redirect after success
      setTimeout(() => {
        router.push("/admin/blog");
      }, 1500);
    } catch (error) {
      // Error handling is done in the hook
      console.error("Form submission error:", error);
    }
  };

  // Handle tag changes
  const handleTagsChange = (tags: Tag[]) => {
    setSelectedTags(tags);
    form.setValue(
      "tagIds",
      tags.map((tag) => tag.id)
    );
  };

  // Handle direct blog post update for image selection
  const handleBlogPostUpdate = async (blogPostId: string, imageUrl: string) => {
    if (mode !== "edit" || !initialData) {
      throw new Error("Blog post update is only available in edit mode");
    }

    // Update the form field first for immediate UI feedback
    form.setValue("featuredImage", imageUrl);

    try {
      // Create a minimal update payload - only update the featured image
      const response = await fetch(`/api/admin/blog/${blogPostId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Include all required fields from current form state
          title: form.getValues("title"),
          slug: form.getValues("slug"),
          excerpt: form.getValues("excerpt"),
          content: form.getValues("content"),
          authorId: form.getValues("authorId"),
          categoryId: form.getValues("categoryId"),
          status: form.getValues("status"),
          metaTitle: form.getValues("metaTitle"),
          metaDescription: form.getValues("metaDescription"),
          metaKeywords: form.getValues("metaKeywords"),
          featuredImage: imageUrl, // This is the AI-generated image URL from Vercel Blob
          tagIds: selectedTags.map((tag) => tag.id),
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update blog post");
      }
      toast.success("Blog post updated with selected image!");
    } catch (error) {
      // Reset the form field if the update failed
      form.setValue("featuredImage", initialData.featuredImage || "");
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update featured image"
      );
      throw error;
    }
  };

  // Loading state
  const isLoading = categoriesLoading || tagsLoading || authorsLoading;
  const hasError = categoriesError || tagsError || authorsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          Error loading form data:{" "}
          {categoriesError || tagsError || authorsError}
        </p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("max-w-full mx-auto", className)}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Error Message */}
        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      {...form.register("title")}
                      placeholder="Enter post title"
                      className={
                        form.formState.errors.title ? "border-destructive" : ""
                      }
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.title.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Controller
                      name="slug"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <SlugGenerator
                          title={watchedTitle}
                          value={field.value}
                          onChange={field.onChange}
                          error={fieldState.error?.message}
                          mode={mode}
                        />
                      )}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    {...form.register("excerpt")}
                    placeholder="Brief description of the post"
                    className={
                      form.formState.errors.excerpt ? "border-destructive" : ""
                    }
                    rows={3}
                  />
                  {form.formState.errors.excerpt && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.excerpt.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Controller
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Content *</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="content"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <MarkdownEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Write your blog post content in markdown..."
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </CardContent>
            </Card>

            {/* SEO Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    {...form.register("metaTitle")}
                    placeholder="SEO title (leave blank to use post title)"
                    className={
                      form.formState.errors.metaTitle
                        ? "border-destructive"
                        : ""
                    }
                  />
                  {form.formState.errors.metaTitle && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.metaTitle.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    {...form.register("metaDescription")}
                    placeholder="SEO description (leave blank to use excerpt)"
                    className={
                      form.formState.errors.metaDescription
                        ? "border-destructive"
                        : ""
                    }
                    rows={3}
                  />
                  {form.formState.errors.metaDescription && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.metaDescription.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    {...form.register("metaKeywords")}
                    placeholder="keyword1, keyword2, keyword3"
                    className={
                      form.formState.errors.metaKeywords
                        ? "border-destructive"
                        : ""
                    }
                  />
                  {form.formState.errors.metaKeywords && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.metaKeywords.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="featuredImage"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FeaturedImageUploader
                      value={field.value || ""}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                      blogTitle={watchedTitle || ""}
                      blogContent={watchedContent || ""}
                      blogExcerpt={watchedExcerpt || ""}
                      mode={mode}
                      onBlogPostUpdate={handleBlogPostUpdate}
                      blogPostId={initialData?.id || ""}
                    />
                  )}
                />
              </CardContent>
            </Card>

            {/* Author & Category */}
            <Card>
              <CardHeader>
                <CardTitle>Author & Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="authorId">Author *</Label>
                  <Controller
                    name="authorId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={
                            fieldState.error ? "border-destructive" : ""
                          }
                        >
                          <SelectValue placeholder="Select author" />
                        </SelectTrigger>
                        <SelectContent>
                          {authors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              {author.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.authorId && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.authorId.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="categoryId">Category *</Label>
                  <Controller
                    name="categoryId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={
                            fieldState.error ? "border-destructive" : ""
                          }
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.categoryId && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.categoryId.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <TagSelector
                  availableTags={tags}
                  selectedTags={selectedTags}
                  onTagsChange={handleTagsChange}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-2 pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Post"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
