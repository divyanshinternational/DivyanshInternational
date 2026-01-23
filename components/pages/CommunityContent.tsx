"use client";

/**
 * Community Page Content Component
 *
 * Displays community initiatives, CSR programs, trade events, and
 * company values around social responsibility.
 *
 * Uses framer-motion for animations - requires client component.
 * All content is fetched from Sanity CMS and validated with Zod schemas
 * for runtime type safety.
 */

import { getGoogleDriveImageUrl } from "@/lib/utils";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { NutIcon, CashewIcon, PeanutIcon } from "@/components/assets/Decorations";
import DecorativeBackground from "@/components/ui/DecorativeBackground";
import PosterSlider from "@/components/sections/PosterSlider";
import VideoShowcase from "@/components/ui/VideoShowcase";
import ContentBanner, { type ContentBannerData } from "@/components/ui/ContentBanner";
import type { SanityImageSource } from "@sanity/image-url";
import { useState, useEffect, useCallback } from "react";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const SanityImageSourceSchema = z.custom<SanityImageSource>((val) => val !== undefined);

const VideoItemSchema = z.object({
  _key: z.string(),
  title: z.string(),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  thumbnail: SanityImageSourceSchema.optional(),
});

const VideoShowcaseSchema = z.object({
  eyebrow: z.string().nullish(),
  title: z.string().nullish(),
  placeholderText: z.string().nullish(),
  highlights: z.array(z.string()).nullish(),
  note: z.string().nullish(),
  videoUrl: z.string().nullish(),
  image: SanityImageSourceSchema.nullish(),
  videos: z.array(VideoItemSchema).nullish(),
});

const EnvironmentalInitiativeSchema = z.object({
  _key: z.string(),
  icon: z.string(),
  text: z.string(),
});

const TradeEventSchema = z.object({
  _key: z.string(),
  name: z.string(),
  date: z.string(),
  location: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

const CSRInitiativeSchema = z.object({
  _key: z.string(),
  title: z.string(),
  description: z.string(),
});

const ContentBannerDataSchema = z.object({
  _key: z.string().optional(),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  highlight: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  layout: z
    .enum(["bottom-image", "right-image", "left-image", "background-image", "text-only"])
    .optional(),
  imageUrl: z.string().optional(),
  image: SanityImageSourceSchema.optional(),
  bgOverlay: z.enum(["none", "black-10", "black-20", "black-40", "white-10"]).optional(),
  theme: z.enum(["light", "dark"]).optional(),
  paragraphs: z.array(z.string()).optional(),
  stats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
});

const CommunityDataSchema = z.object({
  _id: z.string(),
  header: z
    .object({
      eyebrow: z.string(),
      title: z.string(),
      subtitle: z.string(),
    })
    .nullish(),
  corePhilosophy: z
    .object({
      paragraph: z.string(),
      highlight: z.string(),
    })
    .nullish(),
  educationSection: z
    .object({
      icon: z.string(),
      title: z.string(),
      paragraphs: z.array(z.string()),
      quote: z.string(),
      images: z.array(z.string()).optional(),
    })
    .optional(),
  womenEmpowerment: z
    .object({
      icon: z.string(),
      title: z.string(),
      paragraphs: z.array(z.string()),
      imageUrl: z.string().optional(),
    })
    .optional(),
  childcareSection: z
    .object({
      icon: z.string(),
      title: z.string(),
      paragraphs: z.array(z.string()),
      highlight: z.string(),
      imageUrl: z.string().optional(),
    })
    .optional(),
  industryCollaboration: z
    .object({
      icon: z.string(),
      title: z.string(),
      paragraphs: z.array(z.string()),
      imageUrl: z.string().optional(),
    })
    .optional(),
  environmentalSection: z
    .object({
      icon: z.string(),
      title: z.string(),
      introText: z.string(),
      initiatives: z.array(EnvironmentalInitiativeSchema),
      imageUrl: z.string().optional(),
    })
    .optional(),
  employeeStories: VideoShowcaseSchema.optional(),
  tradeEventsSection: z
    .object({
      title: z.string(),
      subtitle: z.string(),
    })
    .optional(),
  tradeEvents: z.array(TradeEventSchema).optional(),
  closingMessage: z
    .object({
      title: z.string(),
      paragraphs: z.array(z.string()),
      finalHighlight: z.string(),
    })
    .nullish(),
  csrInitiatives: z.array(CSRInitiativeSchema).optional(),
  posterSliderSection: z
    .object({
      enabled: z.boolean().optional(),
      autoPlayInterval: z.number().optional(),
      posters: z.array(ContentBannerDataSchema).optional(),
    })
    .optional()
    .nullable(),
});

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

type CommunityData = z.infer<typeof CommunityDataSchema>;
type TradeEvent = z.infer<typeof TradeEventSchema>;
type EnvironmentalInitiative = z.infer<typeof EnvironmentalInitiativeSchema>;

interface CommunityContentProps {
  initialCommunity?: unknown;
  posterSliderSection?: {
    enabled?: boolean;
    autoPlayInterval?: number;
    posters?: ContentBannerData[];
  };
}

// =============================================================================
// VALIDATION & DATA PARSING
// =============================================================================

function parseCommunityData(data: unknown): CommunityData | null {
  const result = CommunityDataSchema.safeParse(data);
  if (!result.success) {
    console.error("[CommunityContent] Data validation failed:", result.error.format());
    return null;
  }
  return result.data;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function CommunityContent({
  initialCommunity,
  posterSliderSection,
}: CommunityContentProps) {
  const community = parseCommunityData(initialCommunity);

  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-deep-brown text-lg">Unable to load Community page content.</p>
      </div>
    );
  }

  const tradeEvents = community.tradeEvents ?? [];
  const sliderData = posterSliderSection ?? community.posterSliderSection;

  return (
    <>
      {/* Poster Slider (Header) - Full Width */}
      {sliderData?.enabled && sliderData.posters && sliderData.posters.length > 0 ? (
        <PosterSlider sliderData={sliderData} />
      ) : null}

      <div className="bg-paper min-h-screen pt-18 md:pt-24 pb-16 md:pb-24 relative">
        {/* Decorative Background */}
        <DecorativeBackground variant="scattered" />

        <div className="container mx-auto px-4 md:px-6 lg:px-10 relative z-10">
          {/* Fallback Header (if slider is disabled/empty) */}
          {(!sliderData?.enabled || !sliderData.posters || sliderData.posters.length === 0) &&
          community.header ? (
            /* Fallback to static ContentBanner if no slider data */
            <ContentBanner
              data={{
                eyebrow: community.header.eyebrow,
                title: community.header.title,
                description: community.header.subtitle,
                layout: "text-only",
                theme: "light",
              }}
              className="mb-16 md:mb-24 bg-transparent"
            />
          ) : null}

          {/* Core Philosophy */}
          {community.corePhilosophy ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="mb-16 md:mb-24 relative"
            >
              {/* Organic blob background */}
              <div
                className="absolute -inset-4 -z-10"
                style={{
                  background: "#f5f0e8",
                  borderRadius: "55% 45% 50% 50% / 50% 55% 45% 50%",
                  transform: "rotate(-2deg)",
                }}
              />

              <div className="bg-white/80 backdrop-blur-md p-10 md:p-12 rounded-2xl border border-sand shadow-lg">
                <div className="mx-auto text-center">
                  <motion.div
                    className="flex justify-center mb-6"
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1 },
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" as const }}
                  >
                    <NutIcon className="w-12 h-12 text-almond-gold/50" />
                  </motion.div>

                  <motion.p
                    className="text-lg text-(--color-slate) leading-relaxed mb-6"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" as const }}
                  >
                    {community.corePhilosophy.paragraph}
                  </motion.p>
                  <motion.p
                    className="text-xl font-semibold text-almond-gold"
                    variants={{
                      hidden: { opacity: 0, x: -30 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
                  >
                    {community.corePhilosophy.highlight}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* Employee Stories */}
          {community.employeeStories ? (
            <div className="mb-16 md:mb-24">
              <VideoShowcase data={community.employeeStories} />
            </div>
          ) : null}

          {/* Education Section */}
          {community.educationSection ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="mb-16 md:mb-24"
            >
              <motion.div
                className="relative"
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.7, ease: "easeOut" as const }}
              >
                <div className="rounded-2xl overflow-hidden flex flex-col md:flex-row">
                  {/* Carousel Side */}
                  {community.educationSection.images &&
                  community.educationSection.images.length > 0 ? (
                    <div className="w-full md:w-1/2 relative flex flex-col justify-center items-center">
                      <div className="w-full relative flex justify-center items-center">
                        <EducationCarousel images={community.educationSection.images} />
                      </div>
                    </div>
                  ) : null}

                  {/* Content Side */}
                  <div className="p-8 md:p-12 w-full md:w-1/2">
                    <div className="text-4xl mb-4">{community.educationSection.icon}</div>
                    <h2 className="text-3xl font-bold text-deep-brown mb-4 font-heading">
                      {community.educationSection.title}
                    </h2>
                    {community.educationSection.paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-(--color-slate) leading-relaxed mb-4 last:mb-0"
                      >
                        {paragraph}
                      </p>
                    ))}

                    {community.educationSection.quote ? (
                      <div className="mt-8 pt-6 border-t border-almond-gold/20 flex flex-col items-start px-4">
                        <CashewIcon className="w-6 h-6 text-almond-gold/60 mb-3" />
                        <p className="text-deep-brown font-semibold text-lg italic">
                          &quot;{community.educationSection.quote}&quot;
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}

          {/* Women Empowerment */}
          {community.womenEmpowerment ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="mb-16 md:mb-24"
            >
              <motion.div
                className="relative"
                variants={{
                  hidden: { opacity: 0, x: 30 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" as const }}
              >
                <div className="rounded-2xl overflow-hidden flex flex-col md:flex-row-reverse">
                  {/* Image Side */}
                  {community.womenEmpowerment.imageUrl ? (
                    <div className="w-full md:w-1/2 relative flex items-center justify-center">
                      <OptimizedImage
                        src={getGoogleDriveImageUrl(community.womenEmpowerment.imageUrl) || ""}
                        alt={community.womenEmpowerment.title}
                        width={600}
                        height={400}
                        className="w-auto h-auto max-w-full"
                        imageClassName="w-full h-auto hover:scale-[1.02] transition-transform duration-700 object-scale-down"
                        quality={100}
                      />
                    </div>
                  ) : null}

                  {/* Content Side */}
                  <div className="p-8 md:p-12 w-full md:w-1/2">
                    <motion.div
                      className="mb-8"
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" as const }}
                    >
                      <div className="text-4xl mb-4">{community.womenEmpowerment.icon}</div>
                      <h2 className="text-3xl md:text-4xl font-bold text-deep-brown mb-4 font-heading">
                        {community.womenEmpowerment.title}
                      </h2>
                    </motion.div>
                    <div className="space-y-6 text-lg text-(--color-slate) leading-relaxed">
                      {community.womenEmpowerment.paragraphs.map((paragraph, index) => {
                        const isLast = index === community.womenEmpowerment!.paragraphs.length - 1;
                        return (
                          <motion.p
                            key={index}
                            className={isLast ? "font-semibold text-deep-brown" : ""}
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              visible: { opacity: 1, y: 0 },
                            }}
                            transition={{
                              duration: 0.5,
                              delay: 0.1 + index * 0.1,
                              ease: "easeOut" as const,
                            }}
                          >
                            {paragraph}
                          </motion.p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}

          {/* Childcare & Learning */}
          {community.childcareSection ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="mb-16 md:mb-24 relative"
            >
              <div className="rounded-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Image Side */}
                {community.childcareSection.imageUrl ? (
                  <div className="w-full md:w-1/2 relative flex items-center justify-center">
                    <OptimizedImage
                      src={getGoogleDriveImageUrl(community.childcareSection.imageUrl) || ""}
                      alt={community.childcareSection.title}
                      width={600}
                      height={400}
                      className="w-auto h-auto max-w-full"
                      imageClassName="w-full h-auto hover:scale-[1.02] transition-transform duration-700 object-scale-down"
                      quality={100}
                    />
                  </div>
                ) : null}

                {/* Content Side */}
                <div className="w-full md:w-1/2 p-10 md:p-12">
                  <motion.div
                    className="mb-8"
                    variants={{
                      hidden: { opacity: 0, scale: 0.9 },
                      visible: { opacity: 1, scale: 1 },
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" as const }}
                  >
                    <div className="text-4xl mb-4">{community.childcareSection.icon}</div>
                    <h2 className="text-3xl md:text-4xl font-bold text-deep-brown mb-4 font-heading">
                      {community.childcareSection.title}
                    </h2>
                  </motion.div>
                  <div className="space-y-6 text-lg text-(--color-slate) leading-relaxed">
                    {community.childcareSection.paragraphs.map((paragraph, index) => (
                      <motion.p
                        key={index}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        transition={{
                          duration: 0.5,
                          delay: 0.1 + index * 0.1,
                          ease: "easeOut" as const,
                        }}
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                    <motion.p
                      className="font-semibold text-almond-gold text-xl"
                      variants={{
                        hidden: { opacity: 0, x: -30 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" as const }}
                    >
                      {community.childcareSection.highlight}
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* Industry Collaboration */}
          {community.industryCollaboration ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="mb-16 md:mb-24"
            >
              <motion.div
                className="relative h-full"
                variants={{
                  hidden: { opacity: 0, x: -40 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.7, ease: "easeOut" as const }}
              >
                <div className="rounded-2xl overflow-hidden flex flex-col md:flex-row-reverse">
                  {community.industryCollaboration.imageUrl ? (
                    <div className="w-full md:w-1/2 relative flex items-center justify-center">
                      <OptimizedImage
                        src={getGoogleDriveImageUrl(community.industryCollaboration.imageUrl) || ""}
                        alt={community.industryCollaboration.title}
                        width={600}
                        height={400}
                        className="w-auto h-auto max-w-full"
                        imageClassName="w-full h-auto hover:scale-[1.02] transition-transform duration-700 object-scale-down"
                        quality={100}
                      />
                    </div>
                  ) : null}
                  <div className="w-full md:w-1/2 p-8 md:p-12">
                    <div className="text-4xl mb-4">{community.industryCollaboration.icon}</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-deep-brown mb-4 font-heading">
                      {community.industryCollaboration.title}
                    </h2>
                    {community.industryCollaboration.paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-(--color-slate) leading-relaxed mb-4 last:mb-0"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}

          {/* Environmental Responsibility */}
          {community.environmentalSection ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="mb-16 md:mb-24"
            >
              <motion.div
                className="relative h-full"
                variants={{
                  hidden: { opacity: 0, x: 40 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" as const }}
              >
                <div className="rounded-2xl overflow-hidden flex flex-col md:flex-row">
                  {community.environmentalSection.imageUrl ? (
                    <div className="w-full md:w-1/2 relative flex items-center justify-center">
                      <OptimizedImage
                        src={getGoogleDriveImageUrl(community.environmentalSection.imageUrl) || ""}
                        alt={community.environmentalSection.title}
                        width={600}
                        height={400}
                        className="w-auto h-auto max-w-full"
                        imageClassName="w-full h-auto hover:scale-[1.02] transition-transform duration-700 object-scale-down"
                        quality={100}
                      />
                    </div>
                  ) : null}
                  <div className="w-full md:w-1/2 p-8 md:p-12">
                    <div className="text-4xl mb-4">{community.environmentalSection.icon}</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-deep-brown mb-4 font-heading">
                      {community.environmentalSection.title}
                    </h2>
                    <p className="text-(--color-slate) leading-relaxed mb-4">
                      {community.environmentalSection.introText}
                    </p>
                    <ul className="space-y-3 text-(--color-slate)">
                      {community.environmentalSection.initiatives.map(
                        (initiative: EnvironmentalInitiative) => (
                          <li key={initiative._key} className="flex items-start">
                            <span className="text-almond-gold mr-2">{initiative.icon}</span>
                            <span>{initiative.text}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}

          {/* Trade Events Section */}
          {tradeEvents.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="mb-16 md:mb-24"
            >
              <motion.div
                className="text-center mb-16 md:mb-24"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" as const }}
              >
                <PeanutIcon className="w-12 h-12 text-almond-gold/40 mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold text-deep-brown mb-4 font-heading">
                  {community.tradeEventsSection?.title ?? "Trade Events & Exhibitions"}
                </h2>
                <p className="text-(--color-slate) mx-auto">
                  {community.tradeEventsSection?.subtitle ??
                    "Meet us at leading industry events across India"}
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tradeEvents.map((event: TradeEvent, index: number) => (
                  <TradeEventCard key={event._key} event={event} index={index} />
                ))}
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface TradeEventCardProps {
  event: TradeEvent;
  index: number;
}

function TradeEventCard({ event, index }: TradeEventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="relative"
    >
      <div className="rounded-2xl transition-all duration-300 overflow-hidden bg-white/50 border border-sand shadow-sm hover:shadow-md">
        {event.imageUrl ? (
          <div className="w-full relative">
            <OptimizedImage
              src={getGoogleDriveImageUrl(event.imageUrl) || ""}
              alt={event.name}
              width={600}
              height={400}
              className="w-auto h-auto max-w-full mx-auto"
              imageClassName="transition-transform duration-700 hover:scale-105 object-scale-down"
              quality={100}
            />
          </div>
        ) : null}
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="shrink-0 w-16 h-16 bg-gold rounded-full flex items-center justify-center text-white font-bold shadow-md text-lg">
              {new Date(event.date).getFullYear()}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-deep-brown mb-2 text-lg">{event.name}</h3>
              <p className="text-sm text-(--color-slate) mb-2 flex items-center">
                <span className="mr-1">📍</span> {event.location}
              </p>
              <p className="text-sm text-almond-gold font-semibold mb-3">
                {new Date(event.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {event.description ? (
                <p className="text-sm text-(--color-slate)/80 leading-relaxed border-t border-sand/50 pt-3">
                  {event.description}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EducationCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const validImages = images.filter((img) => img && img.length > 0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  }, [validImages.length]);

  useEffect(() => {
    if (validImages.length <= 1 || isPaused) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [validImages.length, isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (validImages.length === 0) return null;

  return (
    <div
      className="grid place-items-center w-full relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          className="col-start-1 row-start-1 w-full flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <OptimizedImage
            src={getGoogleDriveImageUrl(validImages[currentIndex] ?? "") || ""}
            alt={`Education slide ${currentIndex + 1}`}
            width={800}
            height={600}
            className="w-auto h-auto max-w-full"
            imageClassName="object-scale-down"
            quality={100}
          />
        </motion.div>
      </AnimatePresence>

      {validImages.length > 1 ? (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-deep-brown/60 hover:text-deep-brown hover:scale-110 active:scale-95 transition-all z-10"
            aria-label="Previous image"
          >
            <svg
              className="w-8 h-8 drop-shadow-sm"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-deep-brown/60 hover:text-deep-brown hover:scale-110 active:scale-95 transition-all z-10"
            aria-label="Next image"
          >
            <svg
              className="w-8 h-8 drop-shadow-sm"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      ) : null}
    </div>
  );
}
