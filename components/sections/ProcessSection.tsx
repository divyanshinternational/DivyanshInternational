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

import DecorativeBackground from "@/components/ui/DecorativeBackground";

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
    <section id={sectionId} className="py-20 bg-paper relative" aria-labelledby="process-heading">
      {/* Floating Decorations */}
      <DecorativeBackground variant="side-balanced" />

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

function SectionHeader({ settings }: SectionHeaderProps) {
  return (
    <div className="max-w-2xl mb-12">
      {settings.eyebrow ? (
        <motion.p
          className="uppercase tracking-[0.4em] text-xs text-text-muted mb-4 font-bold"
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
          className="text-3xl md:text-4xl font-bold text-deep-brown mb-4 font-heading"
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
          className="text-lg text-text-muted leading-relaxed"
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
      className="bg-white p-6 rounded-3xl border-2 border-border shadow-lg hover:shadow-xl hover:border-gold-light transition-all duration-300"
      variants={fadeInUp}
    >
      <motion.h3
        className="text-lg font-bold text-deep-brown mb-2"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {step.title}
      </motion.h3>
      <p className="text-text-muted">{step.detail}</p>
    </motion.article>
  );
}
