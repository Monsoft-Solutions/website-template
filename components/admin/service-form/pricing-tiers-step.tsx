import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { PricingTierCard } from "./pricing-tier-card";
import type { StepProps } from "./types";

export const PricingTiersStep = ({ form }: StepProps) => {
  const {
    fields: pricingFields,
    append: appendPricing,
    remove: removePricing,
  } = useFieldArray({
    control: form.control,
    name: "pricing",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Tiers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-medium">Pricing Options</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendPricing({
                name: "",
                price: "",
                description: "",
                popular: false,
                features: [],
              })
            }
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Pricing Tier
          </Button>
        </div>
        <div className="space-y-6">
          {pricingFields.map((field, index) => (
            <PricingTierCard
              key={field.id}
              form={form}
              index={index}
              onRemove={() => removePricing(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
