/**
 * Password reset email template
 *
 * This template is used to send password reset links to users
 */

import React from "react";
import { Text, Button, Section, Hr } from "@react-email/components";
import { BaseEmailTemplate } from "./base";
import { PasswordResetEmailProps } from "@/lib/types/email.type";
import { emailTemplateConfig } from "@/lib/config/email.config";

export const PasswordResetTemplate = ({
  recipientName,
  resetUrl,
  expiresAt,
  userEmail,
  ipAddress,
  companyName,
  supportEmail,
  siteUrl,
}: PasswordResetEmailProps) => {
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

  const highlightStyle = {
    backgroundColor: "#f8f9fa",
    borderLeft: "4px solid " + emailTemplateConfig.primaryColor,
    padding: "16px",
    margin: "20px 0",
    borderRadius: "4px",
  };

  const warningStyle = {
    backgroundColor: "#fff3cd",
    borderLeft: "4px solid #ffc107",
    padding: "16px",
    margin: "20px 0",
    borderRadius: "4px",
  };

  const footerTextStyle = {
    fontSize: "14px",
    color: "#666666",
    margin: "10px 0",
  };

  const expirationDate = new Date(expiresAt);
  const formattedExpiration = expirationDate.toLocaleString();

  return (
    <BaseEmailTemplate
      title="Reset Your Password"
      previewText="Reset your password to regain access to your account"
      companyName={companyName}
      supportEmail={supportEmail}
      siteUrl={siteUrl}
    >
      <Section style={{ padding: "20px 0" }}>
        <Text style={titleStyle}>🔒 Reset Your Password</Text>

        <Text style={textStyle}>
          Hello{recipientName ? ` ${recipientName}` : ""},
        </Text>

        <Text style={textStyle}>
          We received a request to reset the password for your account
          associated with <strong>{userEmail}</strong>. If you made this
          request, click the button below to reset your password.
        </Text>

        <div style={highlightStyle}>
          <Text
            style={{ ...textStyle, margin: "0 0 10px 0", fontWeight: "600" }}
          >
            Password Reset Details:
          </Text>
          <Text style={{ ...textStyle, margin: "5px 0", fontSize: "14px" }}>
            <strong>Email:</strong> {userEmail}
          </Text>
          <Text style={{ ...textStyle, margin: "5px 0", fontSize: "14px" }}>
            <strong>Expires:</strong> {formattedExpiration}
          </Text>
          {ipAddress && (
            <Text style={{ ...textStyle, margin: "5px 0", fontSize: "14px" }}>
              <strong>Requested from:</strong> {ipAddress}
            </Text>
          )}
        </div>

        <Section style={{ textAlign: "center", margin: "30px 0" }}>
          <Button href={resetUrl} style={buttonStyle}>
            Reset Password
          </Button>
        </Section>

        <div style={warningStyle}>
          <Text
            style={{ ...textStyle, margin: "0 0 10px 0", fontWeight: "600" }}
          >
            ⚠️ Important Security Information:
          </Text>
          <Text style={{ ...textStyle, margin: "5px 0", fontSize: "14px" }}>
            • This link will expire on {formattedExpiration}
          </Text>
          <Text style={{ ...textStyle, margin: "5px 0", fontSize: "14px" }}>
            • If you didn&apos;t request this reset, please ignore this email
          </Text>
          <Text style={{ ...textStyle, margin: "5px 0", fontSize: "14px" }}>
            • For security, this link can only be used once
          </Text>
        </div>

        <Hr style={{ margin: "30px 0", borderColor: "#e6e6e6" }} />

        <Text style={footerTextStyle}>
          If you&apos;re having trouble clicking the button, copy and paste this
          URL into your browser:
        </Text>
        <Text
          style={{
            ...footerTextStyle,
            wordBreak: "break-all",
            color: "#1a73e8",
          }}
        >
          {resetUrl}
        </Text>

        <Text style={footerTextStyle}>
          If you didn&apos;t request a password reset, you can safely ignore
          this email. Your password will remain unchanged.
        </Text>

        <Text style={footerTextStyle}>
          For security questions, contact our support team at{" "}
          <a href={`mailto:${supportEmail}`} style={{ color: "#1a73e8" }}>
            {supportEmail}
          </a>
        </Text>
      </Section>
    </BaseEmailTemplate>
  );
};
