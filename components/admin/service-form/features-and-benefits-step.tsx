/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import type { StepProps } from "./types";

export const FeaturesAndBenefitsStep = ({ form }: StepProps) => {
  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control: form.control,
    name: "features",
  } as any);

  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({
    control: form.control,
    name: "benefits",
  } as any);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Features & Benefits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Features Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium">Features *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendFeature("")}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </Button>
          </div>
          <div className="space-y-3">
            {featureFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  {...form.register(`features.${index}`)}
                  placeholder={`Feature ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeFeature(index)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.features && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.features.message}
            </p>
          )}
        </div>

        {/* Benefits Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium">Benefits *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendBenefit("")}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Benefit
            </Button>
          </div>
          <div className="space-y-3">
            {benefitFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  {...form.register(`benefits.${index}`)}
                  placeholder={`Benefit ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeBenefit(index)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.benefits && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.benefits.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
