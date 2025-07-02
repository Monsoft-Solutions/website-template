"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";

interface BlogFiltersProps {
  categories: Array<{ name: string; slug: string; count: number }>;
  currentCategory?: string;
  currentSearch?: string;
  currentPage?: number;
  totalPages?: number;
}

export function BlogFilters({
  categories,
  currentCategory = "all",
  currentSearch = "",
  currentPage = 1,
  totalPages = 1,
}: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(currentSearch);

  // Update search value when currentSearch prop changes
  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  const createURL = (params: Record<string, string | undefined>) => {
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    // Always reset to page 1 when filtering changes
    if (params.category !== undefined || params.search !== undefined) {
      newSearchParams.delete("page");
    }

    return `${pathname}?${newSearchParams.toString()}`;
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);

    // Debounce search
    const timeoutId = setTimeout(() => {
      startTransition(() => {
        router.push(
          createURL({
            search: value,
            category: currentCategory === "all" ? undefined : currentCategory,
          })
        );
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleCategoryFilter = (categorySlug: string) => {
    startTransition(() => {
      router.push(
        createURL({
          category: categorySlug,
          search: currentSearch || undefined,
        })
      );
    });
  };

  const handleClearFilters = () => {
    setSearchValue("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const handlePageChange = (page: number) => {
    startTransition(() => {
      router.push(
        createURL({
          page: page.toString(),
          category: currentCategory === "all" ? undefined : currentCategory,
          search: currentSearch || undefined,
        })
      );
    });
  };

  const hasActiveFilters = currentCategory !== "all" || currentSearch !== "";

  return (
    <div className="space-y-6">
      {/* Search and Clear Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="pl-10"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            disabled={isPending}
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            disabled={isPending}
            className="gap-2"
          >
            <X className="size-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="size-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Categories:</span>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.slug}
              variant={
                category.slug === currentCategory ? "default" : "secondary"
              }
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => handleCategoryFilter(category.slug)}
            >
              {category.name} ({category.count})
            </Badge>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage <= 1 || isPending}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  size="sm"
                  disabled={isPending}
                  onClick={() => handlePageChange(pageNumber)}
                  className="w-10 h-10"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            disabled={currentPage >= totalPages || isPending}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Active filters:</span>
          {currentCategory !== "all" && (
            <Badge variant="outline" className="gap-1">
              Category:{" "}
              {categories.find((c) => c.slug === currentCategory)?.name}
              <X
                className="size-3 cursor-pointer hover:text-foreground"
                onClick={() => handleCategoryFilter("all")}
              />
            </Badge>
          )}
          {currentSearch && (
            <Badge variant="outline" className="gap-1">
              Search: {currentSearch}
              <X
                className="size-3 cursor-pointer hover:text-foreground"
                onClick={() => handleSearch("")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
