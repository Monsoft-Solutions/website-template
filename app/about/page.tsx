import { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateSeoMetadata } from "@/lib/config/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  Users,
  Target,
  Award,
  Heart,
  Code,
  Lightbulb,
  Shield,
  Globe,
} from "lucide-react";

export const metadata: Metadata = generateSeoMetadata({
  title: "About Us",
  description:
    "Learn about our mission, values, and the team behind our innovative solutions. We're passionate about creating exceptional digital experiences.",
  keywords: ["about", "team", "mission", "values", "company"],
});

// Team members data - this would typically come from a database or CMS
const teamMembers = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Founder & CEO",
    bio: "With over 10 years of experience in tech leadership, Alex founded the company with a vision to make technology accessible to everyone.",
    image: "/images/team/alex.jpg",
    skills: ["Leadership", "Strategy", "Product Vision"],
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "CTO",
    bio: "Sarah leads our technical innovation, bringing expertise in scalable architecture and emerging technologies.",
    image: "/images/team/sarah.jpg",
    skills: ["Technical Leadership", "Architecture", "Innovation"],
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Lead Designer",
    bio: "Michael crafts beautiful, user-centered designs that bridge the gap between functionality and aesthetics.",
    image: "/images/team/michael.jpg",
    skills: ["UI/UX Design", "Brand Design", "User Research"],
  },
  {
    id: 4,
    name: "Emily Watson",
    role: "Head of Marketing",
    bio: "Emily drives our growth strategy and ensures our message reaches the right audience at the right time.",
    image: "/images/team/emily.jpg",
    skills: ["Digital Marketing", "Growth Strategy", "Content Strategy"],
  },
];

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Everything we do is centered around delivering exceptional value to our customers.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We constantly push boundaries and embrace new technologies to solve complex problems.",
  },
  {
    icon: Shield,
    title: "Integrity",
    description:
      "We build trust through transparency, honesty, and ethical business practices.",
  },
  {
    icon: Globe,
    title: "Sustainability",
    description:
      "We're committed to creating solutions that benefit both business and the environment.",
  },
];

const stats = [
  { label: "Years Experience", value: "10+" },
  { label: "Projects Completed", value: "500+" },
  { label: "Happy Clients", value: "200+" },
  { label: "Team Members", value: "25+" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        type="Organization"
        data={{
          name: "Monsoft Solutions",
          description:
            "A software development company that provides innovative digital solutions.",
          url: "https://monsoft.com",
          logo: "https://monsoft.com/logo.png",
          foundingDate: "2014",
          founders: [
            {
              "@type": "Person",
              name: "Alex Johnson",
            },
          ],
          numberOfEmployees: "25",
          location: {
            "@type": "Place",
            name: "San Francisco, CA",
          },
        }}
      />

      <div className="flex flex-col gap-12 py-8">
        {/* Hero Section */}
        <section className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              About Our Story
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We&apos;re a passionate team of innovators, designers, and
              developers dedicated to creating digital experiences that make a
              difference.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className="container">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader className="text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-3xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-center text-muted-foreground">
                  To empower businesses and individuals with innovative
                  technology solutions that drive growth, efficiency, and
                  positive impact in their communities.
                </p>
                <Separator />
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary" />
                      What We Do
                    </h3>
                    <p className="text-muted-foreground">
                      We create custom software solutions, beautiful websites,
                      and digital experiences that help our clients achieve
                      their goals and connect with their audiences.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Why We Do It
                    </h3>
                    <p className="text-muted-foreground">
                      We believe technology should be accessible, intuitive, and
                      meaningful. Our passion drives us to create solutions that
                      truly make a difference.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values Section */}
        <section className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide every decision we make and every solution
              we create.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const IconComponent = value.icon;
              return (
                <Card key={value.title} className="text-center">
                  <CardHeader>
                    <IconComponent className="h-10 w-10 text-primary mx-auto mb-2" />
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{value.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Team Section */}
        <section className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Meet Our Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The talented individuals behind our success. Each member brings
              unique expertise and passion to everything we do.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id} className="text-center">
                <CardHeader>
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Work Together?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Let&apos;s discuss how we can help bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md bg-background text-foreground px-6 py-3 font-medium hover:bg-background/90 transition-colors"
                >
                  Get In Touch
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center rounded-md border border-primary-foreground/20 px-6 py-3 font-medium hover:bg-primary-foreground/10 transition-colors"
                >
                  Read Our Blog
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
