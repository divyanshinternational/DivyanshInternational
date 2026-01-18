"use client";

/**
 * CTA Section Component
 *
 * Displays call-to-action cards for walkthrough and pricing inquiries.
 * Uses framer-motion for animations - requires client component.
 *
 * All content is passed via props from parent components that fetch from Sanity CMS.
 * Data is validated with Zod schemas for runtime type safety.
 */

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { z } from "zod";

import { AlmondIcon, CashewIcon, WalnutIcon, PeanutIcon } from "@/components/assets/Decorations";

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
  walkthrough: WalkthroughCTASchema.optional(),
  pricing: PricingCTASchema.optional(),
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
// TYPE DEFINITIONS (Inferred from Zod Schemas)
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
  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    validateProps({ initialCTA, routing });
  }

  const cta = initialCTA;
  const sectionId = routing?.ctaSectionId ?? "cta";
  const contactPath = routing?.contactPagePath ?? DEFAULT_CONTACT_PATH;
  const tradeType = routing?.tradeEnquiryType ?? DEFAULT_TRADE_TYPE;

  if (!cta) return null;

  return (
    <section
      id={sectionId}
      className="py-20 bg-linear-to-b from-ivory to-beige relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Floating Decorations */}
      <DecorativeBackground />

      <div className="container mx-auto px-4 md:px-6 lg:px-10 grid lg:grid-cols-2 gap-8 relative z-10">
        {/* Walkthrough CTA Card */}
        {cta.walkthrough ? (
          <WalkthroughCard walkthrough={cta.walkthrough} contactPath={contactPath} />
        ) : null}

        {/* Pricing CTA Card */}
        {cta.pricing ? (
          <PricingCard pricing={cta.pricing} contactPath={contactPath} tradeType={tradeType} />
        ) : null}
      </div>
    </section>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface WalkthroughCardProps {
  walkthrough: WalkthroughCTA;
  contactPath: string;
}

function WalkthroughCard({ walkthrough, contactPath }: WalkthroughCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(contactPath);
  };

  return (
    <div className="bg-linear-to-br from-white to-cashew-cream p-8 rounded-3xl border-2 border-gold-light shadow-xl hover:shadow-2xl transition-all duration-300">
      <motion.p
        className="uppercase tracking-[0.4em] text-xs text-(--color-muted) mb-4 font-bold"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {walkthrough.subtitle}
      </motion.p>
      <motion.h3
        className="text-2xl font-bold text-(--color-graphite) mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {walkthrough.title}
      </motion.h3>
      <motion.div
        className="text-(--color-slate) mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p>{walkthrough.description}</p>
      </motion.div>
      <button
        type="button"
        onClick={handleClick}
        className="px-8 py-3 rounded-full bg-linear-to-r from-almond-gold to-gold-dark text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
      >
        {walkthrough.buttonText}
      </button>
    </div>
  );
}

interface PricingCardProps {
  pricing: PricingCTA;
  contactPath: string;
  tradeType: string;
}

function PricingCard({ pricing, contactPath, tradeType }: PricingCardProps) {
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
    <div className="bg-linear-to-br from-white to-cashew-cream p-8 rounded-3xl border-2 border-gold-light shadow-xl hover:shadow-2xl transition-all duration-300">
      <motion.p
        className="uppercase tracking-[0.4em] text-xs text-(--color-muted) mb-4 font-bold"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {pricing.subtitle}
      </motion.p>
      <motion.h3
        className="text-2xl font-bold text-(--color-graphite) mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {pricing.title}
      </motion.h3>
      <motion.div
        className="text-(--color-slate) mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p>{pricing.description}</p>
      </motion.div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label htmlFor="cta-email" className="sr-only">
          Email Address
        </label>
        <input
          id="cta-email"
          name="email"
          type="email"
          placeholder={pricing.emailPlaceholder}
          className="px-4 py-3 border border-sand rounded-full focus:outline-2 focus:outline-gold"
          required
          autoComplete="email"
        />
        <button
          type="submit"
          className="px-8 py-3 rounded-full bg-linear-to-r from-deep-brown to-raisin-purple text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          {pricing.buttonText}
        </button>
      </form>
    </div>
  );
}

function DecorativeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <motion.div
        animate={{ rotate: [0, 14, -14, 0], y: [0, 12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-20 opacity-15"
      >
        <AlmondIcon className="w-28 h-28" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -12, 12, 0], x: [0, 10, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute bottom-20 left-20 opacity-15"
      >
        <CashewIcon className="w-26 h-26" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/4 opacity-12"
      >
        <WalnutIcon className="w-24 h-24" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 13, -13, 0], y: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 4 }}
        className="absolute bottom-1/3 right-1/4 opacity-15"
      >
        <PeanutIcon className="w-22 h-22" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -12, 12, 0], x: [0, 10, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear", delay: 6 }}
        className="absolute top-1/3 left-1/3 opacity-12"
      >
        <AlmondIcon className="w-26 h-26" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 14, -14, 0], y: [0, 12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 7 }}
        className="absolute bottom-20 left-1/4 opacity-15"
      >
        <CashewIcon className="w-24 h-24" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute top-1/4 right-1/3 opacity-12"
      >
        <WalnutIcon className="w-22 h-22" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -11, 11, 0], y: [0, -10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 8 }}
        className="absolute top-5 left-1/4 opacity-10"
      >
        <AlmondIcon className="w-20 h-20" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 12, -12, 0], x: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 9 }}
        className="absolute bottom-5 right-1/4 opacity-12"
      >
        <PeanutIcon className="w-22 h-22" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -360], scale: [1, 1.12, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 3 }}
        className="absolute top-1/2 left-5 opacity-8"
      >
        <CashewIcon className="w-18 h-18" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.08, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 4 }}
        className="absolute bottom-1/2 right-5 opacity-8"
      >
        <WalnutIcon className="w-18 h-18" />
      </motion.div>
    </div>
  );
}
