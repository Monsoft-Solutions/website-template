/**
 * LazyImage component props type definition
 * Defines the properties for performance-optimized lazy loading image components
 */
export type LazyImageProps = {
  /** The source URL of the image */
  readonly src: string;
  /** Alternative text for accessibility */
  readonly alt: string;
  /** Width of the image in pixels */
  readonly width?: number;
  /** Height of the image in pixels */
  readonly height?: number;
  /** Additional CSS classes to apply */
  readonly className?: string;
  /** Whether to prioritize loading (disables lazy loading) */
  readonly priority?: boolean;
  /** Placeholder behavior while loading */
  readonly placeholder?: "blur" | "empty";
  /** Custom blur data URL for placeholder */
  readonly blurDataURL?: string;
  /** Responsive image sizes attribute */
  readonly sizes?: string;
  /** Whether to fill the parent container */
  readonly fill?: boolean;
  /** Image quality (1-100) */
  readonly quality?: number;
  /** Callback fired when image loads successfully */
  readonly onLoad?: () => void;
  /** Callback fired when image fails to load */
  readonly onError?: () => void;
};
