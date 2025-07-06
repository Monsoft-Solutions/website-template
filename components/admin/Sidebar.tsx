"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession, signOut } from "@/lib/auth/client";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  FolderOpen,
  Tag,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  comingSoon?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Blog Posts",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    title: "Services",
    href: "/admin/services",
    icon: Briefcase,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    title: "Tags",
    href: "/admin/tags",
    icon: Tag,
  },
  {
    title: "Authors",
    href: "/admin/authors",
    icon: Users,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Shield,
  },
  {
    title: "Site Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">SiteWave</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="hidden lg:flex"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
        {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(false)}
            className="hidden lg:flex"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <div key={item.href} className="relative">
              <Link
                href={item.comingSoon ? "#" : item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                  isActive && "bg-accent text-accent-foreground",
                  item.comingSoon && "cursor-not-allowed opacity-60",
                  isCollapsed && "justify-center px-2"
                )}
                onClick={(e) => {
                  if (item.comingSoon) {
                    e.preventDefault();
                  }
                  if (window.innerWidth < 1024) {
                    setIsMobileOpen(false);
                  }
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
              {isCollapsed && item.badge && (
                <div className="absolute left-full top-0 ml-2 px-2 py-1 bg-popover border rounded-md shadow-md text-xs whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.title} - {item.badge}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={session?.user?.image || undefined} />
            <AvatarFallback>
              {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session?.user?.email}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="w-8 h-8"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
        {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="w-full mt-2"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-50"
        >
          <Menu className="w-4 h-4" />
        </Button>

        {isMobileOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
            <div className="relative flex flex-col w-64 bg-background border-r">
              <SidebarContent />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex flex-col bg-background border-r transition-all duration-200",
          isCollapsed ? "w-16" : "w-64",
          className
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}
