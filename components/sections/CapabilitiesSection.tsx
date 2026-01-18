"use client";

/**
 * Capabilities Section Component
 *
 * Displays company capabilities and certifications with animations.
 * Uses framer-motion for animations - requires client component.
 *
 * All content is passed via props from parent components that fetch from Sanity CMS.
 * Data is validated with Zod schemas for runtime type safety.
 */

import Image from "next/image";
import { motion } from "framer-motion";
import { z } from "zod";
import TextReveal from "@/components/ui/TextReveal";
import {
  AlmondIcon,
  CashewIcon,
  WalnutIcon,
  PeanutIcon,
  NutIcon,
} from "@/components/assets/Decorations";
import { urlForImage } from "@/lib/sanity/image";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const CapabilitySchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  metric: z.string(),
  icon: z.string().optional().nullable(),
});

const CertificateSchema = z.object({
  _id: z.string(),
  name: z.string(),
  label: z.string(),
  imageUrl: z.string().optional().nullable(),
  image: z.unknown().optional().nullable(),
});

const SectionSettingsSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  certificationsTitle: z.string().optional(),
  certificationsDescription: z.string().optional(),
});

const RoutingSchema = z.object({
  capabilitiesSectionId: z.string().optional(),
});

const CapabilitiesSectionPropsSchema = z.object({
  initialCapabilities: z.array(CapabilitySchema).nullish(),
  initialCertificates: z.array(CertificateSchema).nullish(),
  sectionSettings: SectionSettingsSchema.optional(),
  routing: RoutingSchema.optional(),
});

// =============================================================================
// TYPE DEFINITIONS (Inferred from Zod Schemas)
// =============================================================================

type Capability = z.infer<typeof CapabilitySchema>;
type Certificate = z.infer<typeof CertificateSchema>;
type SectionSettings = z.infer<typeof SectionSettingsSchema>;
type Routing = z.infer<typeof RoutingSchema>;

interface CapabilitiesSectionProps {
  initialCapabilities?: Capability[] | null;
  initialCertificates?: Certificate[] | null;
  sectionSettings?: SectionSettings;
  routing?: Routing;
}

// =============================================================================
// VALIDATION
// =============================================================================

function validateProps(props: unknown): void {
  const result = CapabilitiesSectionPropsSchema.safeParse(props);
  if (!result.success) {
    console.warn("[CapabilitiesSection] Props validation warning:", result.error.format());
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
      staggerChildren: 0.01,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 5 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function CapabilitiesSection({
  initialCapabilities,
  initialCertificates,
  sectionSettings,
  routing,
}: CapabilitiesSectionProps) {
  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    validateProps({ initialCapabilities, initialCertificates, sectionSettings, routing });
  }

  const capabilities = initialCapabilities ?? [];
  const certificates = initialCertificates ?? [];
  const sectionId = routing?.capabilitiesSectionId ?? "capabilities";

  if (capabilities.length === 0) return null;

  return (
    <section
      id={sectionId}
      className="py-20 bg-linear-to-b from-ivory to-cashew-cream relative overflow-hidden"
      aria-labelledby="capabilities-heading"
    >
      {/* Floating Decorations */}
      <DecorativeBackground />

      <div className="container mx-auto px-4 md:px-6 lg:px-10 relative z-10">
        {/* Section Header */}
        {sectionSettings ? <SectionHeader settings={sectionSettings} /> : null}

        {/* Capabilities Grid */}
        <CapabilitiesGrid capabilities={capabilities} />

        {/* Certificates Section */}
        {certificates.length > 0 ? (
          <CertificatesSection
            certificates={certificates}
            title={sectionSettings?.certificationsTitle}
            description={sectionSettings?.certificationsDescription}
          />
        ) : null}
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
    <div className="max-w-3xl mb-12">
      {settings.eyebrow ? (
        <motion.p
          className="uppercase tracking-[0.4em] text-xs text-(--color-muted) mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {settings.eyebrow}
        </motion.p>
      ) : null}
      {settings.title ? (
        <TextReveal
          as="h2"
          className="text-3xl md:text-4xl font-semibold text-(--color-graphite) mb-4"
          delay={0.2}
        >
          {settings.title}
        </TextReveal>
      ) : null}
      {settings.description ? (
        <div className="text-lg text-(--color-slate)">
          <TextReveal as="p" delay={0.4}>
            {settings.description}
          </TextReveal>
        </div>
      ) : null}
    </div>
  );
}

interface CapabilitiesGridProps {
  capabilities: Capability[];
}

function CapabilitiesGrid({ capabilities }: CapabilitiesGridProps) {
  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "100px" }}
      variants={staggerContainer}
    >
      {capabilities.map((capability) => (
        <CapabilityCard key={capability._id} capability={capability} />
      ))}
    </motion.div>
  );
}

interface CapabilityCardProps {
  capability: Capability;
}

function CapabilityCard({ capability }: CapabilityCardProps) {
  return (
    <motion.div
      className="bg-linear-to-br from-white to-ivory p-6 h-full rounded-3xl border-2 border-gold-light shadow-lg hover:shadow-xl hover:border-almond-gold transition-all duration-300"
      variants={fadeInUp}
    >
      <div className="text-sm uppercase tracking-[0.3em] text-(--color-muted) mb-4">
        {capability.metric}
      </div>
      <TextReveal
        as="h3"
        className="text-xl font-semibold text-(--color-graphite) mb-3"
        delay={0.1}
      >
        {capability.title}
      </TextReveal>
      <p className="text-(--color-slate)">{capability.description}</p>
    </motion.div>
  );
}

interface CertificatesSectionProps {
  certificates: Certificate[];
  title: string | undefined;
  description: string | undefined;
}

function CertificatesSection({ certificates, title, description }: CertificatesSectionProps) {
  return (
    <motion.div
      className="mt-20 border-t border-sand pt-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center mb-10">
        {title ? (
          <TextReveal
            as="h3"
            className="text-2xl font-bold text-deep-brown mb-4 font-heading"
            delay={0.2}
          >
            {title}
          </TextReveal>
        ) : null}
        {description ? (
          <motion.p
            className="text-(--color-slate) max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {description}
          </motion.p>
        ) : null}
      </div>

      <motion.div
        className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80 grayscale hover:grayscale-0 transition-all duration-500"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.01,
              delayChildren: 0,
            },
          },
        }}
      >
        {certificates.map((cert) => (
          <CertificateCard key={cert._id} certificate={cert} />
        ))}
      </motion.div>
    </motion.div>
  );
}

interface CertificateCardProps {
  certificate: Certificate;
}

function CertificateCard({ certificate }: CertificateCardProps) {
  const imageUrl = certificate.imageUrl
    ? certificate.imageUrl
    : certificate.image
      ? urlForImage(certificate.image).url()
      : null;

  return (
    <motion.div className="flex flex-col items-center gap-3 group" variants={scaleIn}>
      <div className="w-24 h-24 relative bg-white rounded-full shadow-sm border border-sand p-4 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <div className="relative w-full h-full">
            <Image src={imageUrl} alt={certificate.name} fill className="object-contain" />
          </div>
        ) : (
          <span className="text-lg font-bold text-deep-brown">{certificate.name}</span>
        )}
      </div>
      <span className="text-xs font-bold tracking-wider text-(--color-muted) group-hover:text-gold transition-colors">
        {certificate.label}
      </span>
    </motion.div>
  );
}

function DecorativeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0], y: [0, -12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-10 opacity-15"
      >
        <AlmondIcon className="w-32 h-32" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -12, 12, 0], x: [0, 10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute bottom-20 left-10 opacity-15"
      >
        <CashewIcon className="w-28 h-28" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 right-1/4 opacity-12"
      >
        <WalnutIcon className="w-26 h-26" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 14, -14, 0], y: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 4 }}
        className="absolute bottom-1/3 right-20 opacity-15"
      >
        <PeanutIcon className="w-24 h-24" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -11, 11, 0], x: [0, -10, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear", delay: 6 }}
        className="absolute top-1/4 left-20 opacity-12"
      >
        <NutIcon className="w-22 h-22" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 13, -13, 0], y: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 8 }}
        className="absolute bottom-1/4 left-1/3 opacity-15"
      >
        <AlmondIcon className="w-26 h-26" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -14, 14, 0], x: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: 9 }}
        className="absolute top-1/3 right-1/3 opacity-12"
      >
        <CashewIcon className="w-24 h-24" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 12, -12, 0], y: [0, -10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 10 }}
        className="absolute bottom-1/3 left-1/4 opacity-15"
      >
        <PeanutIcon className="w-22 h-22" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -11, 11, 0], x: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 11 }}
        className="absolute top-5 left-1/4 opacity-10"
      >
        <AlmondIcon className="w-20 h-20" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 13, -13, 0], y: [0, 8, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear", delay: 12 }}
        className="absolute bottom-5 right-1/4 opacity-12"
      >
        <CashewIcon className="w-22 h-22" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 19, repeat: Infinity, ease: "linear", delay: 4 }}
        className="absolute top-1/2 left-5 opacity-8"
      >
        <WalnutIcon className="w-18 h-18" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -360], scale: [1, 1.08, 1] }}
        transition={{ duration: 21, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute bottom-1/2 right-5 opacity-8"
      >
        <PeanutIcon className="w-18 h-18" />
      </motion.div>
    </div>
  );
}
