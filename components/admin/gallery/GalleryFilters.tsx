"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";
import { useAdminGalleryGroups } from "@/lib/hooks/use-admin-gallery-groups.hook";

interface GalleryFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedGroup: string;
  onGroupChange: (groupId: string) => void;
  availabilityFilter: string;
  onAvailabilityFilterChange: (filter: string) => void;
  className?: string;
}

/**
 * Gallery filters component for admin interface
 * Provides search, group filtering, and availability filtering
 */
export function GalleryFilters({
  searchTerm,
  onSearchChange,
  selectedGroup,
  onGroupChange,
  availabilityFilter,
  onAvailabilityFilterChange,
  className,
}: GalleryFiltersProps) {
  const { groups } = useAdminGalleryGroups();

  const handleClearFilters = () => {
    onSearchChange("");
    onGroupChange("");
    onAvailabilityFilterChange("");
  };

  const hasActiveFilters =
    searchTerm !== "" || selectedGroup !== "" || availabilityFilter !== "";

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Group Filter */}
          <Select
            value={selectedGroup || "all"}
            onValueChange={(value) =>
              onGroupChange(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All groups</SelectItem>
              {Array.isArray(groups) &&
                groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Availability Filter */}
          <Select
            value={availabilityFilter || "all"}
            onValueChange={(value) =>
              onAvailabilityFilterChange(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All images" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All images</SelectItem>
              <SelectItem value="true">Available only</SelectItem>
              <SelectItem value="false">Hidden only</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                <Search className="h-3 w-3" />
                Search: &quot;{searchTerm}&quot;
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSearchChange("")}
                  className="h-auto p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {selectedGroup && (
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                <Filter className="h-3 w-3" />
                Group:{" "}
                {Array.isArray(groups)
                  ? groups.find((g) => g.id === selectedGroup)?.name ||
                    selectedGroup
                  : selectedGroup}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onGroupChange("")}
                  className="h-auto p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {availabilityFilter && (
              <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                <Filter className="h-3 w-3" />
                Status: {availabilityFilter === "true" ? "Available" : "Hidden"}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onAvailabilityFilterChange("")}
                  className="h-auto p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
