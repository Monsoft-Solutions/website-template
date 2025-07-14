/**
 * User invitation email template
 *
 * This template is used to invite new users to join the platform
 */

import React from "react";
import { Text, Button, Section, Hr } from "@react-email/components";
import { BaseEmailTemplate } from "./base";
import { UserInvitationEmailProps } from "@/lib/types/email.type";
import { emailTemplateConfig } from "@/lib/config/email.config";

export const UserInvitationTemplate = ({
  recipientName,
  inviterName,
  inviterEmail,
  invitationUrl,
  role,
  expiresAt,
  companyName,
  supportEmail,
  siteUrl,
}: UserInvitationEmailProps) => {
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

  const expirationDate = new Date(expiresAt).toLocaleDateString();

  return (
    <BaseEmailTemplate
      title={`Invitation to join ${companyName}`}
      previewText={`${inviterName} has invited you to join ${companyName} as a ${role}`}
      companyName={companyName}
      supportEmail={supportEmail}
      siteUrl={siteUrl}
    >
      <Text style={titleStyle}>
        🎉 You&apos;re invited to join {companyName}!
      </Text>

      <Text style={textStyle}>
        {recipientName ? `Hello ${recipientName},` : "Hello,"}
      </Text>

      <Text style={textStyle}>
        <strong>{inviterName}</strong> ({inviterEmail}) has invited you to join{" "}
        <strong>{companyName}</strong> as a <strong>{role}</strong>.
      </Text>

      <Section style={highlightStyle}>
        <Text style={{ ...textStyle, margin: "0" }}>
          <strong>Your role:</strong> {role}
          <br />
          <strong>Invited by:</strong> {inviterName}
          <br />
          <strong>Expires:</strong> {expirationDate}
        </Text>
      </Section>

      <Text style={textStyle}>
        To accept this invitation and create your account, click the button
        below:
      </Text>

      <Section style={{ textAlign: "center", margin: "30px 0" }}>
        <Button href={invitationUrl} style={buttonStyle}>
          Accept Invitation
        </Button>
      </Section>

      <Hr
        style={{
          border: "none",
          borderTop: "1px solid #e6e6e6",
          margin: "30px 0",
        }}
      />

      <Text style={textStyle}>
        If you can&apos;t click the button above, copy and paste this link into
        your browser:
      </Text>

      <Text
        style={{
          fontSize: "14px",
          color: "#666666",
          wordBreak: "break-all",
          backgroundColor: "#f8f9fa",
          padding: "10px",
          borderRadius: "4px",
          fontFamily: "monospace",
        }}
      >
        {invitationUrl}
      </Text>

      <Text style={{ ...textStyle, fontSize: "14px", color: "#666666" }}>
        This invitation will expire on {expirationDate}. If you don&apos;t
        accept by then, please contact {inviterName} for a new invitation.
      </Text>

      <Text style={{ ...textStyle, fontSize: "14px", color: "#666666" }}>
        If you didn&apos;t expect this invitation, you can safely ignore this
        email.
      </Text>
    </BaseEmailTemplate>
  );
};
