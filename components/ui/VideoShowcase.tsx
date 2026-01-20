"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { urlForImage } from "@/lib/sanity/image";
import { getGoogleDriveVideoUrl, getYouTubeEmbedUrl, isYouTubeUrl } from "@/lib/utils";
import { type z } from "zod";
import { type VideoItemSchema, type VideoShowcaseSchema } from "./video-showcase-schema";

// =============================================================================
// INTERFACES (Inferred from Schemas)
// =============================================================================

export type VideoItem = z.infer<typeof VideoItemSchema>;
export type VideoShowcaseData = z.infer<typeof VideoShowcaseSchema>;

interface VideoShowcaseProps {
  data: VideoShowcaseData | null | undefined;
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
};

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

  const handlePrevVideo = useCallback(() => {
    setActiveVideoIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  }, [videos.length]);

  const handleNextVideo = useCallback(() => {
    setActiveVideoIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  }, [videos.length]);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  if (!settings) return null;

  return (
    <motion.div
      className="bg-paper border-2 border-gold-light p-8 rounded-3xl shadow-xl space-y-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={slideInRight}
    >
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
        <h3 className="text-2xl font-semibold text-(--color-graphite) mb-4">{settings.title}</h3>
      ) : null}

      {/* Video Player Component */}
      <VideoPlayer
        activeVideo={activeVideo}
        totalVideos={videos.length}
        onPrev={handlePrevVideo}
        onNext={handleNextVideo}
        placeholderText={settings.placeholderText ?? undefined}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* active video title/desc */}
      <div className="flex-1 text-center md:text-left">
        <h4 className="font-bold text-deep-brown mb-1">{activeVideo?.title}</h4>
        {activeVideo?.description ? (
          <p className="text-sm text-(--color-slate)">{activeVideo.description}</p>
        ) : null}
      </div>

      {/* Navigation Dots */}
      {videos.length > 1 ? (
        <div className="flex justify-center gap-2 mt-4">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveVideoIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeVideoIndex || (index === 0 && !activeVideoIndex)
                  ? "bg-almond-gold w-8"
                  : "bg-sand hover:bg-gold-light"
              }`}
              aria-label={`Go to video ${index + 1}`}
              aria-current={index === activeVideoIndex ? "true" : "false"}
            />
          ))}
        </div>
      ) : null}

      {highlightsList.length > 0 ? (
        <ul className="space-y-4 text-(--color-slate)">
          {highlightsList.map((point) => (
            <li key={point} className="flex gap-3">
              <span aria-hidden="true" className="mt-2 h-2 w-2 rounded-full bg-gold" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {settings.note ? <p className="mt-6 text-sm text-(--color-muted)">{settings.note}</p> : null}
    </motion.div>
  );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface VideoPlayerProps {
  activeVideo: VideoItem | undefined;
  totalVideos: number;
  onPrev: () => void;
  onNext: () => void;
  placeholderText: string | undefined;
  isMuted: boolean;
  onToggleMute: () => void;
}

function VideoPlayer({
  activeVideo,
  totalVideos,
  onPrev,
  onNext,
  placeholderText,
  isMuted,
  onToggleMute,
}: VideoPlayerProps) {
  return (
    <div className="relative">
      <div className="rounded-2xl overflow-hidden border-2 border-gold-light bg-beige aspect-video relative">
        <AnimatePresence mode="wait">
          {activeVideo?.videoUrl ? (
            <motion.div
              key={activeVideo._key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full"
            >
              {isYouTubeUrl(activeVideo.videoUrl) ? (
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                  <iframe
                    key={`${activeVideo._key}-${isMuted}`}
                    className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 scale-[1.5]"
                    src={`${getYouTubeEmbedUrl(activeVideo.videoUrl) || ""}&controls=0&showinfo=0&disablekb=1&fs=0&iv_load_policy=3&rel=0&modestbranding=1&vq=hd1080&hd=1&quality=high&mute=${isMuted ? 1 : 0}&autoplay=1`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: "none" }}
                  />
                </div>
              ) : (
                <video
                  className="w-full h-full object-cover"
                  src={getGoogleDriveVideoUrl(activeVideo.videoUrl)}
                  controls
                  autoPlay
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
              className="relative w-full h-[300px]"
            >
              <Image
                src={urlForImage(activeVideo.thumbnail).url()}
                alt={activeVideo.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="text-center text-white">
                  <div className="text-5xl mb-2" aria-hidden="true">
                    🎥
                  </div>
                  <p className="text-sm">Video coming soon</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center text-center text-xs uppercase tracking-[0.3em] text-(--color-muted) px-6 min-h-[220px]">
              <div>
                <div className="text-5xl mb-4" aria-hidden="true">
                  🎥
                </div>
                <p>{placeholderText || "Video Placeholder"}</p>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Navigation Arrows */}
        {totalVideos > 1 ? (
          <>
            <button
              onClick={onPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-deep-brown hover:text-almond-gold transition-all shadow-lg z-10"
              aria-label="Previous video"
            >
              <ChevronLeftIcon />
            </button>
            <button
              onClick={onNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-deep-brown hover:text-almond-gold transition-all shadow-lg z-10"
              aria-label="Next video"
            >
              <ChevronRightIcon />
            </button>
          </>
        ) : null}

        {/* Mute/Unmute Button */}
        <button
          onClick={onToggleMute}
          className="absolute bottom-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white text-deep-brown hover:text-almond-gold transition-all shadow-lg z-10"
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
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
