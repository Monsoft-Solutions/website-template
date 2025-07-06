"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type {
  AuthorWithUsage,
  AdminAuthorsListResponse,
} from "@/app/api/admin/authors/route";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { NewAuthor } from "@/lib/types/blog/author.type";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  AlertCircle,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  Mail,
} from "lucide-react";

/**
 * Authors Management Page - Phase 5.3 Implementation
 * Features: CRUD operations, usage statistics, bulk actions
 */
export default function AdminAuthorsPage() {
  // State for authors data
  const [authors, setAuthors] = useState<AuthorWithUsage[]>([]);
  const [totalAuthors, setTotalAuthors] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for pagination and filters
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // State for bulk actions
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [isPerformingBulkAction, setIsPerformingBulkAction] = useState(false);

  // State for create/edit dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<AuthorWithUsage | null>(
    null
  );
  const [formData, setFormData] = useState<NewAuthor>({
    name: "",
    email: "",
    bio: "",
    avatarUrl: "",
  });

  // Fetch authors
  const fetchAuthors = useCallback(async () => {
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

      const response = await fetch(`/api/admin/authors?${params}`);
      const result: ApiResponse<AdminAuthorsListResponse> =
        await response.json();

      if (result.success) {
        setAuthors(result.data.authors);
        setTotalAuthors(result.data.totalAuthors);
      } else {
        setError(result.error || "Failed to fetch authors");
      }
    } catch (error) {
      setError("Error fetching authors");
      console.error("Error fetching authors:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchQuery, sortBy, sortOrder]);

  // Fetch authors on component mount and when filters change
  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  // Handle author creation/update
  const handleSaveAuthor = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    try {
      const url = editingAuthor
        ? `/api/admin/authors/${editingAuthor.id}`
        : "/api/admin/authors";
      const method = editingAuthor ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse<AuthorWithUsage> = await response.json();

      if (result.success) {
        toast.success(
          result.message ||
            `Author ${editingAuthor ? "updated" : "created"} successfully`
        );
        setIsDialogOpen(false);
        setEditingAuthor(null);
        setFormData({ name: "", email: "", bio: "", avatarUrl: "" });
        fetchAuthors();
      } else {
        toast.error(result.error || "Failed to save author");
      }
    } catch (error) {
      toast.error("Error saving author");
      console.error("Error saving author:", error);
    }
  };

  // Handle author deletion
  const handleDeleteAuthor = async (authorId: string) => {
    if (!confirm("Are you sure you want to delete this author?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/authors/${authorId}`, {
        method: "DELETE",
      });

      const result: ApiResponse<null> = await response.json();

      if (result.success) {
        toast.success("Author deleted successfully");
        fetchAuthors();
      } else {
        toast.error(result.error || "Failed to delete author");
      }
    } catch (error) {
      toast.error("Error deleting author");
      console.error("Error deleting author:", error);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: "delete") => {
    if (selectedAuthors.length === 0) {
      toast.error("Please select authors to perform bulk action");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to ${action} ${selectedAuthors.length} authors?`
      )
    ) {
      return;
    }

    setIsPerformingBulkAction(true);

    try {
      const response = await fetch("/api/admin/authors", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedAuthors }),
      });

      const result: ApiResponse<null> = await response.json();

      if (result.success) {
        toast.success(result.message || `Successfully ${action}ed authors`);
        setSelectedAuthors([]);
        fetchAuthors();
      } else {
        toast.error(result.error || `Failed to ${action} authors`);
      }
    } catch (error) {
      toast.error(`Error performing bulk action`);
      console.error("Error performing bulk action:", error);
    } finally {
      setIsPerformingBulkAction(false);
    }
  };

  // Handle author selection
  const handleAuthorSelection = (authorId: string, checked: boolean) => {
    setSelectedAuthors((prev) =>
      checked ? [...prev, authorId] : prev.filter((id) => id !== authorId)
    );
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
  const handleCreateAuthor = () => {
    setEditingAuthor(null);
    setFormData({ name: "", email: "", bio: "", avatarUrl: "" });
    setIsDialogOpen(true);
  };

  // Open edit dialog
  const handleEditAuthor = (author: AuthorWithUsage) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      email: author.email,
      bio: author.bio || "",
      avatarUrl: author.avatarUrl || "",
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

  const totalPages = Math.ceil(totalAuthors / limit);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Authors Management"
        description="Manage blog post authors"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Authors", href: "/admin/authors" },
        ]}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Authors</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAuthors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
            <Checkbox className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedAuthors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {authors.reduce(
                (max, author) =>
                  author.postsCount > max ? author.postsCount : max,
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
                  placeholder="Search authors..."
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
              {selectedAuthors.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                  disabled={isPerformingBulkAction}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedAuthors.length})
                </Button>
              )}
              <Button onClick={handleCreateAuthor}>
                <Plus className="h-4 w-4 mr-2" />
                Add Author
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
                        selectedAuthors.length === authors.length &&
                        authors.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedAuthors(
                            authors.map((author) => author.id)
                          );
                        } else {
                          setSelectedAuthors([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Bio</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : authors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No authors found
                    </TableCell>
                  </TableRow>
                ) : (
                  authors.map((author) => (
                    <TableRow key={author.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedAuthors.includes(author.id)}
                          onCheckedChange={(checked) =>
                            handleAuthorSelection(author.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={author.avatarUrl || undefined} />
                            <AvatarFallback>
                              {author.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{author.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{author.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground max-w-xs truncate">
                          {author.bio || "No bio"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{author.postsCount}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(author.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAuthor(author)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAuthor(author.id)}
                            disabled={author.postsCount > 0}
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
                {Math.min(page * limit, totalAuthors)} of {totalAuthors} authors
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAuthor ? "Edit Author" : "Create Author"}
            </DialogTitle>
            <DialogDescription>
              {editingAuthor
                ? "Update the author details"
                : "Create a new author for blog posts"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter author name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="author@example.com"
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Enter author bio (optional)"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                value={formData.avatarUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, avatarUrl: e.target.value })
                }
                placeholder="https://example.com/avatar.jpg (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAuthor}>
              {editingAuthor ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
