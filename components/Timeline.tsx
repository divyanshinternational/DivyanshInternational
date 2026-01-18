"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/client-browser";
import { z } from "zod";
import type { SanityImageSource } from "@sanity/image-url";

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TimelineEntrySchema = z.object({
  year: z.number(),
  title: z.string(),
  description: z.string().optional(),
  image: z.custom<SanityImageSource>().optional(),
});

// =============================================================================
// TYPES
// =============================================================================

type TimelineEntry = z.infer<typeof TimelineEntrySchema>;

interface TimelineProps {
  entries: TimelineEntry[];
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function Timeline({ entries }: TimelineProps) {
  const sortedEntries = [...entries].sort((a, b) => a.year - b.year);

  return (
    <div className="relative py-20 overflow-hidden">
      {/* Central Line (Desktop) */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-sand hidden md:block -translate-x-1/2" />

      <div className="space-y-24">
        {sortedEntries.map((entry, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={entry.year}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`relative flex flex-col md:flex-row items-center ${
                isEven ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Content Side */}
              <div className="w-full md:w-1/2 px-4 md:px-12 mb-8 md:mb-0">
                <div className={`text-center ${isEven ? "md:text-left" : "md:text-right"}`}>
                  <div className="inline-block mb-6">
                    <div className="border-2 border-gold px-6 py-3 rounded-lg bg-white relative z-10 shadow-sm">
                      <span className="text-3xl font-bold text-deep-brown font-heading block leading-none">
                        {entry.year}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-deep-brown mb-4 font-heading">
                    {entry.title}
                  </h3>
                  {entry.description ? (
                    <p className="text-(--color-slate) leading-relaxed text-lg font-sans">
                      {entry.description}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Center Dot */}
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-gold rounded-full border-4 border-white shadow-md z-20 hidden md:block ring-1 ring-sand/30" />

              {/* Image Side */}
              <div className="w-full md:w-1/2 px-4 md:px-12">
                <div className="relative aspect-4/3 bg-sand rounded-2xl overflow-hidden shadow-xl group hover:shadow-2xl transition-shadow duration-500">
                  {entry.image ? (
                    <Image
                      src={urlFor(entry.image).width(800).height(600).url()}
                      alt={`${entry.title} - ${entry.year}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <>
                      {/* CSS-only Pattern (No external requests) */}
                      <div className="absolute inset-0 opacity-10 bg-deep-brown">
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle, #C9A66B 2px, transparent 2.5px)",
                            backgroundSize: "24px 24px",
                          }}
                        />
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-gold opacity-30 transform group-hover:scale-110 transition-transform duration-700">
                          <svg
                            className="w-24 h-24"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
