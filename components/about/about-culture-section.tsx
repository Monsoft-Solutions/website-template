"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import {
  Camera,
  MapPin,
  Calendar,
  Users,
  Coffee,
  Gamepad2,
  Music,
  Mountain,
} from "lucide-react";

interface CultureImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
  location?: string;
  date?: string;
  category: "workspace" | "team" | "events" | "culture";
  span: "normal" | "wide" | "tall";
}

const cultureImages: CultureImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    alt: "Modern office workspace",
    title: "Our Creative Workspace",
    description: "Designed for collaboration, focus, and inspiration",
    location: "San Francisco HQ",
    category: "workspace",
    span: "wide",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    alt: "Team brainstorming session",
    title: "Innovation Sessions",
    description: "Where great ideas come to life",
    date: "Weekly",
    category: "team",
    span: "normal",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    alt: "Coffee break conversations",
    title: "Coffee & Code",
    description: "The best ideas happen over great coffee",
    category: "culture",
    span: "normal",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    alt: "Annual team retreat",
    title: "Annual Retreat",
    description: "Building bonds beyond the office",
    location: "Lake Tahoe",
    date: "2024",
    category: "events",
    span: "tall",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    alt: "Office game room",
    title: "Unwind Zone",
    description: "Work hard, play harder",
    category: "workspace",
    span: "normal",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    alt: "Cross-team collaboration",
    title: "Collaboration First",
    description: "Breaking down silos, building up solutions",
    category: "team",
    span: "wide",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    alt: "Team learning workshop",
    title: "Continuous Learning",
    description: "Growing together, one skill at a time",
    date: "Monthly",
    category: "culture",
    span: "normal",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    alt: "Team celebration",
    title: "Celebrating Wins",
    description: "Every milestone deserves recognition",
    category: "events",
    span: "normal",
  },
];

const categoryIcons = {
  workspace: MapPin,
  team: Users,
  events: Calendar,
  culture: Coffee,
};

const categoryColors = {
  workspace: "text-blue-500",
  team: "text-green-500",
  events: "text-purple-500",
  culture: "text-orange-500",
};

export function AboutCultureSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background to-accent/5">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">
              <Camera className="w-4 h-4 mr-2" />
              Our Culture
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Life at{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Monsoft
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Peek behind the scenes to see what makes our workplace special.
              From collaborative workspaces to team adventures, discover the
              culture that drives our innovation.
            </p>
          </div>

          {/* Culture Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Coffee className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold mb-2">2,847</div>
              <div className="text-sm text-muted-foreground">
                Cups of Coffee
              </div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Gamepad2 className="w-8 h-8 text-green-500" />
              </div>
              <div className="text-2xl font-bold mb-2">156</div>
              <div className="text-sm text-muted-foreground">Game Nights</div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Music className="w-8 h-8 text-purple-500" />
              </div>
              <div className="text-2xl font-bold mb-2">24</div>
              <div className="text-sm text-muted-foreground">Team Events</div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Mountain className="w-8 h-8 text-orange-500" />
              </div>
              <div className="text-2xl font-bold mb-2">8</div>
              <div className="text-sm text-muted-foreground">Team Retreats</div>
            </div>
          </div>

          {/* Masonry Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {cultureImages.map((image) => {
              const IconComponent = categoryIcons[image.category];
              const iconColor = categoryColors[image.category];

              return (
                <Card
                  key={image.id}
                  className={`group relative overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-500 ${
                    image.span === "wide"
                      ? "md:col-span-2"
                      : image.span === "tall"
                      ? "lg:row-span-2"
                      : ""
                  }`}
                >
                  {/* Background Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                  <CardContent className="p-0 relative">
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <PlaceholderImage
                        src={image.src}
                        alt={image.alt}
                        width={400}
                        height={image.span === "tall" ? 600 : 300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <Badge
                          variant="secondary"
                          className="bg-background/80 backdrop-blur-sm"
                        >
                          <IconComponent
                            className={`w-3 h-3 mr-1 ${iconColor}`}
                          />
                          {image.category}
                        </Badge>
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-lg font-bold text-white mb-2">
                          {image.title}
                        </h3>
                        <p className="text-sm text-white/90 mb-4">
                          {image.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-white/70">
                          {image.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {image.location}
                            </div>
                          )}
                          {image.date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {image.date}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Culture Values */}
          <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/20">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold mb-4">
                  What Makes Us Different
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our culture isn&apos;t just about perks—it&apos;s about
                  creating an environment where everyone can do their best work
                  and grow both personally and professionally.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Inclusive Environment</h4>
                  <p className="text-sm text-muted-foreground">
                    Everyone&apos;s voice matters. We celebrate diversity and
                    create space for all perspectives.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Mountain className="w-6 h-6 text-green-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Work-Life Balance</h4>
                  <p className="text-sm text-muted-foreground">
                    Flexible schedules, remote options, and time for what
                    matters most to you.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Coffee className="w-6 h-6 text-purple-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Continuous Growth</h4>
                  <p className="text-sm text-muted-foreground">
                    Learning budgets, mentorship programs, and opportunities to
                    level up your skills.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
