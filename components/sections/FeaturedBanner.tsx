"use client";

/**
 * Featured Banner Section Component
 *
 * Full-width visual banner with optional text overlay.
 * Used as a visual break between content-heavy sections.
 */

import { motion } from "framer-motion";
import OptimizedImage from "@/components/ui/OptimizedImage";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface FeaturedBannerProps {
  bannerData?: {
    imageUrl?: string;
    title?: string;
    subtitle?: string;
  } | null;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function FeaturedBanner({ bannerData }: FeaturedBannerProps) {
  // Don't render if no image URL
  if (!bannerData?.imageUrl) return null;

  return (
    <section
      className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden"
      aria-label="Featured banner"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={bannerData.imageUrl}
          alt={bannerData.title ?? "Divyansh International facility"}
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-deep-brown/40" />
      </div>

      {/* Text Overlay */}
      {bannerData.title || bannerData.subtitle ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            {bannerData.title ? (
              <motion.h2
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-heading"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {bannerData.title}
              </motion.h2>
            ) : null}
            {bannerData.subtitle ? (
              <motion.p
                className="text-lg md:text-xl lg:text-2xl text-bg/90"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              >
                {bannerData.subtitle}
              </motion.p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
