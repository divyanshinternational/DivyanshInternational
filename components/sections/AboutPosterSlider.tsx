"use client";

/**
 * About Poster Slider Section Component
 *
 * Hero-like slider for displaying promotional posters on the About page.
 * Features auto-play, manual navigation, and smooth transitions.
 * Images only - no video support.
 */

import { useState, useEffect, useCallback, useMemo, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import OptimizedImage from "@/components/ui/OptimizedImage";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface PosterItem {
  _key?: string;
  imageUrl?: string;
  alt?: string;
}

interface AboutPosterSliderProps {
  sliderData?: {
    enabled?: boolean;
    autoPlayInterval?: number;
    posters?: PosterItem[];
  } | null;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_AUTOPLAY_INTERVAL = 5000;

// =============================================================================
// COMPONENT
// =============================================================================

export default function AboutPosterSlider({ sliderData }: AboutPosterSliderProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  // Use useSyncExternalStore for reduced motion preference
  const prefersReducedMotion = useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    },
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  // Memoize filtered posters - must be before any conditional returns
  const posters = useMemo(() => {
    if (!sliderData?.enabled || !sliderData?.posters?.length) return [];
    return sliderData.posters.filter((p) => p.imageUrl);
  }, [sliderData]);

  const autoPlayInterval = sliderData?.autoPlayInterval ?? DEFAULT_AUTOPLAY_INTERVAL;

  // All hooks must be called before any conditional returns
  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= posters.length) return;
      setActiveSlide(index);
    },
    [posters.length]
  );

  const goToPrev = useCallback(() => {
    setActiveSlide((prev) => (prev === 0 ? posters.length - 1 : prev - 1));
  }, [posters.length]);

  const goToNext = useCallback(() => {
    setActiveSlide((prev) => (prev === posters.length - 1 ? 0 : prev + 1));
  }, [posters.length]);

  // Auto-play functionality
  useEffect(() => {
    if (prefersReducedMotion || posters.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % posters.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, posters.length, autoPlayInterval]);

  // Keyboard navigation (arrow keys)
  useEffect(() => {
    if (posters.length <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [posters.length, goToPrev, goToNext]);

  // Now safe to do early return after all hooks
  if (posters.length === 0) return null;

  const currentPoster = posters[activeSlide];
  const imageUrl = currentPoster?.imageUrl ? getGoogleDriveImageUrl(currentPoster.imageUrl) : null;

  return (
    <section
      className="relative w-full pt-16 md:pt-20 overflow-hidden bg-white"
      aria-label="Promotional posters"
    >
      {/* Poster Images - using img tag like ProductCard for Google Drive URLs */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          className="relative w-full h-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {imageUrl ? (
            <div className="relative w-full h-auto flex items-center justify-center">
              {/* Main Image - Scaled horizontally to take the area */}
              <OptimizedImage
                src={imageUrl}
                alt={currentPoster?.alt ?? "Promotional poster"}
                width={1920}
                height={1080}
                className="relative z-10 w-auto h-auto max-w-full mx-auto object-cover shadow-lg"
                sizes="100vw"
                priority={activeSlide === 0}
              />
            </div>
          ) : (
            <div className="w-full h-[60vh] flex items-center justify-center bg-sand/20">
              <p className="text-text-muted">Loading poster...</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls - Only show if more than 1 poster */}
      {posters.length > 1 ? (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-deep-brown transition-all hover:scale-110 shadow-lg border border-white/30"
            aria-label="Previous poster"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-deep-brown transition-all hover:scale-110 shadow-lg border border-white/30"
            aria-label="Next poster"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
            {posters.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === activeSlide
                    ? "bg-gold scale-125 shadow-lg"
                    : "bg-white/60 hover:bg-white/90"
                }`}
                aria-label={`Go to poster ${index + 1}`}
                aria-current={index === activeSlide ? "true" : undefined}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="absolute bottom-6 md:bottom-8 right-4 md:right-8 z-20 text-sm font-medium text-deep-brown bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md">
            {activeSlide + 1} / {posters.length}
          </div>
        </>
      ) : null}
    </section>
  );
}
