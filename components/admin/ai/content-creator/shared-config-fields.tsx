"use client";

import { FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormFieldWithError } from "./form-field-with-error";
import type { ContentFormData } from "@/lib/utils/ai-content-validation";

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

interface SharedConfigFieldsProps {
  data: ContentFormData;
  onChange: (data: Partial<ContentFormData>) => void;
  errors: FieldErrors<ContentFormData>;
  showAudience?: boolean;
  audienceRequired?: boolean;
}

export function SharedConfigFields({
  data,
  onChange,
  errors,
  showAudience = true,
  audienceRequired = false,
}: SharedConfigFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormFieldWithError label="Tone" error={errors.tone?.message}>
          <Select
            value={data.tone}
            onValueChange={(value) =>
              onChange({ tone: value as typeof data.tone })
            }
          >
            <SelectTrigger className={errors.tone ? "border-destructive" : ""}>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              {tones.map((tone) => (
                <SelectItem key={tone.value} value={tone.value}>
                  {tone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldWithError>

        <FormFieldWithError label="Length" error={errors.length?.message}>
          <Select
            value={data.length}
            onValueChange={(value) =>
              onChange({ length: value as typeof data.length })
            }
          >
            <SelectTrigger
              className={errors.length ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Select length" />
            </SelectTrigger>
            <SelectContent>
              {lengths.map((length) => (
                <SelectItem key={length.value} value={length.value}>
                  {length.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldWithError>
      </div>

      {showAudience && (
        <FormFieldWithError
          label="Target Audience"
          error={errors.audience?.message}
          required={audienceRequired}
          description="Who is your target audience?"
        >
          <Input
            placeholder="e.g., Small business owners, developers, marketing professionals..."
            value={data.audience || ""}
            onChange={(e) => onChange({ audience: e.target.value })}
            className={errors.audience ? "border-destructive" : ""}
          />
        </FormFieldWithError>
      )}

      <FormFieldWithError
        label="Custom Instructions"
        error={errors.customInstructions?.message}
        description="Any specific requirements or style preferences (optional)"
      >
        <Textarea
          placeholder="e.g., Include statistics, focus on benefits, use a conversational tone..."
          value={data.customInstructions || ""}
          onChange={(e) => onChange({ customInstructions: e.target.value })}
          rows={3}
          className={errors.customInstructions ? "border-destructive" : ""}
        />
      </FormFieldWithError>
    </div>
  );
}
