import { Badge } from "@/components/ui/badge";
import { Circle, Eye, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmissionStatusBadgeProps {
  status: "new" | "read" | "responded";
  className?: string;
}

/**
 * Contact submission status badge component
 * Displays status with appropriate color coding and icons
 */
export function SubmissionStatusBadge({
  status,
  className,
}: SubmissionStatusBadgeProps) {
  const getStatusConfig = (status: "new" | "read" | "responded") => {
    switch (status) {
      case "new":
        return {
          label: "New",
          icon: Circle,
          className:
            "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
        };
      case "read":
        return {
          label: "Read",
          icon: Eye,
          className:
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400",
        };
      case "responded":
        return {
          label: "Responded",
          icon: CheckCircle,
          className:
            "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400",
        };
      default:
        return {
          label: status,
          icon: Circle,
          className:
            "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900/20 dark:text-gray-400",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1 font-medium",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
