/**
 * Email Service Usage Example
 *
 * This component demonstrates how to use the email service
 * for sending contact form notifications and user invitations
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export function EmailExample() {
  const [isLoading, setIsLoading] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Invitation form state
  const [invitationForm, setInvitationForm] = useState({
    recipientName: "",
    recipientEmail: "",
    role: "Editor",
    inviterName: "John Admin",
    inviterEmail: "admin@example.com",
  });

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "contact-form",
          recipients: ["admin@example.com"], // Replace with actual admin email
          data: {
            senderName: contactForm.name,
            senderEmail: contactForm.email,
            subject: contactForm.subject,
            message: contactForm.message,
            submittedAt: new Date().toISOString(),
            companyName: "Site Wave",
            supportEmail: "support@example.com",
            siteUrl: "https://example.com",
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Contact form notification sent successfully!");

        // Reset form
        setContactForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error(result.error || "Failed to send email");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvitationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "user-invitation",
          recipients: [invitationForm.recipientEmail],
          data: {
            recipientName: invitationForm.recipientName,
            inviterName: invitationForm.inviterName,
            inviterEmail: invitationForm.inviterEmail,
            invitationUrl: `https://example.com/invite/${Date.now()}`, // Replace with actual invitation URL
            role: invitationForm.role,
            expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 72 hours
            companyName: "Site Wave",
            supportEmail: "support@example.com",
            siteUrl: "https://example.com",
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("User invitation sent successfully!");

        // Reset form
        setInvitationForm({
          recipientName: "",
          recipientEmail: "",
          role: "Editor",
          inviterName: "John Admin",
          inviterEmail: "admin@example.com",
        });
      } else {
        throw new Error(result.error || "Failed to send invitation");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send invitation"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Email Service Demo</h1>
        <p className="text-muted-foreground">
          Test the email service with contact form notifications and user
          invitations
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form Example */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Form Notification</CardTitle>
            <CardDescription>
              Send a notification email when someone submits a contact form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-subject">Subject</Label>
                <Input
                  id="contact-subject"
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, subject: e.target.value })
                  }
                  placeholder="Website Inquiry"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  placeholder="I'm interested in your services..."
                  required
                  rows={4}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Sending..." : "Send Contact Form Notification"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* User Invitation Example */}
        <Card>
          <CardHeader>
            <CardTitle>User Invitation</CardTitle>
            <CardDescription>
              Send an invitation email to a new user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvitationSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-name">Recipient Name</Label>
                <Input
                  id="invite-name"
                  value={invitationForm.recipientName}
                  onChange={(e) =>
                    setInvitationForm({
                      ...invitationForm,
                      recipientName: e.target.value,
                    })
                  }
                  placeholder="Jane Smith"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-email">Recipient Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={invitationForm.recipientEmail}
                  onChange={(e) =>
                    setInvitationForm({
                      ...invitationForm,
                      recipientEmail: e.target.value,
                    })
                  }
                  placeholder="jane@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <select
                  id="invite-role"
                  value={invitationForm.role}
                  onChange={(e) =>
                    setInvitationForm({
                      ...invitationForm,
                      role: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="Editor">Editor</option>
                  <option value="Admin">Admin</option>
                  <option value="Viewer">Viewer</option>
                  <option value="Contributor">Contributor</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inviter-name">Inviter Name</Label>
                <Input
                  id="inviter-name"
                  value={invitationForm.inviterName}
                  onChange={(e) =>
                    setInvitationForm({
                      ...invitationForm,
                      inviterName: e.target.value,
                    })
                  }
                  placeholder="John Admin"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inviter-email">Inviter Email</Label>
                <Input
                  id="inviter-email"
                  type="email"
                  value={invitationForm.inviterEmail}
                  onChange={(e) =>
                    setInvitationForm({
                      ...invitationForm,
                      inviterEmail: e.target.value,
                    })
                  }
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Sending..." : "Send User Invitation"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Prerequisites:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Add your Resend API key to environment variables</li>
              <li>Set up your from email address</li>
              <li>Configure admin email addresses</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Environment Variables:</h3>
            <pre className="bg-muted p-3 rounded-md text-sm">
              {`RESEND_API_KEY="your_api_key_here"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
RESEND_FROM_NAME="Your Company"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"`}
            </pre>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Development Mode:</h3>
            <p className="text-sm text-muted-foreground">
              Set <code>EMAIL_MOCK_MODE=&quot;true&quot;</code> to test without
              sending actual emails. All operations will be logged to console
              instead.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
