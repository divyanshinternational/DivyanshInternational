"use client";

/**
 * Sustainability Section Component
 *
 * Displays sustainability pillars with icons and visual elements.
 * Features icon cards, visual dividers, and engaging animations.
 */

import { motion } from "framer-motion";
import { z } from "zod";
import { Handshake, Droplets, Users, TreePine, Leaf, Recycle } from "lucide-react";
import DecorativeBackground from "@/components/ui/DecorativeBackground";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import OptimizedImage from "@/components/ui/OptimizedImage";

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
  infographicImageUrl: z.string().optional(),
  backgroundImageUrl: z.string().optional(),
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
// TYPE DEFINITIONS
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
// ICON MAPPING
// =============================================================================

const pillarIcons = [Handshake, Droplets, Users, TreePine, Leaf, Recycle] as const;

const pillarIconColors = [
  "text-amber-600",
  "text-blue-500",
  "text-orange-500",
  "text-green-600",
  "text-emerald-500",
  "text-teal-500",
] as const;

const pillarBgColors = [
  "bg-amber-50",
  "bg-blue-50",
  "bg-orange-50",
  "bg-green-50",
  "bg-emerald-50",
  "bg-teal-50",
] as const;

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
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function SustainabilitySection({
  initialPillars,
  sectionSettings,
  routing,
}: SustainabilitySectionProps) {
  if (process.env.NODE_ENV === "development") {
    validateProps({ initialPillars, sectionSettings, routing });
  }

  const activePillars = initialPillars ?? [];
  const sectionId = routing?.sustainabilitySectionId;

  // Prepare background image if available
  const bgImage = sectionSettings?.backgroundImageUrl
    ? getGoogleDriveImageUrl(sectionSettings.backgroundImageUrl)
    : null;

  if (activePillars.length === 0) return null;

  return (
    <section
      id={sectionId}
      className="py-16 md:py-24 bg-paper relative overflow-hidden"
      aria-labelledby="sustainability-heading"
    >
      {/* Dynamic Background Image */}
      {bgImage ? (
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={bgImage}
            alt=""
            fill
            className="pointer-events-none scale-110 blur-[5px] opacity-100 object-cover"
            sizes="100vw"
            quality={100}
          />
        </div>
      ) : null}

      {/* Floating Decorations */}
      <DecorativeBackground variant="minimal" />

      <div className="container mx-auto px-4 md:px-6 lg:px-10 relative z-10">
        <div className="text-center mb-16 md:mb-24 max-w-4xl mx-auto bg-white/60 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-white/20">
          {/* Large Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-gold mb-6 mx-auto"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Leaf className="w-8 h-8" />
          </motion.div>

          {sectionSettings?.eyebrow ? (
            <motion.p
              className="uppercase tracking-[0.3em] text-sm text-gold-dark mb-4 font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {sectionSettings.eyebrow}
            </motion.p>
          ) : null}

          {sectionSettings?.title ? (
            <motion.h2
              id="sustainability-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-brown mb-6 font-heading leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {sectionSettings.title}
            </motion.h2>
          ) : null}

          {sectionSettings?.description ? (
            <motion.p
              className="text-lg text-deep-brown/80 leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {sectionSettings.description}
            </motion.p>
          ) : null}
        </div>

        {/* Pillars Grid with Visual Cards */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {activePillars.map((pillar, index) => (
            <PillarCard key={pillar.title} pillar={pillar} index={index} />
          ))}
        </motion.div>

        {/* Visual Stats Bar */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <StatCard
            icon={Recycle}
            value="100%"
            label="Recyclable Packaging"
            color="text-teal-500"
          />
          <StatCard icon={Droplets} value="40%" label="Water Saved" color="text-blue-500" />
          <StatCard icon={TreePine} value="1000+" label="Trees Planted" color="text-green-600" />
          <StatCard icon={Users} value="500+" label="Farmers Supported" color="text-orange-500" />
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface PillarCardProps {
  pillar: SustainabilityPillar;
  index: number;
}

function PillarCard({ pillar, index }: PillarCardProps) {
  const iconIndex = index % pillarIcons.length;
  const Icon = pillarIcons[iconIndex];
  const iconColor = pillarIconColors[iconIndex];
  const bgColor = pillarBgColors[iconIndex];

  return (
    <motion.article
      className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-sand hover:border-gold-light overflow-hidden"
      variants={cardVariant}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Gradient Accent Top */}

      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-xl ${bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        {Icon ? <Icon className={`w-7 h-7 ${iconColor}`} strokeWidth={1.5} /> : null}
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-deep-brown mb-2 group-hover:text-gold-dark transition-colors">
        {pillar.title}
      </h3>
      <p className="text-sm text-text-muted leading-relaxed">{pillar.detail}</p>

      {/* Hover decoration */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />
    </motion.article>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  color?: string;
}

function StatCard({ icon: Icon, value, label, color = "text-gold" }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 text-center border border-sand hover:border-gold-light hover:shadow-md transition-all">
      <Icon className={`w-8 h-8 ${color} mx-auto mb-2`} />
      <div className="text-2xl font-bold text-deep-brown">{value}</div>
      <div className="text-xs text-text-muted">{label}</div>
    </div>
  );
}
