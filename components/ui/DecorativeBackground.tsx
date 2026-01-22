"use client";

import { motion } from "framer-motion";
import { useState, useSyncExternalStore, memo } from "react";
import { LeafIcon, NutIcon } from "@/components/assets/Decorations";
import OptimizedImage from "@/components/ui/OptimizedImage";

export type Variant = "default" | "scattered" | "side-balanced" | "minimal";

export interface DecorativeBackgroundProps {
  variant?: Variant;
  className?: string;
}

// =============================================================================
// ASSET MAPPING
// =============================================================================

const DECORATIVE_IMAGES = {
  almond: "/almond.png",
  cashew: "/cashewsingle.png",
  walnut: "/walnut.png",
  hazelnut: "/hazelnut.png",
  raisin: "/raisin.png",
  date: "/dates.png",
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function FloatingImage({
  src,
  className = "",
  ...props
}: { src: string } & Omit<FloatingElementProps, "children">) {
  return (
    <FloatingElement className={className} {...props}>
      <div className="relative w-full h-full">
        <OptimizedImage
          src={src}
          alt=""
          fill
          className="object-contain drop-shadow-md select-none grayscale-[0.2] brightness-110"
          sizes="100px"
        />
      </div>
    </FloatingElement>
  );
}

function GoldenDust() {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [particles] = useState(() =>
    Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1, // 1px to 4px
      duration: Math.random() * 10 + 10, // 10s to 20s
      delay: Math.random() * 5,
    }))
  );

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/30 blur-[1px]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  xRange?: number[];
  yRange?: number[];
  rotateRange?: number[];
}

function FloatingElement({
  children,
  className = "",
  delay = 0,
  duration = 15,
  xRange = [0, 10, 0],
  yRange = [0, -15, 0],
  rotateRange = [0, 5, -5, 0],
}: FloatingElementProps) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        x: xRange,
        y: yRange,
        rotate: rotateRange,
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default memo(function DecorativeBackground({
  variant = "default",
  className = "",
}: DecorativeBackgroundProps) {
  const renderDefault = () => (
    <>
      <FloatingElement
        className="top-10 left-0 text-gold/5"
        duration={18}
        yRange={[0, -20, 0]}
        rotateRange={[0, 2, -2, 0]}
      >
        <LeafIcon className="w-80 h-80" />
      </FloatingElement>

      <FloatingImage
        src={DECORATIVE_IMAGES.almond}
        className="top-1/4 right-16 opacity-30"
        duration={20}
        rotateRange={[0, 15, -15, 0]}
        yRange={[0, -25, 0]}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.walnut}
        className="bottom-1/3 left-20 opacity-25 w-32 h-32"
        duration={22}
        rotateRange={[0, -14, 14, 0]}
        xRange={[0, -15, 0]}
        delay={2}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.cashew}
        className="top-1/3 left-1/4 opacity-20 w-24 h-24"
        duration={25}
        rotateRange={[0, -9, 9, 0]}
        yRange={[0, -15, 0]}
        delay={1}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.hazelnut}
        className="bottom-1/3 left-1/2 opacity-20 w-22 h-22"
        duration={28}
        rotateRange={[0, 11, -11, 0]}
        xRange={[0, 12, 0]}
        delay={4}
      />
    </>
  );

  const renderScattered = () => (
    <>
      {/* Large background anchor */}
      <FloatingElement
        className="top-[-5%] right-1/4 text-deep-brown/5"
        duration={30}
        yRange={[0, 20, 0]}
        rotateRange={[0, 5, 0]}
      >
        <NutIcon className="w-96 h-96" />
      </FloatingElement>

      {/* Scattered particles */}
      <FloatingImage
        src={DECORATIVE_IMAGES.cashew}
        className="top-[15%] left-[10%] opacity-25 w-20 h-20"
        duration={18}
        rotateRange={[0, 45, 0]}
        xRange={[0, 20, 0]}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.walnut}
        className="top-[45%] right-[8%] opacity-20 w-32 h-32"
        duration={25}
        rotateRange={[0, -30, 30, 0]}
        yRange={[0, 40, 0]}
        delay={1}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.almond}
        className="bottom-[25%] left-[15%] opacity-25 w-24 h-24"
        duration={22}
        rotateRange={[0, 60, 0]}
        delay={2}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.hazelnut}
        className="bottom-[10%] right-[30%] opacity-15 w-20 h-20"
        duration={35}
        rotateRange={[0, -360]}
        delay={0.5}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.raisin}
        className="top-[30%] left-[80%] opacity-20 w-16 h-16"
        duration={28}
        rotateRange={[0, 15, -15, 0]}
        yRange={[0, -20, 0]}
        delay={3}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.date}
        className="bottom-[40%] left-[40%] opacity-20 w-24 h-24"
        duration={32}
        rotateRange={[0, 360]}
        delay={4}
      />
    </>
  );

  const renderSideBalanced = () => (
    <>
      <FloatingElement
        className="top-20 right-0 text-gold/5"
        duration={25}
        xRange={[0, 10, 0]}
        rotateRange={[0, -5, 0]}
      >
        <LeafIcon className="w-80 h-80 transform scale-x-[-1]" />
      </FloatingElement>

      <FloatingImage
        src={DECORATIVE_IMAGES.walnut}
        className="top-[25%] left-[5%] opacity-30 w-24 h-24"
        duration={22}
        yRange={[0, -20, 0]}
        rotateRange={[0, 15, 0]}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.cashew}
        className="top-[65%] left-[8%] opacity-25 w-28 h-28"
        duration={26}
        yRange={[0, 25, 0]}
        rotateRange={[0, -10, 0]}
        delay={1}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.almond}
        className="bottom-[15%] right-[5%] opacity-30 w-26 h-26"
        duration={28}
        xRange={[0, -15, 0]}
        rotateRange={[0, 20, 0]}
        delay={2}
      />
    </>
  );

  const renderMinimal = () => (
    <>
      <FloatingElement
        className="-top-10 -right-10 opacity-10"
        duration={30}
        rotateRange={[0, 10, -10, 0]}
      >
        <NutIcon className="w-56 h-56" />
      </FloatingElement>

      <FloatingElement
        className="bottom-10 left-10 opacity-10"
        duration={35}
        rotateRange={[0, -8, 8, 0]}
        yRange={[0, 15, 0]}
      >
        <LeafIcon className="w-48 h-48" />
      </FloatingElement>

      {/* Subtle extra detail for minimal */}
      <FloatingImage
        src={DECORATIVE_IMAGES.almond}
        className="top-1/2 left-10 opacity-15 w-12 h-12"
        duration={25}
        rotateRange={[0, 360]}
        delay={5}
      />
    </>
  );

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
      {/* Background ambient dust for all variants */}
      <GoldenDust />

      <div className="relative z-10 w-full h-full lg:overflow-hidden">
        {variant === "default" ? renderDefault() : null}
        {variant === "scattered" ? renderScattered() : null}
        {variant === "side-balanced" ? renderSideBalanced() : null}
        {variant === "minimal" ? renderMinimal() : null}
      </div>
    </div>
  );
});
