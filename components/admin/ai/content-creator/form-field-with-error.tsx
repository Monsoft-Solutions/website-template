"use client";

import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldWithErrorProps {
  label: string;
  error?: string;
  required?: boolean;
  description?: string;
  className?: string;
  children: ReactNode;
}

export function FormFieldWithError({
  label,
  error,
  required = false,
  description,
  className,
  children,
}: FormFieldWithErrorProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
}
