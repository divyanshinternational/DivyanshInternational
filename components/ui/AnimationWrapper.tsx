"use client";

/**
 * Animation Wrapper Component
 *
 * A reusable wrapper for animating elements on scroll view.
 * Uses framer-motion for performant animations.
 *
 * Props validated with Zod for runtime safety.
 */

import { motion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { z } from "zod";
import type { ReactNode } from "react";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const AnimationWrapperPropsSchema = z.object({
  children: z.custom<ReactNode>(),
  className: z.string().optional(),
  delay: z.number().min(0).optional(),
  duration: z.number().min(0).optional(),
  viewportAmount: z.number().min(0).max(1).optional(),
});

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

type AnimationWrapperProps = z.infer<typeof AnimationWrapperPropsSchema> & MotionProps;

// =============================================================================
// VALIDATION
// =============================================================================

function validateProps(props: unknown): void {
  const result = AnimationWrapperPropsSchema.safeParse(props);
  if (!result.success) {
    console.warn("[AnimationWrapper] Prop validation warning:", result.error.flatten());
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function AnimationWrapper({
  children,
  className,
  delay = 0,
  duration = 0.7,
  viewportAmount = 0.2, // Default threshold
  ...motionProps
}: AnimationWrapperProps) {
  // Validate props during development
  if (process.env.NODE_ENV === "development") {
    validateProps({ children, className, delay, duration, viewportAmount });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: viewportAmount, margin: "0px 0px -50px 0px" }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={cn(className)}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
