"use client";

/**
 * Poster Banner Section Component
 *
 * Full-width banner for displaying a single promotional poster.
 * Used on the home page between Hero and SpiralQuote sections.
 * Supports Google Drive URLs with automatic transformation.
 */

import { motion } from "framer-motion";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import OptimizedImage from "@/components/ui/OptimizedImage";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface PosterBannerProps {
  bannerData?: {
    imageUrl?: string;
    alt?: string;
    title?: string;
  } | null;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function PosterBanner({ bannerData }: PosterBannerProps) {
  if (!bannerData?.imageUrl) return null;

  const imageUrl = getGoogleDriveImageUrl(bannerData.imageUrl);

  if (!imageUrl) return null;

  return (
    <section
      className="relative w-full py-16 md:py-24 overflow-hidden bg-bg"
      aria-label="Featured poster"
    >
      <motion.div
        className="relative w-full h-[85vh] max-h-[900px] min-h-[500px] flex items-center justify-center p-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <OptimizedImage
            src={imageUrl}
            alt=""
            fill
            className="scale-110 blur-[5px] opacity-100 object-cover z-0"
            sizes="100vw"
          />
        </div>

        {/* Poster Image */}
        <OptimizedImage
          src={imageUrl}
          alt={bannerData.alt ?? "Divyansh International promotional poster"}
          width={1200}
          height={800}
          className="relative z-10 w-auto h-full max-h-full shadow-2xl rounded-lg"
          imageClassName="object-scale-down"
          priority
          quality={100}
        />

        {bannerData.title ? (
          <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center pointer-events-none">
            <div className="bg-deep-brown/80 p-4 md:p-6 rounded-xl backdrop-blur-sm mx-4">
              <motion.h3
                className="text-xl md:text-2xl lg:text-3xl font-bold text-white font-heading text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {bannerData.title}
              </motion.h3>
            </div>
          </div>
        ) : null}
      </motion.div>
    </section>
  );
}
