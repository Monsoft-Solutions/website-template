import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  badge?: string;
  className?: string;
}

/**
 * Admin page header component
 * Provides consistent styling and structure for admin pages
 */
export function PageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  badge,
  className,
}: PageHeaderProps) {
  const allBreadcrumbs = [
    { label: "Dashboard", href: "/admin" },
    ...breadcrumbs,
  ];

  return (
    <div className={cn("border-b bg-background px-6 py-4", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
          {allBreadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center">
              {index === 0 && <Home className="w-4 h-4 mr-1" />}
              {item.href && !item.active ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(item.active && "text-foreground font-medium")}
                >
                  {item.label}
                </span>
              )}
              {index < allBreadcrumbs.length - 1 && (
                <ChevronRight className="w-4 h-4 mx-1" />
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Header Content */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
