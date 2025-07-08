"use client";

import { useState } from "react";
import { RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormFieldWithError } from "./form-field-with-error";
import { DynamicArrayField } from "./dynamic-array-field";
import { toast } from "sonner";
import type {
  ContentType,
  ContentGenerationRequest,
} from "@/lib/types/ai/content-generation.type";

const contentTypes = [
  {
    value: "blog-post" as const,
    label: "Blog Post",
    description: "Generate a complete blog post with SEO optimization",
  },
  {
    value: "service-description" as const,
    label: "Service Description",
    description: "Create compelling service descriptions",
  },
  {
    value: "page-content" as const,
    label: "Page Content",
    description: "Generate content for web pages",
  },
  {
    value: "email-template" as const,
    label: "Email Template",
    description: "Create professional email templates",
  },
  {
    value: "marketing-copy" as const,
    label: "Marketing Copy",
    description: "Generate persuasive marketing content",
  },
];

const tones = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "technical", label: "Technical" },
  { value: "friendly", label: "Friendly" },
  { value: "persuasive", label: "Persuasive" },
  { value: "authoritative", label: "Authoritative" },
];

const lengths = [
  { value: "short", label: "Short (300-500 words)" },
  { value: "medium", label: "Medium (500-1000 words)" },
  { value: "long", label: "Long (1000+ words)" },
];

const pageTypes = [
  { value: "homepage", label: "Homepage" },
  { value: "about", label: "About Page" },
  { value: "contact", label: "Contact Page" },
  { value: "landing", label: "Landing Page" },
  { value: "product", label: "Product Page" },
  { value: "general", label: "General Content" },
];

const marketingCopyTypes = [
  { value: "headline", label: "Headline" },
  { value: "social-post", label: "Social Media Post" },
  { value: "ad-copy", label: "Advertisement Copy" },
  { value: "landing-page", label: "Landing Page Copy" },
];

interface ContentConfigurationPanelProps {
  onGenerate: (request: ContentGenerationRequest) => Promise<void>;
  isGenerating: boolean;
  progress: number;
}

export function ContentConfigurationPanel({
  onGenerate,
  isGenerating,
  progress,
}: ContentConfigurationPanelProps) {
  const [contentType, setContentType] = useState<ContentType>("blog-post");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState<
    | "professional"
    | "casual"
    | "technical"
    | "friendly"
    | "persuasive"
    | "authoritative"
  >("professional");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [audience, setAudience] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");

  // Page content specific
  const [pageType, setPageType] = useState<
    "homepage" | "about" | "contact" | "landing" | "product" | "general"
  >("general");

  // Service description specific
  const [serviceName, setServiceName] = useState("");
  const [serviceFeatures, setServiceFeatures] = useState<string[]>([""]);
  const [serviceBenefits, setServiceBenefits] = useState<string[]>([""]);
  const [serviceTargetAudience, setServiceTargetAudience] = useState("");
  const [serviceIndustry, setServiceIndustry] = useState("");
  const [serviceCompetitiveAdvantage, setServiceCompetitiveAdvantage] =
    useState("");
  const [includeCallToAction, setIncludeCallToAction] = useState(false);

  // Email template specific
  const [includeSubject, setIncludeSubject] = useState(true);

  // Marketing copy specific
  const [marketingCopyType, setMarketingCopyType] = useState<
    "headline" | "social-post" | "ad-copy" | "landing-page"
  >("landing-page");
  const [keyBenefits, setKeyBenefits] = useState<string[]>([""]);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validation - only for non-service content types
    if (contentType !== "service-description") {
      if (!topic.trim()) {
        newErrors.topic = "Topic is required";
      } else if (topic.trim().length < 3) {
        newErrors.topic = "Topic must be at least 3 characters";
      }
    }

    // Content type specific validation
    if (contentType === "service-description") {
      if (!serviceName.trim()) {
        newErrors.serviceName = "Service name is required";
      }
      if (!serviceTargetAudience.trim()) {
        newErrors.serviceTargetAudience = "Target audience is required";
      }
      if (serviceFeatures.filter((f) => f.trim()).length === 0) {
        newErrors.serviceFeatures = "Please add at least one service feature";
      }
      if (serviceBenefits.filter((b) => b.trim()).length === 0) {
        newErrors.serviceBenefits = "Please add at least one service benefit";
      }
    }

    if (
      (contentType === "email-template" || contentType === "marketing-copy") &&
      !audience.trim()
    ) {
      newErrors.audience = "Target audience is required";
    }

    // Debug logging
    console.log("Validation for content type:", contentType);
    console.log("Validation errors found:", newErrors);
    console.log("Form data:", {
      topic: topic.trim(),
      serviceName: serviceName.trim(),
      serviceTargetAudience: serviceTargetAudience.trim(),
      serviceFeatures: serviceFeatures.filter((f) => f.trim()),
      serviceBenefits: serviceBenefits.filter((b) => b.trim()),
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setTopic("");
    setKeywords("");
    setAudience("");
    setCustomInstructions("");
    setServiceName("");
    setServiceFeatures([""]);
    setServiceBenefits([""]);
    setServiceTargetAudience("");
    setServiceIndustry("");
    setServiceCompetitiveAdvantage("");
    setKeyBenefits([""]);
    setErrors({});
  };

  const handleContentTypeChange = (newType: ContentType) => {
    setContentType(newType);
    resetForm();
  };

  const handleGenerate = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      const keywordArray = keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const request: ContentGenerationRequest = {
        type: contentType,
        topic:
          contentType === "service-description"
            ? serviceName.trim()
            : topic.trim(),
        keywords: keywordArray,
        tone,
        length,
        audience: audience.trim() || undefined,
        customInstructions: customInstructions.trim() || undefined,
      };

      // Add content-type specific fields
      if (contentType === "service-description") {
        request.service = {
          name: serviceName.trim(),
          features: serviceFeatures
            .filter((f) => f.trim())
            .map((f) => f.trim()),
          benefits: serviceBenefits
            .filter((b) => b.trim())
            .map((b) => b.trim()),
          targetAudience: serviceTargetAudience.trim(),
          industry: serviceIndustry.trim() || undefined,
          competitiveAdvantage: serviceCompetitiveAdvantage.trim() || undefined,
        };
        request.includeCallToAction = includeCallToAction;
      } else if (contentType === "page-content") {
        request.pageType = pageType;
      } else if (contentType === "email-template") {
        request.includeSubject = includeSubject;
      } else if (contentType === "marketing-copy") {
        request.copyType = marketingCopyType;
        request.keyBenefits = keyBenefits
          .filter((b) => b.trim())
          .map((b) => b.trim());
      }

      await onGenerate(request);
      toast.success("Content generated successfully!");
    } catch (error) {
      toast.error("Failed to generate content");
      console.error("Error generating content:", error);
    }
  };

  const selectedContentType = contentTypes.find(
    (ct) => ct.value === contentType
  );

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Content Type Selection */}
      <FormFieldWithError label="Content Type">
        <Select value={contentType} onValueChange={handleContentTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            {contentTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex flex-col">
                  <span>{type.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {type.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedContentType && (
          <p className="text-xs text-muted-foreground">
            {selectedContentType.description}
          </p>
        )}
      </FormFieldWithError>

      {/* Content-specific fields */}
      <div className="flex-1 overflow-auto space-y-4">
        {/* Service-specific fields */}
        {contentType === "service-description" && (
          <>
            <FormFieldWithError
              label="Service Name"
              error={errors.serviceName}
              required
            >
              <Input
                placeholder="Enter the service name..."
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className={errors.serviceName ? "border-destructive" : ""}
              />
            </FormFieldWithError>

            <DynamicArrayField
              label="Service Features"
              placeholder="Enter a service feature..."
              values={serviceFeatures}
              onChange={setServiceFeatures}
              error={errors.serviceFeatures}
              required
              addButtonText="Add Feature"
            />

            <DynamicArrayField
              label="Service Benefits"
              placeholder="Enter a service benefit..."
              values={serviceBenefits}
              onChange={setServiceBenefits}
              error={errors.serviceBenefits}
              required
              addButtonText="Add Benefit"
            />

            <FormFieldWithError
              label="Target Audience"
              error={errors.serviceTargetAudience}
              required
              description="Who is this service for?"
            >
              <Input
                placeholder="e.g., Small business owners, startups, developers..."
                value={serviceTargetAudience}
                onChange={(e) => setServiceTargetAudience(e.target.value)}
                className={
                  errors.serviceTargetAudience ? "border-destructive" : ""
                }
              />
            </FormFieldWithError>

            <FormFieldWithError
              label="Industry"
              description="What industry does this service serve?"
            >
              <Input
                placeholder="e.g., Technology, Healthcare, Finance, E-commerce..."
                value={serviceIndustry}
                onChange={(e) => setServiceIndustry(e.target.value)}
              />
            </FormFieldWithError>

            <FormFieldWithError
              label="Competitive Advantage"
              description="What makes this service unique?"
            >
              <Textarea
                placeholder="Describe what sets this service apart..."
                value={serviceCompetitiveAdvantage}
                onChange={(e) => setServiceCompetitiveAdvantage(e.target.value)}
                rows={3}
              />
            </FormFieldWithError>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-cta"
                checked={includeCallToAction}
                onCheckedChange={(checked) =>
                  setIncludeCallToAction(checked as boolean)
                }
              />
              <Label htmlFor="include-cta" className="text-sm font-medium">
                Include call-to-action
              </Label>
            </div>
          </>
        )}

        {/* General topic field (for non-service content) */}
        {contentType !== "service-description" && (
          <FormFieldWithError
            label={
              contentType === "email-template"
                ? "Email Purpose"
                : contentType === "marketing-copy"
                ? "Product/Service"
                : "Topic"
            }
            error={errors.topic}
            required
          >
            <Input
              placeholder={
                contentType === "email-template"
                  ? "e.g., Welcome new users, Promote a sale..."
                  : contentType === "marketing-copy"
                  ? "e.g., Web design service, E-commerce platform..."
                  : "Enter your content topic..."
              }
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={errors.topic ? "border-destructive" : ""}
            />
          </FormFieldWithError>
        )}

        {/* Page type for page content */}
        {contentType === "page-content" && (
          <FormFieldWithError label="Page Type">
            <Select
              value={pageType}
              onValueChange={(value) => setPageType(value as typeof pageType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWithError>
        )}

        {/* Marketing copy type */}
        {contentType === "marketing-copy" && (
          <FormFieldWithError label="Copy Type">
            <Select
              value={marketingCopyType}
              onValueChange={(value) =>
                setMarketingCopyType(value as typeof marketingCopyType)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {marketingCopyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWithError>
        )}

        {/* Keywords (for blog posts and page content) */}
        {(contentType === "blog-post" || contentType === "page-content") && (
          <FormFieldWithError
            label="Keywords"
            description="Enter keywords separated by commas (optional)"
          >
            <Input
              placeholder="keyword1, keyword2, keyword3..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </FormFieldWithError>
        )}

        {/* Key benefits for marketing copy */}
        {contentType === "marketing-copy" && (
          <DynamicArrayField
            label="Key Benefits"
            placeholder="Enter a key benefit..."
            values={keyBenefits}
            onChange={setKeyBenefits}
            maxItems={8}
            addButtonText="Add Benefit"
          />
        )}

        {/* Shared configuration fields */}
        <div className="grid grid-cols-2 gap-4">
          <FormFieldWithError label="Tone">
            <Select
              value={tone}
              onValueChange={(value) => setTone(value as typeof tone)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWithError>

          <FormFieldWithError label="Length">
            <Select
              value={length}
              onValueChange={(value) => setLength(value as typeof length)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {lengths.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWithError>
        </div>

        {/* Target Audience (conditional based on content type) */}
        {contentType !== "service-description" && (
          <FormFieldWithError
            label="Target Audience"
            error={errors.audience}
            required={
              contentType === "email-template" ||
              contentType === "marketing-copy"
            }
            description="Who is your target audience?"
          >
            <Input
              placeholder="e.g., Small business owners, developers, marketing professionals..."
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className={errors.audience ? "border-destructive" : ""}
            />
          </FormFieldWithError>
        )}

        {/* Email template options */}
        {contentType === "email-template" && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-subject"
              checked={includeSubject}
              onCheckedChange={(checked) =>
                setIncludeSubject(checked as boolean)
              }
            />
            <Label htmlFor="include-subject" className="text-sm font-medium">
              Include email subject line
            </Label>
          </div>
        )}

        {/* Custom Instructions */}
        <FormFieldWithError
          label="Custom Instructions"
          description="Any specific requirements or style preferences (optional)"
        >
          <Textarea
            placeholder="e.g., Include statistics, focus on benefits, use a conversational tone..."
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            rows={3}
          />
        </FormFieldWithError>
      </div>

      {/* Generate Button */}
      <div className="space-y-4">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Generate Content
            </>
          )}
        </Button>

        {/* Progress */}
        {isGenerating && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-center text-muted-foreground">
              Generating your content...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
