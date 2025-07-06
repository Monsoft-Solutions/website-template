import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { TestimonialAvatarUploader } from "./testimonial-avatar-uploader";
import type { TestimonialCardProps } from "./types";

export const TestimonialCard = ({
  form,
  index,
  onRemove,
}: TestimonialCardProps) => {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Label className="text-base font-medium">Testimonial {index + 1}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Remove
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor={`testimonials.${index}.quote`}>Quote *</Label>
          <Textarea
            id={`testimonials.${index}.quote`}
            {...form.register(`testimonials.${index}.quote`)}
            placeholder="Enter the testimonial quote"
            rows={4}
          />
          {form.formState.errors.testimonials?.[index]?.quote && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.testimonials[index]?.quote?.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`testimonials.${index}.author`}>Author *</Label>
            <Input
              id={`testimonials.${index}.author`}
              {...form.register(`testimonials.${index}.author`)}
              placeholder="Author name"
            />
            {form.formState.errors.testimonials?.[index]?.author && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.testimonials[index]?.author?.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor={`testimonials.${index}.company`}>Company *</Label>
            <Input
              id={`testimonials.${index}.company`}
              {...form.register(`testimonials.${index}.company`)}
              placeholder="Company name"
            />
            {form.formState.errors.testimonials?.[index]?.company && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.testimonials[index]?.company?.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>Avatar Image</Label>
          <TestimonialAvatarUploader
            value={form.watch(`testimonials.${index}.avatar`) || ""}
            onChange={(value) =>
              form.setValue(`testimonials.${index}.avatar`, value)
            }
            error={form.formState.errors.testimonials?.[index]?.avatar?.message}
            uniqueId={`testimonial-avatar-upload-${index}`}
          />
        </div>
      </div>
    </div>
  );
};
