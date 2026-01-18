"use client";

/**
 * Process Section Component
 *
 * Displays the company's process steps with animations.
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

const ProcessStepSchema = z.object({
  title: z.string(),
  detail: z.string(),
});

const SectionSettingsSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

const RoutingSchema = z.object({
  processSectionId: z.string().optional(),
});

const ProcessSectionPropsSchema = z.object({
  initialProcessSteps: z.array(ProcessStepSchema).nullish(),
  sectionSettings: SectionSettingsSchema.optional(),
  routing: RoutingSchema.optional(),
});

// =============================================================================
// TYPE DEFINITIONS (Inferred from Zod Schemas)
// =============================================================================

type ProcessStep = z.infer<typeof ProcessStepSchema>;
type SectionSettings = z.infer<typeof SectionSettingsSchema>;
type Routing = z.infer<typeof RoutingSchema>;

interface ProcessSectionProps {
  initialProcessSteps?: ProcessStep[] | null;
  sectionSettings?: SectionSettings;
  routing?: Routing;
}

// =============================================================================
// VALIDATION
// =============================================================================

function validateProps(props: unknown): void {
  const result = ProcessSectionPropsSchema.safeParse(props);
  if (!result.success) {
    console.warn("[ProcessSection] Props validation warning:", result.error.format());
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
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }, // Snappier
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function ProcessSection({
  initialProcessSteps,
  sectionSettings,
  routing,
}: ProcessSectionProps) {
  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    validateProps({ initialProcessSteps, sectionSettings, routing });
  }

  const steps = initialProcessSteps ?? [];
  const sectionId = routing?.processSectionId;

  if (steps.length === 0) return null;

  return (
    <section
      id={sectionId}
      className="py-20 bg-linear-to-b from-white to-ivory relative overflow-hidden"
      aria-labelledby="process-heading"
    >
      {/* Floating Decorations */}
      <DecorativeBackground />

      <div className="container mx-auto px-4 md:px-6 lg:px-10 relative z-10">
        {/* Section Header */}
        {sectionSettings ? <SectionHeader settings={sectionSettings} /> : null}

        {/* Process Steps Grid */}
        <ProcessStepsGrid steps={steps} />
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

interface SectionHeaderProps {
  settings: SectionSettings;
}

function SectionHeader({ settings }: SectionHeaderProps) {
  return (
    <div className="max-w-2xl mb-12">
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
          className="text-3xl md:text-4xl font-bold text-(--color-graphite) mb-4 font-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
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
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p>{settings.description}</p>
        </motion.div>
      ) : null}
    </div>
  );
}

interface ProcessStepsGridProps {
  steps: ProcessStep[];
}

function ProcessStepsGrid({ steps }: ProcessStepsGridProps) {
  return (
    <motion.div
      className="grid md:grid-cols-2 gap-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -50px 0px" }}
      variants={staggerContainer}
    >
      {steps.map((step) => (
        <ProcessStepCard key={step.title} step={step} />
      ))}
    </motion.div>
  );
}

interface ProcessStepCardProps {
  step: ProcessStep;
}

function ProcessStepCard({ step }: ProcessStepCardProps) {
  return (
    <motion.article
      className="bg-linear-to-br from-white to-ivory p-6 rounded-3xl border-2 border-sand shadow-lg hover:shadow-xl hover:border-gold-light transition-all duration-300"
      variants={fadeInUp}
    >
      <motion.h3
        className="text-lg font-bold text-(--color-graphite) mb-2"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {step.title}
      </motion.h3>
      <p className="text-(--color-slate)">{step.detail}</p>
    </motion.article>
  );
}

function DecorativeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <motion.div
        animate={{ rotate: [0, 12, -12, 0], y: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-10 opacity-15"
      >
        <AlmondIcon className="w-30 h-30" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -13, 13, 0], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute bottom-10 right-10 opacity-15"
      >
        <CashewIcon className="w-26 h-26" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -360], scale: [1, 1.08, 1] }}
        transition={{ duration: 17, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute top-1/3 right-20 opacity-12"
      >
        <WalnutIcon className="w-28 h-28" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 11, -11, 0], y: [0, -10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 3 }}
        className="absolute bottom-1/4 left-20 opacity-15"
      >
        <PeanutIcon className="w-24 h-24" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -13, 13, 0], x: [0, 10, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute top-1/4 left-1/3 opacity-12"
      >
        <AlmondIcon className="w-26 h-26" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 14, -14, 0], y: [0, 12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 6 }}
        className="absolute bottom-1/3 right-1/3 opacity-15"
      >
        <CashewIcon className="w-24 h-24" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 19, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute top-1/3 left-1/4 opacity-12"
      >
        <WalnutIcon className="w-22 h-22" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -11, 11, 0], y: [0, -10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 7 }}
        className="absolute top-5 left-1/3 opacity-10"
      >
        <AlmondIcon className="w-20 h-20" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 12, -12, 0], x: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 8 }}
        className="absolute bottom-5 right-1/3 opacity-12"
      >
        <CashewIcon className="w-22 h-22" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -360], scale: [1, 1.12, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 3 }}
        className="absolute top-1/2 right-5 opacity-8"
      >
        <PeanutIcon className="w-18 h-18" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.08, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 4 }}
        className="absolute bottom-1/2 left-5 opacity-8"
      >
        <WalnutIcon className="w-18 h-18" />
      </motion.div>
    </div>
  );
}
