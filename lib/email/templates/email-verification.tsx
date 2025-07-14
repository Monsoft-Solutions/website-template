/**
 * Email verification template
 *
 * This template is used to send email verification links to users
 */

import React from "react";
import { Text, Button, Section, Hr } from "@react-email/components";
import { BaseEmailTemplate } from "./base";
import { EmailVerificationProps } from "@/lib/types/email.type";
import { emailTemplateConfig } from "@/lib/config/email.config";

export const EmailVerificationTemplate = ({
  recipientName,
  verificationUrl,
  userEmail,
  expiresAt,
  companyName,
  supportEmail,
  siteUrl,
}: EmailVerificationProps) => {
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

  const successStyle = {
    backgroundColor: "#d4edda",
    borderLeft: "4px solid #28a745",
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
      title="Verify Your Email Address"
      previewText="Please verify your email address to complete your account setup"
      companyName={companyName}
      supportEmail={supportEmail}
      siteUrl={siteUrl}
    >
      <Section style={{ padding: "20px 0" }}>
        <Text style={titleStyle}>✅ Verify Your Email Address</Text>

        <Text style={textStyle}>
          Hello{recipientName ? ` ${recipientName}` : ""},
        </Text>

        <Text style={textStyle}>
          Thank you for signing up! To complete your account setup and start
          using our platform, please verify your email address by clicking the
          button below.
        </Text>

        <div style={highlightStyle}>
          <Text
            style={{ ...textStyle, margin: "0 0 10px 0", fontWeight: "600" }}
          >
            Verification Details:
          </Text>
          <Text style={{ ...textStyle, margin: "5px 0", fontSize: "14px" }}>
            <strong>Email:</strong> {userEmail}
          </Text>
          <Text style={{ ...textStyle, margin: "5px 0", fontSize: "14px" }}>
            <strong>Expires:</strong> {formattedExpiration}
          </Text>
        </div>

        <Section style={{ textAlign: "center", margin: "30px 0" }}>
          <Button href={verificationUrl} style={buttonStyle}>
            Verify Email Address
          </Button>
        </Section>

        <div style={successStyle}>
          <Text
            style={{ ...textStyle, margin: "0 0 10px 0", fontWeight: "600" }}
          >
            🎉 What happens after verification:
          </Text>
          <Text style={{ ...textStyle, margin: "5px 0", fontSize: "14px" }}>
            • Your account will be fully activated
          </Text>
          <Text style={{ ...textStyle, margin: "5px 0", fontSize: "14px" }}>
            • You&apos;ll have access to all features
          </Text>
          <Text style={{ ...textStyle, margin: "5px 0", fontSize: "14px" }}>
            • You can start using the platform immediately
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
          {verificationUrl}
        </Text>

        <Text style={footerTextStyle}>
          This verification link will expire on {formattedExpiration}. If you
          didn&apos;t create an account with us, you can safely ignore this
          email.
        </Text>

        <Text style={footerTextStyle}>
          Need help? Contact our support team at{" "}
          <a href={`mailto:${supportEmail}`} style={{ color: "#1a73e8" }}>
            {supportEmail}
          </a>
        </Text>
      </Section>
    </BaseEmailTemplate>
  );
};
