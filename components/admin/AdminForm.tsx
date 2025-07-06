import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertCircle } from "lucide-react";

interface AdminFormProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  error?: string;
  success?: string;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  className?: string;
  showCard?: boolean;
}

/**
 * Admin form wrapper component
 * Provides consistent styling and structure for admin forms
 */
export function AdminForm({
  title,
  description,
  children,
  onSubmit,
  isLoading = false,
  error,
  success,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
  className,
  showCard = true,
}: AdminFormProps) {
  const FormContent = () => (
    <div className="space-y-6">
      {/* Header */}
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <Separator />
        </div>
      )}

      {/* Success Message */}
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form Fields */}
      <div className="space-y-4">{children}</div>

      {/* Form Actions */}
      <div className="flex items-center gap-2 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
        )}
      </div>
    </div>
  );

  const formElement = (
    <form onSubmit={onSubmit} className={cn("", className)}>
      <FormContent />
    </form>
  );

  if (showCard) {
    return (
      <Card>
        <CardContent className="p-6">{formElement}</CardContent>
      </Card>
    );
  }

  return formElement;
}
