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

import { motion } from "framer-motion";
import { z } from "zod";

import DecorativeBackground from "@/components/ui/DecorativeBackground";
import { urlForImage } from "@/lib/sanity/image";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import OptimizedImage from "@/components/ui/OptimizedImage";

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
  backgroundImageUrl: z.string().optional().nullable(),
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
// TYPE DEFINITIONS
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
      staggerChildren: 0.06,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
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

  const bgImage = sectionSettings?.backgroundImageUrl
    ? getGoogleDriveImageUrl(sectionSettings.backgroundImageUrl)
    : null;

  if (capabilities.length === 0) return null;

  return (
    <section
      id={sectionId}
      className="py-16 md:py-24 bg-paper relative overflow-hidden"
      aria-labelledby="capabilities-heading"
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
      <DecorativeBackground variant="scattered" />

      <div className="container mx-auto px-4 md:px-6 lg:px-10 relative z-10">
        {/* Section Header */}
        {sectionSettings ? (
          <div className="bg-white/60 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-white/20 mb-16 md:mb-24 max-w-4xl">
            <SectionHeader settings={sectionSettings} />
          </div>
        ) : null}

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
    <div className="max-w-3xl mb-16 md:mb-24">
      {settings.eyebrow ? (
        <motion.p
          className="uppercase tracking-[0.4em] text-xs text-gold-dark mb-4 font-bold"
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
          className="text-3xl md:text-5xl font-bold text-deep-brown mb-6 font-heading leading-tight"
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

interface CapabilitiesGridProps {
  capabilities: Capability[];
}

function CapabilitiesGrid({ capabilities }: CapabilitiesGridProps) {
  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05, margin: "0px" }}
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
      className="bg-white p-6 h-full rounded-3xl border-2 border-border shadow-lg hover:shadow-xl hover:border-gold transition-all duration-300"
      variants={fadeInUp}
    >
      <div className="text-sm uppercase tracking-[0.3em] text-text-muted mb-4 font-bold">
        {capability.metric}
      </div>
      <motion.h3
        className="text-xl font-bold text-deep-brown mb-3"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {capability.title}
      </motion.h3>
      <p className="text-text-muted">{capability.description}</p>
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
      className="mt-16 md:mt-24 border-t border-border pt-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center mb-16 md:mb-24">
        {title ? (
          <motion.h3
            className="text-2xl font-bold text-deep-brown mb-4 font-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            {title}
          </motion.h3>
        ) : null}
        {description ? (
          <motion.p
            className="text-text-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
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
  const driveImageUrl = certificate.imageUrl ? getGoogleDriveImageUrl(certificate.imageUrl) : null;
  const sanityImageUrl = certificate.image ? urlForImage(certificate.image).url() : null;

  return (
    <motion.div className="flex flex-col items-center gap-3 group" variants={scaleIn}>
      <div className="w-24 h-24 relative bg-white rounded-full shadow-sm border border-border p-4 flex items-center justify-center overflow-hidden">
        {driveImageUrl ? (
          <div className="relative w-full h-full">
            <OptimizedImage
              src={driveImageUrl}
              alt={certificate.name}
              fill
              className="object-scale-down"
              sizes="96px"
              quality={100}
            />
          </div>
        ) : sanityImageUrl ? (
          <div className="relative w-full h-full">
            <OptimizedImage
              src={sanityImageUrl}
              alt={certificate.name}
              fill
              className="object-scale-down"
              quality={100}
            />
          </div>
        ) : (
          <span className="text-lg font-bold text-deep-brown">{certificate.name}</span>
        )}
      </div>
      <span className="text-xs font-bold tracking-wider text-text-muted group-hover:text-gold transition-colors">
        {certificate.label}
      </span>
    </motion.div>
  );
}
