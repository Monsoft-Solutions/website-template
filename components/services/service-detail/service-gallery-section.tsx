"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "react";
import { Camera } from "lucide-react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

interface ServiceGallerySectionProps {
  gallery: string[];
}

export function ServiceGallerySection({ gallery }: ServiceGallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -30]);

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

  const galleryVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
        delay: 0.4,
      },
    },
  };

  // Transform gallery array to react-image-gallery format
  const galleryItems = gallery.map((imageUrl, index) => ({
    original: imageUrl,
    thumbnail: imageUrl,
    originalAlt: `Gallery image ${index + 1}`,
    thumbnailAlt: `Gallery thumbnail ${index + 1}`,
  }));

  return (
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
            examples, showcasing our attention to detail and design excellence.
          </p>
        </motion.div>

        {/* Gallery */}
        <motion.div
          className="max-w-6xl mx-auto"
          variants={galleryVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="image-gallery-container">
            <ImageGallery
              items={galleryItems}
              showBullets
              showThumbnails
              showFullscreenButton={true}
              showPlayButton={false}
              autoPlay={false}
              slideInterval={3000}
              slideDuration={450}
              thumbnailPosition="bottom"
              additionalClass="custom-gallery"
              lazyLoad={true}
            />
          </div>
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
            Each project represents our commitment to excellence and innovation,
            delivered with precision and creative vision.
          </motion.p>
        </motion.div>
      </div>

      {/* Custom styles for the gallery */}
      <style jsx global>{`
        .custom-gallery {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          background: hsl(var(--card));
        }

        .custom-gallery .image-gallery-slide img {
          border-radius: 12px;
          max-height: 600px;
          object-fit: cover;
          width: 100%;
        }

        .custom-gallery .image-gallery-thumbnails-wrapper {
          background: hsl(var(--card));
          border-top: 1px solid hsl(var(--border));
          padding: 16px;
        }

        .custom-gallery .image-gallery-thumbnail {
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid hsl(var(--border));
          transition: all 0.3s ease;
        }

        .custom-gallery .image-gallery-thumbnail:hover,
        .custom-gallery .image-gallery-thumbnail.active {
          border-color: hsl(var(--primary));
          transform: scale(1.05);
        }

        .custom-gallery .image-gallery-thumbnail img {
          border-radius: 6px;
        }

        .custom-gallery .image-gallery-index {
          background: hsl(var(--background) / 0.8);
          color: hsl(var(--foreground));
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          backdrop-filter: blur(8px);
          border: 1px solid hsl(var(--border));
        }

        @media (max-width: 768px) {
          .custom-gallery .image-gallery-slide img {
            max-height: 400px;
          }
        }
      `}</style>
    </section>
  );
}
