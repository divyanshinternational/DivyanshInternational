"use client";

/**
 * Drone Diaries Section Component
 *
 * Video slider with embedded playback like HeroSlider.
 * Features arrow navigation and audio control.
 */

import { useState, useCallback, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video as VideoIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { getYouTubeEmbedUrl, isYouTubeUrl } from "@/lib/utils";
import DecorativeBackground from "@/components/ui/DecorativeBackground";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface Video {
  _key?: string;
  title: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

interface DroneDiariesProps {
  sectionData?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    videos?: Video[];
  } | null;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function DroneDiaries({ sectionData }: DroneDiariesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // Hydration-safe client detection
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Filter valid videos
  const validVideos =
    sectionData?.videos?.filter((v) => v.videoUrl && v.videoUrl.trim() !== "") || [];

  // Navigation
  const goToNext = useCallback(() => {
    if (validVideos.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % validVideos.length);
  }, [validVideos.length]);

  const goToPrev = useCallback(() => {
    if (validVideos.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + validVideos.length) % validVideos.length);
  }, [validVideos.length]);

  // Auto-advance
  useEffect(() => {
    if (validVideos.length <= 1) return;
    const interval = setInterval(goToNext, 12000);
    return () => clearInterval(interval);
  }, [goToNext, validVideos.length]);

  if (!sectionData || validVideos.length === 0) return null;

  const currentVideo = validVideos[activeIndex];

  return (
    <section className="relative bg-paper" aria-labelledby="drone-diaries-heading">
      <div className="absolute inset-0 opacity-10 pointer-events-none"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-16 w-32 h-32 border-2 border-gold/20 rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 -right-16 w-24 h-24 border-2 border-gold/20 rounded-full pointer-events-none" />

      {/* Floating Decorations */}
      <DecorativeBackground variant="minimal" />

      <div className="container mx-auto px-4 md:px-6 lg:px-10 py-16 md:py-24 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-6"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <VideoIcon className="w-8 h-8" />
          </motion.div>

          {sectionData.eyebrow ? (
            <motion.p
              className="uppercase tracking-[0.3em] text-sm text-gold-dark mb-4 font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {sectionData.eyebrow}
            </motion.p>
          ) : null}

          {sectionData.title ? (
            <motion.h2
              id="drone-diaries-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-brown mb-4 font-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {sectionData.title}
            </motion.h2>
          ) : null}

          {sectionData.description ? (
            <motion.p
              className="text-lg text-text-muted leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {sectionData.description}
            </motion.p>
          ) : null}
        </div>

        {/* Video Slider Container - Like Hero Section */}
        <div className="relative max-w-6xl mx-auto">
          {/* Video Container with Aspect Ratio */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-deep-brown">
            {/* Video Background */}
            <AnimatePresence mode="wait">
              {isClient && currentVideo?.videoUrl && isYouTubeUrl(currentVideo.videoUrl) ? (
                <motion.div
                  key={`video-${activeIndex}-${isMuted}`}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-full h-full relative overflow-hidden">
                    <iframe
                      className="video-background-iframe"
                      src={`${getYouTubeEmbedUrl(currentVideo.videoUrl) || ""}&mute=${isMuted ? 1 : 0}&vq=hd1080&hd=1&quality=high&autoplay=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1`}
                      title={currentVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ border: "none" }}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  className="absolute inset-0 bg-amber-100 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <VideoIcon className="w-20 h-20 text-gold/40" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Solid Overlay for Text Readability */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            {/* Video Info Card */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg max-w-lg">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`info-${activeIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg md:text-xl font-bold text-deep-brown mb-1">
                      {currentVideo?.title}
                    </h3>
                    {currentVideo?.description ? (
                      <p className="text-text-muted text-sm">{currentVideo.description}</p>
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Sound Control Button - Like Hero */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all hover:scale-110 shadow-lg border border-white/30"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Navigation Controls - Only if multiple videos */}
          {validVideos.length > 1 ? (
            <>
              {/* Left Arrow */}
              <button
                onClick={goToPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-20 p-3 md:p-4 rounded-full shadow-lg border transition-all bg-white/90 border-border text-deep-brown hover:bg-gold hover:border-gold hover:text-white hover:shadow-xl"
                aria-label="Previous video"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-20 p-3 md:p-4 rounded-full shadow-lg border transition-all bg-white/90 border-border text-deep-brown hover:bg-gold hover:border-gold hover:text-white hover:shadow-xl"
                aria-label="Next video"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Slider Controls - Dots and Counter */}
              <div className="flex justify-center mt-6 gap-4 items-center">
                <div className="flex gap-2">
                  {validVideos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === activeIndex
                          ? "bg-gold w-8"
                          : "bg-deep-brown/20 w-2.5 hover:bg-deep-brown/40"
                      }`}
                      aria-label={`Go to video ${index + 1}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-text-muted tabular-nums">
                  {String(activeIndex + 1).padStart(2, "0")}
                  <span className="text-gold mx-1">/</span>
                  {String(validVideos.length).padStart(2, "0")}
                </span>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
