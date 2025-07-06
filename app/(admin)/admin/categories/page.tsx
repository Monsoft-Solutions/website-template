"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import type {
  CategoryWithUsage,
  AdminCategoriesListResponse,
} from "@/app/api/admin/categories/route";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { NewCategory } from "@/lib/types/blog/category.type";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  AlertCircle,
  FileText,
  Tag,
} from "lucide-react";

/**
 * Categories Management Page - Phase 5.1 Implementation
 * Features: CRUD operations, usage statistics, bulk actions
 */
export default function AdminCategoriesPage() {
  // State for categories data
  const [categories, setCategories] = useState<CategoryWithUsage[]>([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for pagination and filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // State for bulk actions
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isPerformingBulkAction, setIsPerformingBulkAction] = useState(false);

  // State for create/edit dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryWithUsage | null>(null);
  const [formData, setFormData] = useState<NewCategory>({
    name: "",
    slug: "",
    description: "",
  });

  // Fetch categories
  const fetchCategories = useCallback(async () => {
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

      const response = await fetch(`/api/admin/categories?${params}`);
      const result: ApiResponse<AdminCategoriesListResponse> =
        await response.json();

      if (result.success) {
        setCategories(result.data.categories);
        setTotalCategories(result.data.totalCategories);
      } else {
        setError(result.error || "Failed to fetch categories");
      }
    } catch (error) {
      setError("Error fetching categories");
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchQuery, sortBy, sortOrder]);

  // Fetch categories on component mount and when filters change
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle category creation/update
  const handleSaveCategory = async () => {
    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required");
      return;
    }

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse<CategoryWithUsage> = await response.json();

      if (result.success) {
        toast.success(
          result.message ||
            `Category ${editingCategory ? "updated" : "created"} successfully`
        );
        setIsDialogOpen(false);
        setEditingCategory(null);
        setFormData({ name: "", slug: "", description: "" });
        fetchCategories();
      } else {
        toast.error(result.error || "Failed to save category");
      }
    } catch (error) {
      toast.error("Error saving category");
      console.error("Error saving category:", error);
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      const result: ApiResponse<null> = await response.json();

      if (result.success) {
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        toast.error(result.error || "Failed to delete category");
      }
    } catch (error) {
      toast.error("Error deleting category");
      console.error("Error deleting category:", error);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: "delete") => {
    if (selectedCategories.length === 0) {
      toast.error("Please select categories to perform bulk action");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to ${action} ${selectedCategories.length} categories?`
      )
    ) {
      return;
    }

    setIsPerformingBulkAction(true);

    try {
      const response = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedCategories }),
      });

      const result: ApiResponse<null> = await response.json();

      if (result.success) {
        toast.success(
          `Successfully ${action}d ${selectedCategories.length} categories`
        );
        setSelectedCategories([]);
        fetchCategories();
      } else {
        toast.error(result.error || `Failed to ${action} categories`);
      }
    } catch (error) {
      toast.error(`Error ${action}ing categories`);
      console.error(`Error ${action}ing categories:`, error);
    } finally {
      setIsPerformingBulkAction(false);
    }
  };

  // Handle category selection for bulk actions
  const handleCategorySelection = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    }
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Format date for display
  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle create category button click
  const handleCreateCategory = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", description: "" });
    setIsDialogOpen(true);
  };

  // Handle edit category button click
  const handleEditCategory = (category: CategoryWithUsage) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setIsDialogOpen(true);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setPage(1);
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Categories"
        description="Manage blog post categories"
        breadcrumbs={[
          { label: "Categories", href: "/admin/categories", active: true },
        ]}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Categories</div>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Selected</div>
            <Checkbox className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedCategories.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Posts</div>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((sum, cat) => sum + cat.postsCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
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
              {selectedCategories.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                  disabled={isPerformingBulkAction}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedCategories.length})
                </Button>
              )}
              <Button onClick={handleCreateCategory}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
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

          <DataTable
            columns={[
              {
                key: "select" as keyof CategoryWithUsage,
                label: "",
                render: (_, category) => (
                  <Checkbox
                    checked={selectedCategories.includes(
                      (category as unknown as CategoryWithUsage).id
                    )}
                    onCheckedChange={(checked) =>
                      handleCategorySelection(
                        (category as unknown as CategoryWithUsage).id,
                        checked as boolean
                      )
                    }
                  />
                ),
              },
              {
                key: "name",
                label: "Name",
                sortable: true,
              },
              {
                key: "slug",
                label: "Slug",
                render: (value) => (
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    {value as string}
                  </code>
                ),
              },
              {
                key: "description",
                label: "Description",
                render: (value) => (
                  <span className="text-sm text-muted-foreground">
                    {value
                      ? (value as string).substring(0, 50) + "..."
                      : "No description"}
                  </span>
                ),
              },
              {
                key: "postsCount",
                label: "Posts",
                sortable: true,
                render: (value) => (
                  <Badge variant="secondary">{value as number}</Badge>
                ),
              },
              {
                key: "createdAt",
                label: "Created",
                sortable: true,
                render: (value) => formatDate(value as string),
              },
              {
                key: "actions" as keyof CategoryWithUsage,
                label: "Actions",
                render: (_, category) => (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleEditCategory(
                          category as unknown as CategoryWithUsage
                        )
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDeleteCategory(
                          (category as unknown as CategoryWithUsage).id
                        )
                      }
                      disabled={
                        (category as unknown as CategoryWithUsage).postsCount >
                        0
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
            data={categories as unknown as Record<string, unknown>[]}
            loading={isLoading}
            pagination={{
              page,
              limit,
              total: totalCategories,
              onPageChange: setPage,
              onLimitChange: setLimit,
            }}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Create Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category details"
                : "Create a new category for blog posts"}
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
                placeholder="Enter category name"
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
                placeholder="category-slug"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter category description (optional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>
              {editingCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
