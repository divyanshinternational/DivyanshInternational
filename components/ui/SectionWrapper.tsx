"use client";

/**
 * Section Wrapper Component
 *
 * A wrapper for animating sections when they enter the viewport.
 * Fixed unused props (delay, staggerChildren) and added Zod validation.
 */

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useViewportAnimation } from "@/hooks/useViewportAnimation";
import { z } from "zod";
import { cn } from "@/lib/utils";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const SectionWrapperPropsSchema = z.object({
  children: z.custom<ReactNode>(),
  className: z.string().optional(),
  delay: z.number().min(0).optional(),
  staggerChildren: z.number().min(0).optional(),
});

const AnimatedItemPropsSchema = z.object({
  children: z.custom<ReactNode>(),
  className: z.string().optional(),
});

// =============================================================================
// TYPES
// =============================================================================

export type SectionWrapperProps = z.infer<typeof SectionWrapperPropsSchema>;
export type AnimatedItemProps = z.infer<typeof AnimatedItemPropsSchema>;

// =============================================================================
// COMPONENT
// =============================================================================

export default function SectionWrapper({
  children,
  className = "",
  delay = 0,
  staggerChildren = 0.01,
}: SectionWrapperProps) {
  // Validate props in dev
  if (process.env.NODE_ENV === "development") {
    const result = SectionWrapperPropsSchema.safeParse({
      children,
      className,
      delay,
      staggerChildren,
    });
    if (!result.success) {
      console.warn("[SectionWrapper] Prop validation warning:", result.error.flatten());
    }
  }

  const { elementRef, shouldAnimate } = useViewportAnimation({
    threshold: 0.01,
    rootMargin: "0px 0px 50% 0px",
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: delay,
        staggerChildren: staggerChildren,
        ease: [0, 0, 1, 1] as const,
      },
    },
  };

  if (!shouldAnimate) {
    return (
      <div ref={elementRef} className={cn(className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={elementRef}
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

export const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0, 0, 1, 1] as const,
    },
  },
};

export function AnimatedItem({ children, className = "" }: AnimatedItemProps) {
  // Validate props in dev
  if (process.env.NODE_ENV === "development") {
    const result = AnimatedItemPropsSchema.safeParse({ children, className });
    if (!result.success) {
      console.warn("[AnimatedItem] Prop validation warning:", result.error.flatten());
    }
  }

  return (
    <motion.div className={cn(className)} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
