"use client";

/**
 * Trust Section Component
 *
 * Displays certificates and partner segments with animations.
 * Uses framer-motion for animations - requires client component.
 *
 * All content is passed via props from parent components that fetch from Sanity CMS.
 * Data is validated with Zod schemas for runtime type safety.
 */

import Image from "next/image";
import { motion } from "framer-motion";
import { z } from "zod";
import TextReveal from "@/components/ui/TextReveal";
import type { SanityImageSource } from "@sanity/image-url";
import { urlForImage } from "@/lib/sanity/image";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const CertificateSchema = z.object({
  _id: z.string(),
  name: z.string(),
  label: z.string(),
  image: z.unknown().optional(), // SanityImageSource is complex
  description: z.string().optional(),
});

const SectionSettingsSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  partnerSegments: z.array(z.string()).optional(),
});

const RoutingSchema = z.object({
  trustSectionId: z.string().optional(),
});

const TrustSectionPropsSchema = z.object({
  initialCertificates: z.array(CertificateSchema).nullish(),
  sectionSettings: SectionSettingsSchema.optional(),
  routing: RoutingSchema.optional(),
});

// =============================================================================
// TYPE DEFINITIONS (Inferred from Zod Schemas)
// =============================================================================

type Certificate = z.infer<typeof CertificateSchema>;
type SectionSettings = z.infer<typeof SectionSettingsSchema>;
type Routing = z.infer<typeof RoutingSchema>;

interface DisplayCertificate {
  label: string;
  description: string;
  image: SanityImageSource | undefined;
}

interface TrustSectionProps {
  initialCertificates?: Certificate[] | null;
  sectionSettings?: SectionSettings;
  routing?: Routing;
}

// =============================================================================
// VALIDATION
// =============================================================================

function validateProps(props: unknown): void {
  const result = TrustSectionPropsSchema.safeParse(props);
  if (!result.success) {
    console.warn("[TrustSection] Props validation warning:", result.error.format());
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
      staggerChildren: 0.1,
    },
  },
};

const staggerContainerDelayed = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function TrustSection({
  initialCertificates,
  sectionSettings,
  routing,
}: TrustSectionProps) {
  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    validateProps({ initialCertificates, sectionSettings, routing });
  }

  const displayCertificates: DisplayCertificate[] =
    initialCertificates && initialCertificates.length > 0
      ? initialCertificates.map((c) => ({
          label: c.label || c.name,
          description: c.name,
          image: c.image as SanityImageSource | undefined,
        }))
      : [];

  const segments = sectionSettings?.partnerSegments ?? [];
  const sectionId = routing?.trustSectionId;

  return (
    <section id={sectionId} className="py-20 bg-ivory" aria-labelledby="trust-heading">
      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        <div className="section-shell p-8 md:p-12 border border-[#efe3d2]">
          {/* Section Header */}
          {sectionSettings ? <SectionHeader settings={sectionSettings} /> : null}

          {/* Certificates Grid */}
          {displayCertificates.length > 0 ? (
            <CertificatesGrid certificates={displayCertificates} />
          ) : null}

          {/* Partner Segments Grid */}
          {segments.length > 0 ? <SegmentsGrid segments={segments} /> : null}
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
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-10">
      <div>
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
            className="text-3xl font-semibold text-(--color-graphite)"
            delay={0.2}
          >
            {settings.title}
          </TextReveal>
        ) : null}
      </div>
      {settings.description ? (
        <div className="text-(--color-slate) max-w-xl">
          <TextReveal as="p" delay={0.4}>
            {settings.description}
          </TextReveal>
        </div>
      ) : null}
    </div>
  );
}

interface CertificatesGridProps {
  certificates: DisplayCertificate[];
}

function CertificatesGrid({ certificates }: CertificatesGridProps) {
  return (
    <motion.div
      className="grid md:grid-cols-3 gap-6 mb-10"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      {certificates.map((cert, index) => (
        <CertificateCard key={`${cert.label}-${index}`} certificate={cert} />
      ))}
    </motion.div>
  );
}

interface CertificateCardProps {
  certificate: DisplayCertificate;
}

function CertificateCard({ certificate }: CertificateCardProps) {
  return (
    <motion.article
      className="p-6 rounded-xl border-2 border-gold/30 bg-white relative overflow-hidden group hover:border-gold transition-colors hover:shadow-lg"
      variants={scaleIn}
    >
      <div
        className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"
        aria-hidden="true"
      >
        {certificate.image ? (
          <div className="w-16 h-16 relative">
            <Image
              src={urlForImage(certificate.image).url()}
              alt=""
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <ShieldIcon />
        )}
      </div>
      <p className="text-sm uppercase tracking-[0.3em] text-gold-dark mb-2 font-bold">
        {certificate.label}
      </p>
      <p className="text-(--color-graphite) font-medium">{certificate.description}</p>
    </motion.article>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-16 h-16 text-gold" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
    </svg>
  );
}

interface SegmentsGridProps {
  segments: string[];
}

function SegmentsGrid({ segments }: SegmentsGridProps) {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-6 items-stretch"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={staggerContainerDelayed}
    >
      {segments.map((segment) => (
        <SegmentCard key={segment} segment={segment} />
      ))}
    </motion.div>
  );
}

interface SegmentCardProps {
  segment: string;
}

function SegmentCard({ segment }: SegmentCardProps) {
  return (
    <motion.div
      className="min-h-[80px] flex items-center justify-center rounded-xl border border-[#efe3d2] bg-white/80 text-center px-4 text-sm font-semibold text-(--color-slate) hover:bg-white hover:shadow-md transition-all"
      variants={fadeInUp}
    >
      {segment}
    </motion.div>
  );
}
