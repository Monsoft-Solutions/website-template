"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

/**
 * Create new service page - Phase 4.2 Implementation
 * Provides multi-step form interface for creating new services
 */
export default function NewServicePage() {
  const router = useRouter();

  // Handle cancel action
  const handleCancel = () => {
    router.push("/admin/services");
  };

  return (
    <div className="h-full overflow-auto">
      <PageHeader
        title="Create New Service"
        description="Add a new service to your portfolio with detailed information"
        breadcrumbs={[
          { label: "Services", href: "/admin/services" },
          { label: "New Service", active: true },
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
        <ServiceForm mode="create" onCancel={handleCancel} />
      </div>
    </div>
  );
}
