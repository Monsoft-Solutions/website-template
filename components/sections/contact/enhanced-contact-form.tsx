"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/forms/FormField";
import { LoadingSpinner } from "@/components/layout/Loading";
import {
  enhancedContactFormSchema,
  type EnhancedContactFormData,
} from "@/lib/utils/contact-form-validation";
import { ContactFormResponse } from "@/lib/types/contact-submission.type";
import { analytics } from "@/lib/utils/analytics";
import {
  Send,
  User,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Clock,
  Briefcase,
  FileText,
  Heart,
} from "lucide-react";

// Project type options
const projectTypes = [
  {
    id: "web-development",
    title: "Web Development",
    description: "Custom websites and web applications",
    icon: "🌐",
    badge: "Popular",
  },
  {
    id: "mobile-app",
    title: "Mobile App",
    description: "iOS and Android applications",
    icon: "📱",
    badge: "",
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    description: "User interface and experience design",
    icon: "🎨",
    badge: "",
  },
  {
    id: "consulting",
    title: "Technical Consulting",
    description: "Strategy and technical guidance",
    icon: "💡",
    badge: "",
  },
  {
    id: "maintenance",
    title: "Maintenance & Support",
    description: "Ongoing support for existing projects",
    icon: "🛠️",
    badge: "",
  },
  {
    id: "other",
    title: "Other",
    description: "Tell us about your unique project",
    icon: "✨",
    badge: "",
  },
];

// Budget ranges
const budgetRanges = [
  { id: "under-10k", label: "Under $10k", icon: "💰" },
  { id: "10k-25k", label: "$10k - $25k", icon: "💎" },
  { id: "25k-50k", label: "$25k - $50k", icon: "🏆" },
  { id: "50k-100k", label: "$50k - $100k", icon: "🚀" },
  { id: "100k+", label: "$100k+", icon: "⭐" },
  { id: "not-sure", label: "Not sure yet", icon: "🤔" },
];

// Timeline options
const timelineOptions = [
  { id: "asap", label: "ASAP", icon: "⚡" },
  { id: "1-2-months", label: "1-2 months", icon: "📅" },
  { id: "3-6-months", label: "3-6 months", icon: "🗓️" },
  { id: "6-12-months", label: "6-12 months", icon: "📆" },
  { id: "flexible", label: "Flexible", icon: "🕰️" },
];

export function EnhancedContactForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStartedForm, setHasStartedForm] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedTimeline, setSelectedTimeline] = useState<string>("");

  const form = useForm<EnhancedContactFormData>({
    resolver: zodResolver(enhancedContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      company: "",
    },
    mode: "onChange",
  });

  const totalSteps = 4;

  // Track form start when user first interacts with any field
  useEffect(() => {
    const subscription = form.watch(() => {
      if (!hasStartedForm) {
        analytics.trackContact.formStart();
        setHasStartedForm(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, hasStartedForm]);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: EnhancedContactFormData) => {
    setIsSubmitting(true);
    analytics.trackContact.formSubmit();

    try {
      const submissionData = {
        ...data,
        projectType: selectedProjectType,
        budget: selectedBudget,
        timeline: selectedTimeline,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
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
          result.message || "We&apos;ll get back to you as soon as possible.",
      });

      analytics.trackContact.formComplete();
      form.reset();
      setCurrentStep(1);
      setSelectedProjectType("");
      setSelectedBudget("");
      setSelectedTimeline("");
    } catch (error) {
      console.error("Contact form error:", error);
      analytics.trackError(
        "contact_form_error",
        error instanceof Error ? error.message : "Unknown error",
        "EnhancedContactForm"
      );

      toast.error("Failed to send message", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return selectedProjectType !== "";
      case 2:
        return selectedBudget !== "" && selectedTimeline !== "";
      case 3:
        return form.watch("name") !== "" && form.watch("email") !== "";
      case 4:
        return form.watch("message") !== "";
      default:
        return false;
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-muted/5 via-background to-accent/5">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4">
              <MessageSquare className="w-3 h-3 mr-1" />
              Tell Us About Your Project
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Let&apos;s Create Something Amazing Together
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Share your vision with us. This quick form helps us understand
              your needs so we can provide the most relevant information and
              next steps.
            </p>
          </motion.div>

          <Card className="glass-card overflow-hidden">
            {/* Progress Bar */}
            <div className="p-6 border-b bg-muted/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  Step {currentStep} of {totalSteps}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {Math.round((currentStep / totalSteps) * 100)}% Complete
                </span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            </div>

            <CardContent className="p-8">
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <AnimatePresence mode="wait">
                    {/* Step 1: Project Type */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
                          <h3 className="text-xl font-semibold mb-2">
                            What type of project do you have in mind?
                          </h3>
                          <p className="text-muted-foreground">
                            This helps us understand your needs better
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {projectTypes.map((type) => (
                            <motion.div
                              key={type.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`relative p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                                selectedProjectType === type.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                              onClick={() => setSelectedProjectType(type.id)}
                            >
                              {type.badge && (
                                <Badge className="absolute -top-2 right-4 text-xs">
                                  {type.badge}
                                </Badge>
                              )}
                              <div className="flex items-start space-x-3">
                                <span className="text-2xl">{type.icon}</span>
                                <div>
                                  <h4 className="font-medium">{type.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {type.description}
                                  </p>
                                </div>
                              </div>
                              {selectedProjectType === type.id && (
                                <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-primary" />
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Budget and Timeline */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                      >
                        {/* Budget Selection */}
                        <div>
                          <div className="text-center mb-6">
                            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                              What&apos;s your budget range?
                            </h3>
                            <p className="text-muted-foreground">
                              This helps us recommend the best approach
                            </p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {budgetRanges.map((budget) => (
                              <motion.div
                                key={budget.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-3 border-2 rounded-xl cursor-pointer text-center transition-all ${
                                  selectedBudget === budget.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                                onClick={() => setSelectedBudget(budget.id)}
                              >
                                <span className="text-lg block mb-1">
                                  {budget.icon}
                                </span>
                                <span className="text-sm font-medium">
                                  {budget.label}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Timeline Selection */}
                        <div>
                          <div className="text-center mb-6">
                            <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                              When would you like to start?
                            </h3>
                            <p className="text-muted-foreground">
                              Understanding your timeline helps us plan
                              accordingly
                            </p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {timelineOptions.map((timeline) => (
                              <motion.div
                                key={timeline.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-3 border-2 rounded-xl cursor-pointer text-center transition-all ${
                                  selectedTimeline === timeline.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                                onClick={() => setSelectedTimeline(timeline.id)}
                              >
                                <span className="text-lg block mb-1">
                                  {timeline.icon}
                                </span>
                                <span className="text-sm font-medium">
                                  {timeline.label}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Contact Information */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <User className="w-12 h-12 text-primary mx-auto mb-4" />
                          <h3 className="text-xl font-semibold mb-2">
                            Let&apos;s get to know you
                          </h3>
                          <p className="text-muted-foreground">
                            Your contact information helps us reach out with the
                            right details
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            name="name"
                            label="Full Name"
                            placeholder="John Doe"
                            required
                          />
                          <FormField
                            name="email"
                            label="Email Address"
                            type="email"
                            placeholder="john@example.com"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            name="company"
                            label="Company (Optional)"
                            placeholder="Your Company"
                          />
                          <FormField
                            name="subject"
                            label="Project Title"
                            placeholder="My Awesome Project"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Project Details */}
                    {currentStep === 4 && (
                      <motion.div
                        key="step4"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                          <h3 className="text-xl font-semibold mb-2">
                            Tell us about your project
                          </h3>
                          <p className="text-muted-foreground">
                            The more details you share, the better we can help
                            you
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="message"
                            className="text-sm font-medium"
                          >
                            Project Description{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <textarea
                            id="message"
                            {...form.register("message")}
                            rows={8}
                            className="flex min-h-[200px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                            placeholder="Describe your project, goals, and any specific requirements you have in mind. Include any relevant details about features, target audience, or technical preferences..."
                          />
                          {form.formState.errors.message && (
                            <p className="text-sm text-destructive">
                              {form.formState.errors.message.message}
                            </p>
                          )}
                        </div>

                        {/* Project Summary */}
                        <div className="p-4 bg-muted/50 rounded-xl">
                          <h4 className="font-medium mb-2 flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-primary" />
                            Project Summary
                          </h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>
                              <strong>Type:</strong>{" "}
                              {projectTypes.find(
                                (p) => p.id === selectedProjectType
                              )?.title || "Not selected"}
                            </p>
                            <p>
                              <strong>Budget:</strong>{" "}
                              {budgetRanges.find((b) => b.id === selectedBudget)
                                ?.label || "Not selected"}
                            </p>
                            <p>
                              <strong>Timeline:</strong>{" "}
                              {timelineOptions.find(
                                (t) => t.id === selectedTimeline
                              )?.label || "Not selected"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid(currentStep)}
                        className="flex items-center"
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting || !isStepValid(currentStep)}
                        className="flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <LoadingSpinner className="mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
