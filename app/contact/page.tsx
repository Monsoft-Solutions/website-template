import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/forms/ContactForm";
import { generateSeoMetadata } from "@/lib/config/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = generateSeoMetadata({
  title: "Contact Us",
  description:
    "Get in touch with our team. We're here to help with your questions, project inquiries, and business needs. Multiple ways to reach us.",
  keywords: ["contact", "support", "inquiry", "business", "help"],
});

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us an email and we'll respond within 24 hours",
    contact: "hello@monsoft.com",
    action: "mailto:hello@monsoft.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak directly with our team during business hours",
    contact: "+1 (555) 123-4567",
    action: "tel:+15551234567",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    contact: "Available 9 AM - 6 PM PST",
    action: "#",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Come see us at our office in San Francisco",
    contact: "123 Tech Street, SF, CA 94102",
    action: "https://maps.google.com",
  },
];

const officeHours = [
  { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM PST" },
  { day: "Saturday", hours: "10:00 AM - 4:00 PM PST" },
  { day: "Sunday", hours: "Closed" },
];

const faqs = [
  {
    question: "What services do you offer?",
    answer:
      "We provide comprehensive software development services including web development, mobile app development, UI/UX design, and digital consulting.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Project timelines vary based on scope and complexity. Simple websites typically take 2-4 weeks, while complex applications can take 3-6 months or more.",
  },
  {
    question: "Do you work with startups?",
    answer:
      "Absolutely! We love working with startups and have special packages designed for early-stage companies. We understand the unique challenges startups face.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "We work with modern technologies including React, Next.js, Node.js, TypeScript, Python, and various cloud platforms like AWS and Vercel.",
  },
  {
    question: "Do you provide ongoing support?",
    answer:
      "Yes, we offer maintenance and support packages to ensure your application stays updated, secure, and performing optimally.",
  },
  {
    question: "Can you help with existing projects?",
    answer:
      "Definitely! We can help improve, maintain, or add features to existing applications. We're experienced in working with legacy codebases.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        type="Organization"
        data={{
          name: "Monsoft Solutions",
          description:
            "A software development company that provides innovative digital solutions.",
          url: "https://monsoft.com",
          telephone: "+1-555-123-4567",
          email: "hello@monsoft.com",
        }}
      />

      <div className="flex flex-col gap-12 py-8">
        {/* Header Section */}
        <section className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Get in Touch
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Have a project in mind? Need help with your existing application?
              We&apos;d love to hear from you. Let&apos;s discuss how we can
              help bring your ideas to life.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <Card
                  key={method.title}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <IconComponent className="h-10 w-10 text-primary mx-auto mb-2" />
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium mb-4">{method.contact}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <a href={method.action}>Contact Now</a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Contact Form */}
        <section className="container">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <HelpCircle className="h-8 w-8 text-primary" />
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our services, process, and
              pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Office Hours */}
        <section className="container">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                Office Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {officeHours.map((schedule) => (
                  <div
                    key={schedule.day}
                    className="flex justify-between items-center py-2"
                  >
                    <span className="font-medium">{schedule.day}</span>
                    <span className="text-muted-foreground">
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="container">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Don&apos;t wait any longer. Let&apos;s discuss your project
                requirements and how we can help you achieve your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  Schedule a Call
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  View Our Portfolio
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
