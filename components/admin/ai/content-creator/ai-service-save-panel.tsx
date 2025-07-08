"use client";

import { useState } from "react";
import { Save, AlertCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import type { Service } from "@/lib/types/ai/content-generation.type";

interface AIServiceSavePanelProps {
  service: Service;
  onSaved?: (serviceId: string, slug: string) => void;
}

export function AIServiceSavePanel({
  service,
  onSaved,
}: AIServiceSavePanelProps) {
  const [featuredImage, setFeaturedImage] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!featuredImage.trim()) {
      toast.error("Please provide a featured image URL");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const saveRequest = {
        // Core service information
        title: service.title,
        shortDescription: service.shortDescription,
        fullDescription: service.fullDescription,
        timeline: service.timeline,
        category: service.category,
        featuredImage: featuredImage.trim(),
        slug: service.slug,

        // Structured arrays for related data
        features: service.features || [],
        benefits: service.benefits || [],
        deliverables: service.deliverables || [],
        technologies: service.technologies || [],

        // Complex structured data
        process: service.process || [],
        pricing: service.pricing || [],
        faq: service.faq || [],
        testimonials: service.testimonials || [],

        // Marketing and positioning
        targetAudience: service.targetAudience,
        competitiveAdvantage: service.competitiveAdvantage,
        callToAction: service.callToAction,

        // SEO and content
        metaDescription: service.metaDescription,
        metaTitle: service.metaTitle,

        // Additional content
        galleryImages: service.galleryImages || [],
        relatedServices: service.relatedServices || [],
      };

      const response = await fetch("/api/ai/content/save-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saveRequest),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save service");
      }

      if (result.data) {
        toast.success("Service saved successfully!");
        onSaved?.(result.data.id, result.data.slug);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save service";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const getWordCount = (text: string) => {
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  };

  const isFormValid = featuredImage.trim() && !isSaving;

  return (
    <div className="space-y-6">
      {/* Service Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Generated Service Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Title
            </Label>
            <h2 className="text-2xl font-bold mt-1">{service.title}</h2>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Category</Label>
              <p className="mt-1">
                <Badge variant="secondary">{service.category}</Badge>
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Timeline</Label>
              <p className="mt-1">{service.timeline}</p>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Short Description ({service.shortDescription.length} characters)
            </Label>
            <p className="text-sm mt-1 p-2 bg-muted rounded">
              {service.shortDescription}
            </p>
          </div>

          {/* Features */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Features
            </Label>
            <ul className="mt-1 space-y-1">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Benefits
            </Label>
            <ul className="mt-1 space-y-1">
              {service.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deliverables */}
          {service.deliverables && service.deliverables.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Deliverables
              </Label>
              <ul className="mt-1 space-y-1">
                {service.deliverables.map((deliverable, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">→</span>
                    <span className="text-sm">{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Description */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Full Description ({getWordCount(service.fullDescription)} words)
            </Label>
            <div className="mt-1 p-4 bg-muted rounded max-h-60 overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                {service.fullDescription.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-2">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Target Audience
            </Label>
            <p className="text-sm mt-1 p-2 bg-muted rounded">
              {service.targetAudience}
            </p>
          </div>

          {/* Technologies */}
          {service.technologies && service.technologies.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Technologies
              </Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {service.technologies.map((tech, index) => (
                  <Badge key={index} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Competitive Advantage */}
          {service.competitiveAdvantage && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Competitive Advantage
              </Label>
              <p className="text-sm mt-1 p-2 bg-muted rounded">
                {service.competitiveAdvantage}
              </p>
            </div>
          )}

          {/* Process Steps */}
          {service.process && service.process.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Process Steps
              </Label>
              <div className="mt-1 space-y-2">
                {service.process.map((step, index) => (
                  <div key={index} className="p-3 bg-muted rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        Step {step.step}
                      </Badge>
                      {step.duration && (
                        <span className="text-xs text-muted-foreground">
                          {step.duration}
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-sm">{step.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Tiers */}
          {service.pricing && service.pricing.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Pricing Tiers
              </Label>
              <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                {service.pricing.map((tier, index) => (
                  <div key={index} className="p-3 bg-muted rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{tier.name}</h4>
                      {tier.popular && (
                        <Badge variant="default" className="text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-primary mb-1">
                      {tier.price}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {tier.description}
                    </p>
                    {tier.features && tier.features.length > 0 && (
                      <ul className="text-xs space-y-1">
                        {tier.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start gap-1"
                          >
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {service.faq && service.faq.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Frequently Asked Questions
              </Label>
              <div className="mt-1 space-y-2">
                {service.faq.map((faq, index) => (
                  <div key={index} className="p-3 bg-muted rounded">
                    <h4 className="font-medium text-sm mb-1">{faq.question}</h4>
                    <p className="text-xs text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonials */}
          {service.testimonials && service.testimonials.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Testimonials
              </Label>
              <div className="mt-1 space-y-2">
                {service.testimonials.map((testimonial, index) => (
                  <div key={index} className="p-3 bg-muted rounded">
                    <p className="text-sm italic mb-2">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">
                        {testimonial.author}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {testimonial.company}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          {service.callToAction && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Call to Action
              </Label>
              <p className="text-sm mt-1 p-2 bg-muted rounded font-medium">
                {service.callToAction}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save to Database
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Featured Image */}
          <div>
            <Label htmlFor="featured-image">Featured Image URL *</Label>
            <Input
              id="featured-image"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Provide a URL for the service featured image
            </p>
          </div>

          {/* Service Details Summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Service Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Category:</span>
                <span className="ml-2 font-medium">{service.category}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Timeline:</span>
                <span className="ml-2 font-medium">{service.timeline}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Features:</span>
                <span className="ml-2 font-medium">
                  {service.features?.length || 0}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Benefits:</span>
                <span className="ml-2 font-medium">
                  {service.benefits?.length || 0}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Process Steps:</span>
                <span className="ml-2 font-medium">
                  {service.process?.length || 0}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Pricing Tiers:</span>
                <span className="ml-2 font-medium">
                  {service.pricing?.length || 0}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">FAQs:</span>
                <span className="ml-2 font-medium">
                  {service.faq?.length || 0}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Deliverables:</span>
                <span className="ml-2 font-medium">
                  {service.deliverables?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-3">
            <Button
              onClick={handleSave}
              disabled={!isFormValid}
              className="min-w-[120px]"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Service
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            * Required fields must be filled before saving
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
