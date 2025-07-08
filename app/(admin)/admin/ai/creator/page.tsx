"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  Send,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAIContentGeneration } from "@/hooks/useAIContentGeneration";
import type {
  ContentType,
  ContentTone,
  ServiceDescriptionInput,
} from "@/lib/types/ai/content-generation.type";

const contentTypes: Array<{
  value: ContentType;
  label: string;
  description: string;
}> = [
  {
    value: "blog-post",
    label: "Blog Post",
    description: "Generate a complete blog post with SEO optimization",
  },
  {
    value: "service-description",
    label: "Service Description",
    description: "Create compelling service descriptions",
  },
  {
    value: "page-content",
    label: "Page Content",
    description: "Generate content for web pages",
  },
  {
    value: "email-template",
    label: "Email Template",
    description: "Create professional email templates",
  },
  {
    value: "marketing-copy",
    label: "Marketing Copy",
    description: "Generate persuasive marketing content",
  },
];

const tones: Array<{ value: ContentTone; label: string }> = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "technical", label: "Technical" },
  { value: "friendly", label: "Friendly" },
  { value: "persuasive", label: "Persuasive" },
  { value: "authoritative", label: "Authoritative" },
];

const lengths = [
  { value: "short", label: "Short (300-500 words)" },
  { value: "medium", label: "Medium (500-1000 words)" },
  { value: "long", label: "Long (1000+ words)" },
];

const pageTypes = [
  { value: "homepage", label: "Homepage" },
  { value: "about", label: "About Page" },
  { value: "contact", label: "Contact Page" },
  { value: "landing", label: "Landing Page" },
  { value: "product", label: "Product Page" },
  { value: "general", label: "General Content" },
];

const marketingCopyTypes = [
  { value: "headline", label: "Headline" },
  { value: "social-post", label: "Social Media Post" },
  { value: "ad-copy", label: "Advertisement Copy" },
  { value: "landing-page", label: "Landing Page Copy" },
];

export default function AICreatorPage() {
  const [contentType, setContentType] = useState<ContentType>("blog-post");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState<ContentTone>("professional");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [audience, setAudience] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");

  // Page content specific
  const [pageType, setPageType] = useState("general");

  // Service description specific
  const [serviceName, setServiceName] = useState("");
  const [serviceFeatures, setServiceFeatures] = useState<string[]>([""]);
  const [serviceBenefits, setServiceBenefits] = useState<string[]>([""]);
  const [serviceTargetAudience, setServiceTargetAudience] = useState("");
  const [serviceIndustry, setServiceIndustry] = useState("");
  const [serviceCompetitiveAdvantage, setServiceCompetitiveAdvantage] =
    useState("");
  const [includeCallToAction, setIncludeCallToAction] = useState(false);

  // Email template specific
  const [includeSubject, setIncludeSubject] = useState(true);

  // Marketing copy specific
  const [marketingCopyType, setMarketingCopyType] = useState<
    "headline" | "social-post" | "ad-copy" | "landing-page"
  >("landing-page");
  const [keyBenefits, setKeyBenefits] = useState<string[]>([""]);

  const {
    generateContent,
    isGenerating,
    generatedContent,
    error,
    progress,
    metadata,
  } = useAIContentGeneration();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    // Content type specific validations
    if (contentType === "service-description") {
      if (!serviceName.trim()) {
        toast.error("Please enter the service name");
        return;
      }
      if (!serviceTargetAudience.trim()) {
        toast.error("Please enter the target audience for the service");
        return;
      }
      if (serviceFeatures.filter((f) => f.trim()).length === 0) {
        toast.error("Please add at least one service feature");
        return;
      }
      if (serviceBenefits.filter((b) => b.trim()).length === 0) {
        toast.error("Please add at least one service benefit");
        return;
      }
    }

    if (
      (contentType === "email-template" || contentType === "marketing-copy") &&
      !audience.trim()
    ) {
      toast.error(
        `Please enter the target audience for ${
          contentType === "email-template" ? "email template" : "marketing copy"
        }`
      );
      return;
    }

    const keywordArray = keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    try {
      const request = {
        type: contentType,
        topic: topic.trim(),
        keywords: keywordArray,
        tone,
        length,
        audience: audience.trim() || undefined,
        customInstructions: customInstructions.trim() || undefined,
        // Content-type specific fields
        ...(contentType === "service-description" && {
          service: {
            name: serviceName.trim(),
            features: serviceFeatures
              .filter((f) => f.trim())
              .map((f) => f.trim()),
            benefits: serviceBenefits
              .filter((b) => b.trim())
              .map((b) => b.trim()),
            targetAudience: serviceTargetAudience.trim(),
            industry: serviceIndustry.trim() || undefined,
            competitiveAdvantage:
              serviceCompetitiveAdvantage.trim() || undefined,
          } as ServiceDescriptionInput,
          includeCallToAction,
        }),
        ...(contentType === "page-content" && { pageType }),
        ...(contentType === "email-template" && { includeSubject }),
        ...(contentType === "marketing-copy" && {
          copyType: marketingCopyType,
          keyBenefits: keyBenefits.filter((b) => b.trim()).map((b) => b.trim()),
        }),
      };

      await generateContent(request);

      toast.success("Content generated successfully!");
    } catch {
      toast.error("Failed to generate content");
    }
  };

  const handleCopy = async () => {
    if (!generatedContent) return;

    const textToCopy =
      typeof generatedContent === "string"
        ? generatedContent
        : `# ${generatedContent.title}\n\n${generatedContent.content}`;

    await navigator.clipboard.writeText(textToCopy);
    toast.success("Content copied to clipboard");
  };

  const handleDownload = () => {
    if (!generatedContent) return;

    const content =
      typeof generatedContent === "string"
        ? generatedContent
        : `# ${generatedContent.title}\n\n${generatedContent.content}`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-generated-${contentType}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Content downloaded");
  };

  const addArrayItem = (array: string[], setArray: (arr: string[]) => void) => {
    setArray([...array, ""]);
  };

  const removeArrayItem = (
    array: string[],
    setArray: (arr: string[]) => void,
    index: number
  ) => {
    if (array.length > 1) {
      setArray(array.filter((_, i) => i !== index));
    }
  };

  const updateArrayItem = (
    array: string[],
    setArray: (arr: string[]) => void,
    index: number,
    value: string
  ) => {
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
  };

  const selectedContentType = contentTypes.find(
    (ct) => ct.value === contentType
  );

  const resetContentTypeFields = () => {
    setTopic("");
    setKeywords("");
    setAudience("");
    setCustomInstructions("");
    setServiceName("");
    setServiceFeatures([""]);
    setServiceBenefits([""]);
    setServiceTargetAudience("");
    setServiceIndustry("");
    setServiceCompetitiveAdvantage("");
    setKeyBenefits([""]);
  };

  const handleContentTypeChange = (newType: ContentType) => {
    if (newType !== contentType) {
      resetContentTypeFields();
    }
    setContentType(newType);
  };

  return (
    <div className="h-full p-6">
      <div className="max-w-7xl mx-auto h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold">AI Content Creator</h1>
          </div>
          <p className="text-muted-foreground">
            Generate high-quality content using advanced AI models. Create blog
            posts, service descriptions, marketing copy, and more.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Content Configuration</CardTitle>
                <CardDescription>
                  Configure your content generation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto space-y-4">
                {/* Content Type */}
                <div className="space-y-2">
                  <Label htmlFor="content-type">Content Type</Label>
                  <Select
                    value={contentType}
                    onValueChange={handleContentTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex flex-col">
                            <span>{type.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {type.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedContentType && (
                    <p className="text-xs text-muted-foreground">
                      {selectedContentType.description}
                    </p>
                  )}
                </div>

                {/* Service-specific fields */}
                {contentType === "service-description" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="service-name">Service Name *</Label>
                      <Input
                        id="service-name"
                        placeholder="Enter the service name..."
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Service Features *</Label>
                      {serviceFeatures.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Enter a service feature..."
                            value={feature}
                            onChange={(e) =>
                              updateArrayItem(
                                serviceFeatures,
                                setServiceFeatures,
                                index,
                                e.target.value
                              )
                            }
                          />
                          {serviceFeatures.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                removeArrayItem(
                                  serviceFeatures,
                                  setServiceFeatures,
                                  index
                                )
                              }
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          addArrayItem(serviceFeatures, setServiceFeatures)
                        }
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Service Benefits *</Label>
                      {serviceBenefits.map((benefit, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Enter a service benefit..."
                            value={benefit}
                            onChange={(e) =>
                              updateArrayItem(
                                serviceBenefits,
                                setServiceBenefits,
                                index,
                                e.target.value
                              )
                            }
                          />
                          {serviceBenefits.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                removeArrayItem(
                                  serviceBenefits,
                                  setServiceBenefits,
                                  index
                                )
                              }
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          addArrayItem(serviceBenefits, setServiceBenefits)
                        }
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Benefit
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service-target-audience">
                        Target Audience *
                      </Label>
                      <Input
                        id="service-target-audience"
                        placeholder="Who is this service for?"
                        value={serviceTargetAudience}
                        onChange={(e) =>
                          setServiceTargetAudience(e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service-industry">Industry</Label>
                      <Input
                        id="service-industry"
                        placeholder="e.g., Technology, Healthcare, Finance..."
                        value={serviceIndustry}
                        onChange={(e) => setServiceIndustry(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="competitive-advantage">
                        Competitive Advantage
                      </Label>
                      <Textarea
                        id="competitive-advantage"
                        placeholder="What makes this service unique?"
                        value={serviceCompetitiveAdvantage}
                        onChange={(e) =>
                          setServiceCompetitiveAdvantage(e.target.value)
                        }
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-cta"
                        checked={includeCallToAction}
                        onCheckedChange={(checked) =>
                          setIncludeCallToAction(checked as boolean)
                        }
                      />
                      <Label htmlFor="include-cta">
                        Include call-to-action
                      </Label>
                    </div>
                  </>
                )}

                {/* General topic field (for non-service content) */}
                {contentType !== "service-description" && (
                  <div className="space-y-2">
                    <Label htmlFor="topic">
                      {contentType === "email-template"
                        ? "Email Purpose"
                        : contentType === "marketing-copy"
                        ? "Product/Service"
                        : "Topic"}{" "}
                      *
                    </Label>
                    <Input
                      id="topic"
                      placeholder={
                        contentType === "email-template"
                          ? "e.g., Welcome new users, Promote a sale..."
                          : contentType === "marketing-copy"
                          ? "e.g., Web design service, E-commerce platform..."
                          : "Enter your content topic..."
                      }
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>
                )}

                {/* Page type for page content */}
                {contentType === "page-content" && (
                  <div className="space-y-2">
                    <Label htmlFor="page-type">Page Type</Label>
                    <Select value={pageType} onValueChange={setPageType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pageTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Marketing copy type */}
                {contentType === "marketing-copy" && (
                  <div className="space-y-2">
                    <Label htmlFor="copy-type">Copy Type</Label>
                    <Select
                      value={marketingCopyType}
                      onValueChange={(
                        value:
                          | "headline"
                          | "social-post"
                          | "ad-copy"
                          | "landing-page"
                      ) => setMarketingCopyType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {marketingCopyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Keywords (for blog posts and page content) */}
                {(contentType === "blog-post" ||
                  contentType === "page-content") && (
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      placeholder="Enter keywords separated by commas..."
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate multiple keywords with commas
                    </p>
                  </div>
                )}

                {/* Key benefits for marketing copy */}
                {contentType === "marketing-copy" && (
                  <div className="space-y-2">
                    <Label>Key Benefits</Label>
                    {keyBenefits.map((benefit, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Enter a key benefit..."
                          value={benefit}
                          onChange={(e) =>
                            updateArrayItem(
                              keyBenefits,
                              setKeyBenefits,
                              index,
                              e.target.value
                            )
                          }
                        />
                        {keyBenefits.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              removeArrayItem(
                                keyBenefits,
                                setKeyBenefits,
                                index
                              )
                            }
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem(keyBenefits, setKeyBenefits)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Benefit
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Tone */}
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select
                      value={tone}
                      onValueChange={(value: ContentTone) => setTone(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tones.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Length */}
                  <div className="space-y-2">
                    <Label htmlFor="length">Length</Label>
                    <Select
                      value={length}
                      onValueChange={(value: "short" | "medium" | "long") =>
                        setLength(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {lengths.map((l) => (
                          <SelectItem key={l.value} value={l.value}>
                            {l.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Target Audience (required for email and marketing copy) */}
                <div className="space-y-2">
                  <Label htmlFor="audience">
                    Target Audience{" "}
                    {(contentType === "email-template" ||
                      contentType === "marketing-copy") &&
                      "*"}
                  </Label>
                  <Input
                    id="audience"
                    placeholder="e.g., Small business owners, developers, marketing professionals..."
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                  />
                </div>

                {/* Email template options */}
                {contentType === "email-template" && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-subject"
                      checked={includeSubject}
                      onCheckedChange={(checked) =>
                        setIncludeSubject(checked as boolean)
                      }
                    />
                    <Label htmlFor="include-subject">
                      Include email subject line
                    </Label>
                  </div>
                )}

                {/* Custom Instructions */}
                <div className="space-y-2">
                  <Label htmlFor="instructions">Custom Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Any specific requirements or style preferences..."
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>

                {/* Progress */}
                {isGenerating && (
                  <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-center text-muted-foreground">
                      Generating your content...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Output Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generated Content</CardTitle>
                    <CardDescription>
                      Your AI-generated content will appear here
                    </CardDescription>
                  </div>
                  {generatedContent && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {error && (
                  <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {generatedContent ? (
                  <div className="flex-1 space-y-4">
                    {/* Metadata */}
                    {metadata && (
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          {metadata.wordCount} words
                        </Badge>
                        <Badge variant="secondary">
                          {metadata.generationTime}ms
                        </Badge>
                        <Badge variant="secondary">{metadata.model}</Badge>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-auto">
                      {typeof generatedContent === "string" ? (
                        <div className="prose dark:prose-invert max-w-none">
                          <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg border">
                            {generatedContent}
                          </pre>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">Title</h3>
                            <div className="p-3 bg-muted/50 rounded-lg border">
                              {generatedContent.title}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Excerpt</h3>
                            <div className="p-3 bg-muted/50 rounded-lg border">
                              {generatedContent.excerpt}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Content</h3>
                            <div className="prose dark:prose-invert max-w-none">
                              <div className="p-4 bg-muted/50 rounded-lg border text-sm whitespace-pre-wrap">
                                {generatedContent.content}
                              </div>
                            </div>
                          </div>

                          {generatedContent.tags &&
                            generatedContent.tags.length > 0 && (
                              <div>
                                <h3 className="font-semibold mb-2">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                  {generatedContent.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                          {generatedContent.metaDescription && (
                            <div>
                              <h3 className="font-semibold mb-2">
                                Meta Description
                              </h3>
                              <div className="p-3 bg-muted/50 rounded-lg border text-sm">
                                {generatedContent.metaDescription}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Sparkles className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">Ready to create content</h3>
                        <p className="text-sm text-muted-foreground">
                          Configure your parameters and click &ldquo;Generate
                          Content&rdquo; to get started
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
