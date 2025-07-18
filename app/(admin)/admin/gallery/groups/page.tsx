"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GalleryGroupForm } from "@/components/admin/gallery/GalleryGroupForm";
import type { GalleryGroupWithImages } from "@/lib/types/gallery-with-relations.type";
import type { GalleryGroup } from "@/lib/types/gallery-group.type";
import type { ApiResponse } from "@/lib/types/api-response.type";
import { AdminGalleryGroupsListResponse } from "@/app/api/admin/gallery/groups/route";
import {
  Plus,
  Folder,
  Image as ImageIcon,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import NextImage from "next/image";

/**
 * Gallery Groups Management Page - Admin Interface
 * Manage gallery groups/categories for organizing images
 */
export default function AdminGalleryGroupsPage() {
  const [groups, setGroups] = useState<GalleryGroupWithImages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GalleryGroup | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch gallery groups
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/admin/gallery/groups");
      const result: ApiResponse<AdminGalleryGroupsListResponse> =
        await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch gallery groups");
      }

      if (result.data) {
        setGroups(result.data.groups || []);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching gallery groups:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle group creation
  const handleCreateGroup = async (data: {
    name: string;
    slug: string;
    description?: string;
    displayOrder: number;
    isActive: boolean;
  }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/gallery/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<GalleryGroup> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create group");
      }

      toast.success("Group created successfully!");
      setIsCreateDialogOpen(false);
      fetchGroups();
    } catch (error) {
      console.error("Error creating group:", error);
      throw error; // Re-throw to let form handle the error
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle group editing
  const handleEditGroup = async (data: {
    name: string;
    slug: string;
    description?: string;
    displayOrder: number;
    isActive: boolean;
  }) => {
    if (!editingGroup) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/admin/gallery/groups/${editingGroup.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result: ApiResponse<GalleryGroup> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update group");
      }

      toast.success("Group updated successfully!");
      setIsEditDialogOpen(false);
      setEditingGroup(null);
      fetchGroups();
    } catch (error) {
      console.error("Error updating group:", error);
      throw error; // Re-throw to let form handle the error
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle opening edit dialog
  const handleOpenEditDialog = (group: GalleryGroupWithImages) => {
    setEditingGroup(group);
    setIsEditDialogOpen(true);
  };

  // Handle group deletion
  const handleDeleteGroup = async (groupId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this group? Images in this group will not be deleted."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/gallery/groups/${groupId}`, {
        method: "DELETE",
      });

      const result: ApiResponse<{ success: boolean }> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete group");
      }

      toast.success("Group deleted successfully!");
      fetchGroups();
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete group"
      );
    }
  };

  // Handle group status toggle
  const handleToggleGroupStatus = async (
    groupId: string,
    isActive: boolean
  ) => {
    try {
      const response = await fetch(`/api/admin/gallery/groups/${groupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });

      const result: ApiResponse<GalleryGroupWithImages> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update group");
      }

      toast.success(
        `Group ${isActive ? "activated" : "deactivated"} successfully!`
      );
      fetchGroups();
    } catch (error) {
      console.error("Error updating group:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update group"
      );
    }
  };

  // Calculate statistics
  const totalGroups = groups.length;
  const activeGroups = groups.filter((g) => g.isActive).length;
  const totalImages = groups.reduce((sum, g) => sum + g.imageCount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Gallery Groups"
        description="Organize your gallery images into logical groups and categories"
        breadcrumbs={[
          { label: "Gallery", href: "/admin/gallery" },
          { label: "Groups", active: true },
        ]}
        actions={
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Gallery Group</DialogTitle>
              </DialogHeader>
              <GalleryGroupForm
                mode="create"
                onSubmit={handleCreateGroup}
                onCancel={() => setIsCreateDialogOpen(false)}
                isLoading={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGroups}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeGroups}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>

            <ImageIcon className="h-4 w-4 text-blue-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalImages}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Groups Table */}
      <Card>
        <CardHeader>
          <CardTitle>Gallery Groups</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading groups...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchGroups} variant="outline">
                Try Again
              </Button>
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No gallery groups found. Create your first group to organize
                images.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {group.coverImage ? (
                      <NextImage
                        src={
                          group.coverImage.thumbnailUrl ||
                          group.coverImage.originalUrl
                        }
                        alt={
                          group.coverImage.altText ||
                          `Cover image for ${group.name}`
                        }
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Folder className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{group.name}</h3>
                      <p className="text-sm text-gray-500">{group.slug}</p>
                      <p className="text-sm text-gray-600">
                        {group.description || "No description"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <ImageIcon
                        className="h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="text-sm">{group.imageCount}</span>
                    </div>
                    <Badge variant={group.isActive ? "default" : "secondary"}>
                      {group.isActive ? (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditDialog(group)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleToggleGroupStatus(group.id, !group.isActive)
                        }
                        className="h-8 w-8 p-0"
                      >
                        {group.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGroup(group.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Group Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Gallery Group</DialogTitle>
          </DialogHeader>
          {editingGroup && (
            <GalleryGroupForm
              mode="edit"
              initialData={editingGroup}
              onSubmit={handleEditGroup}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingGroup(null);
              }}
              isLoading={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
