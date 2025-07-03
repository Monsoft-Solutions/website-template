"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trophy,
  Award,
  Medal,
  Star,
  Shield,
  Crown,
  Zap,
  Target,
} from "lucide-react";

interface Recognition {
  id: number;
  type: "award" | "certification" | "recognition" | "achievement";
  title: string;
  organization: string;
  year: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  rank?: string;
}

const recognitions: Recognition[] = [
  {
    id: 1,
    type: "award",
    title: "Best Digital Agency",
    organization: "Tech Excellence Awards",
    year: "2024",
    description:
      "Recognized for outstanding innovation in digital transformation solutions",
    icon: Trophy,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    rank: "#1",
  },
  {
    id: 2,
    type: "certification",
    title: "Google Cloud Partner",
    organization: "Google Cloud",
    year: "2023",
    description: "Premier partner status for cloud architecture excellence",
    icon: Shield,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 3,
    type: "recognition",
    title: "Innovation Leader",
    organization: "Digital Transformation Summit",
    year: "2024",
    description: "Leading the industry in AI-powered development solutions",
    icon: Zap,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: 4,
    type: "award",
    title: "Customer Success Excellence",
    organization: "Client Choice Awards",
    year: "2024",
    description: "Highest client satisfaction scores in the industry",
    icon: Star,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    rank: "98%",
  },
  {
    id: 5,
    type: "achievement",
    title: "Fastest Growing Agency",
    organization: "Inc. 5000",
    year: "2023",
    description: "300% growth over three consecutive years",
    icon: Target,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    rank: "Top 100",
  },
  {
    id: 6,
    type: "certification",
    title: "AWS Advanced Partner",
    organization: "Amazon Web Services",
    year: "2023",
    description: "Advanced tier partnership for cloud solutions",
    icon: Crown,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: 7,
    type: "award",
    title: "Workplace Culture Award",
    organization: "Best Places to Work",
    year: "2024",
    description: "Creating an exceptional environment for our team",
    icon: Medal,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    id: 8,
    type: "recognition",
    title: "Sustainability Pioneer",
    organization: "Green Tech Initiative",
    year: "2024",
    description: "Leading sustainable technology practices",
    icon: Award,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
];

const typeLabels = {
  award: "Award",
  certification: "Certification",
  recognition: "Recognition",
  achievement: "Achievement",
};

export function AboutRecognitionSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-accent/5 to-background">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-6 h-6 bg-yellow-500/30 rounded-full" />
        <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-purple-500/30 rounded-full" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">
              <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
              Recognition & Awards
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Industry{" "}
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Recognition
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our commitment to excellence has been recognized by industry
              leaders, clients, and organizations worldwide. These awards
              reflect our dedication to innovation, quality, and client success.
            </p>
          </div>

          {/* Recognition Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {recognitions.map((recognition, index) => {
              const IconComponent = recognition.icon;

              return (
                <Card
                  key={recognition.id}
                  className="group relative overflow-hidden border-2 border-transparent hover:border-yellow-500/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Background Effects */}
                  <div
                    className={`absolute inset-0 ${recognition.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />

                  <CardContent className="p-6 relative">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 ${recognition.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300`}
                      >
                        <IconComponent
                          className={`w-6 h-6 ${recognition.color}`}
                        />
                      </div>

                      {recognition.rank && (
                        <Badge
                          variant="outline"
                          className="text-xs border-yellow-500/30 text-yellow-600 dark:text-yellow-400"
                        >
                          {recognition.rank}
                        </Badge>
                      )}
                    </div>

                    {/* Type Badge */}
                    <Badge variant="secondary" className="mb-3 text-xs">
                      {typeLabels[recognition.type]}
                    </Badge>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg leading-tight group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300">
                        {recognition.title}
                      </h3>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          {recognition.organization}
                        </p>
                        <p className="text-xs text-muted-foreground/80">
                          {recognition.year}
                        </p>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {recognition.description}
                      </p>
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Awards Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center group">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                25+
              </div>
              <div className="text-sm text-muted-foreground">Total Awards</div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                8
              </div>
              <div className="text-sm text-muted-foreground">
                Certifications
              </div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                12
              </div>
              <div className="text-sm text-muted-foreground">
                Industry Rankings
              </div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                5
              </div>
              <div className="text-sm text-muted-foreground">Years Running</div>
            </div>
          </div>

          {/* Quote Section */}
          <Card className="bg-gradient-to-br from-yellow-500/5 via-background to-orange-500/5 border-yellow-500/20">
            <CardContent className="p-8 lg:p-12 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Medal className="w-6 h-6 text-white" />
              </div>
              <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
                &ldquo;Excellence isn&apos;t a destination—it&apos;s a journey.
                These awards represent our commitment to pushing boundaries and
                delivering exceptional value to every client.&rdquo;
              </blockquote>
              <cite className="text-sm font-medium text-muted-foreground">
                — Leadership Team, Monsoft Solutions
              </cite>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
