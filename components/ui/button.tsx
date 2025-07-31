"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",

        // Sun Gulf Realty Brand Variants
        "brand-primary":
          "bg-accent-orange text-white hover:bg-orange-600 hover:-translate-y-0.5 shadow-button hover:shadow-button-hover font-semibold transition-all duration-200 focus:ring-accent-orange focus:ring-opacity-50 active:translate-y-0",
        "brand-secondary":
          "bg-transparent text-primary-blue border-2 border-primary-blue hover:bg-primary-blue hover:text-white font-semibold transition-all duration-200 focus:ring-primary-blue focus:ring-opacity-50",
        "brand-outline":
          "bg-transparent text-neutral-text border border-neutral-border hover:bg-secondary-light hover:border-primary-blue font-medium transition-all duration-200 focus:ring-primary-blue focus:ring-opacity-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",

        // Touch-friendly sizes
        touch: "h-11 px-6 py-3", // 44px minimum for mobile touch targets
        "touch-lg": "h-12 px-8 py-4", // Larger touch target
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
