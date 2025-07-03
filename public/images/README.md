# Image Assets for SiteWave Website Template

This directory contains image assets used throughout the website template. The new home page sections use the following images:

## Required Images

### Hero Section

- `hero-dashboard.png` (800x600) - Main hero image showing website template preview

### Tech Stack Section

- `tech/nextjs.svg` - Next.js logo
- `tech/typescript.svg` - TypeScript logo
- `tech/tailwind.svg` - Tailwind CSS logo
- `tech/postgresql.svg` - PostgreSQL logo
- `tech/drizzle.svg` - Drizzle ORM logo
- `tech/shadcn.svg` - Shadcn/ui logo

### Blog Preview Section

- `blog/nextjs-15.jpg` (600x400) - Featured blog post image
- `blog/typescript-best-practices.jpg` (400x200) - Blog post thumbnail
- `blog/react-seo-optimization.jpg` (400x200) - Blog post thumbnail

### Final CTA Section

- `cta-mockup.png` (600x400) - Website template mockup for CTA section

## Fallback Handling

The template includes a `PlaceholderImage` component that gracefully handles missing images by showing a styled placeholder with an icon and alt text. This ensures the website functions perfectly even without all images present.

## Recommendations

- Use high-quality images optimized for web (WebP format recommended)
- Ensure images follow the specified dimensions for best layout results
- Consider using a consistent visual style across all images
- Optimize images for both light and dark themes

## Adding Your Own Images

1. Replace the placeholder images with your own assets
2. Update the image paths in the respective section components if needed
3. Ensure images are optimized for performance (next/image handles most optimizations automatically)
