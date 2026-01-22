"use client";

import { motion, type MotionStyle } from "framer-motion";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { urlFor } from "@/lib/sanity/client-browser";
import type { SanityImageSource } from "@sanity/image-url";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface ContentBannerData {
  _key?: string;
  eyebrow?: string;
  title?: string;
  highlight?: string;
  description?: string;
  features?: string[];
  layout?: "bottom-image" | "right-image" | "left-image" | "background-image" | "text-only";
  imageUrl?: string;
  image?: SanityImageSource;
  bgOverlay?: "none" | "black-10" | "black-20" | "black-40" | "white-10";
  theme?: "light" | "dark";
}

interface ContentBannerProps {
  data: ContentBannerData;
  className?: string;
  priority?: boolean;
}

interface FloatingStarProps {
  className?: string;
  delay?: number;
  duration?: number;
}

interface FloatingImageProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
}

// =============================================================================
// SUB-COMPONENTS (Defined outside render to fix React warnings)
// =============================================================================

const FloatingStar = ({ className, delay = 0, duration = 4 }: FloatingStarProps) => (
  <motion.div
    className={cn("absolute text-gold/40 pointer-events-none z-0", className)}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      scale: [1, 1.1, 1],
      opacity: [0.4, 0.8, 0.4],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay,
    }}
  >
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  </motion.div>
);

const FloatingImage = ({ src, className, style, delay = 0, duration = 4 }: FloatingImageProps) => (
  <motion.div
    className={cn("absolute pointer-events-none z-0 opacity-90", className)}
    style={style as MotionStyle}
    animate={{
      y: [0, -25, 0],
      rotate: [0, 15, -15, 0],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay,
    }}
  >
    <div className="relative w-full h-full">
      <OptimizedImage
        src={src}
        alt=""
        fill
        className="object-contain drop-shadow-lg"
        sizes="100px"
      />
    </div>
  </motion.div>
);

// =============================================================================
// COMPONENT
// =============================================================================

export default function ContentBanner({ data, className, priority = false }: ContentBannerProps) {
  const {
    eyebrow,
    title,
    highlight,
    description,
    features = [],
    layout = "bottom-image",
    imageUrl,
    image,
    bgOverlay = "black-20",
    theme = "light",
  } = data;

  // Priority: imageUrl (Google Drive) > image (Sanity)
  const processedImageUrl = imageUrl
    ? getGoogleDriveImageUrl(imageUrl)
    : image
      ? urlFor(image).url()
      : null;

  const isDarkTheme = theme === "dark";

  // ===========================================================================
  // THEME & COLORS
  // ===========================================================================

  // Background Colors (Full Width)
  const bgClasses = cn(
    "relative w-full overflow-hidden transition-colors duration-500",
    layout === "background-image"
      ? "min-h-[60vh] lg:min-h-[70vh] flex items-center"
      : "min-h-[60vh] lg:min-h-[70vh] flex items-center py-12 md:py-16",
    // Theme backgrounds for non-image-bg layouts
    layout !== "background-image" && isDarkTheme ? "bg-[#5D4037]" : "",
    layout !== "background-image" && !isDarkTheme ? "bg-ivory" : "",
    className
  );

  // Text Colors
  const isLightText = isDarkTheme || layout === "background-image";
  const textColor = isLightText ? "!text-[#f5f1e8]" : "!text-deep-brown";
  const descColor = isLightText ? "!text-[#f5f1e8]/90" : "!text-slate-600";
  const eyebrowColor = isLightText ? "!text-[#e0c895]" : "!text-gold-dark";
  const highlightColor = "text-gold";

  // ===========================================================================
  // FLOATING ELEMENTS (DECORATIONS)
  // ===========================================================================

  const FLOATING_IMAGES = [
    // Top Left Area (Prominent)
    {
      src: "/almond.png",
      className: "w-14 h-14 md:w-24 md:h-24",
      top: "5%",
      left: "3%",
      delay: 0,
      duration: 7,
    },
    // Top Right Area (Prominent)
    {
      src: "/cashewsingle.png",
      className: "w-12 h-12 md:w-20 md:h-20",
      top: "10%",
      right: "5%",
      delay: 1.5,
      duration: 6,
    },
    // Bottom Left Area (Prominent)
    {
      src: "/walnut.png",
      className: "w-16 h-16 md:w-28 md:h-28",
      bottom: "8%",
      left: "4%",
      delay: 0.5,
      duration: 8,
    },
    // Bottom Right Area (Prominent)
    {
      src: "/hazelnut.png",
      className: "w-12 h-12 md:w-20 md:h-20",
      bottom: "12%",
      right: "6%",
      delay: 2,
      duration: 5.5,
    },

    // Spread across (Middle/Inner edges)
    {
      src: "/dates.png",
      className: "w-10 h-10 md:w-16 md:h-16 opacity-70",
      top: "45%",
      left: "2%",
      delay: 3,
      duration: 9,
    },
    {
      src: "/raisin.png",
      className: "w-8 h-8 md:w-12 md:h-12 opacity-60",
      top: "55%",
      right: "2%",
      delay: 1,
      duration: 6.5,
    },
    {
      src: "/almond.png",
      className: "w-8 h-8 md:w-12 md:h-12 opacity-40 hidden lg:block",
      top: "15%",
      left: "40%",
      delay: 2,
      duration: 10,
    },
    {
      src: "/cashewsingle.png",
      className: "w-6 h-6 md:w-10 md:h-10 opacity-30 hidden lg:block",
      bottom: "25%",
      left: "45%",
      delay: 4,
      duration: 12,
    },
  ];

  const FloatingElements = isDarkTheme ? (
    <>
      {/* Stars - Background Layer */}
      <FloatingStar className="top-[5%] left-[10%] w-12 h-12 opacity-60" delay={0} duration={5} />
      <FloatingStar
        className="top-[25%] right-[12%] w-8 h-8 opacity-40"
        delay={1.5}
        duration={4.5}
      />
      <FloatingStar
        className="bottom-[15%] left-[8%] w-10 h-10 opacity-50"
        delay={0.5}
        duration={6}
      />
      <FloatingStar
        className="bottom-[40%] right-[3%] w-6 h-6 opacity-30"
        delay={2}
        duration={3.5}
      />
      <FloatingStar
        className="top-[35%] left-[30%] w-5 h-5 opacity-20 hidden lg:block"
        delay={4}
        duration={8}
      />

      {/* Images - More Prominent Layer */}
      {FLOATING_IMAGES.map((img, idx) => (
        <FloatingImage
          key={idx}
          src={img.src}
          className={img.className}
          style={{ top: img.top, left: img.left, right: img.right, bottom: img.bottom }}
          delay={img.delay}
          duration={img.duration}
        />
      ))}
    </>
  ) : null;

  // ===========================================================================
  // CONTENT BLOCKS
  // ===========================================================================

  const ContentBlock = (
    <div className="relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-6 md:space-y-8"
      >
        {/* Eyebrow */}
        {eyebrow ? (
          <div className="flex items-center gap-3">
            <span
              className={cn("h-px w-8 md:w-12", isLightText ? "bg-gold" : "bg-deep-brown/30")}
            />
            <p
              className={cn(
                "text-xs md:text-sm font-bold tracking-[0.2em] uppercase",
                eyebrowColor
              )}
            >
              {eyebrow}
            </p>
          </div>
        ) : null}

        {/* Title */}
        {title ? (
          <h2
            className={cn(
              "text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight font-heading",
              textColor
            )}
          >
            {title}
            {highlight ? (
              <span className={cn("block mt-2 italic font-serif", highlightColor)}>
                {highlight}
              </span>
            ) : null}
          </h2>
        ) : null}

        {/* Divider (only for centered layouts) */}
        {layout === "bottom-image" || layout === "text-only" ? (
          <div className="w-20 h-1.5 bg-gold mx-auto rounded-full opacity-80" />
        ) : null}

        {/* Description */}
        {description ? (
          <p
            className={cn(
              "text-lg md:text-xl leading-relaxed max-w-xl",
              layout === "bottom-image" || layout === "text-only" ? "mx-auto" : "",
              descColor
            )}
          >
            {description}
          </p>
        ) : null}

        {/* Features */}
        {features.length > 0 ? (
          <div
            className={cn(
              "flex flex-wrap gap-x-6 gap-y-3 pt-4",
              layout === "bottom-image" || layout === "text-only" ? "justify-center" : ""
            )}
          >
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 group">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gold/20 text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span
                  className={cn(
                    "text-sm font-bold tracking-wide uppercase",
                    isLightText ? "text-[#f5f1e8]/90!" : "text-deep-brown!"
                  )}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </motion.div>
    </div>
  );

  const ImageBlock = processedImageUrl ? (
    <div
      className={cn(
        "relative overflow-hidden isolate",
        // Different styling per layout
        layout === "bottom-image"
          ? "mt-16 w-full max-w-5xl mx-auto rounded-2xl shadow-2xl aspect-video"
          : "",
        layout === "right-image" || layout === "left-image"
          ? "w-full flex items-center justify-center p-4 lg:p-12"
          : "",
        layout === "background-image" ? "absolute inset-0 z-0" : ""
      )}
    >
      <OptimizedImage
        src={processedImageUrl}
        alt={title || "Banner image"}
        fill={layout === "background-image" || layout === "bottom-image"}
        width={!(layout === "background-image" || layout === "bottom-image") ? 800 : undefined}
        height={!(layout === "background-image" || layout === "bottom-image") ? 600 : undefined}
        className={cn(
          "transition-transform duration-1000 hover:scale-105",
          layout === "right-image" || layout === "left-image"
            ? "w-auto h-auto max-w-full max-h-[50vh] object-contain"
            : "object-cover"
        )}
        priority={priority}
        sizes={layout === "background-image" ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
      />

      {/* Overlay for bg image */}
      {layout === "background-image" ? (
        <div
          className={cn(
            "absolute inset-0 z-10",
            bgOverlay === "black-10" && "bg-black/10",
            bgOverlay === "black-20" && "bg-black/20",
            bgOverlay === "black-40" && "bg-black/40",
            bgOverlay === "white-10" && "bg-white/10"
          )}
        />
      ) : null}
    </div>
  ) : null;

  // ===========================================================================
  // RENDER LAYOUTS
  // ===========================================================================

  // 1. Full Background Image Layout (Original "Overlay" style)
  if (layout === "background-image") {
    return (
      <div className={bgClasses}>
        {ImageBlock}
        {FloatingElements}
        <div className="container mx-auto px-4 md:px-8 relative z-20">{ContentBlock}</div>
      </div>
    );
  }

  // 2. Split Layouts (Left/Right) - "Hero Style"
  if (layout === "right-image" || layout === "left-image") {
    return (
      <div className={bgClasses}>
        {FloatingElements}
        <div className="container mx-auto px-4 md:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Logic: If left-image, Image goes first. If right-image, Content goes first. */}
            <div
              className={cn(layout === "left-image" ? "order-last lg:order-first" : "order-first")}
            >
              {layout === "left-image" ? ImageBlock : ContentBlock}
            </div>
            <div
              className={cn(layout === "left-image" ? "order-first lg:order-last" : "order-last")}
            >
              {layout === "left-image" ? ContentBlock : ImageBlock}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Stacked/Bottom Layouts
  return (
    <div className={bgClasses}>
      {FloatingElements}
      <div className="container mx-auto px-4 md:px-6 lg:px-10 text-center">
        <div className="max-w-4xl mx-auto">{ContentBlock}</div>
        {ImageBlock}
      </div>
    </div>
  );
}
