"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef, useState } from "react";
import Image from "next/image";
import { ZoomIn, X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

interface ServiceGallerySectionProps {
  gallery: string[];
}

export function ServiceGallerySection({ gallery }: ServiceGallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  const lightboxVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  };

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setTimeout(() => setSelectedImage(null), 300);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % gallery.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === 0 ? gallery.length - 1 : selectedImage - 1
      );
    }
  };

  // Generate responsive grid classes
  const getGridClasses = (index: number) => {
    const patterns = [
      "md:col-span-2 md:row-span-2", // Large
      "md:col-span-1 md:row-span-1", // Small
      "md:col-span-1 md:row-span-2", // Tall
      "md:col-span-2 md:row-span-1", // Wide
      "md:col-span-1 md:row-span-1", // Small
      "md:col-span-1 md:row-span-1", // Small
    ];
    return patterns[index % patterns.length];
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-accent/5 to-background"
      >
        {/* Animated background */}
        <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25 opacity-20" />

          {/* Floating elements */}
          <motion.div
            className="absolute top-20 left-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-64 h-64 bg-accent/5 rounded-full blur-2xl"
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />

          {/* Camera floating animation */}
          <motion.div
            className="absolute top-1/3 left-1/4 w-20 h-20 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-lg"
            animate={{
              scale: [0.8, 1.3, 0.8],
              rotate: [0, 360],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </motion.div>

        <div className="container relative z-10" ref={ref}>
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            variants={headerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 15, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Camera className="w-4 h-4" />
              </motion.div>
              Visual Portfolio
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="block text-foreground">Project</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Gallery
              </span>
            </h2>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore our work through this curated collection of project
              examples, showcasing our attention to detail and design
              excellence.
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {gallery.map((image, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`group relative cursor-pointer ${getGridClasses(
                  index
                )}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => openLightbox(index)}
              >
                <motion.div
                  className="relative w-full h-64 md:h-full overflow-hidden rounded-2xl bg-muted"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.div
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <ZoomIn className="w-5 h-5" />
                      <span className="text-sm font-medium">View</span>
                    </motion.div>
                  </motion.div>

                  {/* Decorative elements */}
                  <motion.div
                    className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                  <motion.div
                    className="absolute bottom-4 left-4 w-2 h-2 bg-primary/60 rounded-full opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  />

                  {/* Image number indicator */}
                  <motion.div
                    className="absolute top-4 left-4 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs font-medium opacity-0 group-hover:opacity-100"
                    initial={{ opacity: 0, y: -10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {index + 1} / {gallery.length}
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom message */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              whileHover={{ scale: 1.02 }}
            >
              Each project represents our commitment to excellence and
              innovation, delivered with precision and creative vision.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {isLightboxOpen && selectedImage !== null && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLightbox}
        >
          <motion.div
            className="relative max-w-4xl max-h-full"
            variants={lightboxVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              onClick={closeLightbox}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Navigation buttons */}
            {gallery.length > 1 && (
              <>
                <motion.button
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  onClick={prevImage}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
                <motion.button
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  onClick={nextImage}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </>
            )}

            {/* Image counter */}
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {selectedImage + 1} of {gallery.length}
            </motion.div>

            {/* Main image */}
            <motion.div
              className="relative w-full h-full max-h-[80vh] bg-muted rounded-lg overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={gallery[selectedImage]}
                alt={`Gallery image ${selectedImage + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
