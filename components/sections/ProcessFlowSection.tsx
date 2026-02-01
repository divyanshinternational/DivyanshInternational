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
import { Sprout, ShieldCheck, Package, Truck } from "lucide-react";
import DecorativeBackground from "@/components/ui/DecorativeBackground";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import OptimizedImage from "@/components/ui/OptimizedImage";

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
  backgroundImageUrl: z.string().optional(),
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
  farm: <Sprout className="w-10 h-10" strokeWidth={2} />,
  shelling: (
    <OptimizedImage
      src="/Shelling.png"
      alt="Shelling Process"
      width={150}
      height={150}
      className="w-10 h-10 object-scale-down"
      quality={100}
    />
  ),
  sorting: (
    <OptimizedImage
      src="/Sorting.png"
      alt="Sorting Process"
      width={150}
      height={150}
      className="w-10 h-10 object-scale-down"
      quality={100}
    />
  ),
  quality: <ShieldCheck className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2} />,
  packing: <Package className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2} />,
  shipping: <Truck className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2} />,
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

  const bgImage = sectionSettings?.backgroundImageUrl
    ? getGoogleDriveImageUrl(sectionSettings.backgroundImageUrl)
    : null;

  return (
    <section
      className="relative py-16 md:py-24 bg-paper overflow-hidden"
      aria-labelledby="process-flow-heading"
    >
      {/* Dynamic Background Image */}
      {bgImage ? (
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={bgImage}
            alt=""
            fill
            className="pointer-events-none opacity-100"
            imageClassName="object-cover object-center md:object-[center_center]"
            sizes="100vw"
            quality={100}
          />
        </div>
      ) : null}
      {/* Background decoration */}
      <DecorativeBackground variant="minimal" />
      <div className="absolute inset-0 opacity-5 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center max-w-4xl mx-auto mb-16 md:mb-24 bg-sand/90 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-sand/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="uppercase tracking-[0.3em] text-xs text-gold-dark font-bold mb-3">
            {eyebrow}
          </p>
          <h2
            id="process-flow-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-brown mb-4 font-heading"
          >
            {title}
          </h2>
          <p className="text-lg text-deep-brown/80 leading-relaxed font-medium">{description}</p>
        </motion.div>

        {/* Process Flow */}
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
          className="text-center mt-3 md:mt-12 text-text-muted italic"
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
  const bgColor = isEven ? "bg-deep-brown" : "bg-paper";
  const textColor = isEven ? "!text-white" : "!text-deep-brown";

  const isFirst = index === 0;
  const isLast = index === total - 1;

  const numberStyle = isEven
    ? { color: "#3b2f2f", backgroundColor: "#f5f1e8" }
    : { color: "#f5f1e8", backgroundColor: "#3b2f2f" };

  return (
    <motion.div
      className={`relative w-full md:flex-1 min-h-55 md:min-h-80 group transition-all duration-300 z-0 hover:z-20 hover:scale-[1.05] ${
        !isFirst ? "md:-ml-8" : ""
      }`}
      variants={itemVariants}
    >
      {/* Desktop Shape Container */}
      <div
        className={`hidden md:flex relative h-full ${bgColor} items-center justify-center p-6 clip-path-chevron transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.15)]`}
        style={{
          clipPath: isFirst
            ? "polygon(0% 0%, calc(100% - 30px) 0%, 100% 50%, calc(100% - 30px) 100%, 0% 100%)"
            : isLast
              ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 30px 50%)"
              : "polygon(0% 0%, calc(100% - 30px) 0%, 100% 50%, calc(100% - 30px) 100%, 0% 100%, 30px 50%)",
          width: "100%",
        }}
      >
        <div
          className={`flex flex-col h-full justify-center items-center text-center w-full max-w-50 ${!isFirst ? "pl-8" : ""} ${!isLast ? "pr-8" : ""}`}
        >
          <div
            className={`w-14 h-14 rounded-full mb-5 flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-opacity-20 ${isEven ? "ring-white" : "ring-gold"} mx-auto`}
            style={numberStyle}
          >
            {stepNumber}
          </div>

          <div
            className={`mb-4 ${textColor} transform group-hover:scale-110 transition-transform duration-300`}
          >
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

      <div className={`md:hidden ${bgColor} rounded-xl p-6 mb-4 relative shadow-lg`}>
        {!isLast ? (
          <div className="absolute left-1/2 -bottom-4 w-1 h-4 bg-border -translate-x-1/2 z-0"></div>
        ) : null}

        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-bold text-lg shadow-md"
            style={numberStyle}
          >
            {stepNumber}
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 flex items-center justify-center ${textColor}`}>{icon}</div>
              <h3 className={`text-lg font-bold ${textColor}`}>{step.title}</h3>
            </div>
            <p className={`text-sm ${textColor} opacity-90`}>{step.detail}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
