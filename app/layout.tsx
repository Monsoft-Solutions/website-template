import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AnalyticsInitializer } from "@/components/analytics/AnalyticsInitializer";
import { defaultMetadata } from "@/lib/config/seo";
import { clientEnv } from "@/lib/env-client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}
        <Toaster position="bottom-right" />
        {clientEnv.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={clientEnv.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        )}
        <AnalyticsInitializer />
      </body>
    </html>
  );
}
