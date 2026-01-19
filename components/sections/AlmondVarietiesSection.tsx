"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/client-browser";
import type { SanityImageSource } from "@sanity/image-url";
import { getGoogleDriveImageUrl } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

export type AlmondVariety = {
  _key?: string;
  name: string;
  code?: string;
  imageUrl?: string | null;
  image?: SanityImageSource;
  shell?: string;
  nut?: string;
  characteristics?: string;
  classification?: string;
  availability?: string;
};

interface AlmondVarietiesSectionProps {
  varieties: AlmondVariety[];
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function AlmondVarietiesSection({ varieties }: AlmondVarietiesSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!varieties || varieties.length === 0) return null;

  return (
    <section ref={ref} className="mt-12 mb-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-3">
          Premium Varieties
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-deep-brown mb-3">
          California Almond Varieties
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We source the finest California almonds, each variety offering unique characteristics
          perfect for different applications.
        </p>
      </motion.div>

      {/* Varieties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {varieties.map((variety, index) => (
          <VarietyCard key={variety._key || index} variety={variety} index={index} />
        ))}
      </div>
    </section>
  );
}

// =============================================================================
// VARIETY CARD COMPONENT
// =============================================================================

function VarietyCard({ variety, index }: { variety: AlmondVariety; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Get image URL (Google Drive or Sanity)
  const imageUrl = variety.imageUrl
    ? getGoogleDriveImageUrl(variety.imageUrl)
    : variety.image
      ? urlFor(variety.image).width(400).height(300).url()
      : null;

  const isPlaceholder = variety.imageUrl?.startsWith("PLACEHOLDER");
  const isProxyUrl = imageUrl?.startsWith("/api/image-proxy");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
    >
      {/* Card Header with Name */}
      <div className="bg-linear-to-r from-amber-50 to-orange-50 px-5 py-4 border-b border-amber-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-deep-brown">
            {variety.name}
            {variety.code ? (
              <span className="ml-2 text-sm font-medium text-amber-600">({variety.code})</span>
            ) : null}
          </h3>
          {variety.characteristics ? (
            <span className="px-3 py-1 bg-white text-amber-700 text-xs font-medium rounded-full border border-amber-200 shadow-sm">
              {variety.characteristics}
            </span>
          ) : null}
        </div>
      </div>

      {/* Image Section */}
      <div className="relative h-48 bg-linear-to-br from-amber-50 to-orange-50 overflow-hidden">
        {imageUrl && !isPlaceholder ? (
          isProxyUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageUrl}
              alt={`${variety.name} almonds`}
              className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Image
              src={imageUrl}
              alt={`${variety.name} almonds`}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          )
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-400">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-2">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-amber-500">Image Coming Soon</span>
          </div>
        )}
      </div>

      {/* Specifications */}
      <div className="p-5 space-y-4">
        {/* Shell & Nut Info */}
        <div className="space-y-3">
          {variety.shell ? (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <span className="text-sm">🥜</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                  Shell
                </span>
                <p className="text-sm text-gray-700 leading-snug">{variety.shell}</p>
              </div>
            </div>
          ) : null}

          {variety.nut ? (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                <span className="text-sm">🌰</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">
                  Nut
                </span>
                <p className="text-sm text-gray-700 leading-snug">{variety.nut}</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Info */}
        <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-2">
          {variety.classification ? (
            <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
              <svg className="w-3 h-3 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              {variety.classification}
            </span>
          ) : null}
          {variety.availability ? (
            <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md">
              <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {variety.availability}
            </span>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
