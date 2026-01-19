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

import Timeline from "@/components/Timeline";
import DistributionMap from "@/components/DistributionMap";
import {
  LeafIcon,
  NutIcon,
  AlmondIcon,
  CashewIcon,
  WalnutIcon,
  PeanutIcon,
} from "@/components/assets/Decorations";
import InfographicsSection from "@/components/sections/InfographicsSection";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const TimelineEntrySchema = z.object({
  _id: z.string(),
  year: z.number(),
  title: z.string(),
  description: z.string(),
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
});

const BrandRetailSchema = z.object({
  title: z.string(),
  name: z.string(),
  description: z.string(),
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

const AboutDataSchema = z.object({
  header: z
    .object({
      eyebrow: z.string(),
      title: z.string(),
      subtitle: z.string(),
    })
    .optional(),
  openingStory: z
    .object({
      title: z.string(),
      highlight: z.string(),
      paragraphs: z.array(z.string()),
    })
    .optional(),
  anjeerStory: z
    .object({
      title: z.string(),
      paragraphs: z.array(z.string()),
    })
    .optional(),
  birthSection: z
    .object({
      title: z.string(),
      paragraphs: z.array(z.string()),
      boxTitle: z.string(),
      boxText: z.string(),
    })
    .optional(),
  growingSection: z
    .object({
      title: z.string(),
      paragraphs: z.array(z.string()),
    })
    .optional(),
  philosophySection: z
    .object({
      title: z.string(),
      highlight: z.string(),
      paragraphs: z.array(z.string()),
    })
    .optional(),
  timelineSummaryCards: z.array(TimelineSummaryCardSchema).optional(),
  brandsSection: BrandsSectionSchema.optional(),
  productRangeSection: ProductRangeSectionSchema.optional(),
  whoWeAre: z
    .object({
      title: z.string(),
      description: z.string(),
      image: z.unknown().optional(),
    })
    .optional(),
  mission: z
    .object({
      title: z.string(),
      description: z.string(),
    })
    .optional(),
  vision: z
    .object({
      title: z.string(),
      description: z.string(),
    })
    .optional(),
  ourStory: z
    .object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
    })
    .optional(),
  commitment: z
    .object({
      title: z.string(),
      description: z.string(),
    })
    .optional(),
  teamSection: z
    .object({
      eyebrow: z.string(),
      title: z.string(),
    })
    .optional(),
  journeySection: z
    .object({
      eyebrow: z.string(),
      title: z.string(),
    })
    .optional(),
  distributionRegions: z.array(DistributionRegionSchema).optional(),
});

const SiteSettingsSchema = z.object({
  distribution: z
    .object({
      heading: z.string().optional(),
    })
    .optional(),
});

type TimelineEntry = z.infer<typeof TimelineEntrySchema>;
type AboutData = z.infer<typeof AboutDataSchema>;
type SiteSettings = z.infer<typeof SiteSettingsSchema>;

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

function parseSiteSettings(data: unknown): SiteSettings | null {
  const result = SiteSettingsSchema.safeParse(data);
  if (!result.success) {
    console.error("[AboutContent] Site settings validation failed:", result.error.format());
    return null;
  }
  return result.data;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function AboutContent({
  initialTimeline,
  initialAbout,
  siteSettings: rawSiteSettings,
  capabilities = [],
}: AboutContentProps) {
  // Validate and parse all incoming data with Zod
  const about = parseAboutData(initialAbout);
  const timelineEntries = parseTimelineEntries(initialTimeline);
  const siteSettings = parseSiteSettings(rawSiteSettings);

  if (!about) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-deep-brown text-lg">Unable to load About page content.</p>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-b from-ivory via-cashew-cream to-beige min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Decorative Background Icons */}
      <DecorativeBackground />

      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        {/* Header */}
        {about.header ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            className="text-center mb-20 relative"
          >
            {/* Decorative blob in background */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[300px] opacity-20"
              style={{
                background: "linear-gradient(135deg, #f5f0e8 0%, #efe3d2 50%, #e8dcc8 100%)",
                borderRadius: "60% 40% 55% 45% / 55% 60% 40% 45%",
                filter: "blur(40px)",
              }}
            />

            <motion.p
              className="uppercase tracking-[0.4em] text-xs text-(--color-muted) mb-4"
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
              className="text-lg text-(--color-slate) max-w-3xl mx-auto leading-relaxed"
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
              <LeafIcon className="w-48 h-48 md:w-64 md:h-64 text-gold" />
            </motion.div>
            <motion.div
              className="absolute bottom-0 left-0 md:left-20 -z-10 opacity-10"
              variants={{
                hidden: { opacity: 0, rotate: 20 },
                visible: { opacity: 0.1, rotate: -15 },
              }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" as const }}
              aria-hidden="true"
            >
              <AlmondIcon className="w-32 h-32 md:w-40 md:h-40 text-almond-gold" />
            </motion.div>
          </motion.div>
        ) : null}

        {/* The Anjeer Story */}
        {about.anjeerStory ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="mb-16 relative"
          >
            {/* Organic blob background */}
            <div
              className="absolute -inset-4 -z-10"
              style={{
                background: "linear-gradient(135deg, #f5f0e8 0%, #efe3d2 50%, #e8dcc8 100%)",
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
                  <CashewIcon className="w-12 h-12 text-almond-gold/50" />
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

                <div className="space-y-6 text-lg text-(--color-slate) leading-relaxed">
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

        {/* Our Philosophy */}
        {about.philosophySection ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="text-center mb-16 relative"
          >
            {/* Organic blob background */}
            <div
              className="absolute -inset-6 -z-10"
              style={{
                background: "linear-gradient(135deg, #f5f0e8 0%, #efe3d2 50%, #e8dcc8 100%)",
                borderRadius: "55% 45% 50% 50% / 50% 55% 45% 50%",
                transform: "rotate(2deg)",
              }}
            />

            <div className="bg-white/85 backdrop-blur-sm p-12 rounded-2xl border border-almond-gold/30 shadow-lg relative overflow-hidden">
              {/* Decorative Icon */}
              <motion.div
                className="flex justify-center mb-6"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" as const }}
              >
                <PeanutIcon className="w-14 h-14 text-almond-gold/50" />
              </motion.div>

              <motion.h2
                className="text-3xl md:text-4xl font-bold text-deep-brown mb-6 font-heading"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" as const }}
              >
                {about.philosophySection.title}
              </motion.h2>

              <div className="max-w-4xl mx-auto space-y-6 text-lg text-(--color-slate) leading-relaxed">
                <motion.p
                  className="text-xl font-semibold text-almond-gold"
                  variants={{
                    hidden: { opacity: 0, x: -30 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
                >
                  {about.philosophySection.highlight}
                </motion.p>
                {about.philosophySection.paragraphs.map((p, i) => (
                  <motion.p
                    key={i}
                    className={i === 1 ? "italic" : ""}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: "easeOut" as const }}
                  >
                    {p}
                  </motion.p>
                ))}
              </div>

              <DecorativeCorners />
            </div>
          </motion.div>
        ) : null}

        {/* Infographics / Capabilities Section */}
        {capabilities && capabilities.length > 0 ? (
          <InfographicsSection capabilities={capabilities} />
        ) : null}

        {/* Our Brands */}
        {about.brandsSection ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="mb-16 relative"
          >
            {/* Section blob background */}
            <div
              className="absolute -inset-6 -z-10"
              style={{
                background: "linear-gradient(135deg, #f5f0e8 0%, #efe3d2 50%, #e8dcc8 100%)",
                borderRadius: "50% 50% 45% 55% / 45% 50% 50% 55%",
              }}
            />

            <div className="bg-white/90 backdrop-blur-sm p-10 rounded-2xl border border-gold-light shadow-xl">
              <motion.h2
                className="text-3xl font-bold text-deep-brown mb-10 text-center font-heading"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {about.brandsSection.title}
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Partners Card */}
                <motion.div
                  className="relative"
                  variants={{
                    hidden: { opacity: 0, x: -40 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                  <div className="absolute -top-3 -left-3 z-10">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-gold to-almond-gold flex items-center justify-center text-white font-bold text-[8px] shadow-md ring-2 ring-white">
                      Partners
                    </div>
                  </div>

                  <div className="text-center p-8 bg-white rounded-2xl border border-sand shadow-lg relative overflow-hidden">
                    <WalnutIcon className="w-10 h-10 text-almond-gold/40 mx-auto mb-4" />

                    <h3 className="text-xl font-bold text-almond-gold mb-4">
                      {about.brandsSection.partners.title}
                    </h3>
                    <div className="space-y-2 mb-4">
                      {about.brandsSection.partners.names.map((name) => (
                        <p key={name} className="text-lg font-semibold text-deep-brown">
                          {name}
                        </p>
                      ))}
                    </div>
                    <p className="text-sm text-(--color-slate)">
                      {about.brandsSection.partners.description}
                    </p>
                  </div>
                </motion.div>

                {/* Retail Card */}
                <motion.div
                  className="relative"
                  variants={{
                    hidden: { opacity: 0, x: 40 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                >
                  <div className="absolute -top-3 -left-3 z-10">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-gold to-almond-gold flex items-center justify-center text-white font-bold text-[10px] shadow-md ring-2 ring-white">
                      Retail
                    </div>
                  </div>

                  <div className="text-center p-8 bg-white rounded-2xl border border-sand shadow-lg relative overflow-hidden">
                    <PeanutIcon className="w-10 h-10 text-almond-gold/40 mx-auto mb-4" />

                    <h3 className="text-xl font-bold text-almond-gold mb-4">
                      {about.brandsSection.retail.title}
                    </h3>
                    <a
                      href="https://thebetternut.co/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-deep-brown mb-4 hover:text-gold transition-colors inline-flex items-center gap-1"
                    >
                      {about.brandsSection.retail.name}
                      <svg
                        className="w-3.5 h-3.5 opacity-60"
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
                    <p className="text-sm text-(--color-slate)">
                      {about.brandsSection.retail.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Journey / Legacy Animation */}
        {timelineEntries.length > 0 && about.journeySection ? (
          <section className="mb-16" aria-labelledby="journey-heading">
            <div className="text-center mb-12">
              <p className="uppercase tracking-[0.4em] text-xs text-(--color-muted) mb-3">
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

        {/* Distribution Map */}
        {about.distributionRegions && about.distributionRegions.length > 0 ? (
          <section className="mb-16" aria-labelledby="distribution-heading">
            <div className="text-center mb-12">
              <h2
                id="distribution-heading"
                className="text-3xl md:text-4xl font-bold text-deep-brown font-heading"
              >
                {siteSettings?.distribution?.heading ?? "Distribution Regions"}
              </h2>
            </div>
            <DistributionMap
              locations={(about.distributionRegions || []).map((r) => ({
                name: r.name,
                lat: r.lat ?? 28.6139,
                lng: r.lng ?? 77.209,
                radius: r.radius ?? 50000,
                _id: r._id,
              }))}
              heading={siteSettings?.distribution?.heading}
            />
          </section>
        ) : null}
      </div>
    </div>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function DecorativeCorners() {
  return (
    <>
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-4 right-4 opacity-20"
        aria-hidden="true"
      >
        <NutIcon className="w-24 h-24 text-almond-gold" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-4 left-4 opacity-20"
        aria-hidden="true"
      >
        <AlmondIcon className="w-20 h-20 text-gold-dark" />
      </motion.div>
    </>
  );
}

function DecorativeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Primary floating icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-0 text-gold/5"
      >
        <LeafIcon className="w-96 h-96" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute bottom-40 left-0 text-gold/5"
      >
        <NutIcon className="w-80 h-80" />
      </motion.div>

      {/* Scattered nut icons */}
      <motion.div
        animate={{ rotate: [0, 10, -10, 0], y: [0, -15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-10 text-gold/10"
      >
        <AlmondIcon className="w-32 h-32" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -12, 12, 0], x: [0, 10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute top-2/3 right-20 text-gold-dark/10"
      >
        <AlmondIcon className="w-28 h-28" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 15, -15, 0], y: [0, 12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 1.5 }}
        className="absolute top-1/2 right-10 text-gold/8"
      >
        <CashewIcon className="w-24 h-24" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -10, 10, 0], x: [0, -8, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 3 }}
        className="absolute bottom-1/4 left-20 text-gold-dark/8"
      >
        <CashewIcon className="w-30 h-30" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 right-1/4 opacity-12"
      >
        <NutIcon className="w-20 h-20" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -10, 10, 0], y: [0, 8, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear", delay: 4 }}
        className="absolute top-3/4 right-1/3 opacity-15"
      >
        <WalnutIcon className="w-26 h-26" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 15, -15, 0], x: [0, -10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 3.5 }}
        className="absolute bottom-1/3 right-16 opacity-15"
      >
        <PeanutIcon className="w-22 h-22" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -13, 13, 0], y: [0, 12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute top-1/4 left-10 opacity-12"
      >
        <PeanutIcon className="w-26 h-26" />
      </motion.div>
    </div>
  );
}
