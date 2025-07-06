/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import type { StepProps } from "./types";

export const ProcessAndTimelineStep = ({ form }: StepProps) => {
  const {
    fields: processFields,
    append: appendProcess,
    remove: removeProcess,
  } = useFieldArray({
    control: form.control,
    name: "process",
  });

  const {
    fields: deliverableFields,
    append: appendDeliverable,
    remove: removeDeliverable,
  } = useFieldArray({
    control: form.control,
    name: "deliverables",
  } as any);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Process & Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Process Steps Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium">Process Steps</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendProcess({
                  step: processFields.length + 1,
                  title: "",
                  description: "",
                  duration: "",
                })
              }
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Step
            </Button>
          </div>
          <div className="space-y-4">
            {processFields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">
                    Step {index + 1}
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeProcess(index)}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`process.${index}.title`}>Title *</Label>
                    <Input
                      id={`process.${index}.title`}
                      {...form.register(`process.${index}.title`)}
                      placeholder="Step title"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`process.${index}.duration`}>
                      Duration
                    </Label>
                    <Input
                      id={`process.${index}.duration`}
                      {...form.register(`process.${index}.duration`)}
                      placeholder="e.g., 1-2 days"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <Label htmlFor={`process.${index}.description`}>
                    Description *
                  </Label>
                  <Textarea
                    id={`process.${index}.description`}
                    {...form.register(`process.${index}.description`)}
                    placeholder="Step description"
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium">Deliverables *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendDeliverable("")}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Deliverable
            </Button>
          </div>
          <div className="space-y-3">
            {deliverableFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  {...form.register(`deliverables.${index}`)}
                  placeholder={`Deliverable ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeDeliverable(index)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.deliverables && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.deliverables.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
