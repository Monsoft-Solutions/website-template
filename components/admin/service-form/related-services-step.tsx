"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, X, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import type { RelatedServicesStepProps } from "./types";

interface Service {
  id: string;
  title: string;
  slug: string;
  category: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

interface AdminServicesListResponse {
  services: Service[];
  totalServices: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const RelatedServicesStep = ({
  form,
  currentServiceId,
}: RelatedServicesStepProps) => {
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  const selectedServices = form.watch("relatedServices") || [];

  // Fetch available services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/services?limit=100");
        const result: ApiResponse<AdminServicesListResponse> =
          await response.json();

        if (result.success) {
          // Convert to the format we need and exclude current service if editing
          const services = result.data.services
            .filter((service) => service.id !== currentServiceId)
            .map((service) => ({
              id: service.id,
              title: service.title,
              slug: service.slug,
              category: service.category,
            }));
          setAvailableServices(services);
          setFilteredServices(services);
        } else {
          toast.error("Failed to load services");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to load services");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [currentServiceId]);

  // Filter services based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredServices(availableServices);
    } else {
      const filtered = availableServices.filter(
        (service) =>
          service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchQuery, availableServices]);

  // Add a service to related services
  const addService = (serviceId: string) => {
    const currentServices = form.getValues("relatedServices") || [];
    if (!currentServices.includes(serviceId)) {
      form.setValue("relatedServices", [...currentServices, serviceId]);
    }
  };

  // Remove a service from related services
  const removeService = (serviceId: string) => {
    const currentServices = form.getValues("relatedServices") || [];
    const updatedServices = currentServices.filter((id) => id !== serviceId);
    form.setValue("relatedServices", updatedServices);
  };

  // Get service details by ID
  const getServiceById = (serviceId: string) => {
    return availableServices.find((service) => service.id === serviceId);
  };

  // Get services that can be added (not already selected)
  const getAvailableServicesForSelection = () => {
    return filteredServices.filter(
      (service) => !selectedServices.includes(service.id)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Services</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select services that are related to this service. These will be shown
          as suggestions to customers.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Services */}
        {selectedServices.length > 0 && (
          <div>
            <Label className="text-sm font-medium">
              Selected Related Services
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedServices.map((serviceId) => {
                const service = getServiceById(serviceId);
                if (!service) return null;

                return (
                  <Badge
                    key={serviceId}
                    variant="secondary"
                    className="flex items-center gap-2 pr-1"
                  >
                    <span>{service.title}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeService(serviceId)}
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Search Services */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services to add..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Available Services */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading services...</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getAvailableServicesForSelection().length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery
                    ? "No services found matching your search."
                    : "No more services available to add."}
                </div>
              ) : (
                getAvailableServicesForSelection().map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{service.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {service.category}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addService(service.id)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Info Message */}
        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <strong>Note:</strong> Related services help customers discover
          additional services that complement this one. They will be displayed
          on the service detail page.
        </div>
      </CardContent>
    </Card>
  );
};
