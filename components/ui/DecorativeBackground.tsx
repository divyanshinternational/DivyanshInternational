"use client";

import { motion } from "framer-motion";
import { useState, useSyncExternalStore, memo } from "react";
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
          className="drop-shadow-md select-none grayscale-[0.2] brightness-110"
          imageClassName="object-scale-down"
          quality={100}
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
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
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
            x: [0, 20, -15, 10, 0],
            y: [0, -35, 15, -25, 0],
            opacity: [0, 0.6, 0.3, 0.5, 0],
            scale: [1, 1.8, 1.2, 1.5, 1],
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
}

function FloatingElement({
  children,
  className = "",
  delay = 0,
  duration = 15,
  xRange = [0, 10, 0],
  yRange = [0, -15, 0],
}: FloatingElementProps) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        x: [...xRange, xRange[0]].filter((val): val is number => val !== undefined),
        y: [...yRange, yRange[0]].filter((val): val is number => val !== undefined),
        rotate: [0, 360],
        scale: [1, 1.05, 0.98, 1.03, 1],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
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
      <FloatingImage
        src={DECORATIVE_IMAGES.almond}
        className="top-1/4 right-16 opacity-30 w-32 h-32"
        duration={20}
        xRange={[0, 25, -15, 10]}
        yRange={[0, -30, 15, -25]}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.walnut}
        className="bottom-1/3 left-20 opacity-25 w-32 h-32"
        duration={22}
        xRange={[0, -20, 15, -10]}
        yRange={[0, 20, -15, 10]}
        delay={2}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.cashew}
        className="top-1/3 left-1/4 opacity-20 w-24 h-24"
        duration={25}
        xRange={[0, 15, -20, 12]}
        yRange={[0, -20, 10, -15]}
        delay={1}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.hazelnut}
        className="bottom-1/3 left-1/2 opacity-20 w-22 h-22"
        duration={28}
        xRange={[0, 18, -12, 8]}
        yRange={[0, -18, 12, -10]}
        delay={4}
      />
    </>
  );

  const renderScattered = () => (
    <>
      {/* Scattered particles */}
      <FloatingImage
        src={DECORATIVE_IMAGES.cashew}
        className="top-[15%] left-[10%] opacity-25 w-20 h-20"
        duration={18}
        xRange={[0, 25, -18, 12]}
        yRange={[0, -22, 15, -18]}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.walnut}
        className="top-[45%] right-[8%] opacity-20 w-32 h-32"
        duration={25}
        xRange={[0, -30, 20, -15]}
        yRange={[0, 35, -25, 20]}
        delay={1}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.almond}
        className="bottom-[25%] left-[15%] opacity-25 w-24 h-24"
        duration={22}
        xRange={[0, 20, -15, 10]}
        yRange={[0, -25, 18, -15]}
        delay={2}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.hazelnut}
        className="bottom-[10%] right-[30%] opacity-15 w-20 h-20"
        duration={35}
        xRange={[0, -25, 18, -12]}
        yRange={[0, 20, -15, 12]}
        delay={0.5}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.raisin}
        className="top-[30%] left-[80%] opacity-20 w-16 h-16"
        duration={28}
        xRange={[0, -18, 15, -10]}
        yRange={[0, -25, 12, -18]}
        delay={3}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.date}
        className="bottom-[40%] left-[40%] opacity-20 w-24 h-24"
        duration={32}
        xRange={[0, 22, -20, 15]}
        yRange={[0, -20, 15, -12]}
        delay={4}
      />
    </>
  );

  const renderSideBalanced = () => (
    <>
      <FloatingImage
        src={DECORATIVE_IMAGES.walnut}
        className="top-[25%] left-[5%] opacity-30 w-24 h-24"
        duration={22}
        xRange={[0, 18, -12, 8]}
        yRange={[0, -25, 15, -18]}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.cashew}
        className="top-[65%] left-[8%] opacity-25 w-28 h-28"
        duration={26}
        xRange={[0, 15, -18, 10]}
        yRange={[0, 28, -20, 15]}
        delay={1}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.almond}
        className="bottom-[15%] right-[5%] opacity-30 w-26 h-26"
        duration={28}
        xRange={[0, -20, 12, -10]}
        yRange={[0, 25, -18, 12]}
        delay={2}
      />
    </>
  );

  const renderMinimal = () => (
    <>
      <FloatingImage
        src={DECORATIVE_IMAGES.hazelnut}
        className="-top-10 -right-10 opacity-10 w-56 h-56"
        duration={30}
        xRange={[0, -15, 10, -8]}
        yRange={[0, 12, -10, 8]}
      />

      <FloatingImage
        src={DECORATIVE_IMAGES.cashew}
        className="bottom-10 left-10 opacity-10 w-48 h-48"
        duration={35}
        xRange={[0, 12, -10, 8]}
        yRange={[0, 18, -12, 10]}
      />

      {/* Subtle extra detail for minimal */}
      <FloatingImage
        src={DECORATIVE_IMAGES.almond}
        className="top-1/2 left-10 opacity-15 w-12 h-12"
        duration={25}
        xRange={[0, 10, -8, 5]}
        yRange={[0, -15, 10, -8]}
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
