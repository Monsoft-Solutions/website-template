"use client";

import { FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormFieldWithError } from "./form-field-with-error";
import type {
  BlogPostFormData,
  PageContentFormData,
} from "@/lib/utils/ai-content-validation";

interface GeneralContentFieldsProps {
  data: BlogPostFormData | PageContentFormData;
  onChange: (data: Partial<BlogPostFormData | PageContentFormData>) => void;
  errors: FieldErrors<BlogPostFormData | PageContentFormData>;
  topicLabel?: string;
  topicPlaceholder?: string;
}

export function GeneralContentFields({
  data,
  onChange,
  errors,
  topicLabel = "Topic",
  topicPlaceholder = "Enter your content topic...",
}: GeneralContentFieldsProps) {
  return (
    <div className="space-y-4">
      <FormFieldWithError
        label={topicLabel}
        error={errors.topic?.message}
        required
      >
        <Input
          placeholder={topicPlaceholder}
          value={data.topic}
          onChange={(e) => onChange({ topic: e.target.value })}
          className={errors.topic ? "border-destructive" : ""}
        />
      </FormFieldWithError>

      <FormFieldWithError
        label="Keywords"
        error={errors.keywords?.message}
        description="Enter keywords separated by commas (optional)"
      >
        <Input
          placeholder="keyword1, keyword2, keyword3..."
          value={
            (data as BlogPostFormData | PageContentFormData).keywords?.join(
              ", "
            ) || ""
          }
          onChange={(e) => {
            const keywords = e.target.value
              .split(",")
              .map((k) => k.trim())
              .filter((k) => k.length > 0);
            onChange({ keywords });
          }}
          className={errors.keywords ? "border-destructive" : ""}
        />
      </FormFieldWithError>
    </div>
  );
}
