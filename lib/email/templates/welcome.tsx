/**
 * Welcome email template
 *
 * This template is used to welcome new users to the platform
 */

import React from "react";
import { Text, Button, Section, Hr } from "@react-email/components";
import { BaseEmailTemplate } from "./base";
import { WelcomeEmailProps } from "@/lib/types/email.type";
import { emailTemplateConfig } from "@/lib/config/email.config";

export const WelcomeTemplate = ({
  recipientName,
  userName,
  userEmail,
  dashboardUrl,
  onboardingUrl,
  resourcesUrl,
  companyName,
  supportEmail,
  siteUrl,
}: WelcomeEmailProps) => {
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

  const buttonContainerStyle = {
    textAlign: "center" as const,
    margin: "20px 0",
  };

  const displayName = recipientName || userName || "there";

  return (
    <BaseEmailTemplate
      title={`Welcome to ${companyName || "our platform"}!`}
      previewText="Welcome! Get started with your new account"
      companyName={companyName}
      supportEmail={supportEmail}
      siteUrl={siteUrl}
    >
      <Section style={{ padding: "20px 0" }}>
        <Text style={titleStyle}>
          🎉 Welcome to {companyName || "our platform"}!
        </Text>

        <Text style={textStyle}>Hello {displayName},</Text>

        <Text style={textStyle}>
          Welcome aboard! We&apos;re thrilled to have you join our community.
          Your account has been successfully created and you&apos;re ready to
          start exploring all the amazing features we have to offer.
        </Text>

        <div style={highlightStyle}>
          <Text
            style={{ ...textStyle, margin: "0 0 10px 0", fontWeight: "600" }}
          >
            Account Details:
          </Text>
          <Text style={{ ...textStyle, margin: "5px 0", fontSize: "14px" }}>
            <strong>Email:</strong> {userEmail}
          </Text>
          <Text style={{ ...textStyle, margin: "5px 0", fontSize: "14px" }}>
            <strong>Username:</strong> {userName || "Not set"}
          </Text>
        </div>

        <div style={successStyle}>
          <Text
            style={{ ...textStyle, margin: "0 0 10px 0", fontWeight: "600" }}
          >
            🚀 Getting Started:
          </Text>
          <Text style={{ ...textStyle, margin: "5px 0", fontSize: "14px" }}>
            • Complete your profile setup
          </Text>
          <Text style={{ ...textStyle, margin: "5px 0", fontSize: "14px" }}>
            • Explore our features and tools
          </Text>
          <Text style={{ ...textStyle, margin: "5px 0", fontSize: "14px" }}>
            • Join our community and connect with others
          </Text>
          <Text style={{ ...textStyle, margin: "5px 0", fontSize: "14px" }}>
            • Check out our resources and tutorials
          </Text>
        </div>

        <Section style={buttonContainerStyle}>
          <Button href={dashboardUrl} style={buttonStyle}>
            Go to Dashboard
          </Button>
        </Section>

        {onboardingUrl && (
          <Section style={buttonContainerStyle}>
            <Button
              href={onboardingUrl}
              style={{
                ...buttonStyle,
                backgroundColor: "#28a745",
                marginTop: "10px",
              }}
            >
              Start Onboarding
            </Button>
          </Section>
        )}

        <Hr style={{ margin: "30px 0", borderColor: "#e6e6e6" }} />

        <Text style={textStyle}>
          <strong>Quick Links:</strong>
        </Text>

        <Text style={footerTextStyle}>
          •{" "}
          <a href={dashboardUrl} style={{ color: "#1a73e8" }}>
            Dashboard
          </a>{" "}
          - Your main workspace
        </Text>

        {onboardingUrl && (
          <Text style={footerTextStyle}>
            •{" "}
            <a href={onboardingUrl} style={{ color: "#1a73e8" }}>
              Onboarding
            </a>{" "}
            - Get started guide
          </Text>
        )}

        {resourcesUrl && (
          <Text style={footerTextStyle}>
            •{" "}
            <a href={resourcesUrl} style={{ color: "#1a73e8" }}>
              Resources
            </a>{" "}
            - Help and documentation
          </Text>
        )}

        <Text style={footerTextStyle}>
          •{" "}
          <a href={`mailto:${supportEmail}`} style={{ color: "#1a73e8" }}>
            Support
          </a>{" "}
          - Get help when you need it
        </Text>

        <Hr style={{ margin: "30px 0", borderColor: "#e6e6e6" }} />

        <Text style={textStyle}>
          We&apos;re here to help you succeed. If you have any questions,
          don&apos;t hesitate to reach out to our support team at{" "}
          <a href={`mailto:${supportEmail}`} style={{ color: "#1a73e8" }}>
            {supportEmail}
          </a>
        </Text>

        <Text style={textStyle}>
          Thank you for choosing {companyName || "our platform"}. We look
          forward to helping you achieve your goals!
        </Text>
      </Section>
    </BaseEmailTemplate>
  );
};
