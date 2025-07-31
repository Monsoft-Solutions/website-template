"use client";

import { Eye, MapPin, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const valuePropositions = [
  {
    icon: Eye,
    title: "Transparent Process",
    description: "No hidden fees, clear communication, honest market analysis",
    details:
      "We believe in complete transparency throughout your real estate journey. From our upfront pricing to detailed market reports, you'll always know exactly what to expect.",
  },
  {
    icon: MapPin,
    title: "Local Market Expertise",
    description: "Born and raised in Cape Coral, 10+ years market experience",
    details:
      "Our deep Cape Coral roots and decade of experience mean we know every neighborhood, trend, and opportunity in the local market.",
  },
  {
    icon: Lightbulb,
    title: "Innovative Marketing",
    description:
      "Professional photography, social media marketing, cutting-edge technology",
    details:
      "We leverage the latest technology and marketing strategies to ensure your property gets maximum exposure and you find the perfect home faster.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 25,
    },
  },
};

export function ValuePropositionSection() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section className="bg-secondary-light py-24 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          ref={ref}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-blue-dark mb-6 leading-tight">
            Why Choose Sun Gulf Realty
          </h2>
          <p className="text-xl md:text-2xl text-neutral-text max-w-3xl mx-auto leading-relaxed">
            Different by design means better results for you
          </p>
        </motion.div>

        {/* Value Propositions Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {valuePropositions.map((prop, index) => {
            const IconComponent = prop.icon;
            return (
              <motion.div
                key={index}
                className="text-center group cursor-default"
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Icon */}
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-8 group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <IconComponent className="h-10 w-10 text-primary-blue" />
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl md:text-3xl font-bold text-primary-blue-dark mb-4 leading-tight">
                  {prop.title}
                </h3>
                <p className="text-lg md:text-xl text-neutral-text mb-6 leading-relaxed font-medium">
                  {prop.description}
                </p>
                <p className="text-base md:text-lg text-neutral-text leading-relaxed opacity-80">
                  {prop.details}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
