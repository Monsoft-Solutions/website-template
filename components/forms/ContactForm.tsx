"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/FormField";
import { LoadingSpinner } from "@/components/layout/Loading";
import {
  contactFormSchema,
  type ContactFormData,
} from "@/lib/utils/validation";
import { ContactFormResponse } from "@/lib/types/contact-submission.type";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: ContactFormResponse = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Rate limit exceeded", {
            description:
              result.message || "Too many submissions. Please try again later.",
          });
          return;
        }

        if (response.status === 400) {
          toast.error("Validation failed", {
            description:
              result.error || "Please check your form data and try again.",
          });
          return;
        }

        throw new Error(result.error || "Failed to send message");
      }

      toast.success("Message sent successfully!", {
        description:
          result.message || "We'll get back to you as soon as possible.",
      });

      form.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField name="name" label="Name" placeholder="John Doe" required />
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="john@example.com"
            required
          />
        </div>

        <FormField
          name="subject"
          label="Subject"
          placeholder="How can we help?"
        />

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">
            Message <span className="text-destructive">*</span>
          </label>
          <textarea
            id="message"
            {...form.register("message")}
            rows={5}
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            placeholder="Tell us more about your project..."
          />
          {form.formState.errors.message && (
            <p className="text-sm text-destructive">
              {form.formState.errors.message.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner className="mr-2" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </FormProvider>
  );
}
