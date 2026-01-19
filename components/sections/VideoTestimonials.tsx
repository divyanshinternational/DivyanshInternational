"use client";

/**
 * Video Testimonials Section Component
 *
 * Displays a list of testimonials and a video showcase section.
 * Uses client-side state for video slider navigation.
 *
 * All content is passed via props from parent components that fetch from Sanity CMS.
 * Data is validated with Zod schemas for runtime type safety.
 */

import { motion } from "framer-motion";
import { z } from "zod";

import type { SanityImageSource } from "@sanity/image-url";
import VideoShowcase from "@/components/ui/VideoShowcase";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const SanityImageSourceSchema = z.custom<SanityImageSource>((val) => val !== undefined);

const TestimonialSchema = z.object({
  _id: z.string(),
  author: z.string(),
  role: z.string(),
  location: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  thumbnail: SanityImageSourceSchema.optional().nullable(),
  quote: z.string(),
});

const VideoItemSchema = z.object({
  _key: z.string(),
  title: z.string(),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  thumbnail: SanityImageSourceSchema.optional(),
});

const VideoShowcaseSchema = z.object({
  eyebrow: z.string().nullish(),
  title: z.string().nullish(),
  placeholderText: z.string().nullish(),
  highlights: z.array(z.string()).nullish(),
  note: z.string().nullish(),
  videoUrl: z.string().nullish(),
  image: SanityImageSourceSchema.nullish(),
  videos: z.array(VideoItemSchema).nullish(),
});

const SectionSettingsSchema = z.object({
  eyebrow: z.string().nullish(),
  title: z.string().nullish(),
  droneSection: VideoShowcaseSchema.nullish(),
  videoTestimonialsSection: VideoShowcaseSchema.nullish(),
});

const RoutingSchema = z.object({
  testimonialsSectionId: z.string().optional(),
});

const VideoTestimonialsPropsSchema = z.object({
  initialTestimonials: z.array(TestimonialSchema).nullish(),
  sectionSettings: SectionSettingsSchema.nullish(),
  routing: RoutingSchema.optional(),
});

// =============================================================================
// TYPE DEFINITIONS (Inferred from Zod Schemas)
// =============================================================================

type Testimonial = z.infer<typeof TestimonialSchema>;
type SectionSettings = z.infer<typeof SectionSettingsSchema>;
type Routing = z.infer<typeof RoutingSchema>;

interface VideoTestimonialsProps {
  initialTestimonials?: Testimonial[] | null;
  sectionSettings?: SectionSettings | null;
  routing?: Routing;
}

// =============================================================================
// VALIDATION
// =============================================================================

function validateProps(props: unknown): void {
  const result = VideoTestimonialsPropsSchema.safeParse(props);
  if (!result.success) {
    console.warn("[VideoTestimonials] Props validation warning:", result.error.format());
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
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function VideoTestimonialsSection({
  initialTestimonials,
  sectionSettings,
  routing,
}: VideoTestimonialsProps) {
  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    validateProps({ initialTestimonials, sectionSettings, routing });
  }
  const testimonials = initialTestimonials ?? [];
  const sectionId = routing?.testimonialsSectionId;

  return (
    <section
      id={sectionId}
      className="py-20 bg-linear-to-b from-beige to-sand relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Testimonials List */}
          <div className="space-y-12">
            <TestimonialsList
              testimonials={testimonials}
              eyebrow={sectionSettings?.eyebrow}
              title={sectionSettings?.title}
            />
          </div>

          {/* Right Column: Drone/Video Showcase */}
          <div className="space-y-12">
            <VideoShowcase data={sectionSettings?.droneSection} />
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface TestimonialsListProps {
  testimonials: Testimonial[];
  eyebrow: string | undefined | null;
  title: string | undefined | null;
}

function TestimonialsList({ testimonials, eyebrow, title }: TestimonialsListProps) {
  return (
    <div>
      {eyebrow ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="uppercase tracking-[0.4em] text-xs text-(--color-muted)">{eyebrow}</span>
        </motion.div>
      ) : null}

      {title ? (
        <motion.h2
          className="text-3xl md:text-4xl font-semibold text-(--color-graphite) mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {title}
        </motion.h2>
      ) : null}

      <motion.div
        className="space-y-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -50px 0px" }}
        variants={staggerContainer}
      >
        {testimonials.map((testimonial) => (
          <motion.blockquote
            key={testimonial._id}
            className="bg-linear-to-br from-white to-ivory border-2 border-sand rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-gold-light transition-all duration-300"
            variants={fadeInUp}
          >
            <p className="text-lg text-(--color-slate) mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
            <footer className="text-sm font-semibold text-deep-brown">
              {testimonial.author}, <span className="text-(--color-muted)">{testimonial.role}</span>
            </footer>
          </motion.blockquote>
        ))}
      </motion.div>
    </div>
  );
}
