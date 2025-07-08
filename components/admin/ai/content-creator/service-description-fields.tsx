"use client";

import { FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormFieldWithError } from "./form-field-with-error";
import { DynamicArrayField } from "./dynamic-array-field";
import type { ServiceDescriptionFormData } from "@/lib/utils/ai-content-validation";

interface ServiceDescriptionFieldsProps {
  data: ServiceDescriptionFormData;
  onChange: (data: Partial<ServiceDescriptionFormData>) => void;
  errors: FieldErrors<ServiceDescriptionFormData>;
}

export function ServiceDescriptionFields({
  data,
  onChange,
  errors,
}: ServiceDescriptionFieldsProps) {
  return (
    <div className="space-y-4">
      <FormFieldWithError
        label="Service Name"
        error={errors.serviceName?.message}
        required
      >
        <Input
          placeholder="Enter the service name..."
          value={data.serviceName}
          onChange={(e) => onChange({ serviceName: e.target.value })}
          className={errors.serviceName ? "border-destructive" : ""}
        />
      </FormFieldWithError>

      <DynamicArrayField
        label="Service Features"
        placeholder="Enter a service feature..."
        values={data.serviceFeatures}
        onChange={(serviceFeatures) => onChange({ serviceFeatures })}
        error={errors.serviceFeatures?.message}
        required
        addButtonText="Add Feature"
      />

      <DynamicArrayField
        label="Service Benefits"
        placeholder="Enter a service benefit..."
        values={data.serviceBenefits}
        onChange={(serviceBenefits) => onChange({ serviceBenefits })}
        error={errors.serviceBenefits?.message}
        required
        addButtonText="Add Benefit"
      />

      <FormFieldWithError
        label="Target Audience"
        error={errors.serviceTargetAudience?.message}
        required
        description="Who is this service for?"
      >
        <Input
          placeholder="e.g., Small business owners, startups, developers..."
          value={data.serviceTargetAudience}
          onChange={(e) => onChange({ serviceTargetAudience: e.target.value })}
          className={errors.serviceTargetAudience ? "border-destructive" : ""}
        />
      </FormFieldWithError>

      <FormFieldWithError
        label="Industry"
        error={errors.serviceIndustry?.message}
        description="What industry does this service serve?"
      >
        <Input
          placeholder="e.g., Technology, Healthcare, Finance, E-commerce..."
          value={data.serviceIndustry || ""}
          onChange={(e) => onChange({ serviceIndustry: e.target.value })}
          className={errors.serviceIndustry ? "border-destructive" : ""}
        />
      </FormFieldWithError>

      <FormFieldWithError
        label="Competitive Advantage"
        error={errors.serviceCompetitiveAdvantage?.message}
        description="What makes this service unique or better than competitors?"
      >
        <Textarea
          placeholder="Describe what sets this service apart..."
          value={data.serviceCompetitiveAdvantage || ""}
          onChange={(e) =>
            onChange({ serviceCompetitiveAdvantage: e.target.value })
          }
          rows={3}
          className={
            errors.serviceCompetitiveAdvantage ? "border-destructive" : ""
          }
        />
      </FormFieldWithError>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="include-cta"
          checked={data.includeCallToAction}
          onCheckedChange={(checked) =>
            onChange({ includeCallToAction: checked as boolean })
          }
        />
        <Label htmlFor="include-cta" className="text-sm font-medium">
          Include call-to-action
        </Label>
      </div>
    </div>
  );
}
