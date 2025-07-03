"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Award, Target, Lightbulb, Clock, Users, Star } from "lucide-react";

const reasons = [
  {
    icon: <Award className="w-6 h-6" />,
    title: "Expert Team",
    description:
      "Our experienced professionals bring years of industry expertise to your project.",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-500 dark:text-blue-400",
    borderColor: "border-blue-100 dark:border-blue-800/30",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Results-Driven",
    description:
      "We focus on delivering measurable results that drive your business forward.",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    iconColor: "text-green-500 dark:text-green-400",
    borderColor: "border-green-100 dark:border-green-800/30",
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Innovation",
    description:
      "We stay ahead of technology trends to provide cutting-edge solutions.",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    iconColor: "text-purple-500 dark:text-purple-400",
    borderColor: "border-purple-100 dark:border-purple-800/30",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Timely Delivery",
    description:
      "We pride ourselves on meeting deadlines and respecting your timeline.",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    iconColor: "text-amber-500 dark:text-amber-400",
    borderColor: "border-amber-100 dark:border-amber-800/30",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Client-Focused",
    description:
      "Your satisfaction is our priority, with support every step of the way.",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    iconColor: "text-red-500 dark:text-red-400",
    borderColor: "border-red-100 dark:border-red-800/30",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Quality Assurance",
    description:
      "Rigorous testing ensures your solution performs flawlessly at launch.",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    iconColor: "text-indigo-500 dark:text-indigo-400",
    borderColor: "border-indigo-100 dark:border-indigo-800/30",
  },
];

export function WhyChooseUsSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section className="py-24 bg-muted/30 dark:bg-muted/10 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-32 w-64 h-64 rounded-full border border-primary/10 opacity-50"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={
            inView ? { scale: 1, opacity: 0.5 } : { scale: 0.8, opacity: 0 }
          }
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full border border-primary/10 opacity-50"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={
            inView ? { scale: 1, opacity: 0.5 } : { scale: 0.8, opacity: 0 }
          }
          transition={{ duration: 1, delay: 0.4 }}
        />
      </div>

      <div className="container relative z-10">
        <div ref={ref} className="mx-auto max-w-2xl text-center mb-16">
          <motion.h2
            className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            Why Choose Us?
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We bring expertise, innovation, and dedication to every project to
            deliver exceptional results.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-xl border ${reason.borderColor} ${reason.bgColor} transition-all hover:shadow-md`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-full ${reason.bgColor} mb-4`}
                >
                  <div className={reason.iconColor}>{reason.icon}</div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
                <p className="text-muted-foreground">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
