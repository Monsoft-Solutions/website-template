import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/admin/Sidebar";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Panel | SiteWave",
  description: "Admin panel for managing SiteWave website content",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin route group layout
 * Provides complete HTML structure for admin pages without site header/footer
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <div className="h-screen overflow-hidden bg-background">
          <div className="flex h-full">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              {/* Main Content Area */}
              <main className="flex-1 overflow-auto">
                <div className="h-full">{children}</div>
              </main>
            </div>
          </div>
        </div>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
