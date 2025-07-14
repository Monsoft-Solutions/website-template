/**
 * Notification email template
 *
 * This template is used to send various types of notifications to users
 */

import React from "react";
import { Text, Button, Section, Hr } from "@react-email/components";
import { BaseEmailTemplate } from "./base";
import { NotificationEmailProps } from "@/lib/types/email.type";
import { emailTemplateConfig } from "@/lib/config/email.config";

export const NotificationTemplate = ({
  recipientName,
  title,
  message,
  actionUrl,
  actionText,
  severity,
  timestamp,
  companyName,
  supportEmail,
  siteUrl,
}: NotificationEmailProps) => {
  const buttonStyle = {
    ...emailTemplateConfig.buttonStyle,
    display: "inline-block",
    width: "auto",
  };

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

  const footerTextStyle = {
    fontSize: "14px",
    color: "#666666",
    margin: "10px 0",
  };

  // Get severity-specific styling
  const getSeverityStyle = (
    severity: "info" | "warning" | "error" | "success"
  ) => {
    const baseStyle = {
      padding: "16px",
      margin: "20px 0",
      borderRadius: "4px",
      borderLeft: "4px solid",
    };

    switch (severity) {
      case "success":
        return {
          ...baseStyle,
          backgroundColor: "#d4edda",
          borderLeftColor: "#28a745",
        };
      case "warning":
        return {
          ...baseStyle,
          backgroundColor: "#fff3cd",
          borderLeftColor: "#ffc107",
        };
      case "error":
        return {
          ...baseStyle,
          backgroundColor: "#f8d7da",
          borderLeftColor: "#dc3545",
        };
      case "info":
      default:
        return {
          ...baseStyle,
          backgroundColor: "#d1ecf1",
          borderLeftColor: "#17a2b8",
        };
    }
  };

  const getSeverityIcon = (
    severity: "info" | "warning" | "error" | "success"
  ) => {
    switch (severity) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      case "info":
      default:
        return "ℹ️";
    }
  };

  const getSeverityButtonColor = (
    severity: "info" | "warning" | "error" | "success"
  ) => {
    switch (severity) {
      case "success":
        return "#28a745";
      case "warning":
        return "#ffc107";
      case "error":
        return "#dc3545";
      case "info":
      default:
        return "#17a2b8";
    }
  };

  const severityStyle = getSeverityStyle(severity);
  const severityIcon = getSeverityIcon(severity);
  const severityButtonColor = getSeverityButtonColor(severity);

  const actionButtonStyle = actionUrl
    ? {
        ...buttonStyle,
        backgroundColor: severityButtonColor,
      }
    : buttonStyle;

  return (
    <BaseEmailTemplate
      title={title}
      previewText={`Notification: ${title}`}
      companyName={companyName}
      supportEmail={supportEmail}
      siteUrl={siteUrl}
    >
      <Section style={{ padding: "20px 0" }}>
        <Text style={titleStyle}>
          {severityIcon} {title}
        </Text>

        <Text style={textStyle}>
          Hello{recipientName ? ` ${recipientName}` : ""},
        </Text>

        <div style={severityStyle}>
          <Text style={{ ...textStyle, margin: "0", whiteSpace: "pre-wrap" }}>
            {message}
          </Text>
        </div>

        {actionUrl && actionText && (
          <Section style={{ textAlign: "center", margin: "30px 0" }}>
            <Button href={actionUrl} style={actionButtonStyle}>
              {actionText}
            </Button>
          </Section>
        )}

        <Hr style={{ margin: "30px 0", borderColor: "#e6e6e6" }} />

        <Text style={footerTextStyle}>
          This is an automated notification from {companyName || "our platform"}{" "}
          sent on {new Date(timestamp).toLocaleString()}. If you have any
          questions or concerns, please don&apos;t hesitate to contact our
          support team.
        </Text>

        <Text style={footerTextStyle}>
          Need help? Contact our support team at{" "}
          <a href={`mailto:${supportEmail}`} style={{ color: "#1a73e8" }}>
            {supportEmail}
          </a>
        </Text>

        {actionUrl && (
          <>
            <Text style={footerTextStyle}>
              If you&apos;re having trouble clicking the button, copy and paste
              this URL into your browser:
            </Text>
            <Text
              style={{
                ...footerTextStyle,
                wordBreak: "break-all",
                color: "#1a73e8",
              }}
            >
              {actionUrl}
            </Text>
          </>
        )}
      </Section>
    </BaseEmailTemplate>
  );
};
