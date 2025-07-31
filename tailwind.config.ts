import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Sun Gulf Realty Brand Colors
        "primary-blue": {
          DEFAULT: "hsl(var(--primary-blue-light))",
          dark: "hsl(var(--primary-blue-dark))",
          light: "hsl(var(--primary-blue-light))",
        },
        "secondary-white": {
          DEFAULT: "hsl(var(--secondary-white))",
          light: "hsl(var(--secondary-light))",
        },
        "accent-orange": "hsl(var(--accent-orange))",
        "neutral-text": "hsl(var(--neutral-text))",
        "neutral-light": "hsl(var(--neutral-light))",
        "neutral-border": "hsl(var(--neutral-border))",
        "neutral-background": "hsl(var(--neutral-background))",

        // Shadcn UI Colors (mapped to brand colors)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        headline: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "Helvetica Neue", "sans-serif"],
        accent: ["Dancing Script", "cursive"],
      },
      fontSize: {
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
        "5xl": "3rem", // 48px
      },
      spacing: {
        "1": "0.25rem", // 4px
        "2": "0.5rem", // 8px
        "3": "0.75rem", // 12px
        "4": "1rem", // 16px
        "6": "1.5rem", // 24px
        "8": "2rem", // 32px
        "12": "3rem", // 48px
        "16": "4rem", // 64px
        "20": "5rem", // 80px
        "24": "6rem", // 96px
      },
      maxWidth: {
        "container-sm": "640px",
        "container-md": "768px",
        "container-lg": "1024px",
        "container-xl": "1280px",
        "container-2xl": "1536px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        shimmer: {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        gradient: "gradient 3s ease infinite",
        shimmer: "shimmer 3s infinite",
        spin: "spin 1s linear infinite",
      },
      boxShadow: {
        card: "0 4px 6px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 8px 25px rgba(0, 0, 0, 0.1)",
        property: "0 4px 6px rgba(0, 0, 0, 0.05)",
        "property-hover": "0 12px 30px rgba(0, 0, 0, 0.15)",
        button: "0 2px 4px rgba(249, 115, 22, 0.2)",
        "button-hover": "0 4px 8px rgba(249, 115, 22, 0.3)",
        testimonial: "0 4px 20px rgba(0, 0, 0, 0.08)",
        search: "0 8px 32px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
