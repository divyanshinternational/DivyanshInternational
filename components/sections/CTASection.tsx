"use client";

/**
 * CTA Section Component
 *
 * Full-width call-to-action section with centered form.
 */

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { z } from "zod";
import { Send, Mail, ArrowRight, Sparkles } from "lucide-react";

import DecorativeBackground from "@/components/ui/DecorativeBackground";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import OptimizedImage from "@/components/ui/OptimizedImage";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const WalkthroughCTASchema = z.object({
  subtitle: z.string(),
  title: z.string(),
  description: z.string(),
  buttonText: z.string(),
});

const PricingCTASchema = z.object({
  subtitle: z.string(),
  title: z.string(),
  description: z.string(),
  buttonText: z.string(),
  emailPlaceholder: z.string().optional(),
});

const CTADataSchema = z.object({
  walkthrough: WalkthroughCTASchema.nullish(),
  pricing: PricingCTASchema.nullish(),
  backgroundImageUrl: z.string().nullish(),
});

const RoutingSchema = z.object({
  ctaSectionId: z.string().optional(),
  contactPagePath: z.string().optional(),
  tradeEnquiryType: z.string().optional(),
});

const CTASectionPropsSchema = z.object({
  initialCTA: CTADataSchema.nullish(),
  routing: RoutingSchema.optional(),
});

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

type WalkthroughCTA = z.infer<typeof WalkthroughCTASchema>;
type PricingCTA = z.infer<typeof PricingCTASchema>;
type CTAData = z.infer<typeof CTADataSchema>;
type Routing = z.infer<typeof RoutingSchema>;

interface CTASectionProps {
  initialCTA?: CTAData | null;
  routing?: Routing;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_CONTACT_PATH = "/contact";
const DEFAULT_TRADE_TYPE = "trade";

// =============================================================================
// VALIDATION
// =============================================================================

function validateProps(props: unknown): void {
  const result = CTASectionPropsSchema.safeParse(props);
  if (!result.success) {
    console.warn("[CTASection] Props validation warning:", result.error.format());
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function CTASection({ initialCTA, routing }: CTASectionProps) {
  if (process.env.NODE_ENV === "development") {
    validateProps({ initialCTA, routing });
  }

  const cta = initialCTA;
  const sectionId = routing?.ctaSectionId ?? "cta";
  const contactPath = routing?.contactPagePath ?? DEFAULT_CONTACT_PATH;
  const tradeType = routing?.tradeEnquiryType ?? DEFAULT_TRADE_TYPE;

  const bgImage = initialCTA?.backgroundImageUrl
    ? getGoogleDriveImageUrl(initialCTA.backgroundImageUrl)
    : null;

  if (!cta) return null;

  const activeData = cta.pricing ?? cta.walkthrough;
  if (!activeData) return null;

  return (
    <section
      id={sectionId}
      className="py-16 md:py-24 bg-paper relative overflow-hidden"
      aria-labelledby="cta-heading"
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
        <div className="text-center mb-16 md:mb-24 max-w-4xl mx-auto bg-white/60 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-white/20">
          {/* Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-6 mx-auto"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Send className="w-8 h-8" />
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="uppercase tracking-[0.3em] text-sm text-gold-dark font-semibold">
              {activeData.subtitle}
            </span>
            <Sparkles className="w-4 h-4 text-gold" />
          </motion.div>

          <motion.h2
            id="cta-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-brown mb-6 font-heading leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {activeData.title}
          </motion.h2>

          <motion.p
            className="text-lg text-deep-brown/80 leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {activeData.description}
          </motion.p>
        </div>

        {/* Action Area */}
        {cta.pricing ? (
          <PricingForm pricing={cta.pricing} contactPath={contactPath} tradeType={tradeType} />
        ) : cta.walkthrough ? (
          <WalkthroughButton walkthrough={cta.walkthrough} contactPath={contactPath} />
        ) : null}

        {/* Quick Contact Options */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        ></motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface WalkthroughButtonProps {
  walkthrough: WalkthroughCTA;
  contactPath: string;
}

function WalkthroughButton({ walkthrough, contactPath }: WalkthroughButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(contactPath);
  };

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold text-white font-semibold text-lg hover:shadow-xl hover:bg-gold-dark transition-all duration-300 hover:scale-105"
      >
        {walkthrough.buttonText}
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

interface PricingFormProps {
  pricing: PricingCTA;
  contactPath: string;
  tradeType: string;
}

function PricingForm({ pricing, contactPath, tradeType }: PricingFormProps) {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");

    if (email && typeof email === "string") {
      const encodedEmail = encodeURIComponent(email);
      router.push(`${contactPath}?type=${tradeType}&email=${encodedEmail}`);
    }
  };

  return (
    <motion.form
      className="max-w-xl mx-auto"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            id="cta-email"
            name="email"
            type="email"
            placeholder={pricing.emailPlaceholder ?? "Enter your business email"}
            className="w-full pl-12 pr-4 py-4 border-2 border-border rounded-full focus:outline-none focus:border-gold bg-white text-lg"
            required
            autoComplete="email"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-deep-brown text-white font-semibold text-lg hover:shadow-xl hover:bg-raisin-purple transition-all duration-300 hover:scale-105 whitespace-nowrap"
        >
          {pricing.buttonText}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.form>
  );
}
