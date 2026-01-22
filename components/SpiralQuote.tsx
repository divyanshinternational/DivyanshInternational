"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import TextReveal from "@/components/ui/TextReveal";
import DecorativeBackground from "@/components/ui/DecorativeBackground";
import { z } from "zod";

import { getGoogleDriveImageUrl } from "@/lib/utils";
import OptimizedImage from "@/components/ui/OptimizedImage";

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
    backgroundImageUrl: z.string().optional(),
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

  // Prepare background image if available
  const bgImage = labels.spiralQuoteSection?.backgroundImageUrl
    ? getGoogleDriveImageUrl(labels.spiralQuoteSection.backgroundImageUrl)
    : null;

  return (
    <section className="py-16 md:py-24 bg-bg relative overflow-hidden">
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
      <DecorativeBackground variant="minimal" />

      <div className="container mx-auto px-4 md:px-6 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Spiral Animation */}
          <div className="relative flex justify-center items-center h-[350px] lg:h-[450px]">
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
              <div className="w-48 h-48 rounded-full bg-deep-brown flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-105 shadow-xl">
                <Sparkles className="w-20 h-20 text-gold/30 absolute" />
                <span className="text-gold text-center px-6 font-heading text-xl leading-tight relative z-10 group-hover:scale-110 transition-transform drop-shadow-md">
                  {buttonText}
                </span>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-gold scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
            </Link>
          </div>

          {/* Quote with Glass Protection */}
          <div className="text-center lg:text-left bg-white/60 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-white/20">
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
              className="text-lg text-deep-brown/70 italic font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
            >
              — {initialQuote.author}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
