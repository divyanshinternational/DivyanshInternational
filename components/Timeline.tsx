"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { urlFor } from "@/lib/sanity/client-browser";
import { z } from "zod";
import type { SanityImageSource } from "@sanity/image-url";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import OptimizedImage from "@/components/ui/OptimizedImage";

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TimelineEntrySchema = z.object({
  year: z.number(),
  title: z.string(),
  description: z.string().optional(),
  image: z.custom<SanityImageSource>().optional(),
  imageUrl: z.string().optional().nullable(),
});

// =============================================================================
// TYPES
// =============================================================================

type TimelineEntry = z.infer<typeof TimelineEntrySchema>;

interface TimelineProps {
  entries: TimelineEntry[];
}

const DECORATIVE_IMAGES = [
  { src: "/almond.png", label: "almond" },
  { src: "/cashewsingle.png", label: "cashew" },
  { src: "/walnut.png", label: "walnut" },
  { src: "/hazelnut.png", label: "hazelnut" },
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function Timeline({ entries }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const sortedEntries = [...entries].sort((a, b) => a.year - b.year);

  return (
    <div ref={containerRef} className="relative py-16 md:py-32 overflow-hidden">
      {/* Central Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gold/10 hidden md:block -translate-x-1/2" />
      <motion.div
        className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gold hidden md:block -translate-x-1/2 origin-top"
        style={{ scaleY: pathLength }}
      />

      <div className="space-y-24 md:space-y-0 relative z-10">
        {sortedEntries.map((entry, index) => {
          const isEven = index % 2 === 0;
          const stepNumber = index + 1;
          const decorativeImg =
            DECORATIVE_IMAGES[index % DECORATIVE_IMAGES.length] || DECORATIVE_IMAGES[0];

          // Animation directions
          const contentSlideX = isEven ? 40 : -40;
          const imageSlideX = isEven ? -40 : 40;

          return (
            <div
              key={entry.year}
              className={`relative flex flex-col md:flex-row items-center md:min-h-[400px] ${
                isEven ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image Side */}
              <motion.div
                className="w-full md:w-1/2 px-4 md:px-12 mb-12 md:mb-0 flex justify-center"
                initial={{ opacity: 0, x: imageSlideX, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.01, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="relative group/img">
                  {/* Decorative elements */}
                  <motion.div
                    className={`absolute ${isEven ? "-bottom-6 -right-10" : "-bottom-6 -left-10"} hidden lg:block z-10`}
                    style={{ rotate: isEven ? 35 : -35 }}
                    animate={{
                      y: [0, -15, 0],
                      rotate: isEven ? [35, 40, 35] : [-35, -40, -35],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="relative w-16 h-16 pointer-events-none">
                      <OptimizedImage
                        src={decorativeImg?.src || ""}
                        alt=""
                        fill
                        className="absolute inset-0"
                        imageClassName="object-scale-down drop-shadow-2xl grayscale-[0.1] opacity-90"
                        quality={100}
                        sizes="64px"
                      />
                    </div>
                  </motion.div>

                  {/* Image container */}
                  <div className="relative overflow-visible">
                    {entry.imageUrl ? (
                      <OptimizedImage
                        src={getGoogleDriveImageUrl(entry.imageUrl) || ""}
                        alt={`${entry.title} - ${entry.year}`}
                        width={800}
                        height={600}
                        className="w-auto h-auto max-w-full md:max-w-[500px] lg:max-w-[600px] transition-all duration-700"
                        imageClassName="w-full h-full object-scale-down rounded-2xl shadow-none group-hover/img:shadow-xl group-hover/img:scale-[1.03] transition-all duration-700"
                        priority
                        quality={100}
                        overflowVisible={true}
                      />
                    ) : entry.image ? (
                      <OptimizedImage
                        src={urlFor(entry.image).width(800).auto("format").url()}
                        alt={`${entry.title} - ${entry.year}`}
                        width={800}
                        height={600}
                        className="w-auto h-auto max-w-full md:max-w-[500px] lg:max-w-[600px] transition-all duration-700"
                        imageClassName="w-full h-full object-scale-down rounded-2xl shadow-none group-hover/img:shadow-xl group-hover/img:scale-[1.03] transition-all duration-700"
                        priority
                        quality={100}
                        overflowVisible={true}
                      />
                    ) : (
                      <div className="w-80 h-60 flex items-center justify-center rounded-2xl border-2 border-dashed border-gold/20 bg-beige/30">
                        <div className="text-gold/20">
                          <svg
                            className="w-16 h-16"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Center Timeline Element */}
              <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center z-20">
                <motion.div
                  className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white font-bold text-lg shadow-xl ring-4 ring-white"
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true, amount: 0.01, margin: "-50px" }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.3,
                  }}
                  whileHover={{ scale: 1.2, backgroundColor: "#3b2f2f", color: "#c5a059" }}
                >
                  {stepNumber}
                </motion.div>
                <motion.div
                  className="absolute -inset-2 rounded-full border border-gold/40 -z-10"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              </div>

              {/* Content Side with Staggered Entrances */}
              <motion.div
                className="w-full md:w-1/2 px-4 md:px-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.01, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.15,
                    },
                  },
                }}
              >
                <div
                  className={`text-center ${isEven ? "md:text-left md:pl-12" : "md:text-right md:pr-12"}`}
                >
                  {/* Decorative Icon */}
                  <motion.div
                    className={`mb-6 ${isEven ? "" : "flex justify-end"}`}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="relative w-16 h-16 md:w-20 md:h-20">
                        <OptimizedImage
                          src={decorativeImg?.src || ""}
                          alt=""
                          fill
                          className="absolute inset-0"
                          imageClassName="object-scale-down opacity-40 drop-shadow-xl grayscale-[0.2]"
                          quality={100}
                          sizes="80px"
                        />
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Year Badge */}
                  <motion.div
                    className={`inline-block mb-6 ${isEven ? "" : "md:ml-auto"}`}
                    variants={{
                      hidden: { opacity: 0, x: contentSlideX },
                      visible: { opacity: 1, x: 0 },
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="px-8 py-2 rounded-full bg-gold text-white flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span className="text-2xl font-bold font-heading tracking-tighter">
                        {entry.year}
                      </span>
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    className="text-3xl md:text-5xl font-bold text-deep-brown mb-6 font-heading leading-tight"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    {entry.title}
                  </motion.h3>

                  {/* Description */}
                  {entry.description ? (
                    <motion.p
                      className="text-text-muted leading-relaxed text-lg md:text-xl max-w-xl mx-auto md:mx-0 font-medium"
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      {entry.description}
                    </motion.p>
                  ) : null}
                </div>
              </motion.div>

              {/* Mobile Step Number Indicator */}
              <div className="md:hidden absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 bg-white p-2 rounded-full shadow-md z-20">
                <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white font-bold text-sm">
                  {stepNumber}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
