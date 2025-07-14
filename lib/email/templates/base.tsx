/**
 * Base email template component
 *
 * This component provides a consistent layout and styling for all email templates
 */

import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Font,
} from "@react-email/components";
import { BaseEmailTemplateProps } from "@/lib/types/email.type";
import { emailTemplateConfig } from "@/lib/config/email.config";

export interface BaseEmailProps extends BaseEmailTemplateProps {
  title?: string;
  previewText?: string;
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const BaseEmailTemplate = ({
  title = "Notification",
  previewText = "You have a new notification",
  children,
  showHeader = true,
  showFooter = true,
  companyName = emailTemplateConfig.companyName,
  supportEmail = emailTemplateConfig.supportEmail,
  siteUrl = "",
  unsubscribeUrl,
}: BaseEmailProps) => {
  const mainStyle = {
    backgroundColor: "#ffffff",
    fontFamily: emailTemplateConfig.fontFamily,
    margin: "0 auto",
    maxWidth: emailTemplateConfig.maxWidth,
  };

  const containerStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e6e6e6",
    borderRadius: emailTemplateConfig.borderRadius,
    margin: "0 auto",
    maxWidth: emailTemplateConfig.maxWidth,
    padding: "20px",
  };

  const headerStyle = {
    backgroundColor: emailTemplateConfig.primaryColor,
    borderRadius: `${emailTemplateConfig.borderRadius} ${emailTemplateConfig.borderRadius} 0 0`,
    padding: "20px",
    textAlign: "center" as const,
  };

  const contentStyle = {
    padding: "40px 20px",
  };

  const footerStyle = {
    ...emailTemplateConfig.footerStyle,
    borderTop: "1px solid #e6e6e6",
    marginTop: "40px",
    textAlign: "center" as const,
  };

  const linkStyle = {
    color: emailTemplateConfig.primaryColor,
    textDecoration: "none",
  };

  return (
    <Html>
      <Head>
        <title>{title}</title>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <meta name="description" content={previewText} />
      </Head>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          {showHeader && (
            <Section style={headerStyle}>
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: "24px",
                  fontWeight: "600",
                  margin: "0",
                }}
              >
                {companyName}
              </Text>
            </Section>
          )}

          <Section style={contentStyle}>{children}</Section>

          {showFooter && (
            <Section style={footerStyle}>
              <Hr
                style={{
                  border: "none",
                  borderTop: "1px solid #e6e6e6",
                  margin: "20px 0",
                }}
              />
              <Text
                style={{ margin: "10px 0", fontSize: "12px", color: "#666666" }}
              >
                This email was sent by {companyName}
              </Text>
              <Text
                style={{ margin: "10px 0", fontSize: "12px", color: "#666666" }}
              >
                Need help? Contact us at{" "}
                <Link href={`mailto:${supportEmail}`} style={linkStyle}>
                  {supportEmail}
                </Link>
              </Text>
              {siteUrl && (
                <Text
                  style={{
                    margin: "10px 0",
                    fontSize: "12px",
                    color: "#666666",
                  }}
                >
                  Visit our website:{" "}
                  <Link href={siteUrl} style={linkStyle}>
                    {siteUrl.replace(/^https?:\/\//, "")}
                  </Link>
                </Text>
              )}
              {unsubscribeUrl && (
                <Text
                  style={{
                    margin: "10px 0",
                    fontSize: "12px",
                    color: "#666666",
                  }}
                >
                  <Link href={unsubscribeUrl} style={linkStyle}>
                    Unsubscribe
                  </Link>
                </Text>
              )}
            </Section>
          )}
        </Container>
      </Body>
    </Html>
  );
};
