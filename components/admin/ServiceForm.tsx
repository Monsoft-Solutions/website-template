"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import type { ServiceWithRelations } from "@/lib/types/service-with-relations.type";
import {
  BasicInformationStep,
  FeaturesAndBenefitsStep,
  ProcessAndTimelineStep,
  PricingTiersStep,
  TechnologiesStep,
  GalleryAndMediaStep,
  FAQsStep,
  TestimonialsStep,
  RelatedServicesStep,
  serviceFormSchema,
  STEPS,
  type ServiceFormData,
} from "@/components/admin/service-form";

interface ServiceFormProps {
  initialData?: ServiceWithRelations;
  mode: "create" | "edit";
  onCancel: () => void;
  className?: string;
}

/**
 * Multi-step service form component
 */
export function ServiceForm({
  initialData,
  mode,
  onCancel,
  className,
}: ServiceFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize form with React Hook Form
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      shortDescription: initialData?.shortDescription || "",
      fullDescription: initialData?.fullDescription || "",
      timeline: initialData?.timeline || "",
      category: initialData?.category || "Development",
      featuredImage: initialData?.featuredImage || "",
      features: initialData?.features || [],
      benefits: initialData?.benefits || [],
      technologies: initialData?.technologies || [],
      deliverables: initialData?.deliverables || [],
      gallery: initialData?.gallery || [],
      faq: initialData?.faq || [],
      process: initialData?.process || [],
      pricing: initialData?.pricing || [],
      testimonials: initialData?.testimonials || [],
      relatedServices:
        initialData?.relatedServices?.map((rs) =>
          typeof rs === "string" ? rs : rs.id
        ) || [],
      status: initialData?.status || "published",
    },
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Handle title change to auto-generate slug
  const handleTitleChange = (value: string) => {
    form.setValue("title", value);
    if (mode === "create") {
      const slug = generateSlug(value);
      form.setValue("slug", slug);
    }
  };

  // Handle form submission
  const onSubmit = async (data: ServiceFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const url =
        mode === "create"
          ? "/api/admin/services"
          : `/api/admin/services/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          mode === "create"
            ? "Service created successfully!"
            : "Service updated successfully!"
        );
        setTimeout(() => {
          router.push("/admin/services");
        }, 1500);
      } else {
        throw new Error(result.error || "Failed to save service");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInformationStep form={form} onTitleChange={handleTitleChange} />
        );
      case 2:
        return <FeaturesAndBenefitsStep form={form} />;
      case 3:
        return <ProcessAndTimelineStep form={form} />;
      case 4:
        return <PricingTiersStep form={form} />;
      case 5:
        return <TechnologiesStep form={form} />;
      case 6:
        return <GalleryAndMediaStep form={form} />;
      case 7:
        return <FAQsStep form={form} />;
      case 8:
        return <TestimonialsStep form={form} />;
      case 9:
        return (
          <RelatedServicesStep form={form} currentServiceId={initialData?.id} />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("max-w-6xl mx-auto", className)}>
      {/* Error Message */}
      {submitError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {/* Step Navigation */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                Step {currentStep} of {STEPS.length}:{" "}
                {STEPS[currentStep - 1].title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {STEPS[currentStep - 1].description}
              </p>
            </div>
            <Badge variant="outline">
              {currentStep}/{STEPS.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {STEPS.map((step) => (
              <Button
                key={step.id}
                type="button"
                variant={
                  step.id === currentStep
                    ? "default"
                    : step.id < currentStep
                    ? "secondary"
                    : "outline"
                }
                size="sm"
                onClick={() => goToStep(step.id)}
                className="flex items-center gap-2"
              >
                {step.id < currentStep ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span className="w-3 h-3 rounded-full bg-current" />
                )}
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.id}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>

          <div className="flex gap-2">
            {currentStep < STEPS.length ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {mode === "create" ? "Create Service" : "Update Service"}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
