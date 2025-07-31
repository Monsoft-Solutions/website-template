"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Button } from "@/components/ui/button";
import { Search, Home, TrendingUp } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

// Background images for rotation - Using free Unsplash images
const backgroundImages = [
  {
    src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    alt: "Beautiful modern waterfront home with dock",
    fallback: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
  },
  {
    src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    alt: "Aerial view of waterfront properties and canals",
    fallback: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
  },
  {
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    alt: "Modern luxury home exterior with landscaping",
    fallback: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
  },
  {
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    alt: "Beautiful waterfront home at sunset",
    fallback: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<SwiperType>(null);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Swiper Background Slideshow */}
      <div className="absolute inset-0">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          loop={true}
          speed={2000}
          allowTouchMove={false}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
          className="h-full w-full"
        >
          {backgroundImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full w-full">
                {/* Fallback gradient background */}
                <div
                  className="absolute inset-0 z-10"
                  style={{ background: image.fallback }}
                />

                {/* Background Image */}
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover z-20"
                  priority={index === 0}
                  sizes="100vw"
                  quality={90}
                  onError={() => {
                    console.warn(`Failed to load hero image: ${image.src}`);
                  }}
                />

                {/* Sophisticated Overlay - More transparent and elegant */}
                <div className="absolute inset-0 z-30 bg-gradient-to-br from-[#1E3A8A]/70 via-[#1E3A8A]/50 to-[#3B82F6]/40" />

                {/* Subtle texture overlay for depth */}
                <div className="absolute inset-0 z-40 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Main Content Container */}
      <div className="relative z-50 h-full flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-center h-full">
            {/* Left Content - Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-7 text-center lg:text-left"
            >
              {/* Brand Accent Text */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-accent text-xl md:text-2xl text-[#F97316] mb-4"
              >
                Cape Coral&apos;s Premier Choice
              </motion.p>

              {/* Main Headline - Following typography guidelines */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="font-headline text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-[1.1]"
              >
                Real Estate{" "}
                <span className="block text-transparent bg-gradient-to-r from-white to-white/80 bg-clip-text">
                  Different by Design
                </span>
              </motion.h1>

              {/* CTA Buttons - Enhanced Design */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  asChild
                  variant="brand-primary"
                  size="touch-lg"
                  className="group text-lg"
                >
                  <Link href="/search" className="flex items-center gap-2">
                    <Search className="w-5 h-5 transition-transform group-hover:scale-110" />
                    Search Properties
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="brand-secondary"
                  size="touch-lg"
                  className="group text-lg border-white/80 text-white hover:bg-white hover:text-primary-blue-dark backdrop-blur-sm"
                >
                  <Link
                    href="/home-valuation"
                    className="flex items-center gap-2"
                  >
                    <TrendingUp className="w-5 h-5 transition-transform group-hover:scale-110" />
                    Free Home Valuation
                  </Link>
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="mt-8 flex flex-wrap items-center gap-6 justify-center lg:justify-start text-white/80"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#F97316] rounded-full"></div>
                  <span className="text-sm font-medium">Local MLS Expert</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#F97316] rounded-full"></div>
                  <span className="text-sm font-medium">
                    100% Transparent Process
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#F97316] rounded-full"></div>
                  <span className="text-sm font-medium">Modern Technology</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="lg:col-span-5 hidden lg:block"
            >
              <div className="space-y-4">
                {[
                  {
                    icon: Home,
                    title: "Luxury Waterfront Properties",
                    desc: "Exclusive Cape Coral listings",
                  },
                  {
                    icon: Search,
                    title: "Advanced Property Search",
                    desc: "Find your perfect home faster",
                  },
                  {
                    icon: TrendingUp,
                    title: "Market Intelligence",
                    desc: "Data-driven pricing insights",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-[#F97316] rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-body font-semibold text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-white/80">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Image Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="flex space-x-3 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => swiperRef.current?.slideToLoop(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-[#F97316] w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Switch to image ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>

      {/* Refined Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-sm"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
