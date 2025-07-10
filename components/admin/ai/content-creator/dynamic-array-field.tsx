"use client";

import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormFieldWithError } from "./form-field-with-error";

interface DynamicArrayFieldProps {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
  required?: boolean;
  maxItems?: number;
  addButtonText?: string;
}

export function DynamicArrayField({
  label,
  placeholder,
  values,
  onChange,
  error,
  required = false,
  maxItems = 10,
  addButtonText = "Add Item",
}: DynamicArrayFieldProps) {
  const addItem = () => {
    if (values.length < maxItems) {
      onChange([...values, ""]);
    }
  };

  const removeItem = (index: number) => {
    if (values.length > 1) {
      onChange(values.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  return (
    <FormFieldWithError label={label} error={error} required={required}>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder={placeholder}
              value={value}
              onChange={(e) => updateItem(index, e.target.value)}
              className={error ? "border-destructive" : ""}
            />
            {values.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeItem(index)}
                className="shrink-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        {values.length < maxItems && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            {addButtonText}
          </Button>
        )}
      </div>
    </FormFieldWithError>
  );
}
