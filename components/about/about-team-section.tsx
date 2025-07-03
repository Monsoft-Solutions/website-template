"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Github,
  Linkedin,
  Twitter,
  Heart,
  Coffee,
  Code,
  Sparkles,
  Users,
  MessageCircle,
  Star,
  Award,
  Zap,
  Globe,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";

// Team member card component with enhanced animations
const TeamMemberCard = ({
  member,
  index,
}: {
  member: {
    name: string;
    role: string;
    bio: string;
    image: string;
    skills: string[];
    interests: string[];
    github: string;
    linkedin: string;
    twitter: string;
  };
  index: number;
}) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 100,
      scale: 0.8,
      rotateY: index % 2 === 0 ? -15 : 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.8,
        delay: index * 0.2,
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className="group relative"
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{
        scale: 1.02,
        y: -10,
        transition: { duration: 0.3 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 blur-xl rounded-3xl transition-opacity duration-500"
        animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
      />

      {/* Card */}
      <div className="relative p-8 bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl group-hover:border-primary/30 transition-all duration-500 group-hover:bg-card/90 overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => {
            // Deterministic positioning based on index
            const xPos = i * 60 + 30; // Distributed: 30, 90, 150, 210, 270
            const yPos = i * 80 + 50; // Distributed: 50, 130, 210, 290, 370
            const xTarget = i * 50 + 50; // Different target positions

            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                initial={{
                  opacity: 0,
                  x: xPos,
                  y: yPos,
                }}
                animate={
                  isHovered
                    ? {
                        opacity: [0, 1, 0],
                        y: [yPos, -50],
                        x: [xPos, xTarget],
                        scale: [0, 1, 0],
                      }
                    : {}
                }
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: isHovered ? Infinity : 0,
                  repeatDelay: 3,
                }}
              />
            );
          })}
        </div>

        {/* Profile Image */}
        <motion.div
          className="relative mb-6 mx-auto w-32 h-32"
          animate={
            isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/50 transition-colors duration-300">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {/* Overlay gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            />
          </div>

          {/* Status indicator */}
          <motion.div
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-3 h-3 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Member Info */}
        <div className="text-center relative z-10">
          <motion.h3
            className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300"
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
          >
            {member.name}
          </motion.h3>

          <motion.p
            className="text-primary font-medium mb-4"
            initial={{ opacity: 0.8 }}
            animate={
              isHovered
                ? { opacity: 1, scale: 1.05 }
                : { opacity: 0.8, scale: 1 }
            }
          >
            {member.role}
          </motion.p>

          <p className="text-muted-foreground text-sm mb-6 leading-relaxed line-clamp-3">
            {member.bio}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {member.skills
              .slice(0, 3)
              .map((skill: string, skillIndex: number) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
                  }
                  transition={{
                    duration: 0.3,
                    delay: index * 0.2 + skillIndex * 0.1 + 0.5,
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Badge
                    variant="secondary"
                    className="text-xs px-3 py-1 hover:bg-primary/10 transition-colors duration-200 cursor-pointer"
                  >
                    {skill}
                  </Badge>
                </motion.div>
              ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-background/50 rounded-2xl">
            {[
              {
                icon: Code,
                value: 50 + ((index * 15) % 100), // Deterministic values based on member index
                label: "Projects",
              },
              {
                icon: Coffee,
                value: 500 + ((index * 123) % 500), // Deterministic coffee count
                label: "Coffee",
              },
              {
                icon: Star,
                value: (3.5 + ((index * 0.3) % 1.5)).toFixed(1), // Deterministic rating
                label: "Rating",
              },
            ].map((stat, statIndex) => (
              <motion.div
                key={statIndex}
                className="text-center"
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <motion.div
                  animate={isHovered ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5, delay: statIndex * 0.1 }}
                >
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                </motion.div>
                <div className="text-lg font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-3">
            {[
              {
                icon: Github,
                href: member.github,
                color: "hover:text-gray-600",
              },
              {
                icon: Linkedin,
                href: member.linkedin,
                color: "hover:text-blue-600",
              },
              {
                icon: Twitter,
                href: member.twitter,
                color: "hover:text-blue-400",
              },
            ].map((social, socialIndex) => (
              <motion.div
                key={socialIndex}
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.2 + socialIndex * 0.1 + 0.8,
                }}
              >
                <Link
                  href={social.href}
                  className={`w-10 h-10 bg-background/80 rounded-full flex items-center justify-center text-muted-foreground ${social.color} transition-all duration-300 hover:bg-primary/10 hover:shadow-lg`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Contact button */}
          <motion.div
            className="mt-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: index * 0.2 + 1 }}
          >
            <Button
              size="sm"
              variant="outline"
              className="w-full bg-background/50 hover:bg-primary/10 border-primary/20 hover:border-primary/50 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </motion.div>
        </div>

        {/* Corner decoration */}
        <motion.div
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-5 h-5 text-primary" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export function AboutTeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      bio: "Visionary leader with 15+ years in tech. Passionate about building products that make a difference. Coffee enthusiast and weekend photographer.",
      image: "/api/placeholder/150/150",
      skills: ["Leadership", "Strategy", "Innovation", "Product Vision"],
      interests: ["Photography", "Coffee", "Hiking"],
      github: "https://github.com/alexjohnson",
      linkedin: "https://linkedin.com/in/alexjohnson",
      twitter: "https://twitter.com/alexjohnson",
    },
    {
      name: "Sarah Chen",
      role: "CTO & Co-Founder",
      bio: "Full-stack architect who turns complex problems into elegant solutions. Open source contributor and tech conference speaker.",
      image: "/api/placeholder/150/150",
      skills: ["Architecture", "DevOps", "React", "Node.js"],
      interests: ["Open Source", "Gaming", "Cooking"],
      github: "https://github.com/sarahchen",
      linkedin: "https://linkedin.com/in/sarahchen",
      twitter: "https://twitter.com/sarahchen",
    },
    {
      name: "Marcus Rodriguez",
      role: "Lead Designer",
      bio: "Design thinking specialist who creates beautiful, intuitive experiences. Believes design is not just how it looks, but how it works.",
      image: "/api/placeholder/150/150",
      skills: ["UI/UX", "Figma", "Prototyping", "Design Systems"],
      interests: ["Art", "Travel", "Music"],
      github: "https://github.com/marcusrodriguez",
      linkedin: "https://linkedin.com/in/marcusrodriguez",
      twitter: "https://twitter.com/marcusrodriguez",
    },
    {
      name: "Emily Watson",
      role: "Head of Engineering",
      bio: "Performance optimization expert and team mentor. Loves solving complex technical challenges and building high-performing teams.",
      image: "/api/placeholder/150/150",
      skills: ["Team Leadership", "Performance", "Scalability", "Mentoring"],
      interests: ["Rock Climbing", "Tech Books", "Running"],
      github: "https://github.com/emilywatson",
      linkedin: "https://linkedin.com/in/emilywatson",
      twitter: "https://twitter.com/emilywatson",
    },
    {
      name: "David Kim",
      role: "Senior Full-Stack Developer",
      bio: "Code craftsman with expertise in modern web technologies. Passionate about clean code, best practices, and continuous learning.",
      image: "/api/placeholder/150/150",
      skills: ["React", "TypeScript", "Python", "Cloud"],
      interests: ["Chess", "Podcasts", "Cycling"],
      github: "https://github.com/davidkim",
      linkedin: "https://linkedin.com/in/davidkim",
      twitter: "https://twitter.com/davidkim",
    },
    {
      name: "Lisa Thompson",
      role: "Product Manager",
      bio: "Bridge between business and technology. Expert at translating user needs into product features that drive real impact.",
      image: "/api/placeholder/150/150",
      skills: ["Product Strategy", "Analytics", "User Research", "Agile"],
      interests: ["Yoga", "Reading", "Traveling"],
      github: "https://github.com/lisathompson",
      linkedin: "https://linkedin.com/in/lisathompson",
      twitter: "https://twitter.com/lisathompson",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-gradient-to-br from-background via-accent/3 to-background"
    >
      {/* Animated background */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-20" />

        {/* Floating elements */}
        <motion.div
          className="absolute top-32 left-16 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 right-16 w-56 h-56 bg-accent/5 rounded-full blur-3xl"
          animate={{
            x: [0, -60, 0],
            y: [0, 40, 0],
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
      </motion.div>

      <div className="container relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Users className="w-4 h-4" />
            Meet Our Amazing Team
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              The Minds Behind
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              The Magic
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We&apos;re a diverse group of passionate individuals who love what
            we do. Get to know the people who make the impossible, possible.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={member.name} member={member} index={index} />
          ))}
        </div>

        {/* Team Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 p-8 bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          {[
            { label: "Team Members", value: "25+", icon: Users },
            { label: "Countries", value: "8", icon: Globe },
            { label: "Years Experience", value: "100+", icon: Award },
            { label: "Happiness Level", value: "99%", icon: Heart },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={
                inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
              }
              transition={{ duration: 0.5, delay: 1.7 + index * 0.1 }}
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-3xl font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Join Our Team CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <div className="relative inline-block">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl rounded-3xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="relative p-12 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 rounded-3xl">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-3xl font-bold text-foreground mb-4">
                Want to Join Our Team?
              </h3>

              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                We&apos;re always looking for talented individuals who share our
                passion for innovation and excellence. Come help us build the
                future!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                    asChild
                  >
                    <Link href="/careers">View Open Positions</Link>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="backdrop-blur-sm hover:bg-primary/10 border-primary/20 hover:border-primary/50"
                    asChild
                  >
                    <Link href="/contact">Get In Touch</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
