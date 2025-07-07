"use client";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/utils/analytics";
import Link from "next/link";
import { ButtonProps } from "@/components/ui/button";
import { ReactNode } from "react";

interface AnalyticsButtonProps extends Omit<ButtonProps, "asChild"> {
  href: string;
  postTitle: string;
  postCategory: string;
  children: ReactNode;
  isViewAllButton?: boolean;
}

export function AnalyticsButton({
  href,
  postTitle,
  postCategory,
  children,
  isViewAllButton = false,
  ...buttonProps
}: AnalyticsButtonProps) {
  const handleClick = () => {
    if (isViewAllButton) {
      trackEvent({
        action: "view_all_blog_click",
        category: "navigation",
        label: "Blog Preview Section",
      });
    } else {
      trackEvent({
        action: "blog_preview_click",
        category: "engagement",
        label: `${postCategory}: ${postTitle}`,
      });
    }
  };

  return (
    <Button {...buttonProps} asChild>
      <Link href={href} onClick={handleClick}>
        {children}
      </Link>
    </Button>
  );
}
