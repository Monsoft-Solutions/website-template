"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatsCard } from "@/components/admin/StatsCard";
import { SubmissionStatusBadge } from "@/components/admin/SubmissionStatusBadge";
import { Button } from "@/components/ui/button";
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
import { useAdminContactSubmissions } from "@/lib/hooks/use-admin-contact-submissions.hook";
import type { ContactSubmission } from "@/lib/types/contact/contact-submission.type";
import type { ApiResponse } from "@/lib/types/api-response.type";
import {
  Search,
  Filter,
  Trash2,
  Eye,
  CheckCircle,
  Circle,
  AlertCircle,
  Calendar,
  User,
  Building,
  Mail,
  MessageSquare,
  DollarSign,
  Clock,
} from "lucide-react";

/**
 * Contact Submissions List Page - Phase 6.1 Implementation
 * Features: Pagination, Sorting, Filtering, Search, Bulk Actions
 */
export default function AdminContactSubmissionsListPage() {
  const router = useRouter();

  // State for filters and pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>("all");
  const [budgetFilter, setBudgetFilter] = useState<string>("all");
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // State for bulk actions
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [isPerformingBulkAction, setIsPerformingBulkAction] = useState(false);

  // Fetch contact submissions using the custom hook
  const {
    submissions,
    totalSubmissions,
    currentPage,
    statusCounts,
    isLoading,
    error,
    refetch,
  } = useAdminContactSubmissions({
    page,
    limit,
    searchQuery: searchQuery || undefined,
    status:
      statusFilter !== "all"
        ? (statusFilter as "new" | "read" | "responded")
        : undefined,
    projectType: projectTypeFilter !== "all" ? projectTypeFilter : undefined,
    budget: budgetFilter !== "all" ? budgetFilter : undefined,
    dateFrom: dateFromFilter || undefined,
    dateTo: dateToFilter || undefined,
    sortBy: sortBy as "name" | "email" | "status" | "company" | "createdAt",
    sortOrder,
  });

  // Handle bulk actions
  const handleBulkAction = async (
    action: "mark-read" | "mark-responded" | "mark-new" | "delete"
  ) => {
    if (selectedSubmissions.length === 0) {
      toast.error("Please select submissions to perform bulk action");
      return;
    }

    setIsPerformingBulkAction(true);

    try {
      const url = "/api/admin/contact-submissions";
      const method = action === "delete" ? "DELETE" : "PATCH";
      const body =
        action === "delete"
          ? { ids: selectedSubmissions }
          : { ids: selectedSubmissions, action };

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
            `Successfully ${action === "delete" ? "deleted" : "updated"} ${
              selectedSubmissions.length
            } submission(s)`
        );
        setSelectedSubmissions([]);
        refetch();
      } else {
        toast.error(result.error || `Failed to ${action} submissions`);
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

  // Handle individual submission selection
  const handleSubmissionSelection = (
    submissionId: string,
    checked: boolean
  ) => {
    setSelectedSubmissions((prev) =>
      checked
        ? [...prev, submissionId]
        : prev.filter((id) => id !== submissionId)
    );
  };

  // Handle select all submissions
  const handleSelectAllSubmissions = (checked: boolean) => {
    setSelectedSubmissions(
      checked ? submissions.map((submission) => submission.id) : []
    );
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setProjectTypeFilter("all");
    setBudgetFilter("all");
    setDateFromFilter("");
    setDateToFilter("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  // Format date
  const formatDate = (date: string | Date | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format project type
  const formatProjectType = (projectType: string | null) => {
    if (!projectType) return "—";
    return projectType
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // DataTable columns configuration
  const columns = [
    {
      key: "select" as keyof ContactSubmission,
      label: "",
      width: "w-12",
      render: (_: unknown, submission: ContactSubmission) => (
        <Checkbox
          checked={selectedSubmissions.includes(submission.id)}
          onCheckedChange={(checked) =>
            handleSubmissionSelection(submission.id, checked as boolean)
          }
        />
      ),
    },
    {
      key: "name" as keyof ContactSubmission,
      label: "Contact",
      sortable: true,
      render: (name: unknown, submission: ContactSubmission) => (
        <div className="space-y-1">
          <div className="font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            {String(name)}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Mail className="h-3 w-3" />
            {submission.email}
          </div>
          {submission.company && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Building className="h-3 w-3" />
              {submission.company}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "subject" as keyof ContactSubmission,
      label: "Subject & Message",
      render: (subject: unknown, submission: ContactSubmission) => (
        <div className="space-y-1 max-w-xs">
          <div className="font-medium line-clamp-1">
            {String(subject) || "No subject"}
          </div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {submission.message}
          </div>
        </div>
      ),
    },
    {
      key: "projectType" as keyof ContactSubmission,
      label: "Project Details",
      render: (projectType: unknown, submission: ContactSubmission) => (
        <div className="space-y-1">
          {submission.projectType && (
            <div className="text-sm flex items-center gap-2">
              <MessageSquare className="h-3 w-3 text-muted-foreground" />
              {formatProjectType(submission.projectType)}
            </div>
          )}
          {submission.budget && (
            <div className="text-sm flex items-center gap-2">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              {submission.budget}
            </div>
          )}
          {submission.timeline && (
            <div className="text-sm flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              {submission.timeline}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "status" as keyof ContactSubmission,
      label: "Status",
      sortable: true,
      render: (status: unknown) => (
        <SubmissionStatusBadge
          status={String(status) as "new" | "read" | "responded"}
        />
      ),
    },
    {
      key: "createdAt" as keyof ContactSubmission,
      label: "Submitted",
      sortable: true,
      render: (createdAt: unknown) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{formatDate(createdAt as string)}</span>
        </div>
      ),
    },
  ];

  // DataTable actions
  const actions = [
    {
      label: "View Details",
      onClick: (submission: ContactSubmission) => {
        router.push(`/admin/contact-submissions/${submission.id}`);
      },
    },
    {
      label: "Mark as Read",
      onClick: async (submission: ContactSubmission) => {
        try {
          const response = await fetch("/api/admin/contact-submissions", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: [submission.id], action: "mark-read" }),
          });
          const result = await response.json();
          if (result.success) {
            toast.success("Marked as read");
            refetch();
          }
        } catch {
          toast.error("Failed to update status");
        }
      },
    },
    {
      label: "Mark as Responded",
      onClick: async (submission: ContactSubmission) => {
        try {
          const response = await fetch("/api/admin/contact-submissions", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ids: [submission.id],
              action: "mark-responded",
            }),
          });
          const result = await response.json();
          if (result.success) {
            toast.success("Marked as responded");
            refetch();
          }
        } catch {
          toast.error("Failed to update status");
        }
      },
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page Header */}
      <PageHeader
        title="Contact Submissions"
        description="Manage and respond to customer inquiries and project requests."
        breadcrumbs={[
          {
            label: "Contact Submissions",
            href: "/admin/contact-submissions",
            active: true,
          },
        ]}
      />

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Submissions"
          value={totalSubmissions}
          icon={MessageSquare}
        />
        <StatsCard
          title="New"
          value={statusCounts.new}
          icon={Circle}
          className="border-blue-200"
        />
        <StatsCard
          title="Read"
          value={statusCounts.read}
          icon={Eye}
          className="border-yellow-200"
        />
        <StatsCard
          title="Responded"
          value={statusCounts.responded}
          icon={CheckCircle}
          className="border-green-200"
        />
      </div>

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
                  placeholder="Search submissions..."
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
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Project Type Filter */}
            <div>
              <Label htmlFor="projectType">Project Type</Label>
              <Select
                value={projectTypeFilter}
                onValueChange={setProjectTypeFilter}
              >
                <SelectTrigger id="projectType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="webDevelopment">
                    Web Development
                  </SelectItem>
                  <SelectItem value="mobileApp">Mobile App</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Budget Filter */}
            <div>
              <Label htmlFor="budget">Budget</Label>
              <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                <SelectTrigger id="budget">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Budgets</SelectItem>
                  <SelectItem value="under5k">Under $5,000</SelectItem>
                  <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                  <SelectItem value="15k-50k">$15,000 - $50,000</SelectItem>
                  <SelectItem value="over50k">Over $50,000</SelectItem>
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
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
                  <SelectItem value="status-asc">Status A-Z</SelectItem>
                  <SelectItem value="company-asc">Company A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
              />
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
      {selectedSubmissions.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedSubmissions.length === submissions.length}
                  onCheckedChange={handleSelectAllSubmissions}
                />
                <span className="text-sm font-medium">
                  {selectedSubmissions.length} of {submissions.length}{" "}
                  submission(s) selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("mark-read")}
                  disabled={isPerformingBulkAction}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Mark as Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("mark-responded")}
                  disabled={isPerformingBulkAction}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark as Responded
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
                        {selectedSubmissions.length} submission(s)? This action
                        cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleBulkAction("delete")}
                        disabled={isPerformingBulkAction}
                      >
                        Delete Submissions
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submissions Table */}
      <DataTable
        title={`Contact Submissions (${totalSubmissions})`}
        columns={columns}
        data={submissions}
        actions={actions}
        loading={isLoading}
        searchable={false} // We have custom search
        pagination={{
          page: currentPage,
          limit,
          total: totalSubmissions,
          onPageChange: setPage,
          onLimitChange: setLimit,
        }}
      />
    </div>
  );
}
