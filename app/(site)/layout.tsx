import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/config/site";
import { clientEnv } from "@/lib/env-client";

interface SiteLayoutProps {
  children: React.ReactNode;
}

/**
 * Site route group layout
 * Provides header, footer, and main content structure for all site pages
 */
export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <JsonLd
        type="WebSite"
        data={{
          name: siteConfig.name,
          description: siteConfig.description,
          url: clientEnv.NEXT_PUBLIC_SITE_URL,
        }}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
