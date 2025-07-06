/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { TestimonialCard } from "./testimonial-card";
import type { StepProps } from "./types";

export const TestimonialsStep = ({ form }: StepProps) => {
  const {
    fields: testimonialFields,
    append: appendTestimonial,
    remove: removeTestimonial,
  } = useFieldArray({
    control: form.control,
    name: "testimonials",
  } as any);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Testimonials</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-medium">Customer Testimonials</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendTestimonial({
                quote: "",
                author: "",
                company: "",
                avatar: "",
              } as any)
            }
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Button>
        </div>

        <div className="space-y-6">
          {testimonialFields.map((field, index) => (
            <TestimonialCard
              key={field.id}
              form={form}
              index={index}
              onRemove={() => removeTestimonial(index)}
            />
          ))}
        </div>

        {testimonialFields.length === 0 && (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No testimonials added</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add customer testimonials to showcase your service quality
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
