"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle, CheckCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useAIBlogPostSave } from "@/hooks/use-ai-blog-post-save";
import { useAdminFormData } from "@/hooks/use-admin-form-data";
import type { BlogPost } from "@/lib/types/ai/content-generation.type";

interface AIBlogPostSavePanelProps {
  blogPost: BlogPost;
  onSaved?: (postId: string, slug: string) => void;
}

export function AIBlogPostSavePanel({
  blogPost,
  onSaved,
}: AIBlogPostSavePanelProps) {
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    "draft"
  );
  const [featuredImage, setFeaturedImage] = useState<string>("");

  const { savePost, isSaving, error } = useAIBlogPostSave();
  const {
    authors,
    categories,
    isLoading: isLoadingData,
    error: dataError,
  } = useAdminFormData();

  // Handle data loading errors
  useEffect(() => {
    if (dataError) {
      toast.error("Failed to load form data");
    }
  }, [dataError]);

  // Auto-select category if AI generated one
  useEffect(() => {
    if (blogPost.category && categories.length > 0 && !selectedCategoryId) {
      const matchingCategory = categories.find(
        (cat) => cat.name.toLowerCase() === blogPost.category?.toLowerCase()
      );
      if (matchingCategory) {
        setSelectedCategoryId(matchingCategory.id);
      }
    }
  }, [blogPost.category, categories, selectedCategoryId]);

  const handleSave = async () => {
    if (!selectedAuthorId || !selectedCategoryId) {
      toast.error("Please select both author and category");
      return;
    }

    try {
      const result = await savePost(blogPost, {
        authorId: selectedAuthorId,
        categoryId: selectedCategoryId,
        status,
        featuredImage: featuredImage || undefined,
      });

      if (result.success && result.data) {
        toast.success("Blog post saved successfully!");
        onSaved?.(result.data.id, result.data.slug);
      }
    } catch {
      toast.error("Failed to save blog post");
    }
  };

  const getWordCount = (text: string) => {
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  };

  const isFormValid =
    selectedAuthorId && selectedCategoryId && !isSaving && !isLoadingData;

  return (
    <div className="space-y-6">
      {/* Blog Post Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Generated Blog Post Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Title
            </Label>
            <h2 className="text-2xl font-bold mt-1">{blogPost.title}</h2>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Meta Title</Label>
              <p className="mt-1">{blogPost.metaTitle || "Not provided"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                Suggested Category
              </Label>
              <p className="mt-1">{blogPost.category || "Not provided"}</p>
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Meta Description
            </Label>
            <p className="text-sm mt-1 p-2 bg-muted rounded">
              {blogPost.metaDescription}
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Excerpt
            </Label>
            <p className="mt-1 text-muted-foreground">{blogPost.excerpt}</p>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Tags
            </Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {blogPost.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Content Preview */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Content ({getWordCount(blogPost.content)} words)
            </Label>
            <div className="mt-1 p-4 bg-muted rounded max-h-60 overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                {blogPost.content.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-2">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Meta Keywords */}
          {blogPost.metaKeywords && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Meta Keywords
              </Label>
              <p className="text-sm mt-1 p-2 bg-muted rounded">
                {blogPost.metaKeywords}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save to Database
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Author Selection */}
            <div>
              <Label htmlFor="author-select">Author *</Label>
              <Select
                value={selectedAuthorId}
                onValueChange={setSelectedAuthorId}
                disabled={isLoadingData}
              >
                <SelectTrigger id="author-select">
                  <SelectValue placeholder="Select an author" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Selection */}
            <div>
              <Label htmlFor="category-select">Category *</Label>
              <Select
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
                disabled={isLoadingData}
              >
                <SelectTrigger id="category-select">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Selection */}
            <div>
              <Label htmlFor="status-select">Status</Label>
              <Select
                value={status}
                onValueChange={(value: "draft" | "published" | "archived") =>
                  setStatus(value)
                }
              >
                <SelectTrigger id="status-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Featured Image */}
            <div>
              <Label htmlFor="featured-image">
                Featured Image URL (optional)
              </Label>
              <Input
                id="featured-image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              disabled={!isFormValid}
              size="lg"
              className="min-w-32"
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Blog Post
                </>
              )}
            </Button>
          </div>

          {isFormValid && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              Ready to save
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
