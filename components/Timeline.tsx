"use client";

import { motion } from "framer-motion";
import { urlFor } from "@/lib/sanity/client-browser";
import { z } from "zod";
import type { SanityImageSource } from "@sanity/image-url";
import { LeafIcon } from "@/components/assets/Decorations";
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
  const sortedEntries = [...entries].sort((a, b) => a.year - b.year);

  return (
    <div className="relative py-16 md:py-24 overflow-hidden">
      {/* Central Line (Desktop) */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gold/30 hidden md:block -translate-x-1/2" />

      <div className="space-y-16 md:space-y-0">
        {sortedEntries.map((entry, index) => {
          const isEven = index % 2 === 0;
          const stepNumber = index + 1;
          const decorativeImg =
            DECORATIVE_IMAGES[index % DECORATIVE_IMAGES.length] || DECORATIVE_IMAGES[0];

          // Animation directions
          const contentSlideX = isEven ? 60 : -60;
          const imageSlideX = isEven ? -60 : 60;

          return (
            <div
              key={entry.year}
              className={`relative flex flex-col md:flex-row items-center md:min-h-[400px] ${
                isEven ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image Side with Decorative Blob Shape */}
              <motion.div
                className="w-full md:w-1/2 px-4 md:px-8 mb-8 md:mb-0 flex justify-center"
                initial={{ opacity: 0, x: imageSlideX }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <div className="relative">
                  {/* Decorative blob background */}
                  <div
                    className="absolute -inset-4 md:-inset-6"
                    style={{
                      background: "#f5f0e8",
                      borderRadius: isEven
                        ? "60% 40% 55% 45% / 55% 60% 40% 45%"
                        : "40% 60% 45% 55% / 45% 40% 60% 55%",
                      transform: `rotate(${isEven ? -5 : 5}deg)`,
                    }}
                  />

                  {/* Decorative leaves/elements */}
                  <div
                    className={`absolute ${isEven ? "-top-4 -left-8" : "-top-4 -right-8"} text-gold/40 hidden md:block z-10`}
                    style={{ transform: `rotate(${isEven ? -30 : 30}deg)` }}
                  >
                    <LeafIcon className="w-12 h-12" />
                  </div>
                  <div
                    className={`absolute ${isEven ? "-bottom-4 -right-6" : "-bottom-4 -left-6"} hidden md:block z-10`}
                    style={{ transform: `rotate(${isEven ? 45 : -45}deg)` }}
                  >
                    <div className="relative w-12 h-12">
                      <OptimizedImage
                        src={decorativeImg?.src || ""}
                        alt=""
                        fill
                        className="object-contain drop-shadow-md grayscale-[0.2]"
                        sizes="48px"
                      />
                    </div>
                  </div>

                  {/* Image container with organic border */}
                  <div
                    className="relative w-[320px] h-[230px] md:w-[420px] md:h-[300px] lg:w-[480px] lg:h-[340px] overflow-hidden shadow-xl group"
                    style={{
                      borderRadius: isEven
                        ? "55% 45% 50% 50% / 50% 55% 45% 50%"
                        : "45% 55% 50% 50% / 50% 45% 55% 50%",
                      border: "4px solid white",
                    }}
                  >
                    {entry.imageUrl ? (
                      <OptimizedImage
                        src={getGoogleDriveImageUrl(entry.imageUrl) || ""}
                        alt={`${entry.title} - ${entry.year}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 320px, (max-width: 1024px) 420px, 480px"
                      />
                    ) : entry.image ? (
                      <OptimizedImage
                        src={urlFor(entry.image).width(600).height(450).url()}
                        alt={`${entry.title} - ${entry.year}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 320px, (max-width: 1024px) 420px, 480px"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: "#f5f0e8",
                        }}
                      >
                        <div className="text-gold/20">
                          <svg
                            className="w-16 h-16"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
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

              {/* Center Timeline Element - Numbered Circle */}
              <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center z-20">
                <motion.div
                  className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-white"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                >
                  {stepNumber}
                </motion.div>
              </div>

              {/* Content Side */}
              <motion.div
                className="w-full md:w-1/2 px-4 md:px-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.1 }}
              >
                <div
                  className={`text-center ${isEven ? "md:text-left md:pl-8" : "md:text-right md:pr-8"}`}
                >
                  {/* Decorative Icon - fades down */}
                  <motion.div
                    className={`mb-4 ${isEven ? "md:text-left" : "md:text-right"}`}
                    variants={{
                      hidden: { opacity: 0, y: -20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  >
                    <div className={`inline-block ${isEven ? "" : "md:ml-auto"}`}>
                      <div className="relative w-14 h-14 md:w-16 md:h-16">
                        <OptimizedImage
                          src={decorativeImg?.src || ""}
                          alt=""
                          fill
                          className="object-contain opacity-80 drop-shadow-md grayscale-[0.2]"
                          sizes="(max-width: 768px) 56px, 64px"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Year Badge - slides from one side */}
                  <motion.div
                    className={`inline-block mb-4 ${isEven ? "" : "md:ml-auto"}`}
                    variants={{
                      hidden: { opacity: 0, x: contentSlideX },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
                  >
                    <div className="px-6 py-2 rounded-full border-2 border-gold bg-white shadow-sm">
                      <span className="text-xl font-bold text-deep-brown font-heading">
                        {entry.year}
                      </span>
                    </div>
                  </motion.div>

                  {/* Title - slides from opposite side */}
                  <motion.h3
                    className="text-2xl md:text-3xl font-bold text-deep-brown mb-4 font-heading"
                    variants={{
                      hidden: { opacity: 0, x: -contentSlideX },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                  >
                    {entry.title}
                  </motion.h3>

                  {/* Description - fades up from bottom */}
                  {entry.description ? (
                    <motion.p
                      className="text-text-muted leading-relaxed text-base md:text-lg max-w-md mx-auto md:mx-0"
                      style={{ marginLeft: isEven ? undefined : "auto" }}
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
                    >
                      {entry.description}
                    </motion.p>
                  ) : null}
                </div>
              </motion.div>

              {/* Mobile Step Number */}
              <div className="md:hidden absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white font-bold text-sm shadow-lg">
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
