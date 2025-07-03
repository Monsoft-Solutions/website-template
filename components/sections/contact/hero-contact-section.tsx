"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Clock,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Floating Particle Component for hero
const ContactParticle = ({
  delay = 0,
  duration = 15,
  x = 0,
  y = 0,
}: {
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
}) => (
  <motion.div
    className="absolute w-1 h-1 bg-primary/40 rounded-full"
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      y: [y, y - 300],
      x: [x, x + Math.sin(delay) * 50],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      delay: delay,
      ease: "easeOut",
    }}
  />
);

// Quick action card component
const QuickActionCard = ({
  icon: Icon,
  title,
  description,
  action,
  status = "available",
  delay = 0,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action: () => void;
  status?: "available" | "busy" | "offline";
  delay?: number;
}) => {
  const statusColors = {
    available: "bg-green-500",
    busy: "bg-yellow-500",
    offline: "bg-gray-400",
  };

  const statusText = {
    available: "Available now",
    busy: "Response in 2h",
    offline: "Next business day",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card p-6 cursor-pointer group relative overflow-hidden"
      onClick={action}
    >
      {/* Morphing border effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors"
          >
            <Icon className="w-6 h-6 text-primary" />
          </motion.div>

          {/* Status indicator */}
          <div className="absolute -top-1 -right-1 flex items-center space-x-1">
            <div
              className={`w-3 h-3 rounded-full ${statusColors[status]} pulse`}
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          <Badge variant="outline" className="mt-2 text-xs">
            {statusText[status]}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
};

export function HeroContactSection() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isBusinessHours, setIsBusinessHours] = useState(false);

  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Update time and business hours status
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });
      setCurrentTime(timeString);

      const hours = now.getHours();
      const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
      setIsBusinessHours(isWeekday && hours >= 9 && hours < 18);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const quickActions: Array<{
    icon: LucideIcon;
    title: string;
    description: string;
    action: () => void;
    status: "available" | "busy" | "offline";
  }> = [
    {
      icon: MessageCircle,
      title: "Start a Chat",
      description: "Get instant answers to your questions",
      action: () => console.log("Open chat"),
      status: isBusinessHours ? "available" : "offline",
    },
    {
      icon: Phone,
      title: "Schedule a Call",
      description: "Book a free consultation call",
      action: () => console.log("Schedule call"),
      status: "available",
    },
    {
      icon: Mail,
      title: "Send an Email",
      description: "Detailed project discussions",
      action: () => console.log("Scroll to form"),
      status: "available",
    },
    {
      icon: Calendar,
      title: "Book a Meeting",
      description: "In-person or video meeting",
      action: () => console.log("Book meeting"),
      status: isBusinessHours ? "available" : "busy",
    },
  ];

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/5 to-accent/5">
      {/* Animated background elements */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25"
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <ContactParticle
            key={i}
            delay={i * 0.5}
            duration={10 + Math.random() * 10}
            x={
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1200)
            }
            y={
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 800)
            }
          />
        ))}
      </div>

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container relative z-10" ref={ref}>
        <div className="mx-auto max-w-6xl text-center">
          {/* Header Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            {/* Live status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isBusinessHours ? "bg-green-500" : "bg-yellow-500"
                    } pulse`}
                  />
                  <Clock className="w-3 h-3" />
                  <span>{currentTime}</span>
                  <span className="text-xs opacity-75">
                    {isBusinessHours
                      ? "We&apos;re online!"
                      : "We&apos;ll respond soon"}
                  </span>
                </div>
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6"
            >
              <span className="block bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Connect With Our Team
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              Ready to bring your vision to life? Choose your preferred way to
              connect with our expert team. We&apos;re here to transform your
              ideas into exceptional digital experiences.
            </motion.p>
          </motion.div>

          {/* Quick Action Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={action.title}
                {...action}
                delay={0.6 + index * 0.1}
              />
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="group">
              Get Started Today
              <motion.div
                className="ml-2"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </Button>

            <Button size="lg" variant="outline" className="group">
              <Zap className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
              Emergency Contact
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Custom styles for pulse animation */}
      <style jsx>{`
        .pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </section>
  );
}
