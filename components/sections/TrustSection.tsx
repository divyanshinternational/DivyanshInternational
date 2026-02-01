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

import { motion } from "framer-motion";
import { z } from "zod";
import DecorativeBackground from "@/components/ui/DecorativeBackground";
import {
  ShoppingCart,
  Building2,
  UtensilsCrossed,
  Factory,
  CheckCircle,
  Shield,
} from "lucide-react";

import type { SanityImageSource } from "@sanity/image-url";
import { urlForImage } from "@/lib/sanity/image";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import OptimizedImage from "@/components/ui/OptimizedImage";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const CertificateSchema = z.object({
  _id: z.string(),
  name: z.string(),
  label: z.string(),
  image: z.unknown().optional(),
  imageUrl: z.string().optional().nullable(),
  description: z.string().optional(),
});

const SectionSettingsSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  partnerSegments: z.array(z.string()).optional(),
  backgroundImageUrl: z.string().optional(),
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
// TYPE DEFINITIONS
// =============================================================================

type Certificate = z.infer<typeof CertificateSchema>;
type SectionSettings = z.infer<typeof SectionSettingsSchema>;
type Routing = z.infer<typeof RoutingSchema>;

interface DisplayCertificate {
  label: string;
  description: string;
  image: SanityImageSource | undefined;
  imageUrl: string | null | undefined;
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
      staggerChildren: 0.05,
    },
  },
};

const staggerContainerDelayed = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
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
  if (process.env.NODE_ENV === "development") {
    validateProps({ initialCertificates, sectionSettings, routing });
  }

  const displayCertificates: DisplayCertificate[] =
    initialCertificates && initialCertificates.length > 0
      ? initialCertificates.map((c) => ({
          label: c.label || c.name,
          description: c.name,
          image: c.image as SanityImageSource | undefined,
          imageUrl: c.imageUrl,
        }))
      : [];

  const segments = sectionSettings?.partnerSegments ?? [];
  const sectionId = routing?.trustSectionId;

  const bgImage = sectionSettings?.backgroundImageUrl
    ? getGoogleDriveImageUrl(sectionSettings.backgroundImageUrl)
    : null;

  return (
    <section
      id={sectionId}
      className="py-16 md:py-24 bg-bg relative overflow-hidden"
      aria-labelledby="trust-heading"
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

      {/* Floating Decorations */}
      <DecorativeBackground variant="side-balanced" />

      <div className="container mx-auto px-4 md:px-6 lg:px-10 relative z-10">
        <div className="text-center mb-16 max-w-4xl mx-auto bg-sand/90 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-sand/50">
          {/* Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-gold mb-6 mx-auto"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Shield className="w-8 h-8" />
          </motion.div>

          {sectionSettings?.eyebrow ? (
            <motion.div
              className="flex items-center justify-center gap-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="h-px w-8 bg-gold" />
              <span className="uppercase tracking-[0.3em] text-sm text-gold-dark font-semibold">
                {sectionSettings.eyebrow}
              </span>
              <span className="h-px w-8 bg-gold" />
            </motion.div>
          ) : null}

          {sectionSettings?.title ? (
            <motion.h2
              id="trust-heading"
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

        {/* Certificates Grid */}
        {displayCertificates.length > 0 ? (
          <CertificatesGrid certificates={displayCertificates} />
        ) : null}

        {/* Partner Segments Grid */}
        {segments.length > 0 ? <SegmentsGrid segments={segments} /> : null}
      </div>
    </section>
  );
}

interface CertificatesGridProps {
  certificates: DisplayCertificate[];
}

function CertificatesGrid({ certificates }: CertificatesGridProps) {
  return (
    <motion.div
      className="grid md:grid-cols-3 gap-6 mb-16 md:mb-24"
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
      className="p-6 rounded-xl border border-sand bg-white relative overflow-hidden group hover:border-gold transition-all duration-500 hover:shadow-xl"
      variants={scaleIn}
    >
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div
        className="absolute top-0 right-0 p-2 opacity-70 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
      >
        {certificate.imageUrl ? (
          <div className="w-16 h-16 relative transition-all duration-500">
            <OptimizedImage
              src={getGoogleDriveImageUrl(certificate.imageUrl) || ""}
              alt=""
              fill
              className="object-scale-down"
              sizes="64px"
              quality={100}
            />
          </div>
        ) : certificate.image ? (
          <div className="w-16 h-16 relative transition-all duration-500">
            <OptimizedImage
              src={urlForImage(certificate.image).url()}
              alt=""
              fill
              className="object-scale-down"
              quality={100}
            />
          </div>
        ) : (
          <ShieldIcon />
        )}
      </div>
      <p className="text-sm uppercase tracking-[0.3em] text-gold-dark mb-2 font-bold group-hover:text-gold transition-colors">
        {certificate.label}
      </p>
      <p className="text-deep-brown font-medium group-hover:text-brown-light transition-colors">
        {certificate.description}
      </p>
    </motion.article>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="w-16 h-16 text-gold transition-transform duration-500 group-hover:scale-110"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
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
  const lower = segment.toLowerCase();

  const renderIcon = () => {
    const iconProps = { className: "w-5 h-5 text-gold-dark", strokeWidth: 1.5 };
    if (lower.includes("retail")) return <ShoppingCart {...iconProps} />;
    if (lower.includes("professional") || lower.includes("purchase"))
      return <Building2 {...iconProps} />;
    if (lower.includes("hospitality")) return <UtensilsCrossed {...iconProps} />;
    if (lower.includes("food") || lower.includes("processing") || lower.includes("wellness"))
      return <Factory {...iconProps} />;
    return <CheckCircle {...iconProps} />;
  };

  return (
    <motion.div
      className="min-h-[100px] flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-white text-center px-4 py-4 hover:shadow-lg hover:border-gold/50 hover:-translate-y-1 transition-all duration-300 group"
      variants={fadeInUp}
    >
      <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        {renderIcon()}
      </div>
      <span className="text-sm font-semibold text-text-muted group-hover:text-gold-dark transition-colors">
        {segment}
      </span>
    </motion.div>
  );
}
