"use client";

import { FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormFieldWithError } from "./form-field-with-error";
import { DynamicArrayField } from "./dynamic-array-field";
import type { MarketingCopyFormData } from "@/lib/utils/ai-content-validation";

const marketingCopyTypes = [
  { value: "headline", label: "Headline" },
  { value: "social-post", label: "Social Media Post" },
  { value: "ad-copy", label: "Advertisement Copy" },
  { value: "landing-page", label: "Landing Page Copy" },
];

interface MarketingCopyFieldsProps {
  data: MarketingCopyFormData;
  onChange: (data: Partial<MarketingCopyFormData>) => void;
  errors: FieldErrors<MarketingCopyFormData>;
}

export function MarketingCopyFields({
  data,
  onChange,
  errors,
}: MarketingCopyFieldsProps) {
  return (
    <div className="space-y-4">
      <FormFieldWithError
        label="Product/Service"
        error={errors.topic?.message}
        required
        description="What are you promoting?"
      >
        <Input
          placeholder="e.g., Web design service, E-commerce platform, Mobile app..."
          value={data.topic}
          onChange={(e) => onChange({ topic: e.target.value })}
          className={errors.topic ? "border-destructive" : ""}
        />
      </FormFieldWithError>

      <FormFieldWithError
        label="Copy Type"
        error={errors.marketingCopyType?.message}
      >
        <Select
          value={data.marketingCopyType}
          onValueChange={(value) =>
            onChange({
              marketingCopyType:
                value as MarketingCopyFormData["marketingCopyType"],
            })
          }
        >
          <SelectTrigger
            className={errors.marketingCopyType ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Select copy type" />
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

      <FormFieldWithError
        label="Target Audience"
        error={errors.audience?.message}
        required
        description="Who is your target market?"
      >
        <Input
          placeholder="e.g., Small business owners, Tech professionals, Young entrepreneurs..."
          value={data.audience}
          onChange={(e) => onChange({ audience: e.target.value })}
          className={errors.audience ? "border-destructive" : ""}
        />
      </FormFieldWithError>

      <DynamicArrayField
        label="Key Benefits"
        placeholder="Enter a key benefit..."
        values={data.keyBenefits}
        onChange={(keyBenefits) => onChange({ keyBenefits })}
        error={errors.keyBenefits?.message}
        maxItems={8}
        addButtonText="Add Benefit"
      />
    </div>
  );
}
