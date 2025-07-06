import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceGalleryUploader } from "./service-gallery-uploader";
import type { StepProps } from "./types";

export const GalleryAndMediaStep = ({ form }: StepProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery & Media</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-base font-medium">Gallery Images</Label>
          <ServiceGalleryUploader
            value={form.watch("gallery") || []}
            onChange={(value) => form.setValue("gallery", value)}
            error={form.formState.errors.gallery?.message}
            maxImages={15}
          />
        </div>
      </CardContent>
    </Card>
  );
};
