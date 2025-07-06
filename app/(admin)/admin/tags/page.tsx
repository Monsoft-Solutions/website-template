"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  TagWithUsage,
  AdminTagsListResponse,
} from "@/app/api/admin/tags/route";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { NewTag } from "@/lib/types/blog/tag.type";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  AlertCircle,
  FileText,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * Tags Management Page - Phase 5.2 Implementation
 * Features: CRUD operations, usage statistics, bulk actions
 */
export default function AdminTagsPage() {
  // State for tags data
  const [tags, setTags] = useState<TagWithUsage[]>([]);
  const [totalTags, setTotalTags] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for pagination and filters
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // State for bulk actions
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPerformingBulkAction, setIsPerformingBulkAction] = useState(false);

  // State for create/edit dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagWithUsage | null>(null);
  const [formData, setFormData] = useState<NewTag>({
    name: "",
    slug: "",
  });

  // Fetch tags
  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (searchQuery) {
        params.append("searchQuery", searchQuery);
      }

      const response = await fetch(`/api/admin/tags?${params}`);
      const result: ApiResponse<AdminTagsListResponse> = await response.json();

      if (result.success) {
        setTags(result.data.tags);
        setTotalTags(result.data.totalTags);
      } else {
        setError(result.error || "Failed to fetch tags");
      }
    } catch (error) {
      setError("Error fetching tags");
      console.error("Error fetching tags:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchQuery, sortBy, sortOrder]);

  // Fetch tags on component mount and when filters change
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // Handle tag creation/update
  const handleSaveTag = async () => {
    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required");
      return;
    }

    try {
      const url = editingTag
        ? `/api/admin/tags/${editingTag.id}`
        : "/api/admin/tags";
      const method = editingTag ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse<TagWithUsage> = await response.json();

      if (result.success) {
        toast.success(
          result.message ||
            `Tag ${editingTag ? "updated" : "created"} successfully`
        );
        setIsDialogOpen(false);
        setEditingTag(null);
        setFormData({ name: "", slug: "" });
        fetchTags();
      } else {
        toast.error(result.error || "Failed to save tag");
      }
    } catch (error) {
      toast.error("Error saving tag");
      console.error("Error saving tag:", error);
    }
  };

  // Handle tag deletion
  const handleDeleteTag = async (tagId: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tags/${tagId}`, {
        method: "DELETE",
      });

      const result: ApiResponse<null> = await response.json();

      if (result.success) {
        toast.success("Tag deleted successfully");
        fetchTags();
      } else {
        toast.error(result.error || "Failed to delete tag");
      }
    } catch (error) {
      toast.error("Error deleting tag");
      console.error("Error deleting tag:", error);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: "delete") => {
    if (selectedTags.length === 0) {
      toast.error("Please select tags to perform bulk action");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to ${action} ${selectedTags.length} tags?`
      )
    ) {
      return;
    }

    setIsPerformingBulkAction(true);

    try {
      const response = await fetch("/api/admin/tags", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedTags }),
      });

      const result: ApiResponse<null> = await response.json();

      if (result.success) {
        toast.success(result.message || `Successfully ${action}ed tags`);
        setSelectedTags([]);
        fetchTags();
      } else {
        toast.error(result.error || `Failed to ${action} tags`);
      }
    } catch (error) {
      toast.error(`Error performing bulk action`);
      console.error("Error performing bulk action:", error);
    } finally {
      setIsPerformingBulkAction(false);
    }
  };

  // Handle tag selection
  const handleTagSelection = (tagId: string, checked: boolean) => {
    setSelectedTags((prev) =>
      checked ? [...prev, tagId] : prev.filter((id) => id !== tagId)
    );
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Format date
  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Open create dialog
  const handleCreateTag = () => {
    setEditingTag(null);
    setFormData({ name: "", slug: "" });
    setIsDialogOpen(true);
  };

  // Open edit dialog
  const handleEditTag = (tag: TagWithUsage) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
    });
    setIsDialogOpen(true);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const totalPages = Math.ceil(totalTags / limit);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tags Management"
        description="Manage blog post tags"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Tags", href: "/admin/tags" },
        ]}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTags}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
            <Checkbox className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedTags.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tags.reduce(
                (max, tag) => (tag.postsCount > max ? tag.postsCount : max),
                0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              {selectedTags.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                  disabled={isPerformingBulkAction}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedTags.length})
                </Button>
              )}
              <Button onClick={handleCreateTag}>
                <Plus className="h-4 w-4 mr-2" />
                Add Tag
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        selectedTags.length === tags.length && tags.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTags(tags.map((tag) => tag.id));
                        } else {
                          setSelectedTags([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : tags.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No tags found
                    </TableCell>
                  </TableRow>
                ) : (
                  tags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={(checked) =>
                            handleTagSelection(tag.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">{tag.name}</TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {tag.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{tag.postsCount}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(tag.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTag(tag)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTag(tag.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, totalTags)} of {totalTags} tags
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTag ? "Edit Tag" : "Create Tag"}</DialogTitle>
            <DialogDescription>
              {editingTag
                ? "Update the tag details"
                : "Create a new tag for blog posts"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: generateSlug(name),
                  });
                }}
                placeholder="Enter tag name"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="tag-slug"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTag}>
              {editingTag ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
