"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NutIcon } from "@/components/assets/Decorations";
import TextReveal from "@/components/ui/TextReveal";
import { z } from "zod";

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const QuoteSchema = z.object({
  quote: z.string(),
  author: z.string(),
  linkText: z.string(),
  linkUrl: z.string(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LabelsSchema = z.object({
  spiralQuoteSection: z.object({
    buttonText: z.string().optional(),
  }),
  navigation: z.object({
    aboutUrl: z.string().optional(),
  }),
});

// =============================================================================
// TYPES
// =============================================================================

type QuoteData = z.infer<typeof QuoteSchema>;
type Labels = z.infer<typeof LabelsSchema>;

interface SpiralQuoteProps {
  initialQuote: QuoteData;
  labels: Labels;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function SpiralQuote({ initialQuote, labels }: SpiralQuoteProps) {
  // Safe access with fallbacks
  const buttonText = labels.spiralQuoteSection?.buttonText || "Discover Our Story";
  const aboutUrl = labels.navigation?.aboutUrl || "/about";

  return (
    <section className="py-24 bg-ivory overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-6 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Spiral Animation */}
          <div className="relative flex justify-center items-center h-[500px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-[400px] h-[400px] border border-gold/20 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-[300px] h-[300px] border border-gold/30 rounded-full"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute w-[200px] h-[200px] border border-gold/40 rounded-full"
            />

            <Link href={aboutUrl} className="relative z-20 group cursor-pointer">
              <div className="w-48 h-48 rounded-full bg-deep-brown flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
                <NutIcon className="w-24 h-24 text-gold opacity-20 absolute" />
                <p className="text-white text-center px-4 font-heading text-xl relative z-10 group-hover:scale-110 transition-transform">
                  {buttonText}
                </p>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-gold scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
            </Link>
          </div>

          {/* Quote */}
          <div className="text-center lg:text-left">
            <motion.span
              className="text-6xl text-gold font-serif leading-none block mb-2"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
            >
              &quot;
            </motion.span>
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-brown font-heading leading-tight mb-6 -mt-2">
              <TextReveal
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-brown font-heading leading-tight mb-6 -mt-2 inline-block"
                delay={0}
                duration={0.8}
              >
                {initialQuote.quote}
              </TextReveal>
            </div>
            <motion.p
              className="text-lg text-(--color-slate) italic mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
            >
              — {initialQuote.author}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href={initialQuote.linkUrl}
                className="inline-flex items-center gap-2 text-deep-brown font-semibold border-b-2 border-gold pb-1 hover:text-gold transition-colors"
              >
                {initialQuote.linkText}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
