"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, ArrowRight, Lightbulb, Compass } from "lucide-react";

export function AboutMissionSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />

      <div className="container relative">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Compass className="w-4 h-4 mr-2" />
              Our Purpose
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Driven by{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Purpose
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our mission and vision guide every decision we make and every
              solution we create.
            </p>
          </div>

          {/* Split Layout */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Mission Card */}
            <Card className="group relative overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-500">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />

              <CardContent className="p-8 lg:p-12 relative">
                {/* Icon */}
                <div className="mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <Badge variant="secondary" className="text-sm font-medium">
                    Our Mission
                  </Badge>

                  <h3 className="text-3xl font-bold leading-tight">
                    Empowering Digital{" "}
                    <span className="text-primary">Transformation</span>
                  </h3>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To bridge the gap between innovative technology and human
                    needs by creating digital solutions that are not just
                    functional, but truly transformative. We empower businesses
                    to thrive in the digital age while maintaining their unique
                    identity and values.
                  </p>

                  {/* Mission Points */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Accessible Innovation:
                        </span>{" "}
                        Making cutting-edge technology available to businesses
                        of all sizes
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Human-Centered Design:
                        </span>{" "}
                        Creating solutions that prioritize user experience and
                        accessibility
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Sustainable Growth:
                        </span>{" "}
                        Building scalable solutions that grow with our
                        clients&apos; success
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vision Card */}
            <Card className="group relative overflow-hidden border-2 border-transparent hover:border-accent/20 transition-all duration-500">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl translate-y-16 -translate-x-16" />

              <CardContent className="p-8 lg:p-12 relative">
                {/* Icon */}
                <div className="mb-8">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-8 h-8 text-accent" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <Badge variant="secondary" className="text-sm font-medium">
                    Our Vision
                  </Badge>

                  <h3 className="text-3xl font-bold leading-tight">
                    Shaping the{" "}
                    <span className="text-accent">Digital Future</span>
                  </h3>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To be the catalyst that transforms how the world interacts
                    with technology. We envision a future where digital
                    experiences are so intuitive and meaningful that they
                    seamlessly enhance human potential and create lasting
                    positive impact.
                  </p>

                  {/* Vision Points */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-3 flex-shrink-0" />
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Global Impact:
                        </span>{" "}
                        Leading the way in ethical technology practices
                        worldwide
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-3 flex-shrink-0" />
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Innovation Pioneer:
                        </span>{" "}
                        Setting new standards for what&apos;s possible in
                        digital experiences
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-3 flex-shrink-0" />
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Community Builder:
                        </span>{" "}
                        Fostering an ecosystem where technology serves humanity
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How We Achieve This */}
          <Card className="bg-gradient-to-r from-primary/5 via-background to-accent/5 border-none">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center mb-12">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  How We Make It Happen
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our approach combines cutting-edge technology with deep human
                  understanding, resulting in solutions that are both innovative
                  and meaningful.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-primary">01</span>
                  </div>
                  <h4 className="text-lg font-semibold mb-3">
                    Deep Understanding
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We immerse ourselves in your world, understanding not just
                    what you need, but why you need it and how it fits into your
                    bigger picture.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-accent">02</span>
                  </div>
                  <h4 className="text-lg font-semibold mb-3">
                    Innovative Solutions
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We leverage the latest technologies and methodologies, but
                    more importantly, we think differently about problems to
                    create truly unique solutions.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-primary">03</span>
                  </div>
                  <h4 className="text-lg font-semibold mb-3">Lasting Impact</h4>
                  <p className="text-sm text-muted-foreground">
                    We measure success not just by delivery, but by the
                    long-term value and positive change our solutions create in
                    the world.
                  </p>
                </div>
              </div>

              {/* Connection Arrow */}
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <ArrowRight className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    This leads to extraordinary results
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
