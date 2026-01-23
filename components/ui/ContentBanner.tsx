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
  _key?: string | undefined;
  eyebrow?: string | undefined;
  title?: string | undefined;
  highlight?: string | undefined;
  description?: string | undefined;
  features?: string[] | undefined;
  layout?:
    | "bottom-image"
    | "right-image"
    | "left-image"
    | "background-image"
    | "text-only"
    | undefined;
  imageUrl?: string | undefined;
  image?: SanityImageSource | undefined;
  bgOverlay?: "none" | "black-10" | "black-20" | "black-40" | "white-10" | undefined;
  theme?: "light" | "dark" | undefined;
  paragraphs?: string[] | undefined;
  stats?: { value: string; label: string }[] | undefined;
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
  priority?: boolean;
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const FloatingStar = ({ className, delay = 0, duration = 4 }: FloatingStarProps) => (
  <motion.div
    className={cn("absolute text-gold/40 pointer-events-none z-0", className)}
    animate={{
      x: [0, 20, -15, 10, 0],
      y: [0, -30, 15, -20, 0],
      rotate: [0, 360],
      scale: [1, 1.2, 0.9, 1.1, 1],
      opacity: [0.4, 0.8, 0.5, 0.7, 0.4],
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

const FloatingImage = ({
  src,
  className,
  style,
  delay = 0,
  duration = 4,
  priority = false,
}: FloatingImageProps) => (
  <motion.div
    className={cn("absolute pointer-events-none z-0 opacity-90", className)}
    style={style as MotionStyle}
    animate={{
      x: [0, 30, -20, 10, 0],
      y: [0, -35, 20, -25, 0],
      rotate: [0, 180, 360],
      scale: [1, 1.08, 0.95, 1.05, 1],
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
        className="drop-shadow-lg"
        imageClassName="object-scale-down"
        sizes="100px"
        quality={100}
        priority={priority}
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
    paragraphs,
    image,
    bgOverlay = "black-20",
    theme = "light",
  } = data;

  const processedImageUrl = imageUrl
    ? getGoogleDriveImageUrl(imageUrl)
    : image
      ? urlFor(image).url()
      : null;

  const isDarkTheme = theme === "dark";

  // ===========================================================================
  // THEME & COLORS
  // ===========================================================================

  // Background Colors
  const bgClasses = cn(
    "relative w-full transition-colors duration-500",
    layout === "background-image" ? "overflow-hidden" : "",
    "min-h-[60vh] lg:min-h-[70vh] flex items-center py-8 md:py-12",
    layout !== "background-image" && isDarkTheme ? "bg-[#5D4037]" : "",
    layout !== "background-image" && !isDarkTheme ? "bg-ivory" : "",
    layout === "background-image" ? "bg-[#3b2f2f]" : "",
    className
  );

  // Text Colors
  const isLightText = isDarkTheme || layout === "background-image";
  const textColor = isLightText ? "text-[#f5f1e8]!" : "text-deep-brown!";
  const descColor = isLightText ? "text-[#f5f1e8]/90!" : "text-deep-brown!";
  const eyebrowColor = isLightText ? "text-[#e0c895]!" : "text-gold-dark!";
  const highlightColor = "text-gold";

  // ===========================================================================
  // FLOATING ELEMENTS
  // ===========================================================================

  const FLOATING_IMAGES = [
    // Top Left Corner
    {
      src: "/almond.png",
      className: "w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 lg:w-24 lg:h-24",
      top: "3%",
      left: "2%",
      delay: 0,
      duration: 7,
    },
    // Top Left-Center
    {
      src: "/raisin.png",
      className: "w-6 h-6 sm:w-8 sm:h-8 md:w-11 md:h-11 opacity-65",
      top: "12%",
      left: "18%",
      delay: 2.5,
      duration: 8,
    },
    // Top Center
    {
      src: "/dates.png",
      className: "w-7 h-7 sm:w-10 sm:h-10 md:w-14 md:h-14 opacity-55 hidden sm:block",
      top: "8%",
      left: "45%",
      delay: 3.2,
      duration: 9,
    },
    // Top Right-Center
    {
      src: "/hazelnut.png",
      className: "w-6 h-6 sm:w-9 sm:h-9 md:w-12 md:h-12 opacity-60",
      top: "14%",
      right: "20%",
      delay: 1.8,
      duration: 7.5,
    },
    // Top Right Corner
    {
      src: "/cashewsingle.png",
      className: "w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20",
      top: "4%",
      right: "3%",
      delay: 1.5,
      duration: 6,
    },
    // Middle Left
    {
      src: "/walnut.png",
      className: "w-8 h-8 sm:w-11 sm:h-11 md:w-15 md:h-15 opacity-70",
      top: "38%",
      left: "5%",
      delay: 3,
      duration: 7.5,
    },
    // Middle Left-Center
    {
      src: "/cashewsingle.png",
      className: "w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 opacity-50 hidden sm:block",
      top: "45%",
      left: "28%",
      delay: 4.2,
      duration: 10,
    },
    // Middle Center
    {
      src: "/almond.png",
      className: "w-8 h-8 sm:w-11 sm:h-11 md:w-15 md:h-15 opacity-45 hidden md:block",
      top: "50%",
      left: "50%",
      delay: 2.8,
      duration: 11,
    },
    // Middle Right-Center
    {
      src: "/raisin.png",
      className: "w-6 h-6 sm:w-8 sm:h-8 md:w-11 md:h-11 opacity-55 hidden sm:block",
      top: "42%",
      right: "25%",
      delay: 3.8,
      duration: 9.5,
    },
    // Middle Right
    {
      src: "/dates.png",
      className: "w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 opacity-65",
      top: "48%",
      right: "4%",
      delay: 1,
      duration: 6.5,
    },
    // Bottom Left Corner
    {
      src: "/hazelnut.png",
      className: "w-12 h-12 sm:w-16 sm:h-16 md:w-22 md:h-22 lg:w-28 lg:h-28",
      bottom: "5%",
      left: "3%",
      delay: 0.5,
      duration: 8,
    },
    // Bottom Left-Center
    {
      src: "/walnut.png",
      className: "w-7 h-7 sm:w-9 sm:h-9 md:w-13 md:h-13 opacity-60",
      bottom: "12%",
      left: "22%",
      delay: 3.5,
      duration: 9,
    },
    // Bottom Center
    {
      src: "/cashewsingle.png",
      className: "w-6 h-6 sm:w-8 sm:h-8 md:w-11 md:h-11 opacity-50 hidden sm:block",
      bottom: "8%",
      left: "48%",
      delay: 4.5,
      duration: 10.5,
    },
    // Bottom Right-Center
    {
      src: "/almond.png",
      className: "w-7 h-7 sm:w-10 sm:h-10 md:w-13 md:h-13 opacity-55",
      bottom: "10%",
      right: "18%",
      delay: 2,
      duration: 8.5,
    },
    // Bottom Right Corner
    {
      src: "/raisin.png",
      className: "w-9 h-9 sm:w-12 sm:h-12 md:w-17 md:h-17 lg:w-20 lg:h-20",
      bottom: "6%",
      right: "4%",
      delay: 2,
      duration: 5.5,
    },
  ];

  const FloatingElements = isDarkTheme ? (
    <>
      {/* Stars */}
      <FloatingStar
        className="top-[8%] left-[12%] w-10 h-10 md:w-12 md:h-12 opacity-50"
        delay={0}
        duration={5}
      />
      <FloatingStar
        className="top-[20%] left-[45%] w-6 h-6 md:w-7 md:h-7 opacity-30 hidden sm:block"
        delay={3}
        duration={6}
      />
      <FloatingStar
        className="top-[15%] right-[15%] w-7 h-7 md:w-8 md:h-8 opacity-35"
        delay={1.5}
        duration={4.5}
      />
      <FloatingStar
        className="top-[48%] left-[35%] w-5 h-5 md:w-6 md:h-6 opacity-25 hidden md:block"
        delay={3.5}
        duration={7}
      />
      <FloatingStar
        className="top-[52%] right-[38%] w-6 h-6 md:w-7 md:h-7 opacity-28 hidden md:block"
        delay={4.2}
        duration={6.8}
      />
      <FloatingStar
        className="bottom-[18%] left-[10%] w-8 h-8 md:w-10 md:h-10 opacity-45"
        delay={0.5}
        duration={6}
      />
      <FloatingStar
        className="bottom-[25%] left-[48%] w-5 h-5 md:w-6 md:h-6 opacity-28 hidden sm:block"
        delay={2.5}
        duration={5.5}
      />
      <FloatingStar
        className="bottom-[12%] right-[12%] w-7 h-7 md:w-8 md:h-8 opacity-40"
        delay={2}
        duration={5}
      />

      {/* Images */}
      {FLOATING_IMAGES.map((img, idx) => (
        <FloatingImage
          key={idx}
          src={img.src}
          className={img.className}
          style={{ top: img.top, left: img.left, right: img.right, bottom: img.bottom }}
          delay={img.delay}
          duration={img.duration}
          priority={priority}
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

        {/* Divider */}
        {layout === "bottom-image" || layout === "text-only" ? (
          <div className="w-20 h-1.5 bg-gold mx-auto rounded-full opacity-80" />
        ) : null}

        {/* Description or Paragraphs */}
        {paragraphs && paragraphs.length > 0 ? (
          <div
            className={cn(
              "text-lg md:text-xl leading-relaxed max-w-xl space-y-4",
              layout === "bottom-image" || layout === "text-only" ? "mx-auto" : ""
            )}
          >
            {paragraphs.map((p, i) => (
              <p key={i} className={descColor}>
                {p}
              </p>
            ))}
          </div>
        ) : description ? (
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

        {/* Stats Grid */}
        {data.stats && data.stats.length > 0 ? (
          <div
            className={cn(
              "grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-gold/20 mt-8",
              layout === "bottom-image" || layout === "text-only" ? "max-w-2xl mx-auto" : ""
            )}
          >
            {data.stats.map((stat, idx) => (
              <div key={idx} className="text-center space-y-1">
                <p
                  className={cn(
                    "text-3xl md:text-4xl font-bold",
                    isLightText ? textColor : "text-gold"
                  )}
                >
                  {stat.value}
                </p>
                <p
                  className={cn(
                    "text-xs md:text-sm font-bold tracking-[0.2em] uppercase",
                    descColor
                  )}
                >
                  {stat.label}
                </p>
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
        "relative isolate flex justify-center",
        layout === "bottom-image" ? "mt-16 w-full max-w-5xl mx-auto" : "",
        layout === "right-image" || layout === "left-image"
          ? "w-full p-4 lg:p-12 items-center h-full max-h-full"
          : "",
        layout === "background-image" ? "absolute inset-0 z-0" : ""
      )}
    >
      <div
        className={cn(
          "relative w-full h-full overflow-visible rounded-3xl",
          layout === "right-image" || layout === "left-image" ? "min-h-75" : ""
        )}
      >
        <OptimizedImage
          src={processedImageUrl}
          alt={title || "Banner image"}
          fill={
            layout === "background-image" ||
            layout === "bottom-image" ||
            layout === "right-image" ||
            layout === "left-image"
          }
          width={
            !(
              layout === "background-image" ||
              layout === "bottom-image" ||
              layout === "right-image" ||
              layout === "left-image"
            )
              ? 800
              : undefined
          }
          height={
            !(
              layout === "background-image" ||
              layout === "bottom-image" ||
              layout === "right-image" ||
              layout === "left-image"
            )
              ? 600
              : undefined
          }
          className="transition-transform duration-1000 hover:scale-105"
          imageClassName={cn(
            "object-scale-down w-auto h-auto max-w-full rounded-3xl drop-shadow-2xl",
            layout === "right-image" || layout === "left-image" ? "object-scale-down" : ""
          )}
          priority={priority}
          sizes={layout === "background-image" ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
          quality={100}
          overflowVisible={true}
        />
      </div>
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

  // 1. Full Background Image Layout
  if (layout === "background-image") {
    return (
      <div className={bgClasses}>
        {ImageBlock}
        {FloatingElements}
        <div className="container mx-auto px-4 md:px-8 relative z-20">{ContentBlock}</div>
      </div>
    );
  }

  // 2. Split Layouts
  if (layout === "right-image" || layout === "left-image") {
    return (
      <div className={bgClasses}>
        {FloatingElements}
        <div className="container mx-auto px-4 md:px-6 lg:px-10 h-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center h-full">
            <div
              className={cn(
                layout === "left-image" ? "order-last lg:order-first" : "order-first",
                "h-full flex flex-col justify-center"
              )}
            >
              {layout === "left-image" ? ImageBlock : ContentBlock}
            </div>
            <div
              className={cn(
                layout === "left-image" ? "order-first lg:order-last" : "order-last",
                "h-full flex flex-col justify-center"
              )}
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
