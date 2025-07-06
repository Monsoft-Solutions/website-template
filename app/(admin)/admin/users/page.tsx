"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/admin";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Plus,
  Search,
  X,
  User,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { UserRole } from "@/lib/types/auth.type";
import type { ApiResponse } from "@/lib/types/api-response.type";
import type { AdminUsersListResponse } from "@/app/api/admin/users/route";

// User type for the data table
type UserTableData = {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  image: string | null;
  bio: string | null;
  lang: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Form data type for adding new users
type AddUserFormData = {
  name: string;
  email: string;
  role: string;
};

export default function AdminUsersPage() {
  // State for users data and pagination
  const [users, setUsers] = useState<UserTableData[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Dialog state for adding new user
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [addUserFormData, setAddUserFormData] = useState<AddUserFormData>({
    name: "",
    email: "",
    role: "user",
  });

  // Bulk actions state
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isPerformingBulkAction, setIsPerformingBulkAction] = useState(false);

  // Fetch users
  const fetchUsers = useCallback(async () => {
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

      if (roleFilter !== "all") {
        params.append("role", roleFilter);
      }

      const response = await fetch(`/api/admin/users?${params}`);
      const result: ApiResponse<AdminUsersListResponse> = await response.json();

      if (result.success) {
        setUsers(result.data.users);
        setTotalUsers(result.data.totalUsers);
      } else {
        setError(result.error || "Failed to fetch users");
      }
    } catch (error) {
      setError("Error fetching users");
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchQuery, roleFilter, sortBy, sortOrder]);

  // Fetch users on component mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle add user form submission
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingUser(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addUserFormData),
      });

      const result: ApiResponse<UserTableData> = await response.json();

      if (result.success) {
        toast.success(result.message || "User created successfully");
        setIsAddDialogOpen(false);
        setAddUserFormData({ name: "", email: "", role: "user" });
        fetchUsers(); // Refresh the users list
      } else {
        toast.error(result.error || "Failed to create user");
      }
    } catch (error) {
      toast.error("Error creating user");
      console.error("Error creating user:", error);
    } finally {
      setIsAddingUser(false);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: "delete") => {
    if (selectedUsers.length === 0) {
      toast.error("Please select users to perform bulk action");
      return;
    }

    if (action === "delete") {
      // Show confirmation for delete action
      const confirmed = window.confirm(
        `Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone.`
      );
      if (!confirmed) return;
    }

    setIsPerformingBulkAction(true);

    try {
      const url = "/api/admin/users";
      const method = "DELETE";
      const body = { ids: selectedUsers };

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
            `Successfully deleted ${selectedUsers.length} user(s)`
        );
        setSelectedUsers([]);
        fetchUsers();
      } else {
        toast.error(result.error || `Failed to ${action} users`);
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

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  // Get role badge variant
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "editor":
        return "default";
      case "viewer":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Data table columns
  const columns = [
    {
      key: "name" as keyof UserTableData,
      label: "Name",
      sortable: true,
      render: (_value: unknown, row: UserTableData) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            {row.image ? (
              <Image
                src={row.image}
                alt={row.name}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-muted-foreground">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role" as keyof UserTableData,
      label: "Role",
      sortable: true,
      render: (value: unknown) => (
        <Badge variant={getRoleBadgeVariant(value as string)}>
          {(value as string).charAt(0).toUpperCase() +
            (value as string).slice(1)}
        </Badge>
      ),
    },
    {
      key: "emailVerified" as keyof UserTableData,
      label: "Email Status",
      render: (value: unknown) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      key: "createdAt" as keyof UserTableData,
      label: "Created",
      sortable: true,
      render: (value: unknown) => new Date(value as Date).toLocaleDateString(),
    },
  ];

  // Data table actions
  const actions = [
    {
      label: "Edit",
      onClick: () => {
        // TODO: Implement edit user functionality
        toast.info("Edit user functionality coming soon");
      },
    },
    {
      label: "Delete",
      onClick: (row: UserTableData) => {
        const confirmed = window.confirm(
          `Are you sure you want to delete user "${row.name}"? This action cannot be undone.`
        );
        if (confirmed) {
          setSelectedUsers([row.id]);
          handleBulkAction("delete");
        }
      },
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Users"
        description="Manage user accounts and permissions"
        breadcrumbs={[{ label: "Users", href: "/admin/users", active: true }]}
        actions={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account. They will receive an email to
                  verify their account and set their password.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddUser}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={addUserFormData.name}
                      onChange={(e) =>
                        setAddUserFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter user's full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={addUserFormData.email}
                      onChange={(e) =>
                        setAddUserFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Enter user's email address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={addUserFormData.role}
                      onValueChange={(value) =>
                        setAddUserFormData((prev) => ({
                          ...prev,
                          role: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(UserRole).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    disabled={isAddingUser}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isAddingUser}>
                    {isAddingUser && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Create User
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {Object.values(UserRole).map((role) => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={clearFilters}
            title="Clear filters"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedUsers.length} user(s) selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleBulkAction("delete")}
            disabled={isPerformingBulkAction}
            className="ml-auto"
          >
            {isPerformingBulkAction && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Users Data Table */}
      <DataTable
        title="All Users"
        description={`Showing ${users.length} of ${totalUsers} users`}
        columns={columns}
        data={users}
        actions={actions}
        loading={isLoading}
        searchable={false} // We handle search manually
        pagination={{
          page,
          limit,
          total: totalUsers,
          onPageChange: setPage,
          onLimitChange: setLimit,
        }}
      />
    </div>
  );
}
