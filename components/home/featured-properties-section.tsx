"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/ui/property-card";
import { getPropertiesByFilter } from "@/lib/data/featured-properties";
import { cn } from "@/lib/utils/cn";

type PropertyFilter =
  | "All Properties"
  | "Waterfront"
  | "New Listings"
  | "Price Reduced";

const FeaturedPropertiesSection = () => {
  const [activeFilter, setActiveFilter] =
    useState<PropertyFilter>("All Properties");

  const filters: PropertyFilter[] = [
    "All Properties",
    "Waterfront",
    "New Listings",
    "Price Reduced",
  ];

  const filteredProperties = getPropertiesByFilter(activeFilter);

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Featured Cape Coral Properties
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Handpicked homes representing the best of our current listings
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter)}
              size="lg"
              className={cn(
                "px-8 py-3 text-base font-semibold rounded-full",
                activeFilter === filter
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50"
              )}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {filteredProperties.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* View All Properties CTA */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl"
          >
            View All Properties
          </Button>
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-12 max-w-lg mx-auto shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No Properties Found
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We don&apos;t currently have any properties matching this
                filter.
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setActiveFilter("All Properties")}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-base font-semibold rounded-lg"
              >
                View All Properties
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export { FeaturedPropertiesSection };
