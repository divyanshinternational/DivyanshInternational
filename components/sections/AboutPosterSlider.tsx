"use client";

/**
 * About Poster Slider Section Component
 *
 * Refactored to use the reusable ContentBanner component.
 * Allows for rich text, various layouts, and "premium" design.
 */

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import ContentBanner, { type ContentBannerData } from "@/components/ui/ContentBanner";
import { ChevronLeft, ChevronRight } from "lucide-react";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface AboutPosterSliderProps {
  sliderData?: {
    enabled?: boolean;
    autoPlayInterval?: number;
    posters?: ContentBannerData[];
  } | null;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_AUTOPLAY_INTERVAL = 6000;

// =============================================================================
// COMPONENT
// =============================================================================

export default function AboutPosterSlider({ sliderData }: AboutPosterSliderProps) {
  const [activeSlide, setActiveSlide] = useState(0);

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

  const posters = sliderData?.posters || [];
  const autoPlayInterval = sliderData?.autoPlayInterval ?? DEFAULT_AUTOPLAY_INTERVAL;

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

  // Auto-play
  useEffect(() => {
    if (prefersReducedMotion || posters.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % posters.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, posters.length, autoPlayInterval]);

  // Keyboard nav
  useEffect(() => {
    if (posters.length <= 1) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") goToPrev();
      else if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [posters.length, goToPrev, goToNext]);

  if (!sliderData?.enabled || posters.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-bg pt-18 md:pt-24 pb-18 md:pb-24"
      aria-label="Promotional highlights"
    >
      <div className="relative">
        <div className="w-full">
          {posters.map((poster, index) => (
            <div key={poster._key || index} className={index === activeSlide ? "block" : "hidden"}>
              <ContentBanner
                data={poster}
                priority={index <= 1}
                className="animate-in fade-in duration-700 slide-in-from-bottom-4"
              />
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        {posters.length > 1 ? (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/50 hover:bg-white backdrop-blur-md text-deep-brown transition-all hover:scale-110 shadow-lg border border-white/20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/50 hover:bg-white backdrop-blur-md text-deep-brown transition-all hover:scale-110 shadow-lg border border-white/20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {posters.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === activeSlide
                      ? "bg-gold scale-125 shadow-lg w-8"
                      : "bg-deep-brown/20 hover:bg-deep-brown/40"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
