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
import Image from "next/image";
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
import { urlForImage } from "@/lib/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const TeamMemberSchema = z.object({
  _id: z.string(),
  name: z.string(),
  role: z.string(),
  image: z.unknown().optional(),
  bio: z.string().optional(),
});

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
  x: z.number().optional(),
  y: z.number().optional(),
});

const TimelineSummaryCardSchema = z.object({
  _key: z.string().optional(),
  title: z.string(),
  description: z.string(),
});

const BrandB2BSchema = z.object({
  title: z.string(),
  names: z.array(z.string()),
  description: z.string(),
});

const BrandD2CSchema = z.object({
  title: z.string(),
  name: z.string(),
  description: z.string(),
});

const BrandsSectionSchema = z.object({
  title: z.string(),
  b2b: BrandB2BSchema,
  d2c: BrandD2CSchema,
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

// =============================================================================
// TYPE DEFINITIONS (Inferred from Zod Schemas)
// =============================================================================

type TeamMember = z.infer<typeof TeamMemberSchema>;
type TimelineEntry = z.infer<typeof TimelineEntrySchema>;
type AboutData = z.infer<typeof AboutDataSchema>;
type SiteSettings = z.infer<typeof SiteSettingsSchema>;

interface AboutContentProps {
  initialTeamMembers?: unknown;
  initialTimeline?: unknown;
  initialAbout?: unknown;
  siteSettings?: unknown;
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
};

const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
};

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

function parseTeamMembers(data: unknown): TeamMember[] {
  if (!Array.isArray(data)) return [];
  const result = z.array(TeamMemberSchema).safeParse(data);
  if (!result.success) {
    console.error("[AboutContent] Team members validation failed:", result.error.format());
    return [];
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
  initialTeamMembers,
  initialTimeline,
  initialAbout,
  siteSettings: rawSiteSettings,
}: AboutContentProps) {
  // Validate and parse all incoming data with Zod
  const about = parseAboutData(initialAbout);
  const teamMembers = parseTeamMembers(initialTeamMembers);
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
    <div className="bg-linear-to-b from-ivory via-cashew-cream to-beige min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Decorative Background Icons */}
      <DecorativeBackground />

      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        {/* Header */}
        {about.header ? (
          <div className="text-center mb-16 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="uppercase tracking-[0.4em] text-xs text-(--color-muted) mb-4">
                {about.header.eyebrow}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-deep-brown mb-6 font-heading">
                {about.header.title}
              </h1>
              <p className="text-lg text-(--color-slate) max-w-3xl mx-auto leading-relaxed">
                {about.header.subtitle}
              </p>
            </motion.div>
            <div className="absolute top-0 right-0 -z-10 opacity-10 rotate-12" aria-hidden="true">
              <LeafIcon className="w-64 h-64 text-leaf-green" />
            </div>
          </div>
        ) : null}

        {/* Opening Story */}
        {about.openingStory ? (
          <motion.div
            {...fadeInUp}
            className="text-center mb-16 bg-linear-to-br from-almond-gold/10 to-gold-light/5 p-12 rounded-3xl border-2 border-almond-gold/20 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-deep-brown mb-6 font-heading">
                {about.openingStory.title}
              </h2>
              <div className="max-w-4xl mx-auto space-y-6 text-lg text-(--color-slate) leading-relaxed">
                <p className="text-xl font-semibold text-almond-gold">
                  {about.openingStory.highlight}
                </p>
                {about.openingStory.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <DecorativeCorners />
          </motion.div>
        ) : null}

        {/* The Anjeer Story */}
        {about.anjeerStory ? (
          <motion.div
            {...fadeInUp}
            className="mb-16 bg-linear-to-br from-white to-cashew-cream p-10 rounded-3xl border-2 border-gold-light shadow-xl"
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-deep-brown mb-8 font-heading">
                {about.anjeerStory.title}
              </h2>
              <div className="space-y-6 text-lg text-(--color-slate) leading-relaxed">
                {about.anjeerStory.paragraphs[0] ? <p>{about.anjeerStory.paragraphs[0]}</p> : null}
                {about.anjeerStory.paragraphs[1] ? (
                  <p className="text-xl font-semibold text-almond-gold italic">
                    {about.anjeerStory.paragraphs[1]}
                  </p>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* The Birth of Divyansh International */}
        {about.birthSection ? (
          <motion.div {...fadeInUp} className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-deep-brown mb-6 font-heading">
                {about.birthSection.title}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-lg text-(--color-slate) leading-relaxed">
                {about.birthSection.paragraphs.map((p, i) => (
                  <p key={i} className={i === 2 ? "font-semibold text-deep-brown" : ""}>
                    {p}
                  </p>
                ))}
              </div>

              <div className="bg-linear-to-br from-ivory to-white p-8 rounded-3xl border-2 border-sand shadow-lg">
                <h3 className="text-2xl font-bold text-almond-gold mb-4 text-center">
                  {about.birthSection.boxTitle}
                </h3>
                <p className="text-(--color-slate) text-center leading-relaxed">
                  {about.birthSection.boxText}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Growing While Staying Rooted */}
        {about.growingSection ? (
          <motion.div
            {...fadeInUp}
            className="mb-16 bg-linear-to-br from-almond-gold/5 to-gold-light/10 p-12 rounded-3xl border border-almond-gold/20"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-deep-brown mb-8 text-center font-heading">
                {about.growingSection.title}
              </h2>
              <div className="space-y-6 text-lg text-(--color-slate) leading-relaxed">
                {about.growingSection.paragraphs[0] ? (
                  <p>{about.growingSection.paragraphs[0]}</p>
                ) : null}
                {about.growingSection.paragraphs[1] ? (
                  <p className="text-center font-semibold text-deep-brown">
                    {about.growingSection.paragraphs[1]}
                  </p>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Our Philosophy */}
        {about.philosophySection ? (
          <motion.div
            {...fadeInUp}
            className="text-center mb-16 bg-linear-to-br from-almond-gold/10 to-gold-light/5 p-12 rounded-3xl border-2 border-almond-gold/20 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-deep-brown mb-6 font-heading">
                {about.philosophySection.title}
              </h2>
              <div className="max-w-4xl mx-auto space-y-6 text-lg text-(--color-slate) leading-relaxed">
                <p className="text-xl font-semibold text-almond-gold">
                  {about.philosophySection.highlight}
                </p>
                {about.philosophySection.paragraphs.map((p, i) => (
                  <p key={i} className={i === 1 ? "italic" : ""}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <DecorativeCorners />
          </motion.div>
        ) : null}

        {/* Timeline Summary */}
        {about.timelineSummaryCards && about.timelineSummaryCards.length > 0 ? (
          <motion.div {...fadeInUp} className="mb-16 text-center">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {about.timelineSummaryCards.map((item, index) => (
                <div
                  key={item._key ?? index}
                  className="bg-linear-to-br from-white to-ivory p-8 rounded-3xl border-2 border-sand shadow-lg"
                >
                  <h3 className="text-2xl font-bold text-almond-gold mb-3">{item.title}</h3>
                  <p className="text-(--color-slate)">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-12">
              <p className="text-2xl font-bold text-deep-brown font-heading">
                Divyansh International.
              </p>
            </div>
          </motion.div>
        ) : null}

        {/* Our Brands */}
        {about.brandsSection ? (
          <motion.div
            {...fadeInUp}
            className="mb-16 bg-linear-to-br from-white to-cashew-cream p-10 rounded-3xl border-2 border-gold-light shadow-xl"
          >
            <h2 className="text-3xl font-bold text-deep-brown mb-8 text-center font-heading">
              {about.brandsSection.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center p-6 bg-linear-to-br from-ivory to-white rounded-2xl border border-sand">
                <h3 className="text-2xl font-bold text-almond-gold mb-3">
                  {about.brandsSection.b2b.title}
                </h3>
                <div className="space-y-2">
                  {about.brandsSection.b2b.names.map((name) => (
                    <p key={name} className="text-lg font-semibold text-deep-brown">
                      {name}
                    </p>
                  ))}
                </div>
                <p className="text-sm text-(--color-slate) mt-3">
                  {about.brandsSection.b2b.description}
                </p>
              </div>
              <div className="text-center p-6 bg-linear-to-br from-ivory to-white rounded-2xl border border-sand">
                <h3 className="text-2xl font-bold text-almond-gold mb-3">
                  {about.brandsSection.d2c.title}
                </h3>
                <p className="text-lg font-semibold text-deep-brown">
                  {about.brandsSection.d2c.name}
                </p>
                <p className="text-sm text-(--color-slate) mt-3">
                  {about.brandsSection.d2c.description}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Product Range */}
        {about.productRangeSection ? (
          <motion.div {...fadeInUp} className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-deep-brown mb-8 font-heading">
              {about.productRangeSection.title}
            </h2>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {about.productRangeSection.products.map((product, index) => (
                <motion.span
                  key={product}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="px-6 py-3 bg-linear-to-r from-almond-gold to-gold-dark text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {product}
                </motion.span>
              ))}
            </div>
            <p className="text-(--color-slate) max-w-2xl mx-auto">
              {about.productRangeSection.description}
            </p>
          </motion.div>
        ) : null}

        {/* Who We Are & Mission/Vision Grid */}
        {about.whoWeAre || about.mission || about.vision ? (
          <div className="grid md:grid-cols-2 gap-8 mb-24">
            {about.whoWeAre ? (
              <motion.div
                {...fadeInLeft}
                className="bg-linear-to-br from-white to-cashew-cream p-10 rounded-3xl border-2 border-gold-light shadow-xl relative overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <h2 className="text-3xl font-bold text-deep-brown mb-6 font-heading">
                  {about.whoWeAre.title}
                </h2>
                <p className="text-foreground mb-6 leading-relaxed">{about.whoWeAre.description}</p>
                <LeafIcon
                  className="absolute -bottom-10 -right-10 w-40 h-40 text-gold/10"
                  aria-hidden="true"
                />
              </motion.div>
            ) : null}

            <div className="space-y-8">
              {about.mission ? (
                <motion.div
                  {...fadeInRight}
                  transition={{ delay: 0.2 }}
                  className="bg-linear-to-br from-white to-ivory p-8 rounded-3xl border-2 border-sand shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold text-deep-brown mb-3 font-heading">
                    {about.mission.title}
                  </h3>
                  <p className="text-(--color-slate)">{about.mission.description}</p>
                </motion.div>
              ) : null}

              {about.vision ? (
                <motion.div
                  {...fadeInRight}
                  transition={{ delay: 0.3 }}
                  className="bg-linear-to-br from-white to-ivory p-8 rounded-3xl border-2 border-sand shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold text-deep-brown mb-3 font-heading">
                    {about.vision.title}
                  </h3>
                  <p className="text-(--color-slate)">{about.vision.description}</p>
                </motion.div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Team Section */}
        {teamMembers.length > 0 && about.teamSection ? (
          <section className="mb-24" aria-labelledby="team-heading">
            <div className="text-center mb-12">
              <p className="uppercase tracking-[0.4em] text-xs text-(--color-muted) mb-3">
                {about.teamSection.eyebrow}
              </p>
              <h2
                id="team-heading"
                className="text-3xl md:text-4xl font-bold text-deep-brown font-heading"
              >
                {about.teamSection.title}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <TeamMemberCard key={member._id} member={member} index={index} />
              ))}
            </div>
          </section>
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
                lat: 28.6139, // Default fallback, ideally these should come from CMS
                lng: 77.209,
                radius: 50000,
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

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  const getImageSrc = (): string | null => {
    if (!member.image) return null;
    if (typeof member.image === "string") return member.image;
    try {
      return urlForImage(member.image as SanityImageSource).url();
    } catch {
      return null;
    }
  };

  const imageSrc = getImageSrc();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <div className="relative aspect-3/4 mb-6 rounded-2xl overflow-hidden bg-sand">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : null}
        {member.bio ? (
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <p className="text-white font-medium">&quot;{member.bio}&quot;</p>
          </div>
        ) : null}
      </div>
      <h3 className="text-xl font-bold text-deep-brown font-heading">{member.name}</h3>
      <p className="text-gold-dark font-medium text-sm uppercase tracking-wider">{member.role}</p>
    </motion.div>
  );
}

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
