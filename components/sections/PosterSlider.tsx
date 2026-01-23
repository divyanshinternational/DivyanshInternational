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
import { cn } from "@/lib/utils";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface PosterSliderProps {
  sliderData?: {
    enabled?: boolean | undefined;
    autoPlayInterval?: number | undefined;
    posters?: ContentBannerData[] | undefined;
  } | null;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_AUTOPLAY_INTERVAL = 6000;

// =============================================================================
// COMPONENT
// =============================================================================

export default function PosterSlider({ sliderData }: PosterSliderProps) {
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
      className="relative w-full overflow-hidden bg-bg pt-18 md:pt-24"
      aria-label="Promotional highlights"
    >
      <div className="relative min-h-[60vh] lg:min-h-[70vh]">
        <div className="w-full grid h-full">
          {posters.map((poster, index) => (
            <div
              key={poster._key || index}
              className={cn(
                "col-start-1 row-start-1 transition-opacity duration-700 h-full",
                index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              )}
            >
              <ContentBanner data={poster} priority={index <= 1} className="h-full" />
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        {posters.length > 1 ? (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 p-2 text-deep-brown/60 hover:text-deep-brown hover:scale-110 active:scale-95 transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 drop-shadow-sm" strokeWidth={2.5} />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 p-2 text-deep-brown/60 hover:text-deep-brown hover:scale-110 active:scale-95 transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8 drop-shadow-sm" strokeWidth={2.5} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-1 md:gap-2 px-4">
              {posters.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1 md:h-2.5 rounded-full transition-all duration-300 ${
                    index === activeSlide
                      ? "bg-gold shadow-md w-4 md:w-8"
                      : "w-1 md:w-2.5 bg-white/40 hover:bg-white/60"
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
