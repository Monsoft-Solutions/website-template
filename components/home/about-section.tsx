"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Statistic {
  value: number;
  suffix: string;
  label: string;
}

const companyStats: Statistic[] = [
  { value: 10, suffix: "+", label: "Years Cape Coral Experience" },
  { value: 500, suffix: "+", label: "Happy Clients" },
  { value: 95, suffix: "%", label: "Client Satisfaction Rate" },
  { value: 30, suffix: "", label: "Avg Days on Market" },
];

// Animated counter hook
function useAnimatedCounter(
  finalValue: number,
  duration: number = 2000,
  isVisible: boolean = false
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * finalValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [finalValue, duration, isVisible]);

  return count;
}

interface AnimatedStatProps {
  stat: Statistic;
  isVisible: boolean;
  delay: number;
}

function AnimatedStat({ stat, isVisible, delay }: AnimatedStatProps) {
  const animatedValue = useAnimatedCounter(stat.value, 2000, isVisible);

  return (
    <motion.div
      className="text-center group"
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-4xl md:text-5xl font-bold text-primary-blue mb-3 group-hover:text-accent-orange transition-colors duration-300">
        {animatedValue}
        {stat.suffix}
      </div>
      <div className="text-base md:text-lg text-gray-600 font-medium leading-tight">
        {stat.label}
      </div>
    </motion.div>
  );
}

export function AboutSection() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const teamPhotoUrl =
    "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&h=600&fit=crop&auto=format";

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary-blue/5 to-accent-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent-orange/5 to-primary-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Real Estate{" "}
            <span className="text-primary-blue">Different by Design</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Founded on the principle that real estate should be transparent,
            innovative, and client-focused, Sun Gulf Realty represents a new
            generation of real estate professionals in Cape Coral.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-20">
          {/* Story Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                Your Local Cape Coral Experts
              </h3>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  Our boutique approach combines deep local market knowledge
                  with cutting-edge technology and marketing strategies. We
                  believe every client deserves personalized attention and
                  honest guidance throughout their real estate journey.
                </p>
                <p>
                  Born and raised in Cape Coral, we understand what makes this
                  community special — from the best waterfront neighborhoods to
                  emerging investment opportunities. This local expertise,
                  paired with our commitment to innovation, sets us apart in the
                  market.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="brand-primary">
                Meet Our Team
              </Button>
              <Button size="lg" variant="brand-secondary">
                Our Story
              </Button>
            </div>
          </motion.div>

          {/* Team Photo */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              <div className="aspect-[5/4] relative rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={teamPhotoUrl}
                  alt="Sun Gulf Realty Team - Cape Coral Real Estate Experts"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>

              {/* Floating accent */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent-orange rounded-full opacity-80 blur-sm animate-pulse" />
              <div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary-blue rounded-full opacity-60 blur-sm animate-pulse"
                style={{ animationDelay: "2s" }}
              />
            </div>
          </motion.div>
        </div>

        {/* Statistics Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Our Track Record Speaks
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {companyStats.map((stat, index) => (
              <AnimatedStat
                key={index}
                stat={stat}
                isVisible={inView}
                delay={0.8 + index * 0.1}
              />
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="text-center bg-gradient-to-r from-primary-blue to-primary-blue-dark rounded-2xl p-8 md:p-12 text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Experience Real Estate Different by Design?
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re buying your first home, selling your current
            property, or looking for investment opportunities, we&apos;re here
            to guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="touch-lg" variant="brand-primary">
              Schedule Free Consultation
            </Button>
            <Button
              size="touch-lg"
              variant="brand-secondary"
              className="border-white text-white hover:bg-white hover:text-primary-blue"
            >
              Get Home Valuation
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
