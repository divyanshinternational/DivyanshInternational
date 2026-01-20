"use client";

/**
 * Hero Slider Component
 *
 * Displays an auto-playing hero slider with video backgrounds, stats, and CTAs.
 * Uses useState/useEffect for state management and framer-motion for animations.
 * Requires client component due to interactive state.
 *
 * All content is passed via props from parent components that fetch from Sanity CMS.
 * Data is validated with Zod schemas for runtime type safety.
 */

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { LeafIcon } from "@/components/assets/Decorations";
import { urlForImage } from "@/lib/sanity/image";
import { getGoogleDriveImageUrl } from "@/lib/utils";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const CTASchema = z.object({
  label: z.string(),
  target: z.string(),
});

const HeroStatsSchema = z.object({
  value: z.string().nullable().optional(),
  label: z.string().nullable().optional(),
  detail: z.string().nullable().optional(),
});

const HeroSlideSchema = z.object({
  _id: z.string(),
  eyebrow: z.string().nullable().optional(),
  badge: z.string().nullable().optional(),
  headline: z.string().nullable().optional(),
  paragraphs: z.array(z.string()).nullable().optional(),
  primaryCta: CTASchema.nullable().optional(),
  secondaryCta: CTASchema.optional().nullable(),
  videoUrl: z.string().nullable().optional(),
  posterImage: z.unknown().optional().nullable(),
  posterImageUrl: z.string().optional().nullable(),
  posterUrl: z.string().optional().nullable(),
  stats: z.array(HeroStatsSchema).optional().nullable(),
});

const AccessibilityLabelsSchema = z.object({
  heroSectionAria: z.string().optional(),
  prevSlideAria: z.string().optional(),
  nextSlideAria: z.string().optional(),
  goToSlideAria: z.string().optional(),
});

const HeroConfigSchema = z.object({
  autoPlayInterval: z.number().optional(),
  slideNumberPadding: z.string().optional(),
});

const RoutingSchema = z.object({
  heroSectionId: z.string().optional(),
  contactPagePath: z.string().optional(),
  tradeEnquiryType: z.string().optional(),
});

const HeroSliderPropsSchema = z.object({
  initialSlides: z.array(HeroSlideSchema).nullish(),
  stats: z.array(HeroStatsSchema).nullish(),
  accessibility: AccessibilityLabelsSchema.optional(),
  heroConfig: HeroConfigSchema.optional(),
  routing: RoutingSchema.optional(),
});

// =============================================================================
// TYPE DEFINITIONS (Inferred from Zod Schemas)
// =============================================================================

type HeroSlide = z.infer<typeof HeroSlideSchema>;
type HeroStats = z.infer<typeof HeroStatsSchema>;
type AccessibilityLabels = z.infer<typeof AccessibilityLabelsSchema>;
type HeroConfig = z.infer<typeof HeroConfigSchema>;
type Routing = z.infer<typeof RoutingSchema>;

interface HeroSliderProps {
  initialSlides?: HeroSlide[] | null;
  stats?: HeroStats[] | null;
  accessibility?: AccessibilityLabels;
  heroConfig?: HeroConfig;
  routing?: Routing;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_AUTOPLAY_INTERVAL = 8000;
const DEFAULT_CONTACT_PATH = "/contact";
const DEFAULT_TRADE_TYPE = "trade";
const DEFAULT_SLIDE_PADDING = "0";

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

import {
  getGoogleDriveVideoUrl,
  getYouTubeEmbedUrl,
  isYouTubeUrl,
  isValidVideoUrl,
} from "@/lib/utils";

function validateProps(props: unknown): void {
  const result = HeroSliderPropsSchema.safeParse(props);
  if (!result.success) {
    console.warn("[HeroSlider] Props validation warning:", result.error.format());
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function HeroSlider({
  initialSlides,
  stats,
  accessibility,
  heroConfig,
  routing,
}: HeroSliderProps) {
  const router = useRouter();

  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    validateProps({ initialSlides, stats, accessibility, heroConfig, routing });
  }

  // State for sound control
  const [isMuted, setIsMuted] = useState(true);

  const slides = initialSlides ?? [];
  const [activeSlide, setActiveSlide] = useState(0);
  const [videoErrors, setVideoErrors] = useState<Record<string, boolean>>({});

  // Use useSyncExternalStore for hydration-safe client detection
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Use useSyncExternalStore for reduced motion preference
  const prefersReducedMotion = useSyncExternalStore(
    (callback) => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  const autoPlayInterval = heroConfig?.autoPlayInterval ?? DEFAULT_AUTOPLAY_INTERVAL;
  const contactPath = routing?.contactPagePath ?? DEFAULT_CONTACT_PATH;
  const tradeType = routing?.tradeEnquiryType ?? DEFAULT_TRADE_TYPE;
  const slideNumberPadding = heroConfig?.slideNumberPadding ?? DEFAULT_SLIDE_PADDING;

  const handleVideoError = useCallback((id: string) => {
    setVideoErrors((prev) => ({ ...prev, [id]: true }));
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (slides.length === 0) return;
      if (index < 0 || index >= slides.length) return;
      setActiveSlide(index);
    },
    [slides.length]
  );

  const handleNavigation = useCallback(
    (target: string) => {
      if (!isClient) return;

      // Handle path-based navigation (e.g., "/products", "/about")
      if (target.startsWith("/")) {
        router.push(target);
        return;
      }

      // Handle contact shortcut
      if (target === "contact") {
        router.push(`${contactPath}?type=${tradeType}`);
        return;
      }

      // Handle section scroll (element IDs)
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },
    [isClient, router, contactPath, tradeType]
  );

  // Auto-play functionality
  useEffect(() => {
    if (prefersReducedMotion || slides.length === 0) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, slides.length, autoPlayInterval]);

  const displayStats = stats ?? [];

  if (slides.length === 0) return null;

  const currentSlide = slides[activeSlide];

  return (
    <section
      id={routing?.heroSectionId}
      className="hero-slider relative overflow-hidden min-h-screen flex items-center"
      aria-label={accessibility?.heroSectionAria}
    >
      {/* Video Background with Light Overlay */}
      <VideoBackground
        slides={slides}
        activeSlide={activeSlide}
        videoErrors={videoErrors}
        onVideoError={handleVideoError}
        isMuted={isMuted}
      />

      {/* Sound Control Button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-8 right-8 z-30 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-deep-brown transition-all hover:scale-110 shadow-lg border border-white/30"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              clipRule="evenodd"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-10 py-16">
        <div className="grid lg:grid-cols-[1fr_0.4fr] gap-8 lg:gap-12 items-start min-h-[60vh]">
          {/* Text Content */}
          <div className="flex flex-col bg-white/50 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20">
            {currentSlide ? (
              <SlideContent slide={currentSlide} onNavigate={handleNavigation} />
            ) : null}

            {/* Slider Controls - Bottom of text column */}
            {slides.length > 1 ? (
              <div className="mt-auto pt-8">
                <SliderControls
                  slides={slides}
                  activeSlide={activeSlide}
                  slideNumberPadding={slideNumberPadding}
                  accessibility={accessibility}
                  onGoToSlide={goToSlide}
                />
              </div>
            ) : null}
          </div>

          {/* Stats Panel - Right column */}
          <StatsPanel slideId={currentSlide?._id} stats={currentSlide?.stats ?? displayStats} />
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface VideoBackgroundProps {
  slides: HeroSlide[];
  activeSlide: number;
  videoErrors: Record<string, boolean>;
  onVideoError: (id: string) => void;
  isMuted: boolean;
}

function VideoBackground({
  slides,
  activeSlide,
  videoErrors,
  onVideoError,
  isMuted,
}: VideoBackgroundProps) {
  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === activeSlide && (
              <motion.div
                key={slide._id}
                className="motion-div absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "linear" }}
              >
                {slide.videoUrl && isValidVideoUrl(slide.videoUrl) && !videoErrors[slide._id] ? (
                  // Check if it's a YouTube URL
                  isYouTubeUrl(slide.videoUrl) ? (
                    <div className="w-full h-full relative overflow-hidden">
                      <iframe
                        key={`${slide._id}-${isMuted}`}
                        className="video-background-iframe"
                        src={`${getYouTubeEmbedUrl(slide.videoUrl) || ""}&mute=${isMuted ? 1 : 0}&vq=hd1080&hd=1&quality=high&autoplay=1`}
                        title="Background video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ border: "none" }}
                      />
                    </div>
                  ) : (
                    <video
                      className="w-full h-full object-cover"
                      src={getGoogleDriveVideoUrl(slide.videoUrl)}
                      poster={
                        slide.posterImage
                          ? urlForImage(slide.posterImage).url()
                          : (slide.posterUrl ?? undefined)
                      }
                      autoPlay
                      muted={isMuted}
                      loop
                      playsInline
                      preload="auto"
                      onError={() => onVideoError(slide._id)}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <FallbackBackground slide={slide} />
                )}
              </motion.div>
            )
        )}
      </AnimatePresence>
      {/* Light warm overlay - solid color instead of gradient */}
      <div className="absolute inset-0 bg-white/60" />
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4YjdkNmIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTEyIDM4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

interface FallbackBackgroundProps {
  slide: HeroSlide;
}

function FallbackBackground({ slide }: FallbackBackgroundProps) {
  // Priority: posterImageUrl (Google Drive) > posterImage (Sanity) > posterUrl (legacy)
  const posterUrl = slide.posterImageUrl
    ? getGoogleDriveImageUrl(slide.posterImageUrl)
    : slide.posterImage
      ? urlForImage(slide.posterImage).url()
      : slide.posterUrl;

  return (
    <div
      className="w-full h-full bg-cover bg-center bg-no-repeat bg-paper"
      style={{
        backgroundImage: posterUrl ? `url(${posterUrl})` : undefined,
      }}
    >
      {!posterUrl ? (
        <div className="absolute inset-0 flex items-center justify-center bg-paper">
          <div className="text-center text-text-muted">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Media loading...</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
interface SlideContentProps {
  slide: HeroSlide;
  onNavigate: (target: string) => void;
}

function SlideContent({ slide, onNavigate }: SlideContentProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slide._id}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.1,
            },
          },
        }}
        className="flex flex-col items-start"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
          }}
          className="flex items-center gap-3 mb-4 md:mb-6"
        >
          <span className="h-px w-8 md:w-12 bg-black!" aria-hidden="true" />
          <p className="uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs text-black! font-extrabold">
            {slide.eyebrow ?? ""}
          </p>
        </motion.div>

        <div className="mb-4 md:mb-6 leading-tight font-heading text-black! drop-shadow-none overflow-hidden min-h-[1.2em]">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
            }}
          >
            {slide.headline ?? ""}
          </motion.h1>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
          }}
          className="mb-4 md:mb-6"
        >
          <p className="text-xs md:text-sm text-black! font-bold tracking-wide uppercase border-l-4 border-black pl-4 py-1 inline-block drop-shadow-sm">
            {slide.badge}
          </p>
        </motion.div>

        <div className="space-y-3 md:space-y-4 text-base md:text-lg text-black! max-w-2xl mb-8 md:mb-10 leading-relaxed font-bold">
          {(slide.paragraphs ?? []).map((paragraph, index) => (
            <motion.p
              key={`${slide._id}-paragraph-${index}`}
              className="drop-shadow-sm text-black!"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
              }}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
          }}
          className="flex flex-wrap gap-3 md:gap-4"
        >
          {slide.primaryCta ? (
            <button
              type="button"
              onClick={() => onNavigate(slide.primaryCta!.target)}
              className="px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base font-bold bg-gold text-white transition-all shadow-lg hover:shadow-xl hover:bg-gold-dark hover:scale-105 duration-300"
            >
              {slide.primaryCta.label}
            </button>
          ) : null}
          {slide.secondaryCta ? (
            <button
              type="button"
              onClick={() => onNavigate(slide.secondaryCta!.target)}
              className="px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base font-semibold border-2 border-black! text-black! hover:bg-white hover:shadow-lg transition-all hover:scale-105 duration-300"
            >
              {slide.secondaryCta.label}
            </button>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface StatsPanelProps {
  slideId: string | undefined;
  stats: HeroStats[];
}

function StatsPanel({ slideId, stats }: StatsPanelProps) {
  if (stats.length === 0) return null;

  return (
    <div className="space-y-6 hidden lg:block">
      <AnimatePresence>
        {stats.map((stat, index) => (
          <motion.div
            key={`${slideId}-${stat.label}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{
              duration: 0.4,
              delay: index * 0.05 + 0.2,
              ease: "easeOut",
            }}
            className="p-6 transition-all duration-300 group hover:translate-x-2 bg-white/50 backdrop-blur-md rounded-xl shadow-lg border border-white/20"
          >
            <div className="flex justify-between items-start mb-1">
              <p className="text-4xl font-bold text-black! group-hover:text-deep-brown transition-colors font-heading">
                {stat.value}
              </p>
              <LeafIcon className="w-5 h-5 text-gold" />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-black! mb-1 font-bold">
              {stat.label}
            </p>
            <p className="text-sm text-black! italic font-semibold">{stat.detail}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface SliderControlsProps {
  slides: HeroSlide[];
  activeSlide: number;
  slideNumberPadding: string;
  accessibility: AccessibilityLabels | undefined;
  onGoToSlide: (index: number) => void;
}

function SliderControls({
  slides,
  activeSlide,
  slideNumberPadding,
  accessibility,
  onGoToSlide,
}: SliderControlsProps) {
  const isFirst = activeSlide === 0;
  const isLast = activeSlide === slides.length - 1;

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => !isFirst && onGoToSlide(activeSlide - 1)}
        disabled={isFirst}
        className={`p-2.5 rounded-full backdrop-blur-md border transition-all shadow-sm ${
          isFirst
            ? "bg-white/50 border-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white/90 border-border text-deep-brown hover:bg-gold hover:border-gold hover:text-white hover:shadow-md"
        }`}
        aria-label={accessibility?.prevSlideAria ?? "Previous slide"}
        aria-disabled={isFirst}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <span className="text-sm font-medium text-text-muted tabular-nums min-w-[60px] text-center">
        {String(activeSlide + 1).padStart(2, slideNumberPadding)}
        <span className="text-gold mx-1">/</span>
        {slides.length.toString().padStart(2, slideNumberPadding)}
      </span>
      <button
        type="button"
        onClick={() => !isLast && onGoToSlide(activeSlide + 1)}
        disabled={isLast}
        className={`p-2.5 rounded-full backdrop-blur-md border transition-all shadow-sm ${
          isLast
            ? "bg-white/50 border-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white/90 border-gray-200 text-deep-brown hover:bg-almond-gold hover:border-almond-gold hover:text-white hover:shadow-md"
        }`}
        aria-label={accessibility?.nextSlideAria ?? "Next slide"}
        aria-disabled={isLast}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
