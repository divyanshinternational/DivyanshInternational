"use client";

/**
 * Sustainability Section Component
 *
 * Displays sustainability pillars with animations.
 * Uses framer-motion for animations - requires client component.
 *
 * All content is passed via props from parent components that fetch from Sanity CMS.
 * Data is validated with Zod schemas for runtime type safety.
 */

import { motion } from "framer-motion";
import { z } from "zod";

import { AlmondIcon, CashewIcon, WalnutIcon, PeanutIcon } from "@/components/assets/Decorations";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const SustainabilityPillarSchema = z.object({
  title: z.string(),
  detail: z.string(),
});

const SectionSettingsSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

const RoutingSchema = z.object({
  sustainabilitySectionId: z.string().optional(),
});

const SustainabilitySectionPropsSchema = z.object({
  initialPillars: z.array(SustainabilityPillarSchema).nullish(),
  sectionSettings: SectionSettingsSchema.optional(),
  routing: RoutingSchema.optional(),
});

// =============================================================================
// TYPE DEFINITIONS (Inferred from Zod Schemas)
// =============================================================================

type SustainabilityPillar = z.infer<typeof SustainabilityPillarSchema>;
type SectionSettings = z.infer<typeof SectionSettingsSchema>;
type Routing = z.infer<typeof RoutingSchema>;

interface SustainabilitySectionProps {
  initialPillars?: SustainabilityPillar[] | null;
  sectionSettings?: SectionSettings;
  routing?: Routing;
}

// =============================================================================
// VALIDATION
// =============================================================================

function validateProps(props: unknown): void {
  const result = SustainabilitySectionPropsSchema.safeParse(props);
  if (!result.success) {
    console.warn("[SustainabilitySection] Props validation warning:", result.error.format());
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
      delayChildren: 0.05,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }, // Snappier
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function SustainabilitySection({
  initialPillars,
  sectionSettings,
  routing,
}: SustainabilitySectionProps) {
  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    validateProps({ initialPillars, sectionSettings, routing });
  }

  const activePillars = initialPillars ?? [];
  const sectionId = routing?.sustainabilitySectionId;

  if (activePillars.length === 0) return null;

  return (
    <section
      id={sectionId}
      className="py-20 bg-linear-to-b from-white to-ivory relative overflow-hidden"
      aria-labelledby="sustainability-heading"
    >
      {/* Floating Decorations */}
      <DecorativeBackground />

      <div className="container mx-auto px-4 md:px-6 lg:px-10 relative z-10">
        <div className="bg-linear-to-br from-white to-cashew-cream p-8 md:p-12 grid lg:grid-cols-2 gap-10 items-center rounded-3xl border-2 border-gold-light shadow-xl">
          {/* Section Header */}
          {sectionSettings ? <SectionHeader settings={sectionSettings} /> : null}

          {/* Pillars Grid */}
          <PillarsGrid pillars={activePillars} />
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface SectionHeaderProps {
  settings: SectionSettings;
}

function SectionHeader({ settings }: SectionHeaderProps) {
  return (
    <div>
      {settings.eyebrow ? (
        <motion.p
          className="uppercase tracking-[0.4em] text-xs text-(--color-muted) mb-4 font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {settings.eyebrow}
        </motion.p>
      ) : null}
      {settings.title ? (
        <motion.h2
          className="text-3xl font-semibold text-(--color-graphite) mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          {settings.title}
        </motion.h2>
      ) : null}
      {settings.description ? (
        <motion.div
          className="text-lg text-(--color-slate) leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <p>{settings.description}</p>
        </motion.div>
      ) : null}
    </div>
  );
}

interface PillarsGridProps {
  pillars: SustainabilityPillar[];
}

function PillarsGrid({ pillars }: PillarsGridProps) {
  return (
    <motion.div
      className="grid gap-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -50px 0px" }}
      variants={staggerContainer}
    >
      {pillars.map((pillar) => (
        <PillarCard key={pillar.title} pillar={pillar} />
      ))}
    </motion.div>
  );
}

interface PillarCardProps {
  pillar: SustainabilityPillar;
}

function PillarCard({ pillar }: PillarCardProps) {
  return (
    <motion.article
      className="p-6 rounded-2xl bg-linear-to-br from-ivory to-white border border-sand hover:shadow-xl hover:border-gold-light transition-all duration-300 group relative overflow-hidden"
      variants={fadeInUp}
      whileHover={{ y: -5 }}
    >
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-linear-to-br from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <motion.h3
        className="text-lg font-bold text-deep-brown mb-3 group-hover:text-gold-dark transition-colors"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -50px 0px" }} // Trigger slightly earlier/easier
        transition={{ duration: 0.4, ease: "easeOut" }} // Removed delay
      >
        {pillar.title}
      </motion.h3>
      <p className="text-(--color-slate) leading-relaxed">{pillar.detail}</p>
    </motion.article>
  );
}

function DecorativeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <motion.div
        animate={{ rotate: [0, 11, -11, 0], y: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 right-10 opacity-15"
      >
        <AlmondIcon className="w-30 h-30" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -14, 14, 0], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute bottom-10 left-10 opacity-15"
      >
        <CashewIcon className="w-28 h-28" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -360], scale: [1, 1.1, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute top-1/2 right-1/4 opacity-12"
      >
        <WalnutIcon className="w-26 h-26" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 12, -12, 0], y: [0, 10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 3 }}
        className="absolute bottom-1/4 left-1/4 opacity-15"
      >
        <PeanutIcon className="w-24 h-24" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -13, 13, 0], x: [0, -10, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute top-1/3 right-1/3 opacity-12"
      >
        <AlmondIcon className="w-26 h-26" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 15, -15, 0], y: [0, -12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 6 }}
        className="absolute bottom-1/3 right-1/4 opacity-15"
      >
        <CashewIcon className="w-24 h-24" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -360], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute top-1/4 left-1/3 opacity-12"
      >
        <WalnutIcon className="w-22 h-22" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 11, -11, 0], y: [0, 10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 7 }}
        className="absolute top-5 left-1/4 opacity-10"
      >
        <AlmondIcon className="w-20 h-20" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -12, 12, 0], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 8 }}
        className="absolute bottom-5 right-1/4 opacity-12"
      >
        <PeanutIcon className="w-22 h-22" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 21, repeat: Infinity, ease: "linear", delay: 3 }}
        className="absolute top-1/2 left-5 opacity-8"
      >
        <CashewIcon className="w-18 h-18" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -360], scale: [1, 1.08, 1] }}
        transition={{ duration: 19, repeat: Infinity, ease: "linear", delay: 4 }}
        className="absolute bottom-1/2 right-5 opacity-8"
      >
        <WalnutIcon className="w-18 h-18" />
      </motion.div>
    </div>
  );
}
