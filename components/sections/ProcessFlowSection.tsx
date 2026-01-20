"use client";

/**
 * Process Flow Section Component
 *
 * Displays the quality process steps in a horizontal flow layout.
 * Each step has an icon, number, title, and description.
 * Matches the design from the poster but as an interactive web component.
 *
 * All content is fetched from Sanity CMS.
 */

import { motion } from "framer-motion";
import { z } from "zod";
import DecorativeBackground from "@/components/ui/DecorativeBackground";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProcessStepSchema = z.object({
  _id: z.string().optional(),
  title: z.string(),
  detail: z.string(),
  icon: z.string().optional(),
  order: z.number().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SectionSettingsSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

type ProcessStep = z.infer<typeof ProcessStepSchema>;
type SectionSettings = z.infer<typeof SectionSettingsSchema>;

interface ProcessFlowProps {
  initialProcessSteps?: ProcessStep[] | null;
  sectionSettings?: SectionSettings | null;
}

// =============================================================================
// ICON COMPONENTS
// =============================================================================

const PROCESS_ICONS: Record<string, React.ReactNode> = {
  farm: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-8 h-8 md:w-10 md:h-10"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  ),
  shelling: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-8 h-8 md:w-10 md:h-10"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </svg>
  ),
  sorting: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-8 h-8 md:w-10 md:h-10"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
      />
    </svg>
  ),
  quality: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-8 h-8 md:w-10 md:h-10"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
      />
    </svg>
  ),
  packing: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-8 h-8 md:w-10 md:h-10"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
      />
    </svg>
  ),
  shipping: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-8 h-8 md:w-10 md:h-10"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
      />
    </svg>
  ),
};

// Helper function to match icons based on keywords
function getProcessIcon(key?: string, title?: string) {
  if (key && PROCESS_ICONS[key]) return PROCESS_ICONS[key];

  const lowerTitle = title?.toLowerCase() || "";

  if (lowerTitle.includes("farm") || lowerTitle.includes("source")) return PROCESS_ICONS["farm"];
  if (lowerTitle.includes("shell") || lowerTitle.includes("crack"))
    return PROCESS_ICONS["shelling"];
  if (lowerTitle.includes("sort") || lowerTitle.includes("grade")) return PROCESS_ICONS["sorting"];
  if (lowerTitle.includes("pack") || lowerTitle.includes("box")) return PROCESS_ICONS["packing"];
  if (
    lowerTitle.includes("ship") ||
    lowerTitle.includes("deliver") ||
    lowerTitle.includes("transport")
  )
    return PROCESS_ICONS["shipping"];

  return PROCESS_ICONS["quality"];
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function ProcessFlowSection({
  initialProcessSteps,
  sectionSettings,
}: ProcessFlowProps) {
  const steps = initialProcessSteps ?? [];

  if (steps.length === 0) return null;

  // Default section settings
  const eyebrow = sectionSettings?.eyebrow ?? "Our Process";
  const title = sectionSettings?.title ?? "Quality Built at Every Step";
  const description =
    sectionSettings?.description ??
    "Our nuts and dry fruits elevate every product, enabling partners to scale with consistency and reliability.";

  return (
    <section className="relative py-16 md:py-32 bg-paper" aria-labelledby="process-flow-heading">
      {/* Background decoration - clean solid */}
      <DecorativeBackground variant="minimal" />
      <div className="absolute inset-0 opacity-5 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="uppercase tracking-[0.3em] text-xs text-gold font-bold mb-3">{eyebrow}</p>
          <h2
            id="process-flow-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-brown mb-4 font-heading"
          >
            {title}
          </h2>
          <p className="text-lg text-text-muted leading-relaxed">{description}</p>
        </motion.div>

        {/* Process Flow - Horizontal Interlocking on Desktop, Vertical on Mobile */}
        <motion.div
          className="flex flex-col md:flex-row w-full md:items-stretch justify-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => (
            <ProcessStepCard
              key={step._id || step.title}
              step={step}
              index={index}
              total={steps.length}
            />
          ))}
        </motion.div>

        {/* Bottom tagline */}
        <motion.p
          className="text-center mt-12 text-text-muted italic"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Every batch follows a multi-stage quality protocol.
        </motion.p>
      </div>
    </section>
  );
}

// =============================================================================
// STEP CARD COMPONENT
// =============================================================================

interface ProcessStepCardProps {
  step: ProcessStep;
  index: number;
  total: number;
}

function ProcessStepCard({ step, index, total }: ProcessStepCardProps) {
  const stepNumber = step.order ?? index + 1;
  const icon = getProcessIcon(step.icon, step.title);

  const isEven = index % 2 === 0;
  // Using solid colors mapped to brand Palette
  const bgColor = isEven ? "bg-gold/50" : "bg-gold/25";
  // Force white text for both backgrounds for better readability
  const textColor = "text-white";
  const numColor = isEven
    ? "text-neutral-900 bg-white"
    : "text-gold bg-white/10 border border-gold";

  // Last item detection
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <motion.div
      className={`relative w-full md:flex-1 min-h-[220px] md:min-h-[320px] group transition-all duration-300 z-0 hover:z-20 hover:scale-[1.05] ${
        !isFirst ? "md:-ml-8" : ""
      }`}
      variants={itemVariants}
    >
      {/* Desktop Shape Container */}
      <div
        className={`hidden md:flex relative h-full ${bgColor} items-center justify-center p-6 clip-path-chevron transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.15)]`}
        style={{
          // Arrow depth is roughly 30px equivalent
          clipPath: isFirst
            ? "polygon(0% 0%, calc(100% - 30px) 0%, 100% 50%, calc(100% - 30px) 100%, 0% 100%)"
            : isLast
              ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 30px 50%)"
              : "polygon(0% 0%, calc(100% - 30px) 0%, 100% 50%, calc(100% - 30px) 100%, 0% 100%, 30px 50%)",
          width: "100%",
        }}
      >
        {/* Inner Content - Visually centered accounting for the arrow slant 
                 We need to shift slightly left to account for the 30px indent on the left (on middle/last items)
             */}
        <div
          className={`flex flex-col h-full justify-center items-center text-center w-full max-w-[200px] ${!isFirst ? "pl-8" : ""} ${!isLast ? "pr-8" : ""}`}
        >
          <div
            className={`w-14 h-14 rounded-full mb-5 flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-opacity-20 ${isEven ? "ring-white" : "ring-gold"} ${numColor} mx-auto`}
          >
            {stepNumber}
          </div>

          <div className="mb-4 text-white/90 transform group-hover:scale-110 transition-transform duration-300">
            <div className="w-10 h-10 md:w-12 md:h-12 mx-auto">{icon}</div>
          </div>

          <h3 className={`text-xl font-bold mb-3 ${textColor} leading-tight drop-shadow-sm`}>
            {step.title}
          </h3>

          <p className={`text-sm ${textColor} opacity-90 leading-relaxed font-medium`}>
            {step.detail}
          </p>
        </div>
      </div>

      {/* Mobile View - Standard Vertical Cards */}
      {/* Visible on mobile, hidden on md */}
      <div className={`md:hidden ${bgColor} rounded-xl p-6 mb-4 relative shadow-lg`}>
        {/* Connecting Line for mobile vertical stack */}
        {!isLast ? (
          <div className="absolute left-1/2 bottom-[-16px] w-1 h-4 bg-border -translate-x-1/2 z-0"></div>
        ) : null}

        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-bold text-lg shadow-md ${numColor}`}
          >
            {stepNumber}
          </div>
          <div className="text-left">
            <h3 className={`text-lg font-bold ${textColor}`}>{step.title}</h3>
            <p className={`text-sm ${textColor} opacity-90`}>{step.detail}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
