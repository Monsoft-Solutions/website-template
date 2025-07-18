import { Camera, Image as ImageIcon, Users, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface GalleryHeroProps {
  title?: string;
  description?: string;
  totalImages?: number;
  totalGroups?: number;
  featuredImages?: number;
  showStats?: boolean;
  className?: string;
}

export function GalleryHero({
  title = "Gallery",
  description = "Explore our collection of beautiful images and visual stories.",
  totalImages = 0,
  totalGroups = 0,
  featuredImages = 0,
  showStats = true,
  className = "",
}: GalleryHeroProps) {
  return (
    <section className={`relative py-20 lg:py-28 overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-accent/10 rounded-full blur-xl" />

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium"
            >
              <Camera className="h-4 w-4 mr-2" />
              Visual Portfolio
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            {title}
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground sm:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* Stats */}
          {showStats &&
            (totalImages > 0 || totalGroups > 0 || featuredImages > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
                {totalImages > 0 && (
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
                      <ImageIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {totalImages}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {totalImages === 1 ? "Image" : "Images"}
                    </div>
                  </div>
                )}

                {totalGroups > 0 && (
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mx-auto mb-2">
                      <Users className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {totalGroups}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {totalGroups === 1 ? "Category" : "Categories"}
                    </div>
                  </div>
                )}

                {featuredImages > 0 && (
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-2">
                      <Sparkles className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {featuredImages}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Featured
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="#gallery">Explore Gallery</Link>
            </Button>

            {featuredImages > 0 && (
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8"
                asChild
              >
                <Link href="?featured=true">
                  <Sparkles className="h-4 w-4 mr-2" />
                  View Featured
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Group-specific hero section
 */
interface GalleryGroupHeroProps {
  groupName: string;
  groupDescription?: string;
  imageCount?: number;
  coverImageUrl?: string;
  className?: string;
}

export function GalleryGroupHero({
  groupName,
  groupDescription,
  imageCount = 0,
  coverImageUrl,
  className = "",
}: GalleryGroupHeroProps) {
  return (
    <section className={`relative py-16 lg:py-20 overflow-hidden ${className}`}>
      {/* Background image or gradient */}
      {coverImageUrl ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${coverImageUrl})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      )}

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Breadcrumb */}
          <div className="mb-4">
            <nav className="flex justify-center" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link
                    href="/gallery"
                    className={`hover:underline ${
                      coverImageUrl
                        ? "text-white/80 hover:text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Gallery
                  </Link>
                </li>
                <span
                  className={
                    coverImageUrl ? "text-white/60" : "text-muted-foreground"
                  }
                >
                  /
                </span>
                <li
                  className={`font-medium ${coverImageUrl ? "text-white" : "text-foreground"}`}
                >
                  {groupName}
                </li>
              </ol>
            </nav>
          </div>

          {/* Title */}
          <h1
            className={`text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4 ${
              coverImageUrl ? "text-white" : "text-foreground"
            }`}
          >
            {groupName}
          </h1>

          {/* Description */}
          {groupDescription && (
            <p
              className={`text-lg sm:text-xl mb-6 max-w-2xl mx-auto leading-relaxed ${
                coverImageUrl ? "text-white/90" : "text-muted-foreground"
              }`}
            >
              {groupDescription}
            </p>
          )}

          {/* Image count */}
          {imageCount > 0 && (
            <Badge
              variant={coverImageUrl ? "secondary" : "outline"}
              className={`px-4 py-2 text-sm font-medium ${
                coverImageUrl ? "bg-white/20 text-white border-white/30" : ""
              }`}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              {imageCount} {imageCount === 1 ? "Image" : "Images"}
            </Badge>
          )}
        </div>
      </div>
    </section>
  );
}
