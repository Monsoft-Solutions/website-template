import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceImageUploader } from "./service-image-uploader";
import type { BasicInformationStepProps } from "./types";

export const BasicInformationStep = ({
  form,
  onTitleChange,
}: BasicInformationStepProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Basic Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...form.register("title")}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter service title"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            {...form.register("slug")}
            placeholder="service-slug"
          />
          {form.formState.errors.slug && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.slug.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="shortDescription">Short Description *</Label>
        <Textarea
          id="shortDescription"
          {...form.register("shortDescription")}
          placeholder="Brief description of the service"
          rows={3}
        />
        {form.formState.errors.shortDescription && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.shortDescription.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="fullDescription">Full Description *</Label>
        <Textarea
          id="fullDescription"
          {...form.register("fullDescription")}
          placeholder="Detailed description of the service"
          rows={5}
        />
        {form.formState.errors.fullDescription && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.fullDescription.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="timeline">Timeline *</Label>
          <Input
            id="timeline"
            {...form.register("timeline")}
            placeholder="e.g., 2-4 weeks"
          />
          {form.formState.errors.timeline && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.timeline.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Controller
            name="category"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Consulting">Consulting</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.category && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.category.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <Label>Featured Image *</Label>
        <ServiceImageUploader
          value={form.watch("featuredImage")}
          onChange={(value) => form.setValue("featuredImage", value)}
          error={form.formState.errors.featuredImage?.message}
          label="Featured Image"
          placeholder="https://example.com/service-image.jpg"
        />
      </div>
    </CardContent>
  </Card>
);
