"use client";

import { FieldErrors } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormFieldWithError } from "./form-field-with-error";
import { GeneralContentFields } from "./general-content-fields";
import type { PageContentFormData } from "@/lib/utils/ai-content-validation";

const pageTypes = [
  { value: "homepage", label: "Homepage" },
  { value: "about", label: "About Page" },
  { value: "contact", label: "Contact Page" },
  { value: "landing", label: "Landing Page" },
  { value: "product", label: "Product Page" },
  { value: "general", label: "General Content" },
];

interface PageContentFieldsProps {
  data: PageContentFormData;
  onChange: (data: Partial<PageContentFormData>) => void;
  errors: FieldErrors<PageContentFormData>;
}

export function PageContentFields({
  data,
  onChange,
  errors,
}: PageContentFieldsProps) {
  return (
    <div className="space-y-4">
      <GeneralContentFields data={data} onChange={onChange} errors={errors} />

      <FormFieldWithError label="Page Type" error={errors.pageType?.message}>
        <Select
          value={data.pageType}
          onValueChange={(value) =>
            onChange({ pageType: value as PageContentFormData["pageType"] })
          }
        >
          <SelectTrigger
            className={errors.pageType ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Select page type" />
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
    </div>
  );
}
