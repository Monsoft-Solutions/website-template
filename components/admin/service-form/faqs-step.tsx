import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import type { StepProps } from "./types";

export const FAQsStep = ({ form }: StepProps) => {
  const {
    fields: faqFields,
    append: appendFAQ,
    remove: removeFAQ,
  } = useFieldArray({
    control: form.control,
    name: "faq",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>FAQs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-medium">
            Frequently Asked Questions
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendFAQ({ question: "", answer: "" })}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </Button>
        </div>
        <div className="space-y-4">
          {faqFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">FAQ {index + 1}</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeFAQ(index)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor={`faq.${index}.question`}>Question *</Label>
                  <Input
                    id={`faq.${index}.question`}
                    {...form.register(`faq.${index}.question`)}
                    placeholder="Enter question"
                  />
                </div>
                <div>
                  <Label htmlFor={`faq.${index}.answer`}>Answer *</Label>
                  <Textarea
                    id={`faq.${index}.answer`}
                    {...form.register(`faq.${index}.answer`)}
                    placeholder="Enter answer"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
