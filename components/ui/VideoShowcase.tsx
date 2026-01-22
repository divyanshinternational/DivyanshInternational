"use client";

import { useEffect, useState } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { motion, AnimatePresence } from "framer-motion";
import { urlForImage } from "@/lib/sanity/image";
import { getGoogleDriveVideoUrl, getYouTubeEmbedUrl, isYouTubeUrl } from "@/lib/utils";
import { type z } from "zod";
import { type VideoItemSchema, type VideoShowcaseSchema } from "./video-showcase-schema";
import { Video as VideoIcon, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

// =============================================================================
// INTERFACES
// =============================================================================

export type VideoItem = z.infer<typeof VideoItemSchema>;
export type VideoShowcaseData = z.infer<typeof VideoShowcaseSchema>;

interface VideoShowcaseProps {
  data: VideoShowcaseData | null | undefined;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function VideoShowcase({ data }: VideoShowcaseProps) {
  const settings = data;
  const videos = settings?.videos ?? [];
  const highlightsList = settings?.highlights ?? [];

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const activeVideo = videos[activeVideoIndex];

  const handlePrevVideo = () => {
    setActiveVideoIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const handleNextVideo = () => {
    setActiveVideoIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveVideoIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveVideoIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [videos.length]);

  if (!settings) return null;

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="text-center md:text-left">
        {settings.eyebrow ? (
          <motion.p
            className="uppercase tracking-[0.4em] text-xs text-(--color-muted) mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {settings.eyebrow}
          </motion.p>
        ) : null}

        {settings.title ? (
          <h3 className="text-3xl font-bold text-deep-brown mb-6">{settings.title}</h3>
        ) : null}
      </div>

      {/* Main Video Player Container */}
      <div className="relative max-w-6xl mx-auto">
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
          <AnimatePresence mode="wait">
            {activeVideo?.videoUrl ? (
              <motion.div
                key={activeVideo._key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {isYouTubeUrl(activeVideo.videoUrl) ? (
                  <div className="w-full h-full relative overflow-hidden pointer-events-none">
                    <iframe
                      key={`${activeVideo._key}-${isMuted}`}
                      className="video-contain-iframe"
                      src={`${getYouTubeEmbedUrl(activeVideo.videoUrl) || ""}&controls=0&showinfo=0&disablekb=1&fs=0&iv_load_policy=3&rel=0&modestbranding=1&vq=hd1080&hd=1&quality=high&mute=${isMuted ? 1 : 0}&autoplay=1&loop=1`}
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ border: "none" }}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <video
                    className="w-full h-full object-scale-down bg-black"
                    src={getGoogleDriveVideoUrl(activeVideo.videoUrl)}
                    muted={isMuted}
                    autoPlay
                    playsInline
                    onEnded={handleNextVideo}
                    poster={
                      activeVideo.thumbnail ? urlForImage(activeVideo.thumbnail).url() : undefined
                    }
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </motion.div>
            ) : activeVideo?.thumbnail ? (
              <motion.div
                key={activeVideo._key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full"
              >
                <OptimizedImage
                  src={urlForImage(activeVideo.thumbnail).url()}
                  alt={activeVideo.title}
                  fill
                  className="bg-black"
                  imageClassName="object-scale-down"
                  quality={100}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <VideoIcon className="w-20 h-20 text-white/80" />
                </div>
              </motion.div>
            ) : (
              <div className="absolute inset-0 bg-beige flex items-center justify-center text-center p-6">
                <div>
                  <VideoIcon className="w-16 h-16 text-almond-gold/50 mx-auto mb-4" />
                  <p className="text-deep-brown/60 font-medium tracking-wide uppercase text-sm">
                    {settings.placeholderText || "No Video Source"}
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Mute Control */}
          <button
            onClick={handleToggleMute}
            className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all hover:scale-110 shadow-lg border border-white/30"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Navigation Arrows */}
          {videos.length > 1 ? (
            <>
              <button
                onClick={handlePrevVideo}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 transition-transform active:scale-95 hover:scale-110 text-white/80 hover:text-white"
                aria-label="Previous video"
              >
                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 drop-shadow-md" />
              </button>
              <button
                onClick={handleNextVideo}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 transition-transform active:scale-95 hover:scale-110 text-white/80 hover:text-white"
                aria-label="Next video"
              >
                <ChevronRight className="w-8 h-8 md:w-10 md:h-10 drop-shadow-md" />
              </button>
            </>
          ) : null}
        </div>

        {/* Info Block */}
        <div className="block mt-4 text-center px-4">
          <motion.div
            key={`mobile-${activeVideo?._key}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-xl font-bold text-deep-brown mb-2">{activeVideo?.title}</h4>
            {activeVideo?.description ? (
              <p className="text-sm text-(--color-slate) leading-relaxed">
                {activeVideo.description}
              </p>
            ) : null}
          </motion.div>
        </div>
      </div>

      {/* Extra Highlights List */}
      {highlightsList.length > 0 ? (
        <ul className="space-y-3 text-(--color-slate) max-w-4xl mx-auto px-4">
          {highlightsList.map((point) => (
            <li key={point} className="flex gap-3">
              <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {settings.note ? (
        <p className="text-center text-sm text-(--color-muted) italic">{settings.note}</p>
      ) : null}
    </div>
  );
}
