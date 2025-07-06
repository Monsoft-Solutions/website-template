"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import type { ServiceWithRelations } from "@/lib/types/service-with-relations.type";
import type { UseFormReturn } from "react-hook-form";
import {
  ServiceImageUploader,
  ServiceGalleryUploader,
  TestimonialAvatarUploader,
} from "@/components/admin/service-form";

// Form validation schema
const serviceFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  fullDescription: z.string().min(1, "Full description is required"),
  timeline: z.string().min(1, "Timeline is required"),
  category: z.enum([
    "Development",
    "Design",
    "Consulting",
    "Marketing",
    "Support",
  ]),
  featuredImage: z.string().min(1, "Featured image is required"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  benefits: z.array(z.string()).min(1, "At least one benefit is required"),
  technologies: z
    .array(z.string())
    .min(1, "At least one technology is required"),
  deliverables: z
    .array(z.string())
    .min(1, "At least one deliverable is required"),
  gallery: z.array(z.string()).optional(),
  faq: z
    .array(
      z.object({
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
      })
    )
    .optional(),
  process: z
    .array(
      z.object({
        step: z.number(),
        title: z.string().min(1, "Step title is required"),
        description: z.string().min(1, "Step description is required"),
        duration: z.string().optional(),
      })
    )
    .optional(),
  pricing: z
    .array(
      z.object({
        name: z.string().min(1, "Pricing tier name is required"),
        price: z.string().min(1, "Price is required"),
        description: z.string().min(1, "Description is required"),
        popular: z.boolean().optional(),
        features: z
          .array(z.string())
          .min(1, "At least one feature is required"),
      })
    )
    .optional(),
  testimonials: z
    .array(
      z.object({
        quote: z.string().min(1, "Quote is required"),
        author: z.string().min(1, "Author is required"),
        company: z.string().min(1, "Company is required"),
        avatar: z.string().optional(),
      })
    )
    .optional(),
  relatedServices: z.array(z.string()).optional(),
});

type ServiceFormData = z.infer<typeof serviceFormSchema>;

// Step component props type
interface StepProps {
  form: UseFormReturn<ServiceFormData>;
}

// Basic information step props
interface BasicInformationStepProps extends StepProps {
  onTitleChange: (value: string) => void;
}

interface ServiceFormProps {
  initialData?: ServiceWithRelations;
  mode: "create" | "edit";
  onCancel: () => void;
  className?: string;
}

const STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "Service title, description, and category",
  },
  {
    id: 2,
    title: "Features & Benefits",
    description: "Key features and benefits of the service",
  },
  {
    id: 3,
    title: "Process & Timeline",
    description: "Service delivery process and timeline",
  },
  {
    id: 4,
    title: "Pricing Tiers",
    description: "Service pricing options and packages",
  },
  { id: 5, title: "Technologies", description: "Technologies and tools used" },
  {
    id: 6,
    title: "Gallery & Media",
    description: "Service gallery images and media",
  },
  { id: 7, title: "FAQs", description: "Frequently asked questions" },
  {
    id: 8,
    title: "Testimonials",
    description: "Customer testimonials and reviews",
  },
];

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
      relatedServices: initialData?.relatedServices || [],
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

// Step Components
const BasicInformationStep = ({
  form,
  onTitleChange,
}: BasicInformationStepProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Basic Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...form.register("title")}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter service title"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            {...form.register("slug")}
            placeholder="service-slug"
          />
          {form.formState.errors.slug && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.slug.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="shortDescription">Short Description *</Label>
        <Textarea
          id="shortDescription"
          {...form.register("shortDescription")}
          placeholder="Brief description of the service"
          rows={3}
        />
        {form.formState.errors.shortDescription && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.shortDescription.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="fullDescription">Full Description *</Label>
        <Textarea
          id="fullDescription"
          {...form.register("fullDescription")}
          placeholder="Detailed description of the service"
          rows={5}
        />
        {form.formState.errors.fullDescription && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.fullDescription.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="timeline">Timeline *</Label>
          <Input
            id="timeline"
            {...form.register("timeline")}
            placeholder="e.g., 2-4 weeks"
          />
          {form.formState.errors.timeline && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.timeline.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Controller
            name="category"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Consulting">Consulting</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.category && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.category.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <Label>Featured Image *</Label>
        <ServiceImageUploader
          value={form.watch("featuredImage")}
          onChange={(value) => form.setValue("featuredImage", value)}
          error={form.formState.errors.featuredImage?.message}
          label="Featured Image"
          placeholder="https://example.com/service-image.jpg"
        />
      </div>
    </CardContent>
  </Card>
);

const FeaturesAndBenefitsStep = ({ form }: StepProps) => {
  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control: form.control,
    name: "features",
  } as any);

  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({
    control: form.control,
    name: "benefits",
  } as any);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Features & Benefits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Features Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium">Features *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendFeature("")}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </Button>
          </div>
          <div className="space-y-3">
            {featureFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  {...form.register(`features.${index}`)}
                  placeholder={`Feature ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeFeature(index)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.features && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.features.message}
            </p>
          )}
        </div>

        {/* Benefits Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium">Benefits *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendBenefit("")}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Benefit
            </Button>
          </div>
          <div className="space-y-3">
            {benefitFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  {...form.register(`benefits.${index}`)}
                  placeholder={`Benefit ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeBenefit(index)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.benefits && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.benefits.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ProcessAndTimelineStep = ({ form }: StepProps) => {
  const {
    fields: processFields,
    append: appendProcess,
    remove: removeProcess,
  } = useFieldArray({
    control: form.control,
    name: "process",
  });

  const {
    fields: deliverableFields,
    append: appendDeliverable,
    remove: removeDeliverable,
  } = useFieldArray({
    control: form.control,
    name: "deliverables",
  } as any);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Process & Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Process Steps Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium">Process Steps</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendProcess({
                  step: processFields.length + 1,
                  title: "",
                  description: "",
                  duration: "",
                })
              }
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Step
            </Button>
          </div>
          <div className="space-y-4">
            {processFields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">
                    Step {index + 1}
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeProcess(index)}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`process.${index}.title`}>Title *</Label>
                    <Input
                      id={`process.${index}.title`}
                      {...form.register(`process.${index}.title`)}
                      placeholder="Step title"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`process.${index}.duration`}>
                      Duration
                    </Label>
                    <Input
                      id={`process.${index}.duration`}
                      {...form.register(`process.${index}.duration`)}
                      placeholder="e.g., 1-2 days"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <Label htmlFor={`process.${index}.description`}>
                    Description *
                  </Label>
                  <Textarea
                    id={`process.${index}.description`}
                    {...form.register(`process.${index}.description`)}
                    placeholder="Step description"
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium">Deliverables *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendDeliverable("")}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Deliverable
            </Button>
          </div>
          <div className="space-y-3">
            {deliverableFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  {...form.register(`deliverables.${index}`)}
                  placeholder={`Deliverable ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeDeliverable(index)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.deliverables && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.deliverables.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const PricingTiersStep = ({ form }: StepProps) => {
  const {
    fields: pricingFields,
    append: appendPricing,
    remove: removePricing,
  } = useFieldArray({
    control: form.control,
    name: "pricing",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Tiers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-medium">Pricing Options</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendPricing({
                name: "",
                price: "",
                description: "",
                popular: false,
                features: [],
              })
            }
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Pricing Tier
          </Button>
        </div>
        <div className="space-y-6">
          {pricingFields.map((field, index) => (
            <PricingTierCard
              key={field.id}
              form={form}
              index={index}
              onRemove={() => removePricing(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const PricingTierCard = ({
  form,
  index,
  onRemove,
}: {
  form: UseFormReturn<ServiceFormData>;
  index: number;
  onRemove: () => void;
}) => {
  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control: form.control,
    name: `pricing.${index}.features` as any,
  });

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <Label className="text-sm font-medium">Pricing Tier {index + 1}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="flex items-center gap-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`pricing.${index}.name`}>Name *</Label>
            <Input
              id={`pricing.${index}.name`}
              {...form.register(`pricing.${index}.name`)}
              placeholder="e.g., Basic, Premium"
            />
          </div>
          <div>
            <Label htmlFor={`pricing.${index}.price`}>Price *</Label>
            <Input
              id={`pricing.${index}.price`}
              {...form.register(`pricing.${index}.price`)}
              placeholder="e.g., $999"
            />
          </div>
        </div>
        <div>
          <Label htmlFor={`pricing.${index}.description`}>Description *</Label>
          <Textarea
            id={`pricing.${index}.description`}
            {...form.register(`pricing.${index}.description`)}
            placeholder="Brief description of this pricing tier"
            rows={3}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Controller
            name={`pricing.${index}.popular`}
            control={form.control}
            render={({ field }) => (
              <Checkbox
                id={`pricing.${index}.popular`}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor={`pricing.${index}.popular`}>Mark as popular</Label>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Features *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendFeature("")}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </Button>
          </div>
          <div className="space-y-2">
            {featureFields.map((featureField, featureIndex) => (
              <div key={featureField.id} className="flex items-center gap-2">
                <Input
                  {...form.register(
                    `pricing.${index}.features.${featureIndex}`
                  )}
                  placeholder={`Feature ${featureIndex + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeFeature(featureIndex)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TechnologiesStep = ({ form }: StepProps) => {
  const {
    fields: technologyFields,
    append: appendTechnology,
    remove: removeTechnology,
  } = useFieldArray({
    control: form.control,
    name: "technologies",
  } as any);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technologies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-medium">Technologies Used *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendTechnology("" as any)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Technology
          </Button>
        </div>
        <div className="space-y-3">
          {technologyFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                {...form.register(`technologies.${index}`)}
                placeholder={`Technology ${index + 1}`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeTechnology(index)}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        {form.formState.errors.technologies && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.technologies.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const GalleryAndMediaStep = ({ form }: StepProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery & Media</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-base font-medium">Gallery Images</Label>
          <ServiceGalleryUploader
            value={form.watch("gallery") || []}
            onChange={(value) => form.setValue("gallery", value)}
            error={form.formState.errors.gallery?.message}
            maxImages={15}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const FAQsStep = ({ form }: StepProps) => {
  const {
    fields: faqFields,
    append: appendFAQ,
    remove: removeFAQ,
  } = useFieldArray({
    control: form.control,
    name: "faq",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>FAQs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-medium">
            Frequently Asked Questions
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendFAQ({ question: "", answer: "" })}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </Button>
        </div>
        <div className="space-y-4">
          {faqFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">FAQ {index + 1}</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeFAQ(index)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor={`faq.${index}.question`}>Question *</Label>
                  <Input
                    id={`faq.${index}.question`}
                    {...form.register(`faq.${index}.question`)}
                    placeholder="Enter question"
                  />
                </div>
                <div>
                  <Label htmlFor={`faq.${index}.answer`}>Answer *</Label>
                  <Textarea
                    id={`faq.${index}.answer`}
                    {...form.register(`faq.${index}.answer`)}
                    placeholder="Enter answer"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const TestimonialsStep = ({ form }: StepProps) => {
  const {
    fields: testimonialFields,
    append: appendTestimonial,
    remove: removeTestimonial,
  } = useFieldArray({
    control: form.control,
    name: "testimonials",
  } as any);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Testimonials</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-medium">Customer Testimonials</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendTestimonial({
                quote: "",
                author: "",
                company: "",
                avatar: "",
              } as any)
            }
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Button>
        </div>

        <div className="space-y-6">
          {testimonialFields.map((field, index) => (
            <TestimonialCard
              key={field.id}
              form={form}
              index={index}
              onRemove={() => removeTestimonial(index)}
            />
          ))}
        </div>

        {testimonialFields.length === 0 && (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No testimonials added</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add customer testimonials to showcase your service quality
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TestimonialCard = ({
  form,
  index,
  onRemove,
}: {
  form: UseFormReturn<ServiceFormData>;
  index: number;
  onRemove: () => void;
}) => {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Label className="text-base font-medium">Testimonial {index + 1}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Remove
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor={`testimonials.${index}.quote`}>Quote *</Label>
          <Textarea
            id={`testimonials.${index}.quote`}
            {...form.register(`testimonials.${index}.quote`)}
            placeholder="Enter the testimonial quote"
            rows={4}
          />
          {form.formState.errors.testimonials?.[index]?.quote && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.testimonials[index]?.quote?.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`testimonials.${index}.author`}>Author *</Label>
            <Input
              id={`testimonials.${index}.author`}
              {...form.register(`testimonials.${index}.author`)}
              placeholder="Author name"
            />
            {form.formState.errors.testimonials?.[index]?.author && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.testimonials[index]?.author?.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor={`testimonials.${index}.company`}>Company *</Label>
            <Input
              id={`testimonials.${index}.company`}
              {...form.register(`testimonials.${index}.company`)}
              placeholder="Company name"
            />
            {form.formState.errors.testimonials?.[index]?.company && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.testimonials[index]?.company?.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>Avatar Image</Label>
          <TestimonialAvatarUploader
            value={form.watch(`testimonials.${index}.avatar`) || ""}
            onChange={(value) =>
              form.setValue(`testimonials.${index}.avatar`, value)
            }
            error={form.formState.errors.testimonials?.[index]?.avatar?.message}
            uniqueId={`testimonial-avatar-upload-${index}`}
          />
        </div>
      </div>
    </div>
  );
};
