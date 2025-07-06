/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import type { PricingTierCardProps } from "./types";

export const PricingTierCard = ({
  form,
  index,
  onRemove,
}: PricingTierCardProps) => {
  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control: form.control,
    name: `pricing.${index}.features` as any,
  });

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <Label className="text-sm font-medium">Pricing Tier {index + 1}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="flex items-center gap-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`pricing.${index}.name`}>Name *</Label>
            <Input
              id={`pricing.${index}.name`}
              {...form.register(`pricing.${index}.name`)}
              placeholder="e.g., Basic, Premium"
            />
          </div>
          <div>
            <Label htmlFor={`pricing.${index}.price`}>Price *</Label>
            <Input
              id={`pricing.${index}.price`}
              {...form.register(`pricing.${index}.price`)}
              placeholder="e.g., $999"
            />
          </div>
        </div>
        <div>
          <Label htmlFor={`pricing.${index}.description`}>Description *</Label>
          <Textarea
            id={`pricing.${index}.description`}
            {...form.register(`pricing.${index}.description`)}
            placeholder="Brief description of this pricing tier"
            rows={3}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Controller
            name={`pricing.${index}.popular`}
            control={form.control}
            render={({ field }) => (
              <Checkbox
                id={`pricing.${index}.popular`}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor={`pricing.${index}.popular`}>Mark as popular</Label>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Features *</Label>
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
          <div className="space-y-2">
            {featureFields.map((featureField, featureIndex) => (
              <div key={featureField.id} className="flex items-center gap-2">
                <Input
                  {...form.register(
                    `pricing.${index}.features.${featureIndex}`
                  )}
                  placeholder={`Feature ${featureIndex + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeFeature(featureIndex)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
