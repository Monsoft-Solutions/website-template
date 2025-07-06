"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/layout/Loading";

// Validation schema for site configuration
const siteConfigSchema = z.object({
  name: z.string().min(1, "Site name is required"),
  description: z.string().min(1, "Description is required"),
  ogImage: z.string().min(1, "OG image is required"),
  links: z.object({
    twitter: z.string().url().optional().or(z.literal("")),
    github: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    facebook: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
  }),
  creator: z.object({
    name: z.string().min(1, "Creator name is required"),
    email: z.string().email("Valid email is required"),
    twitter: z.string().optional(),
    url: z.string().url().optional().or(z.literal("")),
  }),
  keywords: z.array(z.string()).min(1, "At least one keyword is required"),
  language: z.string().min(1, "Language is required"),
  locale: z.string().min(1, "Locale is required"),
  theme: z.object({
    primaryColor: z.string().min(1, "Primary color is required"),
    secondaryColor: z.string().min(1, "Secondary color is required"),
  }),
  socialMedia: z.object({
    twitter: z.object({
      card: z.string().min(1, "Twitter card type is required"),
      site: z.string().optional(),
      creator: z.string().optional(),
    }),
  }),
  generator: z.string().min(1, "Generator is required"),
  applicationName: z.string().min(1, "Application name is required"),
  referrer: z.string().min(1, "Referrer is required"),
  authors: z
    .array(
      z.object({
        name: z.string().min(1, "Author name is required"),
        url: z.string().url().optional().or(z.literal("")),
      })
    )
    .min(1, "At least one author is required"),
  colorScheme: z.string().min(1, "Color scheme is required"),
  themeColor: z
    .array(
      z.object({
        media: z.string().min(1, "Media query is required"),
        color: z.string().min(1, "Color is required"),
      })
    )
    .min(1, "At least one theme color is required"),
  viewport: z.object({
    width: z.string().min(1, "Viewport width is required"),
    initialScale: z.number().min(0.1).max(10),
    maximumScale: z.number().min(0.1).max(10),
    userScalable: z.boolean(),
  }),
  verification: z.object({
    google: z.string().optional(),
    yandex: z.string().optional(),
    bing: z.string().optional(),
  }),
});

type SiteConfigForm = z.infer<typeof siteConfigSchema>;

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  const form = useForm<SiteConfigForm>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: {
      name: "",
      description: "",
      ogImage: "",
      links: {
        twitter: "",
        github: "",
        linkedin: "",
        facebook: "",
        instagram: "",
      },
      creator: {
        name: "",
        email: "",
        twitter: "",
        url: "",
      },
      keywords: [],
      language: "en",
      locale: "en_US",
      theme: {
        primaryColor: "#000000",
        secondaryColor: "#ffffff",
      },
      socialMedia: {
        twitter: {
          card: "summary_large_image",
          site: "",
          creator: "",
        },
      },
      generator: "Next.js",
      applicationName: "",
      referrer: "origin-when-cross-origin",
      authors: [{ name: "", url: "" }],
      colorScheme: "light dark",
      themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#000000" },
      ],
      viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 5,
        userScalable: true,
      },
      verification: {
        google: "",
        yandex: "",
        bing: "",
      },
    },
  });

  // Load existing configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch("/api/admin/site-config");
        if (response.ok) {
          const { data } = await response.json();
          form.reset(data);
          setKeywords(data.keywords || []);
        } else {
          toast.error("Failed to load site configuration");
        }
      } catch (error) {
        console.error("Error loading configuration:", error);
        toast.error("Failed to load site configuration");
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [form]);

  // Handle form submission
  const onSubmit = async (data: SiteConfigForm) => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/site-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, keywords }),
      });

      if (response.ok) {
        toast.success("Site configuration updated successfully");
      } else {
        toast.error("Failed to update site configuration");
      }
    } catch (error) {
      console.error("Error updating configuration:", error);
      toast.error("Failed to update site configuration");
    } finally {
      setSaving(false);
    }
  };

  // Handle keyword management
  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure your site settings and metadata
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Configure your site&apos;s basic information and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Site Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Your Site Name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="ogImage">OG Image</Label>
                  <Input
                    id="ogImage"
                    {...form.register("ogImage")}
                    placeholder="/og-image.jpg"
                  />
                  {form.formState.errors.ogImage && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.ogImage.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  {...form.register("description")}
                  className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md"
                  placeholder="Site description for SEO and social media"
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Configure your social media presence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input
                    id="twitter"
                    {...form.register("links.twitter")}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    {...form.register("links.github")}
                    placeholder="https://github.com/yourhandle"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    {...form.register("links.linkedin")}
                    placeholder="https://linkedin.com/in/yourhandle"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    {...form.register("links.facebook")}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    {...form.register("links.instagram")}
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Creator Information */}
          <Card>
            <CardHeader>
              <CardTitle>Creator Information</CardTitle>
              <CardDescription>
                Information about the site creator/owner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="creatorName">Creator Name</Label>
                  <Input
                    id="creatorName"
                    {...form.register("creator.name")}
                    placeholder="Your Name"
                  />
                  {form.formState.errors.creator?.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.creator.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="creatorEmail">Creator Email</Label>
                  <Input
                    id="creatorEmail"
                    type="email"
                    {...form.register("creator.email")}
                    placeholder="contact@yoursite.com"
                  />
                  {form.formState.errors.creator?.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.creator.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="creatorTwitter">Creator Twitter</Label>
                  <Input
                    id="creatorTwitter"
                    {...form.register("creator.twitter")}
                    placeholder="@yourhandle"
                  />
                </div>
                <div>
                  <Label htmlFor="creatorUrl">Creator URL</Label>
                  <Input
                    id="creatorUrl"
                    {...form.register("creator.url")}
                    placeholder="https://yoursite.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Keywords</CardTitle>
              <CardDescription>
                Keywords for search engine optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="Add keyword"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addKeyword();
                    }
                  }}
                />
                <Button type="button" onClick={addKeyword}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Theme Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Colors</CardTitle>
              <CardDescription>
                Configure your site&apos;s color scheme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    {...form.register("theme.primaryColor")}
                  />
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <Input
                    id="secondaryColor"
                    type="color"
                    {...form.register("theme.secondaryColor")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <LoadingSpinner />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
