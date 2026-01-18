"use client";

/**
 * Video Testimonials Section Component
 *
 * Displays a list of testimonials and a video showcase section.
 * Uses client-side state for video slider navigation.
 *
 * All content is passed via props from parent components that fetch from Sanity CMS.
 * Data is validated with Zod schemas for runtime type safety.
 */

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

import { urlForImage } from "@/lib/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";
import { getGoogleDriveVideoUrl, getYouTubeEmbedUrl, isYouTubeUrl } from "@/lib/utils";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const SanityImageSourceSchema = z.custom<SanityImageSource>((val) => val !== undefined);

const TestimonialSchema = z.object({
  _id: z.string(),
  author: z.string(),
  role: z.string(),
  location: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  thumbnail: SanityImageSourceSchema.optional().nullable(),
  quote: z.string(),
});

const VideoItemSchema = z.object({
  _key: z.string(),
  title: z.string(),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  thumbnail: SanityImageSourceSchema.optional(),
});

const DroneSectionSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  placeholderText: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  note: z.string().optional(),
  videoUrl: z.string().optional(),
  image: SanityImageSourceSchema.optional(),
  videos: z.array(VideoItemSchema).optional(),
});

const SectionSettingsSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  droneSection: DroneSectionSchema.optional(),
});

const RoutingSchema = z.object({
  testimonialsSectionId: z.string().optional(),
});

const VideoTestimonialsPropsSchema = z.object({
  initialTestimonials: z.array(TestimonialSchema).nullish(),
  sectionSettings: SectionSettingsSchema.nullish(),
  routing: RoutingSchema.optional(),
});

// =============================================================================
// TYPE DEFINITIONS (Inferred from Zod Schemas)
// =============================================================================

type Testimonial = z.infer<typeof TestimonialSchema>;
type VideoItem = z.infer<typeof VideoItemSchema>;
type SectionSettings = z.infer<typeof SectionSettingsSchema>;
type Routing = z.infer<typeof RoutingSchema>;

interface VideoTestimonialsProps {
  initialTestimonials?: Testimonial[] | null;
  sectionSettings?: SectionSettings | null;
  routing?: Routing;
}

// =============================================================================
// VALIDATION
// =============================================================================

function validateProps(props: unknown): void {
  const result = VideoTestimonialsPropsSchema.safeParse(props);
  if (!result.success) {
    console.warn("[VideoTestimonials] Props validation warning:", result.error.format());
  }
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06, // Standard fast stagger
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function VideoTestimonialsSection({
  initialTestimonials,
  sectionSettings,
  routing,
}: VideoTestimonialsProps) {
  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    validateProps({ initialTestimonials, sectionSettings, routing });
  }

  const testimonials = initialTestimonials ?? [];
  const sectionId = routing?.testimonialsSectionId;

  return (
    <section
      id={sectionId}
      className="py-20 bg-linear-to-b from-beige to-sand relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Testimonials List */}
          <TestimonialsList
            testimonials={testimonials}
            eyebrow={sectionSettings?.eyebrow}
            title={sectionSettings?.title}
          />

          {/* Right Column: Drone/Video Showcase */}
          <DroneVideoShowcase sectionSettings={sectionSettings} />
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface TestimonialsListProps {
  testimonials: Testimonial[];
  eyebrow: string | undefined;
  title: string | undefined;
}

function TestimonialsList({ testimonials, eyebrow, title }: TestimonialsListProps) {
  return (
    <div>
      {eyebrow ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="uppercase tracking-[0.4em] text-xs text-(--color-muted)">{eyebrow}</span>
        </motion.div>
      ) : null}

      {title ? (
        <motion.h2
          className="text-3xl md:text-4xl font-semibold text-(--color-graphite) mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {title}
        </motion.h2>
      ) : null}

      <motion.div
        className="space-y-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -50px 0px" }}
        variants={staggerContainer}
      >
        {testimonials.map((testimonial) => (
          <motion.blockquote
            key={testimonial._id}
            className="bg-linear-to-br from-white to-ivory border-2 border-sand rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-gold-light transition-all duration-300"
            variants={fadeInUp}
          >
            <p className="text-lg text-(--color-slate) mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
            <footer className="text-sm font-semibold text-deep-brown">
              {testimonial.author}, <span className="text-(--color-muted)">{testimonial.role}</span>
            </footer>
          </motion.blockquote>
        ))}
      </motion.div>
    </div>
  );
}

interface DroneVideoShowcaseProps {
  sectionSettings: SectionSettings | null | undefined;
}

function DroneVideoShowcase({ sectionSettings }: DroneVideoShowcaseProps) {
  const droneSettings = sectionSettings?.droneSection;
  const videos = droneSettings?.videos ?? [];
  const droneHighlightsList = droneSettings?.highlights ?? [];

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const activeVideo = videos[activeVideoIndex];

  const handlePrevVideo = useCallback(() => {
    setActiveVideoIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  }, [videos.length]);

  const handleNextVideo = useCallback(() => {
    setActiveVideoIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  }, [videos.length]);

  return (
    <motion.div
      className="bg-linear-to-br from-white to-ivory border-2 border-gold-light p-8 rounded-3xl shadow-xl space-y-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={slideInRight}
    >
      {droneSettings?.eyebrow ? (
        <motion.p
          className="uppercase tracking-[0.4em] text-xs text-(--color-muted) mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {droneSettings.eyebrow}
        </motion.p>
      ) : null}

      {droneSettings?.title ? (
        <h3 className="text-2xl font-semibold text-(--color-graphite) mb-4">
          {droneSettings.title}
        </h3>
      ) : null}

      {/* Video Player Component */}
      <VideoPlayer
        activeVideo={activeVideo}
        totalVideos={videos.length}
        onPrev={handlePrevVideo}
        onNext={handleNextVideo}
        placeholderText={droneSettings?.placeholderText}
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

      <ul className="space-y-4 text-(--color-slate)">
        {droneHighlightsList.map((point) => (
          <li key={point} className="flex gap-3">
            <span aria-hidden="true" className="mt-2 h-2 w-2 rounded-full bg-gold" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {droneSettings?.note ? (
        <p className="mt-6 text-sm text-(--color-muted)">{droneSettings.note}</p>
      ) : null}
    </motion.div>
  );
}

interface VideoPlayerProps {
  activeVideo: VideoItem | undefined;
  totalVideos: number;
  onPrev: () => void;
  onNext: () => void;
  placeholderText: string | undefined;
}

function VideoPlayer({
  activeVideo,
  totalVideos,
  onPrev,
  onNext,
  placeholderText,
}: VideoPlayerProps) {
  return (
    <div className="relative">
      <div className="rounded-2xl overflow-hidden border-2 border-gold-light bg-beige min-h-[220px] relative">
        <AnimatePresence mode="wait">
          {activeVideo?.videoUrl ? (
            <motion.div
              key={activeVideo._key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full aspect-video"
            >
              {isYouTubeUrl(activeVideo.videoUrl) ? (
                <iframe
                  className="w-full h-full"
                  src={`${getYouTubeEmbedUrl(activeVideo.videoUrl) || ""}&controls=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: "none" }}
                />
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
