"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface SlugGeneratorProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  mode: "create" | "edit";
}

/**
 * Slug generator component for blog post form
 * Auto-generates slug from title in create mode, allows manual editing
 */
export function SlugGenerator({
  title,
  value,
  onChange,
  disabled = false,
  error,
  mode,
}: SlugGeneratorProps) {
  const [isManuallyEdited, setIsManuallyEdited] = useState(mode === "edit");

  // Auto-generate slug from title in create mode
  useEffect(() => {
    if (title && mode === "create" && !isManuallyEdited) {
      const timeoutId = setTimeout(() => {
        const slug = generateSlug(title);
        onChange(slug);
      }, 300); // Debounce to prevent too frequent updates

      return () => clearTimeout(timeoutId);
    }
  }, [title, mode, isManuallyEdited, onChange]);

  const generateSlug = (input: string): string => {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsManuallyEdited(true);
    const newValue = generateSlug(e.target.value);
    onChange(newValue);
  };

  const handleRegenerateSlug = () => {
    if (title) {
      const newSlug = generateSlug(title);
      onChange(newSlug);
      setIsManuallyEdited(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="slug">Slug *</Label>
      <div className="flex gap-2">
        <Input
          id="slug"
          value={value}
          onChange={handleInputChange}
          placeholder="post-slug"
          disabled={disabled}
          className={error ? "border-destructive" : ""}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRegenerateSlug}
          disabled={disabled || !title}
          title="Regenerate slug from title"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {mode === "create" && !isManuallyEdited && title && (
        <p className="text-sm text-muted-foreground">
          Slug will be auto-generated from title
        </p>
      )}
    </div>
  );
}
