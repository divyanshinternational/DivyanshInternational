"use client";

/**
 * About Page Content Component
 *
 * Displays the company story, team, timeline, and distribution information.
 * Uses framer-motion for animations - requires client component.
 *
 * All content is fetched from Sanity CMS and validated with Zod schemas
 * for runtime type safety.
 */

import { motion } from "framer-motion";
import { z } from "zod";
import type { ContentBannerData } from "@/components/ui/ContentBanner";

import { getGoogleDriveImageUrl } from "@/lib/utils";
import OptimizedImage from "@/components/ui/OptimizedImage";

import Timeline from "@/components/Timeline";
import DecorativeBackground from "@/components/ui/DecorativeBackground";
import InfographicsSection from "@/components/sections/InfographicsSection";
import PosterSlider from "@/components/sections/PosterSlider";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const TimelineEntrySchema = z.object({
  _id: z.string(),
  year: z.number(),
  title: z.string(),
  description: z.string(),
  image: z.any().optional(),
  imageUrl: z.string().optional().nullable(),
});

const DistributionRegionSchema = z.object({
  _id: z.string().optional(),
  _key: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  radius: z.number().optional(),
});

const TimelineSummaryCardSchema = z.object({
  _key: z.string().optional(),
  title: z.string(),
  description: z.string(),
});

const BrandPartnersSchema = z.object({
  title: z.string(),
  names: z.array(z.string()),
  description: z.string(),
  imageUrl: z.string().optional(),
});

const BrandRetailSchema = z.object({
  title: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string().optional(),
});

const BrandsSectionSchema = z.object({
  title: z.string(),
  partners: BrandPartnersSchema,
  retail: BrandRetailSchema,
});

const ProductRangeSectionSchema = z.object({
  title: z.string(),
  products: z.array(z.string()),
  description: z.string(),
});

const AboutDataSchema = z
  .object({
    header: z
      .object({
        eyebrow: z.string(),
        title: z.string(),
        subtitle: z.string(),
      })
      .nullable()
      .optional(),
    openingStory: z
      .object({
        title: z.string(),
        highlight: z.string(),
        paragraphs: z.array(z.string()),
      })
      .nullable()
      .optional(),
    anjeerStory: z
      .object({
        title: z.string(),
        paragraphs: z.array(z.string()),
      })
      .nullable()
      .optional(),
    birthSection: z
      .object({
        title: z.string(),
        paragraphs: z.array(z.string()),
        boxTitle: z.string(),
        boxText: z.string(),
      })
      .nullable()
      .optional(),
    growingSection: z
      .object({
        title: z.string(),
        paragraphs: z.array(z.string()),
      })
      .nullable()
      .optional(),
    philosophySection: z
      .object({
        title: z.string(),
        highlight: z.string(),
        paragraphs: z.array(z.string()),
      })
      .nullable()
      .optional(),
    timelineSummaryCards: z.array(TimelineSummaryCardSchema).nullable().optional(),
    brandsSection: BrandsSectionSchema.nullable().optional(),
    productRangeSection: ProductRangeSectionSchema.nullable().optional(),
    whoWeAre: z
      .object({
        title: z.string(),
        description: z.string(),
        image: z.unknown().optional(),
      })
      .nullable()
      .optional(),
    mission: z
      .object({
        title: z.string(),
        description: z.string(),
      })
      .nullable()
      .optional(),
    vision: z
      .object({
        title: z.string(),
        description: z.string(),
      })
      .nullable()
      .optional(),
    ourStory: z
      .object({
        eyebrow: z.string(),
        title: z.string(),
        description: z.string(),
      })
      .nullable()
      .optional(),
    commitment: z
      .object({
        title: z.string(),
        description: z.string(),
      })
      .nullable()
      .optional(),
    teamSection: z
      .object({
        eyebrow: z.string(),
        title: z.string(),
      })
      .nullable()
      .optional(),
    journeySection: z
      .object({
        eyebrow: z.string(),
        title: z.string(),
      })
      .nullable()
      .optional(),
    distributionRegions: z.array(DistributionRegionSchema).nullable().optional(),
  })
  .nullable()
  .optional();

type TimelineEntry = z.infer<typeof TimelineEntrySchema>;
type AboutData = z.infer<typeof AboutDataSchema>;

interface Capability {
  _id: string;
  title: string;
  description: string;
  metric?: string;
  icon?: string;
}

interface AboutContentProps {
  initialTeamMembers?: unknown;
  initialTimeline?: unknown;
  initialAbout?: unknown;
  siteSettings?: unknown;
  capabilities?: Capability[];
  posterSliderSection?: {
    enabled?: boolean;
    autoPlayInterval?: number;
    posters?: ContentBannerData[];
  };
}

// =============================================================================
// VALIDATION & DATA PARSING
// =============================================================================

function parseAboutData(data: unknown): AboutData | null {
  const result = AboutDataSchema.safeParse(data);
  if (!result.success) {
    console.error("[AboutContent] About data validation failed:", result.error.format());
    return null;
  }
  return result.data;
}

function parseTimelineEntries(data: unknown): TimelineEntry[] {
  if (!Array.isArray(data)) return [];
  const result = z.array(TimelineEntrySchema).safeParse(data);
  if (!result.success) {
    console.error("[AboutContent] Timeline entries validation failed:", result.error.format());
    return [];
  }
  return result.data;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function AboutContent({
  initialTimeline,
  initialAbout,
  capabilities = [],
  posterSliderSection,
}: AboutContentProps) {
  const about = parseAboutData(initialAbout);
  const timelineEntries = parseTimelineEntries(initialTimeline);

  if (!about) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-deep-brown text-lg">Unable to load About page content.</p>
      </div>
    );
  }

  return (
    <>
      {/* Poster Slider */}
      <PosterSlider sliderData={posterSliderSection ?? null} />

      <div className="bg-ivory min-h-screen pt-16 md:pt-24 pb-16 md:pb-24 relative">
        {/* Decorative Background Icons */}
        <DecorativeBackground variant="side-balanced" />

        <div className="container mx-auto px-4 md:px-6 lg:px-10">
          {/* Header */}
          {about.header ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="text-center mb-16 md:mb-24 relative"
            >
              {/* Decorative blob in background */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-150 h-75 opacity-20"
                style={{
                  background: "#f5f0e8",
                  borderRadius: "60% 40% 55% 45% / 55% 60% 40% 45%",
                  filter: "blur(40px)",
                }}
              />

              <motion.p
                className="uppercase tracking-[0.4em] text-xs text-text-muted mb-4"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" as const }}
              >
                {about.header.eyebrow}
              </motion.p>
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-deep-brown mb-6 font-heading"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" as const }}
              >
                {about.header.title}
              </motion.h1>
              <motion.p
                className="text-lg text-text-muted max-w-3xl mx-auto leading-relaxed"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
              >
                {about.header.subtitle}
              </motion.p>

              {/* Decorative icons */}
              <motion.div
                className="absolute top-0 right-0 md:right-20 -z-10 opacity-15"
                variants={{
                  hidden: { opacity: 0, rotate: -20 },
                  visible: { opacity: 0.15, rotate: 12 },
                }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" as const }}
                aria-hidden="true"
              >
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                  <OptimizedImage
                    src="/walnut.png"
                    alt=""
                    fill
                    className="object-scale-down grayscale-[0.2] brightness-110"
                    sizes="(max-width: 768px) 192px, 256px"
                    quality={100}
                  />
                </div>
              </motion.div>
              <motion.div
                className="absolute bottom-0 left-0 md:left-20 -z-10 opacity-15"
                variants={{
                  hidden: { opacity: 0, rotate: 20 },
                  visible: { opacity: 0.15, rotate: -15 },
                }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" as const }}
                aria-hidden="true"
              >
                <div className="relative w-32 h-32 md:w-40 md:h-40">
                  <OptimizedImage
                    src="/almond.png"
                    alt=""
                    fill
                    className="object-scale-down grayscale-[0.2] brightness-110"
                    sizes="(max-width: 768px) 128px, 160px"
                    quality={100}
                  />
                </div>
              </motion.div>
            </motion.div>
          ) : null}

          {/* Timeline / Journey Section */}
          {timelineEntries.length > 0 && about.journeySection ? (
            <section className="mb-16 md:mb-24" aria-labelledby="journey-heading">
              <div className="text-center mb-16 md:mb-24">
                <p className="uppercase tracking-[0.4em] text-xs text-text-muted mb-3">
                  {about.journeySection.eyebrow}
                </p>
                <h2
                  id="journey-heading"
                  className="text-3xl md:text-4xl font-bold text-deep-brown font-heading"
                >
                  {about.journeySection.title}
                </h2>
              </div>
              <Timeline entries={timelineEntries} />
            </section>
          ) : null}

          {/* The Anjeer Story */}
          {about.anjeerStory ? (
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
                  borderRadius: "45% 55% 50% 50% / 50% 45% 55% 50%",
                  transform: "rotate(2deg)",
                }}
              />

              <div className="bg-white/90 backdrop-blur-sm p-10 rounded-2xl border border-gold-light shadow-lg">
                <div className="max-w-4xl mx-auto text-center">
                  {/* Decorative Icon */}
                  <motion.div
                    className="flex justify-center mb-6"
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1 },
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" as const }}
                  >
                    <div className="relative w-12 h-12">
                      <OptimizedImage
                        src="/hazelnut.png"
                        alt=""
                        fill
                        className="object-scale-down opacity-60 grayscale-[0.2]"
                        sizes="48px"
                        quality={100}
                      />
                    </div>
                  </motion.div>

                  <motion.h2
                    className="text-3xl font-bold text-deep-brown mb-8 font-heading"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" as const }}
                  >
                    {about.anjeerStory.title}
                  </motion.h2>

                  <div className="space-y-6 text-lg text-text-muted leading-relaxed">
                    {about.anjeerStory.paragraphs[0] ? (
                      <motion.p
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" as const }}
                      >
                        {about.anjeerStory.paragraphs[0]}
                      </motion.p>
                    ) : null}
                    {about.anjeerStory.paragraphs[1] ? (
                      <motion.p
                        className="text-xl font-semibold text-almond-gold italic"
                        variants={{
                          hidden: { opacity: 0, x: 30 },
                          visible: { opacity: 1, x: 0 },
                        }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" as const }}
                      >
                        {about.anjeerStory.paragraphs[1]}
                      </motion.p>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* Infographics / Capabilities Section */}
          {capabilities && capabilities.length > 0 ? (
            <div className="relative left-[calc(-50vw+50%)] w-screen">
              <InfographicsSection capabilities={capabilities} />
            </div>
          ) : null}

          {/* Our Brands */}
          {about.brandsSection ? (
            <div className="py-16 md:py-24">
              <motion.h2
                className="text-3xl md:text-5xl font-bold text-deep-brown mb-16 md:mb-24 text-center font-heading"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {about.brandsSection.title}
              </motion.h2>

              <div className="flex flex-col gap-16 md:gap-24">
                {/* Partners Section */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  className="relative h-full"
                  variants={{
                    hidden: { opacity: 0, x: -40 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <div className="rounded-2xl overflow-hidden flex flex-col md:flex-row">
                    {about.brandsSection.partners.imageUrl ? (
                      <div className="w-full md:w-1/2 relative flex items-center justify-center">
                        <OptimizedImage
                          src={getGoogleDriveImageUrl(about.brandsSection.partners.imageUrl) || ""}
                          alt={about.brandsSection.partners.title}
                          width={600}
                          height={400}
                          className="w-auto h-auto max-w-full"
                          imageClassName="w-full h-auto hover:scale-[1.02] transition-transform duration-700 object-scale-down"
                          quality={100}
                        />
                      </div>
                    ) : null}

                    <div className="w-full md:w-1/2 p-8 md:p-12">
                      <div className="mb-6">
                        <div className="w-12 h-12 mb-4 p-0">
                          <OptimizedImage
                            src="/raisin.png"
                            alt=""
                            fill
                            className="object-scale-down opacity-80"
                            sizes="48px"
                            quality={100}
                          />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-deep-brown mb-4 font-heading">
                          {about.brandsSection.partners.title}
                        </h2>
                      </div>

                      <div className="space-y-4 mb-6">
                        {about.brandsSection.partners.names.map((name) => (
                          <p
                            key={name}
                            className="text-xl font-medium text-(--color-slate) flex items-center gap-3"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                            {name}
                          </p>
                        ))}
                      </div>

                      <p className="text-lg text-(--color-slate) leading-relaxed">
                        {about.brandsSection.partners.description}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Retail Section */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  className="relative h-full"
                  variants={{
                    hidden: { opacity: 0, x: 40 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                >
                  <div className="rounded-2xl overflow-hidden flex flex-col md:flex-row-reverse">
                    {about.brandsSection.retail.imageUrl ? (
                      <div className="w-full md:w-1/2 relative flex items-center justify-center">
                        <OptimizedImage
                          src={getGoogleDriveImageUrl(about.brandsSection.retail.imageUrl) || ""}
                          alt={about.brandsSection.retail.title}
                          width={600}
                          height={400}
                          className="w-auto h-auto max-w-full"
                          imageClassName="w-full h-auto hover:scale-[1.02] transition-transform duration-700 object-scale-down"
                          quality={100}
                        />
                      </div>
                    ) : null}

                    <div className="w-full md:w-1/2 p-8 md:p-12">
                      <div className="mb-6">
                        <div className="w-12 h-12 mb-4 p-0">
                          <OptimizedImage
                            src="/cashewsingle.png"
                            alt=""
                            fill
                            className="object-scale-down opacity-80"
                            sizes="48px"
                            quality={100}
                          />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-deep-brown mb-4 font-heading">
                          {about.brandsSection.retail.title}
                        </h2>
                      </div>

                      <div className="mb-6">
                        <a
                          href="https://thebetternut.co/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-2xl font-semibold text-gold hover:text-gold-dark transition-colors inline-flex items-center gap-2 group/link w-fit"
                        >
                          {about.brandsSection.retail.name}
                          <svg
                            className="w-5 h-5 transform group-hover/link:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </div>

                      <p className="text-lg text-(--color-slate) leading-relaxed">
                        {about.brandsSection.retail.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
