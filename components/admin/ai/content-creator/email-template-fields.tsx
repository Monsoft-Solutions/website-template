"use client";

import { FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormFieldWithError } from "./form-field-with-error";
import type { EmailTemplateFormData } from "@/lib/utils/ai-content-validation";

interface EmailTemplateFieldsProps {
  data: EmailTemplateFormData;
  onChange: (data: Partial<EmailTemplateFormData>) => void;
  errors: FieldErrors<EmailTemplateFormData>;
}

export function EmailTemplateFields({
  data,
  onChange,
  errors,
}: EmailTemplateFieldsProps) {
  return (
    <div className="space-y-4">
      <FormFieldWithError
        label="Email Purpose"
        error={errors.topic?.message}
        required
        description="What is the purpose of this email?"
      >
        <Input
          placeholder="e.g., Welcome new users, Promote a sale, Newsletter update..."
          value={data.topic}
          onChange={(e) => onChange({ topic: e.target.value })}
          className={errors.topic ? "border-destructive" : ""}
        />
      </FormFieldWithError>

      <FormFieldWithError
        label="Target Audience"
        error={errors.audience?.message}
        required
        description="Who will receive this email?"
      >
        <Input
          placeholder="e.g., New subscribers, Existing customers, Newsletter readers..."
          value={data.audience}
          onChange={(e) => onChange({ audience: e.target.value })}
          className={errors.audience ? "border-destructive" : ""}
        />
      </FormFieldWithError>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="include-subject"
          checked={data.includeSubject}
          onCheckedChange={(checked) =>
            onChange({ includeSubject: checked as boolean })
          }
        />
        <Label htmlFor="include-subject" className="text-sm font-medium">
          Include email subject line
        </Label>
      </div>
    </div>
  );
}
