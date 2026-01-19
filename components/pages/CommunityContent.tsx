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
import VideoShowcase from "@/components/ui/VideoShowcase";
import type { SanityImageSource } from "@sanity/image-url";

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
    <div className="bg-linear-to-b from-ivory via-cashew-cream to-beige min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Decorative Background */}
      <DecorativeBackground />

      <div className="container mx-auto px-4 md:px-6 lg:px-10 relative z-10">
        {/* Header */}
        {community.header ? (
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
              {community.header.eyebrow}
            </motion.p>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-deep-brown mb-6 font-heading"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" as const }}
            >
              {community.header.title}
            </motion.h1>
            <motion.p
              className="text-lg text-(--color-slate) max-w-4xl mx-auto leading-relaxed"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
            >
              {community.header.subtitle}
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
          </motion.div>
        ) : null}

        {/* Core Philosophy */}
        {community.corePhilosophy ? (
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
                borderRadius: "55% 45% 50% 50% / 50% 55% 45% 50%",
                transform: "rotate(-2deg)",
              }}
            />

            <div className="bg-white/90 backdrop-blur-sm p-10 md:p-12 rounded-2xl border border-sand shadow-lg">
              <div className="max-w-4xl mx-auto text-center">
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

        {/* Education & Social Participation */}
        {community.educationSection ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="mb-16"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                className="relative"
                variants={{
                  hidden: { opacity: 0, x: -40 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.7, ease: "easeOut" as const }}
              >
                {/* Organic blob background */}
                <div
                  className="absolute -inset-4 -z-10"
                  style={{
                    background: "linear-gradient(135deg, #f5f0e8 0%, #efe3d2 50%, #e8dcc8 100%)",
                    borderRadius: "55% 45% 50% 50% / 50% 55% 45% 50%",
                    transform: "rotate(-2deg)",
                  }}
                />

                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-almond-gold/30 shadow-lg">
                  <AlmondIcon className="w-10 h-10 text-almond-gold/50 mb-4" />
                  <div className="text-4xl mb-4">{community.educationSection.icon}</div>
                  <h2 className="text-3xl font-bold text-deep-brown mb-4 font-heading">
                    {community.educationSection.title}
                  </h2>
                  {community.educationSection.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-(--color-slate) leading-relaxed mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="relative"
                variants={{
                  hidden: { opacity: 0, x: 40 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" as const }}
              >
                <div
                  className="absolute -inset-3 -z-10"
                  style={{
                    background: "linear-gradient(135deg, #f5f0e8 0%, #efe3d2 50%, #e8dcc8 100%)",
                    borderRadius: "45% 55% 50% 50% / 50% 45% 55% 50%",
                    transform: "rotate(3deg)",
                  }}
                />
                <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl border border-sand shadow-lg">
                  <CashewIcon className="w-8 h-8 text-almond-gold/40 mb-4" />
                  <p className="text-deep-brown font-semibold text-lg italic">
                    &quot;{community.educationSection.quote}&quot;
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}

        {/* Women Empowerment */}
        {community.womenEmpowerment ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="mb-16 relative"
          >
            {/* Organic blob background */}
            <div
              className="absolute -inset-6 -z-10"
              style={{
                background: "linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 50%, #f5f5f5 100%)",
                borderRadius: "50% 50% 45% 55% / 45% 50% 50% 55%",
                transform: "rotate(1deg)",
              }}
            />

            <div className="bg-white/85 backdrop-blur-sm p-10 md:p-12 rounded-2xl border border-pistachio-green/30 shadow-lg">
              <motion.div
                className="text-center mb-8"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" as const }}
              >
                <LeafIcon className="w-12 h-12 text-pistachio-green/50 mx-auto mb-4" />
                <div className="text-4xl mb-4">{community.womenEmpowerment.icon}</div>
                <h2 className="text-3xl md:text-4xl font-bold text-deep-brown mb-4 font-heading">
                  {community.womenEmpowerment.title}
                </h2>
              </motion.div>
              <div className="max-w-4xl mx-auto space-y-6 text-lg text-(--color-slate) leading-relaxed">
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
          </motion.div>
        ) : null}

        {/* Childcare & Learning */}
        {community.childcareSection ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="mb-16 relative"
          >
            {/* Organic blob background */}
            <div
              className="absolute -inset-6 -z-10"
              style={{
                background: "linear-gradient(135deg, #f5f0e8 0%, #efe3d2 50%, #e8dcc8 100%)",
                borderRadius: "45% 55% 50% 50% / 50% 45% 55% 50%",
                transform: "rotate(-1deg)",
              }}
            />

            <div className="bg-white/90 backdrop-blur-sm p-10 md:p-12 rounded-2xl border border-gold-light shadow-lg">
              <motion.div
                className="text-center mb-8"
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" as const }}
              >
                <WalnutIcon className="w-12 h-12 text-almond-gold/50 mx-auto mb-4" />
                <div className="text-4xl mb-4">{community.childcareSection.icon}</div>
                <h2 className="text-3xl md:text-4xl font-bold text-deep-brown mb-4 font-heading">
                  {community.childcareSection.title}
                </h2>
              </motion.div>
              <div className="max-w-4xl mx-auto space-y-6 text-lg text-(--color-slate) leading-relaxed">
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
                  className="text-center font-semibold text-almond-gold text-xl"
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
          </motion.div>
        ) : null}

        {/* Industry Collaboration & Environmental Responsibility */}
        {community.industryCollaboration || community.environmentalSection ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="mb-16"
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Industry Collaboration */}
              {community.industryCollaboration ? (
                <motion.div
                  className="relative"
                  variants={{
                    hidden: { opacity: 0, x: -40 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" as const }}
                >
                  <div
                    className="absolute -inset-4 -z-10"
                    style={{
                      background: "linear-gradient(135deg, #f5f0e8 0%, #efe3d2 50%, #e8dcc8 100%)",
                      borderRadius: "55% 45% 50% 50% / 50% 55% 45% 50%",
                      transform: "rotate(-2deg)",
                    }}
                  />
                  <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-sand shadow-lg">
                    <CashewIcon className="w-10 h-10 text-almond-gold/40 mb-4" />
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
                </motion.div>
              ) : null}

              {/* Environmental Responsibility */}
              {community.environmentalSection ? (
                <motion.div
                  className="relative"
                  variants={{
                    hidden: { opacity: 0, x: 40 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" as const }}
                >
                  <div
                    className="absolute -inset-4 -z-10"
                    style={{
                      background: "linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 50%, #f5f5f5 100%)",
                      borderRadius: "45% 55% 50% 50% / 50% 45% 55% 50%",
                      transform: "rotate(2deg)",
                    }}
                  />
                  <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-leaf-green/30 shadow-lg">
                    <LeafIcon className="w-10 h-10 text-leaf-green/50 mb-4" />
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
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        ) : null}

        {/* Employee Stories */}
        {community.employeeStories ? (
          <div className="mb-20">
            <VideoShowcase data={community.employeeStories} />
          </div>
        ) : null}

        {/* Trade Events Section */}
        {tradeEvents.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="mb-20"
          >
            <motion.div
              className="text-center mb-12"
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
              <p className="text-(--color-slate) max-w-2xl mx-auto">
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

        {/* Growing With Purpose - Final Message */}
        {community.closingMessage ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="mb-16 relative"
          >
            {/* Organic blob background */}
            <div
              className="absolute -inset-6 -z-10"
              style={{
                background: "linear-gradient(135deg, #f5f0e8 0%, #efe3d2 50%, #e8dcc8 100%)",
                borderRadius: "55% 45% 50% 50% / 50% 55% 45% 50%",
                transform: "rotate(-2deg)",
              }}
            />

            <div className="bg-white/90 backdrop-blur-sm p-10 md:p-12 rounded-2xl border border-sand shadow-lg">
              <motion.div
                className="text-center mb-8"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" as const }}
              >
                <NutIcon className="w-14 h-14 text-almond-gold/50 mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold text-deep-brown mb-4 font-heading">
                  {community.closingMessage.title}
                </h2>
              </motion.div>
              <div className="max-w-4xl mx-auto space-y-6 text-lg text-(--color-slate) leading-relaxed">
                {community.closingMessage.paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    className={index === 0 ? "text-center" : ""}
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
                  className="text-center text-xl font-semibold text-deep-brown"
                  variants={{
                    hidden: { opacity: 0, x: -30 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" as const }}
                >
                  {community.closingMessage.finalHighlight}
                </motion.p>
              </div>
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
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="relative"
    >
      {/* Organic blob background */}
      <div
        className="absolute -inset-2 -z-10"
        style={{
          background: "linear-gradient(135deg, #f5f0e8 0%, #efe3d2 50%, #e8dcc8 100%)",
          borderRadius:
            index % 2 === 0
              ? "55% 45% 50% 50% / 50% 55% 45% 50%"
              : "45% 55% 50% 50% / 50% 45% 55% 50%",
          transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
        }}
      />

      <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl border border-sand shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-start space-x-4">
          <div className="shrink-0 w-12 h-12 bg-linear-to-br from-almond-gold to-gold-dark rounded-full flex items-center justify-center text-white font-bold shadow-md">
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
