"use client";

import { useState, useEffect } from "react";
import { useGoogleIndexing } from "@/lib/hooks/useGoogleIndexing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Globe,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  ExternalLink,
  Loader2,
  Settings,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

interface GoogleIndexingPanelProps {
  className?: string;
}

export function GoogleIndexingPanel({ className }: GoogleIndexingPanelProps) {
  const {
    isLoading,
    error,
    lastResult,
    config,
    notifyAllUrls,
    notifySiteSettings,
    checkConfiguration,
    clearError,
  } = useGoogleIndexing();

  const [lastOperation, setLastOperation] = useState<string | null>(null);

  useEffect(() => {
    checkConfiguration();
  }, [checkConfiguration]); // Now stable due to useCallback

  const handleNotifyAll = async () => {
    try {
      setLastOperation("Notifying all URLs");
      const result = await notifyAllUrls();

      toast.success(
        `Successfully notified ${result.successCount}/${result.totalUrls} URLs to Google`
      );

      if (result.failedCount > 0) {
        toast.warning(`${result.failedCount} URLs failed to be notified`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to notify Google"
      );
    } finally {
      setLastOperation(null);
    }
  };

  const handleNotifySiteSettings = async () => {
    try {
      setLastOperation("Notifying site pages");
      const result = await notifySiteSettings();

      toast.success(
        `Successfully notified ${result.successCount}/${result.totalUrls} site pages to Google`
      );

      if (result.failedCount > 0) {
        toast.warning(`${result.failedCount} pages failed to be notified`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to notify Google"
      );
    } finally {
      setLastOperation(null);
    }
  };

  const handleRefreshConfiguration = async () => {
    try {
      setLastOperation("Refreshing configuration");
      // Force refresh configuration
      await checkConfiguration(true);
      toast.success("Configuration refreshed successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to refresh configuration"
      );
    } finally {
      setLastOperation(null);
    }
  };

  const getConfigurationStatus = () => {
    if (!config) {
      return {
        status: "checking",
        color: "secondary",
        icon: Loader2,
        text: "Checking configuration...",
      };
    }

    if (config.isConfigured) {
      return {
        status: "configured",
        color: "default",
        icon: CheckCircle,
        text: "Google Indexing is configured",
      };
    }

    return {
      status: "not-configured",
      color: "destructive",
      icon: AlertCircle,
      text: "Google Indexing requires configuration",
    };
  };

  const configStatus = getConfigurationStatus();
  const StatusIcon = configStatus.icon;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="size-5 text-primary" />
          <CardTitle>Google Indexing</CardTitle>
          <Badge
            variant={
              configStatus.color as
                | "default"
                | "secondary"
                | "destructive"
                | "outline"
            }
            className="ml-auto"
          >
            <StatusIcon className="size-3 mr-1" />
            {configStatus.status === "checking"
              ? "Checking..."
              : configStatus.status === "configured"
              ? "Configured"
              : "Not Configured"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Configuration Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <StatusIcon
              className={`size-4 ${
                configStatus.status === "configured"
                  ? "text-green-600"
                  : configStatus.status === "not-configured"
                  ? "text-yellow-600"
                  : "text-muted-foreground"
              }`}
            />
            <span className="text-muted-foreground">{configStatus.text}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshConfiguration}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            {isLoading && lastOperation === "Refreshing configuration" ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <RotateCcw className="size-3" />
            )}
          </Button>
        </div>

        {/* Configuration Details */}
        {config && !config.isConfigured && (
          <Alert>
            <Settings className="size-4" />
            <AlertDescription>
              Missing environment variables:{" "}
              {!config.hasClientEmail && "GOOGLE_CLIENT_EMAIL"}{" "}
              {!config.hasPrivateKey && "GOOGLE_PRIVATE_KEY"}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="size-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Separator />

        {/* Manual Actions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Manual Indexing Operations</h4>

          <div className="grid gap-2">
            <Button
              onClick={handleNotifyAll}
              disabled={!config?.isConfigured || isLoading}
              className="w-full justify-start"
              variant="outline"
            >
              {isLoading && lastOperation === "Notifying all URLs" ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="size-4 mr-2" />
              )}
              Notify All Sitemap URLs
            </Button>

            <Button
              onClick={handleNotifySiteSettings}
              disabled={!config?.isConfigured || isLoading}
              className="w-full justify-start"
              variant="outline"
            >
              {isLoading && lastOperation === "Notifying site pages" ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Globe className="size-4 mr-2" />
              )}
              Notify Main Site Pages
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Manual operations will notify Google about content updates
            immediately.
          </p>
        </div>

        {/* Last Operation Result */}
        {lastResult && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Last Operation Results</h4>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-medium">{lastResult.totalUrls}</div>
                  <div className="text-xs text-muted-foreground">
                    Total URLs
                  </div>
                </div>

                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-medium text-green-700">
                    {lastResult.successCount}
                  </div>
                  <div className="text-xs text-green-600">Successful</div>
                </div>

                <div className="text-center p-2 bg-red-50 rounded">
                  <div className="font-medium text-red-700">
                    {lastResult.failedCount}
                  </div>
                  <div className="text-xs text-red-600">Failed</div>
                </div>
              </div>

              {lastResult.failedCount > 0 && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    View failed URLs ({lastResult.failedCount})
                  </summary>
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    {lastResult.results
                      .filter((r) => !r.success)
                      .map((result, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-red-600"
                        >
                          <XCircle className="size-3" />
                          <span className="truncate">{result.url}</span>
                        </div>
                      ))}
                  </div>
                </details>
              )}
            </div>
          </>
        )}

        {/* Information */}
        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ExternalLink className="size-3" />
            <span>
              Google Indexing API helps search engines discover your content
              faster.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
