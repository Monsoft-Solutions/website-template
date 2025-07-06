/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import type { StepProps } from "./types";

export const TechnologiesStep = ({ form }: StepProps) => {
  const {
    fields: technologyFields,
    append: appendTechnology,
    remove: removeTechnology,
  } = useFieldArray({
    control: form.control,
    name: "technologies",
  } as any);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technologies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-medium">Technologies Used *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendTechnology("" as any)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Technology
          </Button>
        </div>
        <div className="space-y-3">
          {technologyFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                {...form.register(`technologies.${index}`)}
                placeholder={`Technology ${index + 1}`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeTechnology(index)}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        {form.formState.errors.technologies && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.technologies.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
