"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ServiceWithRelations } from "@/lib/types/service-with-relations.type";

/**
 * Edit service page - Phase 4.2 Implementation
 * Provides multi-step form interface for editing existing services
 */
export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const [service, setService] = useState<ServiceWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serviceId = params.id as string;

  // Fetch service data
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/services/${serviceId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch service");
        }

        const data = await response.json();
        if (data.success) {
          setService(data.data);
        } else {
          throw new Error(data.error || "Failed to fetch service");
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  // Handle cancel action
  const handleCancel = () => {
    router.push("/admin/services");
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full overflow-auto">
        <PageHeader
          title="Edit Service"
          description="Loading service..."
          breadcrumbs={[
            { label: "Services", href: "/admin/services" },
            { label: "Edit Service", active: true },
          ]}
        />
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading service...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full overflow-auto">
        <PageHeader
          title="Edit Service"
          description="Error loading service"
          breadcrumbs={[
            { label: "Services", href: "/admin/services" },
            { label: "Edit Service", active: true },
          ]}
          actions={
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Button>
          }
        />
        <div className="p-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // No service found
  if (!service) {
    return (
      <div className="h-full overflow-auto">
        <PageHeader
          title="Edit Service"
          description="Service not found"
          breadcrumbs={[
            { label: "Services", href: "/admin/services" },
            { label: "Edit Service", active: true },
          ]}
          actions={
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Button>
          }
        />
        <div className="p-6">
          <Alert>
            <AlertDescription>Service not found.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <PageHeader
        title={`Edit: ${service.title}`}
        description={
          service.status === "draft"
            ? "This service is currently in draft status. Make your changes and publish when ready."
            : "Modify and update your service information"
        }
        breadcrumbs={[
          { label: "Services", href: "/admin/services" },
          { label: service.title, href: `/admin/services/${serviceId}` },
          { label: "Edit", active: true },
        ]}
        badge={service.status.charAt(0).toUpperCase() + service.status.slice(1)}
        actions={
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Button>
        }
      />

      <div className="p-6">
        {/* Show welcome message for newly created draft services */}
        {service.status === "draft" && (
          <div className="mb-6">
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800">
                <strong>Welcome to your new AI-generated service!</strong> This
                service has been created as a draft. Review the content, upload
                a custom featured image, and make any adjustments before
                publishing.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <ServiceForm
          mode="edit"
          initialData={service}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
