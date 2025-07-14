/**
 * Contact form notification email template
 *
 * This template is used to notify admins about new contact form submissions
 */

import React from "react";
import { Text, Section, Hr, Button } from "@react-email/components";
import { BaseEmailTemplate } from "./base";
import { ContactFormNotificationEmailProps } from "@/lib/types/email.type";
import { emailTemplateConfig } from "@/lib/config/email.config";

export const ContactFormNotificationTemplate = ({
  senderName,
  senderEmail,
  subject,
  message,
  formUrl,
  submittedAt,
  userAgent,
  ipAddress,
  companyName,
  supportEmail,
  siteUrl,
}: ContactFormNotificationEmailProps) => {
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
    backgroundColor: "#f8f9fa",
    borderLeft: "4px solid " + emailTemplateConfig.primaryColor,
    padding: "16px",
    margin: "20px 0",
    borderRadius: "4px",
  };

  const messageStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e6e6e6",
    borderRadius: "8px",
    padding: "20px",
    margin: "20px 0",
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#333333",
    whiteSpace: "pre-wrap" as const,
  };

  const metaStyle = {
    fontSize: "14px",
    color: "#666666",
    margin: "10px 0",
  };

  const buttonStyle = {
    ...emailTemplateConfig.buttonStyle,
    display: "inline-block",
    width: "auto",
  };

  const submissionDate = new Date(submittedAt).toLocaleString();

  return (
    <BaseEmailTemplate
      title="New Contact Form Submission"
      previewText={`New message from ${senderName} (${senderEmail})`}
      companyName={companyName}
      supportEmail={supportEmail}
      siteUrl={siteUrl}
    >
      <Text style={titleStyle}>📧 New Contact Form Submission</Text>

      <Section style={highlightStyle}>
        <Text style={{ ...textStyle, margin: "0" }}>
          <strong>From:</strong> {senderName} ({senderEmail})
          <br />
          <strong>Subject:</strong> {subject}
          <br />
          <strong>Submitted:</strong> {submissionDate}
        </Text>
      </Section>

      <Text style={textStyle}>
        <strong>Message:</strong>
      </Text>

      <Section style={messageStyle}>
        <Text style={{ margin: "0" }}>{message}</Text>
      </Section>

      {formUrl && (
        <Section style={{ textAlign: "center", margin: "30px 0" }}>
          <Button href={formUrl} style={buttonStyle}>
            View in Dashboard
          </Button>
        </Section>
      )}

      <Hr
        style={{
          border: "none",
          borderTop: "1px solid #e6e6e6",
          margin: "30px 0",
        }}
      />

      <Text style={textStyle}>
        <strong>Submission Details:</strong>
      </Text>

      <Section>
        <Text style={metaStyle}>
          <strong>Email:</strong> {senderEmail}
        </Text>
        <Text style={metaStyle}>
          <strong>Name:</strong> {senderName}
        </Text>
        <Text style={metaStyle}>
          <strong>Date:</strong> {submissionDate}
        </Text>
        {ipAddress && (
          <Text style={metaStyle}>
            <strong>IP Address:</strong> {ipAddress}
          </Text>
        )}
        {userAgent && (
          <Text style={metaStyle}>
            <strong>User Agent:</strong> {userAgent}
          </Text>
        )}
      </Section>

      <Text style={{ ...textStyle, fontSize: "14px", color: "#666666" }}>
        This is an automated notification from your contact form. Please respond
        to {senderEmail} directly if you wish to reply.
      </Text>
    </BaseEmailTemplate>
  );
};
