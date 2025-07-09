"use client";

import { useState } from "react";
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
import { useAdminServices } from "@/lib/hooks/use-admin-services";
import type { ServiceWithRelations } from "@/lib/types/service-with-relations.type";
import type { ApiResponse } from "@/lib/types/api-response.type";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Archive,
  AlertCircle,
  Calendar,
  Briefcase,
  Tag,
  Timer,
} from "lucide-react";

/**
 * Services List Page - Phase 4.1 Implementation
 * Features: Pagination, Sorting, Filtering, Search, Bulk Actions
 */
export default function AdminServicesListPage() {
  const router = useRouter();

  // State for filters and pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // State for bulk actions
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isPerformingBulkAction, setIsPerformingBulkAction] = useState(false);

  // Fetch services using the custom hook
  const {
    services: allServices,
    totalServices,
    currentPage,
    isLoading,
    error,
    refetch,
  } = useAdminServices({
    page,
    limit,
    searchQuery: searchQuery || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    sortBy: sortBy as "title" | "createdAt" | "category" | "timeline",
    sortOrder,
  });

  // Filter services by status on the client side
  const services = allServices.filter(
    (service) => statusFilter === "all" || service.status === statusFilter
  );

  // Handle bulk actions
  const handleBulkAction = async (action: "archive" | "delete") => {
    if (selectedServices.length === 0) {
      toast.error("Please select services to perform bulk action");
      return;
    }

    setIsPerformingBulkAction(true);

    try {
      const url = "/api/admin/services";
      const method = action === "delete" ? "DELETE" : "PATCH";
      const body =
        action === "delete"
          ? { ids: selectedServices }
          : { ids: selectedServices, action };

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
            `Successfully ${action}d ${selectedServices.length} service(s)`
        );
        setSelectedServices([]);
        refetch();
      } else {
        toast.error(result.error || `Failed to ${action} services`);
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

  // Handle individual service selection
  const handleServiceSelection = (serviceId: string, checked: boolean) => {
    setSelectedServices((prev) =>
      checked ? [...prev, serviceId] : prev.filter((id) => id !== serviceId)
    );
  };

  // Handle select all services
  const handleSelectAllServices = (checked: boolean) => {
    setSelectedServices(checked ? services.map((service) => service.id) : []);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  // Get category badge
  const getCategoryBadge = (category: string) => {
    const categoryStyles: Record<string, string> = {
      Development: "bg-blue-100 text-blue-800",
      Design: "bg-purple-100 text-purple-800",
      Consulting: "bg-green-100 text-green-800",
      Marketing: "bg-orange-100 text-orange-800",
      Support: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge
        className={categoryStyles[category] || "bg-gray-100 text-gray-800"}
      >
        {category}
      </Badge>
    );
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      draft: "bg-yellow-100 text-yellow-800",
      published: "bg-green-100 text-green-800",
      archived: "bg-gray-100 text-gray-800",
    };

    const statusLabels: Record<string, string> = {
      draft: "Draft",
      published: "Published",
      archived: "Archived",
    };

    return (
      <Badge className={statusStyles[status] || "bg-gray-100 text-gray-800"}>
        {statusLabels[status] || status}
      </Badge>
    );
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
      key: "select" as keyof ServiceWithRelations,
      label: "",
      width: "w-12",
      render: (_: unknown, service: ServiceWithRelations) => (
        <Checkbox
          checked={selectedServices.includes(service.id)}
          onCheckedChange={(checked) =>
            handleServiceSelection(service.id, checked as boolean)
          }
        />
      ),
    },
    {
      key: "title" as keyof ServiceWithRelations,
      label: "Title",
      sortable: true,
      render: (title: unknown, service: ServiceWithRelations) => (
        <div className="space-y-1">
          <button
            className="font-medium line-clamp-1 text-left hover:text-primary transition-colors cursor-pointer"
            onClick={() => router.push(`/admin/services/${service.id}/edit`)}
          >
            {String(title)}
          </button>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {service.shortDescription}
          </div>
        </div>
      ),
    },
    {
      key: "category" as keyof ServiceWithRelations,
      label: "Category",
      sortable: true,
      render: (category: unknown) => (
        <div className="flex items-center space-x-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          {getCategoryBadge(String(category))}
        </div>
      ),
    },
    {
      key: "status" as keyof ServiceWithRelations,
      label: "Status",
      sortable: true,
      render: (status: unknown) => getStatusBadge(String(status)),
    },
    {
      key: "timeline" as keyof ServiceWithRelations,
      label: "Timeline",
      sortable: true,
      render: (timeline: unknown) => (
        <div className="flex items-center space-x-2">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{String(timeline)}</span>
        </div>
      ),
    },
    {
      key: "features" as keyof ServiceWithRelations,
      label: "Features",
      render: (features: unknown) => (
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {(features as string[]).length} feature(s)
          </span>
        </div>
      ),
    },
    {
      key: "createdAt" as keyof ServiceWithRelations,
      label: "Created",
      sortable: true,
      render: (createdAt: unknown) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{formatDate(createdAt as string)}</span>
        </div>
      ),
    },
  ];

  // Handle individual service delete
  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: "DELETE",
      });

      const result: ApiResponse<null> = await response.json();

      if (result.success) {
        toast.success("Service deleted successfully");
        refetch();
      } else {
        toast.error(result.error || "Failed to delete service");
      }
    } catch (error) {
      toast.error(
        `Error deleting service: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // DataTable actions
  const actions = [
    {
      label: "Edit",
      onClick: (service: ServiceWithRelations) => {
        router.push(`/admin/services/${service.id}/edit`);
      },
    },
    {
      label: "Preview",
      onClick: (service: ServiceWithRelations) => {
        router.push(`/admin/services/${service.id}/preview`);
      },
    },
    {
      label: "Delete",
      onClick: (service: ServiceWithRelations) => {
        handleDeleteService(service.id);
      },
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page Header */}
      <PageHeader
        title="Services"
        description="Manage your service offerings, create new services, and organize your portfolio."
        breadcrumbs={[
          { label: "Services", href: "/admin/services", active: true },
        ]}
        actions={
          <Button
            className="gap-2"
            onClick={() => router.push("/admin/services/new")}
          >
            <Plus className="h-4 w-4" />
            Create Service
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
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
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Consulting">Consulting</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
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
                  <SelectItem value="category-asc">Category A-Z</SelectItem>
                  <SelectItem value="timeline-asc">Timeline A-Z</SelectItem>
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
      {selectedServices.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedServices.length === services.length}
                  onCheckedChange={handleSelectAllServices}
                />
                <span className="text-sm font-medium">
                  {selectedServices.length} of {services.length} service(s)
                  selected
                </span>
              </div>
              <div className="flex gap-2">
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
                        Are you sure you want to delete{" "}
                        {selectedServices.length} service(s)? This action cannot
                        be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleBulkAction("delete")}
                        disabled={isPerformingBulkAction}
                      >
                        Delete Services
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services Table */}
      <DataTable
        title={`Services (${totalServices})`}
        columns={columns}
        data={services}
        actions={actions}
        loading={isLoading}
        searchable={false} // We have custom search
        pagination={{
          page: currentPage,
          limit,
          total: totalServices,
          onPageChange: setPage,
          onLimitChange: setLimit,
        }}
      />
    </div>
  );
}
