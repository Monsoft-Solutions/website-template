"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Home,
  RefreshCw,
  Bug,
  Mail,
  ExternalLink,
} from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { isDevelopment } from "@/lib/env-client";

// Force dynamic rendering to avoid build-time Html import issues
export const dynamic = "force-dynamic";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  // Safer development check that works during build

  return (
    <div className="flex flex-col gap-12 py-16">
      {/* Main Error Section */}
      <section className="container">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Something went wrong!
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We encountered an unexpected error. Don&apos;t worry, our team has
              been notified and we&apos;re working to fix this issue.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={reset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <BackButton />
          </div>
        </div>
      </section>

      {/* Error Details (Development Only) */}
      {isDevelopment && (
        <section className="container">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Bug className="h-5 w-5" />
                Error Details (Development Mode)
              </CardTitle>
              <CardDescription>
                This information is only shown in development mode to help with
                debugging.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge variant="destructive" className="mb-2">
                  Error Name
                </Badge>
                <p className="text-sm font-mono bg-muted p-2 rounded">
                  {error.name || "Unknown Error"}
                </p>
              </div>

              <div>
                <Badge variant="destructive" className="mb-2">
                  Error Message
                </Badge>
                <p className="text-sm font-mono bg-muted p-2 rounded">
                  {error.message || "No error message available"}
                </p>
              </div>

              {error.digest && (
                <div>
                  <Badge variant="secondary" className="mb-2">
                    Error Digest
                  </Badge>
                  <p className="text-sm font-mono bg-muted p-2 rounded">
                    {error.digest}
                  </p>
                </div>
              )}

              {error.stack && (
                <div>
                  <Badge variant="destructive" className="mb-2">
                    Stack Trace
                  </Badge>
                  <pre className="text-xs font-mono bg-muted p-4 rounded overflow-x-auto whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* What You Can Do */}
      <section className="container">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">What can you do?</CardTitle>
            <CardDescription>
              Here are some steps you can try to resolve this issue:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Click &quot;Try Again&quot; to reload the page and retry the
                  action
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Check your internet connection and try refreshing the page
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Clear your browser cache and cookies for this site
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  If the problem persists, please contact our support team
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Support Section */}
      <section className="container">
        <Card className="bg-muted/50 max-w-2xl mx-auto">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
            <p className="text-muted-foreground mb-6">
              If this error continues to occur, please let us know. Include any
              details about what you were doing when this error occurred.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href={`mailto:support@monsoft.com?subject=Error Report&body=Error Details:%0D%0A- Error: ${encodeURIComponent(
                    error.message
                  )}${error.digest ? `%0D%0A- Digest: ${error.digest}` : ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Report Error
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
