"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { urlFor } from "@/lib/sanity/client-browser";
import type { SanityImageSource } from "@sanity/image-url";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import OptimizedImage from "@/components/ui/OptimizedImage";

// =============================================================================
// TYPES
// =============================================================================

export type ProductVariety = {
  _key?: string;
  name: string;
  imageUrl?: string | null;
  image?: SanityImageSource;
};

interface ProductVarietiesSectionProps {
  varieties: ProductVariety[];
  title?: string;
  subtitle?: string;
  badge?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ProductVarietiesSection({
  varieties,
  title = "Our Varieties",
  subtitle,
  badge = "Premium Varieties",
}: ProductVarietiesSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  if (!varieties || varieties.length === 0) return null;

  return (
    <section
      ref={ref}
      className="py-16 md:py-24 bg-bg relative overflow-hidden"
      aria-labelledby="varieties-heading"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16 md:mb-24"
      >
        <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-3">
          {badge}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-deep-brown mb-3">{title}</h2>
        {subtitle ? <p className="text-text-muted max-w-2xl mx-auto">{subtitle}</p> : null}
      </motion.div>

      {/* Varieties Grid - Clean Image Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto items-start">
          {varieties.map((variety, index) => (
            <VarietyCard key={variety._key || index} variety={variety} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// VARIETY CARD COMPONENT
// =============================================================================

function VarietyCard({ variety, index }: { variety: ProductVariety; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  // Get image URL (Google Drive or Sanity)
  // Use our proxy for Google Drive images to avoid 403s
  const imageUrl = variety.imageUrl
    ? getGoogleDriveImageUrl(variety.imageUrl)
    : variety.image
      ? urlFor(variety.image).width(400).url()
      : null;

  const isPlaceholder = variety.imageUrl?.startsWith("PLACEHOLDER");
  const isProxyUrl = imageUrl?.startsWith("/api/image-proxy");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative flex flex-col items-center group w-full"
    >
      {/* Image Container - Dynamic Height */}
      <div className="relative w-full flex items-center justify-center min-h-[180px]">
        {imageUrl && !isPlaceholder ? (
          isProxyUrl ? (
            <OptimizedImage
              src={imageUrl}
              alt={`${variety.name} variety`}
              width={400}
              height={400}
              className="w-auto h-auto max-w-full max-h-[400px] object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <OptimizedImage
              src={imageUrl}
              alt={`${variety.name} variety`}
              width={400}
              height={400}
              className="w-auto h-auto max-w-full max-h-[400px] object-contain transition-transform duration-500 group-hover:scale-105"
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-[200px] text-amber-300 bg-amber-50/50 rounded-xl">
            <svg className="w-10 h-10 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span className="text-xs font-medium text-amber-500">No Image</span>
          </div>
        )}
      </div>

      {/* Variety Name - Below Image */}
      <h3 className="mt-2 md:mt-4 text-deep-brown font-bold text-sm md:text-xl text-center font-heading group-hover:text-almond-gold transition-colors duration-300 w-full px-1 wrap-break-word leading-tight">
        {variety.name}
      </h3>
    </motion.div>
  );
}
