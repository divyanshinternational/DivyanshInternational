"use client";

/**
 * Video Testimonials Section Component
 *
 * Displays testimonials with centered header and contextual colors.
 * Full-width layout similar to Sustainability and CTA sections.
 */

import { motion } from "framer-motion";
import { z } from "zod";
import { Quote, Star } from "lucide-react";
import DecorativeBackground from "@/components/ui/DecorativeBackground";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import OptimizedImage from "@/components/ui/OptimizedImage";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const TestimonialSchema = z.object({
  _id: z.string(),
  author: z.string(),
  role: z.string(),
  location: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  thumbnail: z.any().optional().nullable(),
  quote: z.string(),
});

const VideoItemSchema = z.object({
  _key: z.string(),
  title: z.string(),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  thumbnail: z.any().optional(),
});

const VideoShowcaseSchema = z.object({
  eyebrow: z.string().nullish(),
  title: z.string().nullish(),
  placeholderText: z.string().nullish(),
  highlights: z.array(z.string()).nullish(),
  note: z.string().nullish(),
  videoUrl: z.string().nullish(),
  image: z.any().nullish(),
  videos: z.array(VideoItemSchema).nullish(),
});

const SectionSettingsSchema = z.object({
  eyebrow: z.string().nullish(),
  title: z.string().nullish(),
  droneSection: VideoShowcaseSchema.nullish(),
  videoTestimonialsSection: VideoShowcaseSchema.nullish(),
  backgroundImageUrl: z.string().nullish(),
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
// TYPE DEFINITIONS
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
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
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

export default function VideoTestimonialsSection({
  initialTestimonials,
  sectionSettings,
  routing,
}: VideoTestimonialsProps) {
  if (process.env["NODE_ENV"] === "development") {
    validateProps({ initialTestimonials, sectionSettings, routing });
  }

  const testimonials = initialTestimonials ?? [];
  const sectionId = routing?.testimonialsSectionId;

  // Prepare background image if available
  const bgImage = sectionSettings?.backgroundImageUrl
    ? getGoogleDriveImageUrl(sectionSettings.backgroundImageUrl)
    : null;

  return (
    <section
      id={sectionId}
      className="py-16 bg-bg relative overflow-hidden"
      aria-labelledby="testimonials-heading"
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
          />
        </div>
      ) : null}

      {/* Floating Decorations */}
      <DecorativeBackground variant="side-balanced" />

      <div className="container mx-auto px-4 md:px-6 lg:px-10 relative z-10">
        {/* Centered Header with Glass Protection */}
        <div className="text-center mb-16 max-w-4xl mx-auto bg-white/60 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-white/20">
          {/* Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-gold mb-6 mx-auto"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Star className="w-8 h-8" fill="currentColor" />
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
              id="testimonials-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-brown mb-6 font-heading leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {sectionSettings.title}
            </motion.h2>
          ) : null}
        </div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial._id} testimonial={testimonial} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  // Contextual colors based on index
  const colors = [
    {
      quote: "bg-amber-500",
      avatar: "bg-amber-50",
      text: "text-amber-600",
    },
    {
      quote: "bg-blue-500",
      avatar: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      quote: "bg-purple-500",
      avatar: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      quote: "bg-green-500",
      avatar: "bg-green-50",
      text: "text-green-600",
    },
    {
      quote: "bg-rose-500",
      avatar: "bg-rose-50",
      text: "text-rose-600",
    },
    {
      quote: "bg-teal-500",
      avatar: "bg-teal-50",
      text: "text-teal-600",
    },
  ];

  // Safe access with guaranteed fallback
  const defaultColor = {
    quote: "bg-amber-500",
    avatar: "bg-amber-50",
    text: "text-amber-600",
  };
  const colorIndex = index % colors.length;
  const color = colors[colorIndex] ?? defaultColor;

  return (
    <motion.article
      className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-sand hover:border-gold-light overflow-hidden"
      variants={cardVariant}
      whileHover={{ y: -5 }}
    >
      {/* Gradient Accent Top */}

      {/* Quote Icon */}
      <div
        className={`w-12 h-12 rounded-xl ${color.avatar} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <Quote className={`w-6 h-6 ${color.text}`} />
      </div>

      {/* Quote Text */}
      <p className="text-text-muted mb-6 leading-relaxed line-clamp-4">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author Info */}
      <footer className="flex items-center gap-3 pt-4 border-t border-border">
        <div className={`w-10 h-10 rounded-full ${color.avatar} flex items-center justify-center`}>
          <span className={`text-sm font-bold ${color.text}`}>{testimonial.author.charAt(0)}</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-deep-brown">{testimonial.author}</div>
          <div className="text-xs text-text-muted">{testimonial.role}</div>
        </div>
      </footer>

      {/* Hover decoration */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-0.5 ${color.quote} opacity-0 group-hover:opacity-100`}
        transition={{ duration: 0.3 }}
      />
    </motion.article>
  );
}
