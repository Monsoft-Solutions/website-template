"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAdminBlogPosts } from "@/lib/hooks/use-admin-blog-posts";
import type { BlogPostWithRelations } from "@/lib/types/blog-post-with-relations.type";
import type { ApiResponse } from "@/lib/types/api-response.type";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  Circle,
  Archive,
  AlertCircle,
  Calendar,
  User,
  Folder,
} from "lucide-react";

/**
 * Blog Posts List Page - Phase 3.1 Implementation
 * Features: Pagination, Sorting, Filtering, Search, Bulk Actions
 */
export default function AdminBlogListPage() {
  const router = useRouter();

  // State for filters and pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // State for bulk actions
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [isPerformingBulkAction, setIsPerformingBulkAction] = useState(false);

  // State for filter data
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [authors, setAuthors] = useState<Array<{ id: string; name: string }>>(
    []
  );

  // Fetch blog posts using the custom hook
  const { posts, totalPosts, currentPage, isLoading, error, refetch } =
    useAdminBlogPosts({
      page,
      limit,
      searchQuery: searchQuery || undefined,
      status:
        statusFilter !== "all"
          ? (statusFilter as "draft" | "published" | "archived")
          : undefined,
      categoryId: categoryFilter !== "all" ? categoryFilter : undefined,
      authorId: authorFilter !== "all" ? authorFilter : undefined,
      sortBy: sortBy as "title" | "createdAt" | "publishedAt" | "status",
      sortOrder,
    });

  // Fetch filter data on mount
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [categoriesResponse, authorsResponse] = await Promise.all([
          fetch("/api/blog/categories"),
          fetch("/api/admin/authors"),
        ]);

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          if (categoriesData.success) {
            setCategories(categoriesData.data.slice(1)); // Remove "All" category
          }
        }

        if (authorsResponse.ok) {
          const authorsData = await authorsResponse.json();
          if (authorsData.success) {
            setAuthors(authorsData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchFilterData();
  }, []);

  // Handle bulk actions
  const handleBulkAction = async (
    action: "publish" | "unpublish" | "archive" | "delete"
  ) => {
    if (selectedPosts.length === 0) {
      toast.error("Please select posts to perform bulk action");
      return;
    }

    setIsPerformingBulkAction(true);

    try {
      const url = "/api/admin/blog";
      const method = action === "delete" ? "DELETE" : "PATCH";
      const body =
        action === "delete"
          ? { ids: selectedPosts }
          : { ids: selectedPosts, action };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result: ApiResponse<null> = await response.json();

      if (result.success) {
        toast.success(
          result.message ||
            `Successfully ${action}ed ${selectedPosts.length} post(s)`
        );
        setSelectedPosts([]);
        refetch();
      } else {
        toast.error(result.error || `Failed to ${action} posts`);
      }
    } catch (error) {
      toast.error(
        `Error performing bulk action: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsPerformingBulkAction(false);
    }
  };

  // Handle individual post selection
  const handlePostSelection = (postId: string, checked: boolean) => {
    setSelectedPosts((prev) =>
      checked ? [...prev, postId] : prev.filter((id) => id !== postId)
    );
  };

  // Handle select all posts
  const handleSelectAllPosts = (checked: boolean) => {
    setSelectedPosts(checked ? posts.map((post) => post.id) : []);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setAuthorFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "archived":
        return (
          <Badge variant="outline" className="text-gray-600">
            Archived
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (date: string | Date | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // DataTable columns configuration
  const columns = [
    {
      key: "select" as keyof BlogPostWithRelations,
      label: "",
      width: "w-12",
      render: (_: unknown, post: BlogPostWithRelations) => (
        <Checkbox
          checked={selectedPosts.includes(post.id)}
          onCheckedChange={(checked) =>
            handlePostSelection(post.id, checked as boolean)
          }
        />
      ),
    },
    {
      key: "title" as keyof BlogPostWithRelations,
      label: "Title",
      sortable: true,
      render: (title: unknown, post: BlogPostWithRelations) => (
        <div className="space-y-1">
          <div className="font-medium line-clamp-1">{String(title)}</div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {post.excerpt}
          </div>
        </div>
      ),
    },
    {
      key: "author" as keyof BlogPostWithRelations,
      label: "Author",
      render: (author: unknown) => (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{(author as { name: string }).name}</span>
        </div>
      ),
    },
    {
      key: "category" as keyof BlogPostWithRelations,
      label: "Category",
      render: (category: unknown) => (
        <div className="flex items-center space-x-2">
          <Folder className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{(category as { name: string }).name}</span>
        </div>
      ),
    },
    {
      key: "tags" as keyof BlogPostWithRelations,
      label: "Tags",
      render: (tags: unknown) => (
        <div className="flex flex-wrap gap-1">
          {(tags as Array<{ name: string }>).slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag.name}
            </Badge>
          ))}
          {(tags as Array<{ name: string }>).length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{(tags as Array<{ name: string }>).length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "status" as keyof BlogPostWithRelations,
      label: "Status",
      sortable: true,
      render: (status: unknown) => getStatusBadge(String(status)),
    },
    {
      key: "createdAt" as keyof BlogPostWithRelations,
      label: "Created",
      sortable: true,
      render: (createdAt: unknown) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{formatDate(createdAt as string)}</span>
        </div>
      ),
    },
    {
      key: "publishedAt" as keyof BlogPostWithRelations,
      label: "Published",
      sortable: true,
      render: (publishedAt: unknown) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{formatDate(publishedAt as string)}</span>
        </div>
      ),
    },
  ];

  // Handle individual post delete
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "DELETE",
      });

      const result: ApiResponse<null> = await response.json();

      if (result.success) {
        toast.success("Post deleted successfully");
        refetch();
      } else {
        toast.error(result.error || "Failed to delete post");
      }
    } catch (error) {
      toast.error(
        `Error deleting post: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // DataTable actions
  const actions = [
    {
      label: "Edit",
      onClick: (post: BlogPostWithRelations) => {
        router.push(`/admin/blog/${post.id}/edit`);
      },
    },
    {
      label: "Preview",
      onClick: (post: BlogPostWithRelations) => {
        // Navigate to preview page (will be implemented in next phases)
        console.log("Preview post:", post.id);
        toast.info("Preview functionality coming in Phase 3.4");
      },
    },
    {
      label: "Delete",
      onClick: (post: BlogPostWithRelations) => {
        handleDeletePost(post.id);
      },
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page Header */}
      <PageHeader
        title="Blog Posts"
        description="Manage your blog content, create new posts, and organize your articles."
        breadcrumbs={[
          { label: "Blog Posts", href: "/admin/blog", active: true },
        ]}
        actions={
          <Button
            className="gap-2"
            onClick={() => router.push("/admin/blog/new")}
          >
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        }
      />

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Author Filter */}
            <div>
              <Label htmlFor="author">Author</Label>
              <Select value={authorFilter} onValueChange={setAuthorFilter}>
                <SelectTrigger id="author">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Authors</SelectItem>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div>
              <Label htmlFor="sort">Sort By</Label>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(value) => {
                  const [newSortBy, newSortOrder] = value.split("-");
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder as "asc" | "desc");
                }}
              >
                <SelectTrigger id="sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                  <SelectItem value="title-desc">Title Z-A</SelectItem>
                  <SelectItem value="status-asc">Status A-Z</SelectItem>
                  <SelectItem value="publishedAt-desc">
                    Recently Published
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedPosts.length === posts.length}
                  onCheckedChange={handleSelectAllPosts}
                />
                <span className="text-sm font-medium">
                  {selectedPosts.length} of {posts.length} post(s) selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("publish")}
                  disabled={isPerformingBulkAction}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Publish
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("unpublish")}
                  disabled={isPerformingBulkAction}
                  className="gap-2"
                >
                  <Circle className="h-4 w-4" />
                  Unpublish
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("archive")}
                  disabled={isPerformingBulkAction}
                  className="gap-2"
                >
                  <Archive className="h-4 w-4" />
                  Archive
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isPerformingBulkAction}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Delete</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete {selectedPosts.length}{" "}
                        post(s)? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleBulkAction("delete")}
                        disabled={isPerformingBulkAction}
                      >
                        Delete Posts
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Table */}
      <DataTable
        title={`Blog Posts (${totalPosts})`}
        columns={columns}
        data={posts}
        actions={actions}
        loading={isLoading}
        searchable={false} // We have custom search
        pagination={{
          page: currentPage,
          limit,
          total: totalPosts,
          onPageChange: setPage,
          onLimitChange: setLimit,
        }}
      />
    </div>
  );
}
