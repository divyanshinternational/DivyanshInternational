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

import { motion } from "framer-motion";
import { z } from "zod";
import {
  LeafIcon,
  NutIcon,
  AlmondIcon,
  CashewIcon,
  WalnutIcon,
  PeanutIcon,
} from "@/components/assets/Decorations";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

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
});

const CSRInitiativeSchema = z.object({
  _key: z.string(),
  title: z.string(),
  description: z.string(),
});

const CommunityDataSchema = z.object({
  _id: z.string(),
  header: z
    .object({
      eyebrow: z.string(),
      title: z.string(),
      subtitle: z.string(),
    })
    .optional(),
  corePhilosophy: z
    .object({
      paragraph: z.string(),
      highlight: z.string(),
    })
    .optional(),
  educationSection: z
    .object({
      icon: z.string(),
      title: z.string(),
      paragraphs: z.array(z.string()),
      quote: z.string(),
    })
    .optional(),
  womenEmpowerment: z
    .object({
      icon: z.string(),
      title: z.string(),
      paragraphs: z.array(z.string()),
    })
    .optional(),
  childcareSection: z
    .object({
      icon: z.string(),
      title: z.string(),
      paragraphs: z.array(z.string()),
      highlight: z.string(),
    })
    .optional(),
  industryCollaboration: z
    .object({
      icon: z.string(),
      title: z.string(),
      paragraphs: z.array(z.string()),
    })
    .optional(),
  environmentalSection: z
    .object({
      icon: z.string(),
      title: z.string(),
      introText: z.string(),
      initiatives: z.array(EnvironmentalInitiativeSchema),
    })
    .optional(),
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
    .optional(),
  csrInitiatives: z.array(CSRInitiativeSchema).optional(),
});

// =============================================================================
// TYPE DEFINITIONS (Inferred from Zod Schemas)
// =============================================================================

type CommunityData = z.infer<typeof CommunityDataSchema>;
type TradeEvent = z.infer<typeof TradeEventSchema>;
type EnvironmentalInitiative = z.infer<typeof EnvironmentalInitiativeSchema>;

interface CommunityContentProps {
  initialCommunity?: unknown;
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

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

export default function CommunityContent({ initialCommunity }: CommunityContentProps) {
  const community = parseCommunityData(initialCommunity);

  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-deep-brown text-lg">Unable to load Community page content.</p>
      </div>
    );
  }

  const tradeEvents = community.tradeEvents ?? [];

  return (
    <div className="bg-linear-to-b from-ivory via-cashew-cream to-beige min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Decorative Background */}
      <DecorativeBackground />

      <div className="container mx-auto px-4 md:px-6 lg:px-10 relative z-10">
        {/* Header */}
        {community.header ? (
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="uppercase tracking-[0.4em] text-xs text-(--color-muted) mb-4">
                {community.header.eyebrow}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-deep-brown mb-6 font-heading">
                {community.header.title}
              </h1>
              <p className="text-lg text-(--color-slate) max-w-4xl mx-auto leading-relaxed">
                {community.header.subtitle}
              </p>
            </motion.div>
          </div>
        ) : null}

        {/* Core Philosophy */}
        {community.corePhilosophy ? (
          <motion.div
            {...fadeInUp}
            className="mb-16 bg-linear-to-br from-white to-ivory p-10 md:p-12 rounded-3xl border-2 border-sand shadow-xl"
          >
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-(--color-slate) leading-relaxed mb-6">
                {community.corePhilosophy.paragraph}
              </p>
              <p className="text-xl font-semibold text-almond-gold">
                {community.corePhilosophy.highlight}
              </p>
            </div>
          </motion.div>
        ) : null}

        {/* Education & Social Participation */}
        {community.educationSection ? (
          <motion.div {...fadeInUp} className="mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-linear-to-br from-almond-gold/10 to-gold-light/5 p-8 rounded-3xl border-2 border-almond-gold/20">
                <div className="text-5xl mb-4">{community.educationSection.icon}</div>
                <h2 className="text-3xl font-bold text-deep-brown mb-4 font-heading">
                  {community.educationSection.title}
                </h2>
                {community.educationSection.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-(--color-slate) leading-relaxed mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="bg-white p-8 rounded-3xl border border-sand shadow-lg">
                <p className="text-deep-brown font-semibold text-lg italic">
                  &quot;{community.educationSection.quote}&quot;
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Women Empowerment */}
        {community.womenEmpowerment ? (
          <motion.div
            {...fadeInUp}
            className="mb-16 bg-linear-to-br from-pistachio-green/10 to-white p-10 md:p-12 rounded-3xl border-2 border-pistachio-green/20 shadow-xl"
          >
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">{community.womenEmpowerment.icon}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-deep-brown mb-4 font-heading">
                {community.womenEmpowerment.title}
              </h2>
            </div>
            <div className="max-w-4xl mx-auto space-y-6 text-lg text-(--color-slate) leading-relaxed">
              {community.womenEmpowerment.paragraphs.map((paragraph, index) => {
                const isLast = index === community.womenEmpowerment!.paragraphs.length - 1;
                return (
                  <p key={index} className={isLast ? "font-semibold text-deep-brown" : ""}>
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </motion.div>
        ) : null}

        {/* Childcare & Learning */}
        {community.childcareSection ? (
          <motion.div {...fadeInUp} className="mb-16">
            <div className="bg-linear-to-br from-white to-cashew-cream p-10 md:p-12 rounded-3xl border-2 border-gold-light shadow-xl">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">{community.childcareSection.icon}</div>
                <h2 className="text-3xl md:text-4xl font-bold text-deep-brown mb-4 font-heading">
                  {community.childcareSection.title}
                </h2>
              </div>
              <div className="max-w-4xl mx-auto space-y-6 text-lg text-(--color-slate) leading-relaxed">
                {community.childcareSection.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                <p className="text-center font-semibold text-almond-gold text-xl">
                  {community.childcareSection.highlight}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Industry Collaboration & Environmental Responsibility */}
        {community.industryCollaboration || community.environmentalSection ? (
          <motion.div {...fadeInUp} className="mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Industry Collaboration */}
              {community.industryCollaboration ? (
                <div className="bg-linear-to-br from-ivory to-white p-8 rounded-3xl border-2 border-sand shadow-lg">
                  <div className="text-5xl mb-4">{community.industryCollaboration.icon}</div>
                  <h2 className="text-2xl md:text-3xl font-bold text-deep-brown mb-4 font-heading">
                    {community.industryCollaboration.title}
                  </h2>
                  {community.industryCollaboration.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-(--color-slate) leading-relaxed mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : null}

              {/* Environmental Responsibility */}
              {community.environmentalSection ? (
                <div className="bg-linear-to-br from-leaf-green/10 to-white p-8 rounded-3xl border-2 border-leaf-green/20 shadow-lg">
                  <div className="text-5xl mb-4">{community.environmentalSection.icon}</div>
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
              ) : null}
            </div>
          </motion.div>
        ) : null}

        {/* Trade Events Section */}
        {tradeEvents.length > 0 ? (
          <motion.div {...fadeInUp} className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-deep-brown mb-4 font-heading">
                {community.tradeEventsSection?.title ?? "Trade Events & Exhibitions"}
              </h2>
              <p className="text-(--color-slate) max-w-2xl mx-auto">
                {community.tradeEventsSection?.subtitle ??
                  "Meet us at leading industry events across India"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tradeEvents.map((event: TradeEvent, index: number) => (
                <TradeEventCard key={event._key} event={event} index={index} />
              ))}
            </div>
          </motion.div>
        ) : null}

        {/* Growing With Purpose - Final Message */}
        {community.closingMessage ? (
          <motion.div
            {...fadeInUp}
            className="mb-16 bg-linear-to-br from-white to-ivory p-10 md:p-12 rounded-3xl border-2 border-sand shadow-xl"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-deep-brown mb-4 font-heading">
                {community.closingMessage.title}
              </h2>
            </div>
            <div className="max-w-4xl mx-auto space-y-6 text-lg text-(--color-slate) leading-relaxed">
              {community.closingMessage.paragraphs.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-center" : ""}>
                  {paragraph}
                </p>
              ))}
              <p className="text-center text-xl font-semibold text-deep-brown">
                {community.closingMessage.finalHighlight}
              </p>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
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
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-6 rounded-2xl border border-sand shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start space-x-4">
        <div className="shrink-0 w-12 h-12 bg-linear-to-br from-almond-gold to-gold-dark rounded-full flex items-center justify-center text-white font-bold">
          📅
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-deep-brown mb-2">{event.name}</h3>
          <p className="text-sm text-(--color-slate) mb-1">📍 {event.location}</p>
          <p className="text-sm text-almond-gold font-semibold">
            {new Date(event.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function DecorativeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 right-1/4 opacity-10"
      >
        <AlmondIcon className="w-32 h-32" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 left-1/3 opacity-10"
      >
        <CashewIcon className="w-28 h-28" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/4 opacity-8"
      >
        <WalnutIcon className="w-24 h-24" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -360] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/3 right-1/3 opacity-12"
      >
        <PeanutIcon className="w-26 h-26" />
      </motion.div>
    </div>
  );
}
