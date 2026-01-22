"use client";

/**
 * About Section Component
 *
 * Displays the about section with company information, values, timeline, and distribution map.
 * Uses framer-motion for animations - requires client component.
 *
 * All content is passed via props from parent components that fetch from Sanity CMS.
 * Data is validated with Zod schemas for runtime type safety.
 */

import { motion } from "framer-motion";
import { z } from "zod";
import Timeline from "@/components/Timeline";
import DistributionMap from "@/components/DistributionMap";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const StatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const WhoWeAreSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  description: z.string(),
  stats: z.array(StatSchema).optional(),
});

const MissionSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const VisionSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  description: z.string(),
});

const CommitmentSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const TimelineEntrySchema = z.object({
  year: z.number(),
  title: z.string(),
  description: z.string(),
});

const TimelineSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  entries: z.array(TimelineEntrySchema),
});

const DistributionSchema = z.object({
  title: z.string(),
});

const RoutingSchema = z.object({
  aboutSectionId: z.string().optional(),
});

const AboutPropsSchema = z.object({
  whoWeAre: WhoWeAreSchema.optional(),
  mission: MissionSchema.optional(),
  vision: VisionSchema.optional(),
  commitment: CommitmentSchema.optional(),
  timeline: TimelineSchema.optional(),
  distribution: DistributionSchema.optional(),
  routing: RoutingSchema.optional(),
});

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

type Stat = z.infer<typeof StatSchema>;
type TimelineEntry = z.infer<typeof TimelineEntrySchema>;

interface AboutProps {
  whoWeAre?: z.infer<typeof WhoWeAreSchema>;
  mission?: z.infer<typeof MissionSchema>;
  vision?: z.infer<typeof VisionSchema>;
  commitment?: z.infer<typeof CommitmentSchema>;
  timeline?: z.infer<typeof TimelineSchema>;
  distribution?: z.infer<typeof DistributionSchema>;
  routing?: z.infer<typeof RoutingSchema>;
}

// =============================================================================
// VALIDATION & DATA PARSING
// =============================================================================

function validateAboutProps(props: unknown): void {
  const result = AboutPropsSchema.safeParse(props);
  if (!result.success) {
    console.warn("[About] Props validation warning:", result.error.format());
  }
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const fadeInUp = {
  initial: { opacity: 0, y: 25 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function About({
  whoWeAre,
  mission,
  vision,
  commitment,
  timeline,
  distribution,
  routing,
}: AboutProps) {
  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    validateAboutProps({ whoWeAre, mission, vision, commitment, timeline, distribution, routing });
  }

  const timelineEntries = timeline?.entries ?? [];
  const sectionId = routing?.aboutSectionId ?? "about";

  return (
    <section id={sectionId} className="py-16 md:py-24 bg-bg" aria-labelledby="about-heading">
      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        {/* Who We Are Section */}
        {whoWeAre ? <WhoWeAreSection whoWeAre={whoWeAre} /> : null}

        {/* Vision & Purpose Section */}
        {vision || mission ? <VisionPurposeSection vision={vision} mission={mission} /> : null}

        {/* Company Values */}
        {commitment ? <CommitmentSection commitment={commitment} /> : null}

        {/* Timeline */}
        {timeline && timelineEntries.length > 0 ? (
          <TimelineSection title={timeline.title} entries={timelineEntries} />
        ) : null}

        {/* Distribution Map */}
        {distribution ? <DistributionSection title={distribution.title} /> : null}
      </div>
    </section>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface WhoWeAreSectionProps {
  whoWeAre: NonNullable<AboutProps["whoWeAre"]>;
}

function WhoWeAreSection({ whoWeAre }: WhoWeAreSectionProps) {
  return (
    <motion.div
      className="section-shell border border-border p-8 md:p-12 mb-16 md:mb-24"
      {...fadeInUp}
    >
      <p className="uppercase tracking-[0.4em] text-xs text-text-muted mb-4">{whoWeAre.eyebrow}</p>
      <h2 id="about-heading" className="text-3xl md:text-4xl font-semibold text-deep-brown mb-6">
        {whoWeAre.title}
      </h2>
      <div className="space-y-4 text-lg text-text-muted mb-8">
        <p>{whoWeAre.description}</p>
      </div>
      {whoWeAre.stats && whoWeAre.stats.length > 0 ? (
        <div className="grid sm:grid-cols-3 gap-6 text-center pt-6 border-t border-border">
          {whoWeAre.stats.map((stat: Stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-3xl font-semibold text-gold">{stat.value}</p>
              <p className="text-sm uppercase tracking-[0.3em] text-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      ) : null}
    </motion.div>
  );
}

interface VisionPurposeSectionProps {
  vision?: AboutProps["vision"];
  mission?: AboutProps["mission"];
}

function VisionPurposeSection({ vision, mission }: VisionPurposeSectionProps) {
  return (
    <motion.div
      className="section-shell border border-border p-8 md:p-12 mb-16 md:mb-24 bg-paper"
      {...fadeInUp}
      transition={{ delay: 0.1 }}
    >
      {vision?.eyebrow ? (
        <p className="uppercase tracking-[0.4em] text-xs text-text-muted mb-4">{vision.eyebrow}</p>
      ) : null}
      {vision?.title ? (
        <h3 className="text-2xl md:text-3xl font-semibold text-deep-brown mb-6">{vision.title}</h3>
      ) : null}
      <ul className="space-y-4 text-lg text-text-muted">
        {mission?.description ? (
          <li className="flex gap-3">
            <span aria-hidden="true" className="mt-2 h-2 w-2 rounded-full bg-gold shrink-0" />
            <span>{mission.description}</span>
          </li>
        ) : null}
        {vision?.description ? (
          <li className="flex gap-3">
            <span aria-hidden="true" className="mt-2 h-2 w-2 rounded-full bg-gold shrink-0" />
            <span>{vision.description}</span>
          </li>
        ) : null}
      </ul>
    </motion.div>
  );
}

interface CommitmentSectionProps {
  commitment: NonNullable<AboutProps["commitment"]>;
}

function CommitmentSection({ commitment }: CommitmentSectionProps) {
  return (
    <motion.div
      className="section-shell border border-border p-8 md:p-10 mb-16 md:mb-24"
      {...fadeInUp}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-2xl font-semibold text-deep-brown mb-3">{commitment.title}</h3>
      <p className="text-lg text-text-muted">{commitment.description}</p>
    </motion.div>
  );
}

interface TimelineSectionProps {
  title: string;
  entries: TimelineEntry[];
}

function TimelineSection({ title, entries }: TimelineSectionProps) {
  return (
    <div className="mb-16 md:mb-24">
      <h3 className="text-3xl font-bold text-deep-brown text-center mb-16 md:mb-24">{title}</h3>
      <Timeline entries={entries} />
    </div>
  );
}

interface DistributionSectionProps {
  title: string;
}

function DistributionSection({ title }: DistributionSectionProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-3xl font-bold text-deep-brown text-center mb-16 md:mb-24">{title}</h3>
      <DistributionMap />
    </div>
  );
}
