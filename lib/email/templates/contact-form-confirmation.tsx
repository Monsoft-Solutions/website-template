/**
 * Contact form confirmation email template
 *
 * This template is sent to users who submit a contact form to confirm receipt
 */

import React from "react";
import { Text, Section, Hr, Button } from "@react-email/components";
import { BaseEmailTemplate } from "./base";
import { ContactFormConfirmationEmailProps } from "@/lib/types/email.type";
import { emailTemplateConfig } from "@/lib/config/email.config";

export const ContactFormConfirmationTemplate = ({
  senderName,
  subject,
  message,
  submittedAt,
  companyName,
  supportEmail,
  siteUrl,
  responseTime = "24 hours",
}: ContactFormConfirmationEmailProps) => {
  const titleStyle = {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333333",
    margin: "0 0 20px 0",
    textAlign: "center" as const,
  };

  const textStyle = {
    fontSize: "16px",
    color: "#555555",
    lineHeight: "1.6",
    margin: "0 0 20px 0",
  };

  const highlightStyle = {
    backgroundColor: "#f0f9ff",
    borderLeft: "4px solid " + emailTemplateConfig.primaryColor,
    padding: "16px",
    margin: "20px 0",
    borderRadius: "4px",
  };

  const messageStyle = {
    backgroundColor: "#f8f9fa",
    border: "1px solid #e6e6e6",
    borderRadius: "8px",
    padding: "20px",
    margin: "20px 0",
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#333333",
    whiteSpace: "pre-wrap" as const,
  };

  const buttonStyle = {
    ...emailTemplateConfig.buttonStyle,
    display: "inline-block",
    width: "auto",
  };

  const submissionDate = new Date(submittedAt).toLocaleString();

  return (
    <BaseEmailTemplate
      title="Thank you for contacting us!"
      previewText={`We&apos;ve received your message and will respond within ${responseTime}`}
      companyName={companyName}
      supportEmail={supportEmail}
      siteUrl={siteUrl}
    >
      <Text style={titleStyle}>✅ Thank you for contacting us!</Text>

      <Text style={textStyle}>Hello {senderName},</Text>

      <Text style={textStyle}>
        We&apos;ve received your message and wanted to confirm that it has been
        successfully submitted. Our team will review your inquiry and get back
        to you within <strong>{responseTime}</strong>.
      </Text>

      <Section style={highlightStyle}>
        <Text style={{ ...textStyle, margin: "0" }}>
          <strong>Message Details:</strong>
          <br />
          <strong>Subject:</strong> {subject}
          <br />
          <strong>Submitted:</strong> {submissionDate}
        </Text>
      </Section>

      <Text style={textStyle}>
        <strong>Your Message:</strong>
      </Text>

      <Section style={messageStyle}>
        <Text style={{ margin: "0" }}>{message}</Text>
      </Section>

      <Hr
        style={{
          border: "none",
          borderTop: "1px solid #e6e6e6",
          margin: "30px 0",
        }}
      />

      <Text style={textStyle}>In the meantime, feel free to:</Text>

      <Section style={{ margin: "20px 0" }}>
        <Text style={{ ...textStyle, margin: "10px 0" }}>
          • Browse our website for more information
        </Text>
        <Text style={{ ...textStyle, margin: "10px 0" }}>
          • Check out our FAQ section
        </Text>
        <Text style={{ ...textStyle, margin: "10px 0" }}>
          • Follow us on social media for updates
        </Text>
      </Section>

      {siteUrl && (
        <Section style={{ textAlign: "center", margin: "30px 0" }}>
          <Button href={siteUrl} style={buttonStyle}>
            Visit Our Website
          </Button>
        </Section>
      )}

      <Text style={{ ...textStyle, fontSize: "14px", color: "#666666" }}>
        If you have any urgent questions or need immediate assistance, please
        don&apos;t hesitate to reach out to us directly at{" "}
        <a
          href={`mailto:${supportEmail}`}
          style={{ color: emailTemplateConfig.primaryColor }}
        >
          {supportEmail}
        </a>
        .
      </Text>

      <Text style={{ ...textStyle, fontSize: "14px", color: "#666666" }}>
        Thank you for choosing {companyName}. We look forward to connecting with
        you soon!
      </Text>
    </BaseEmailTemplate>
  );
};
