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
import { useEffect, useState } from "react";

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
  duration = 0.5,
  viewportAmount = 0.1, // Trigger sooner
  ...motionProps
}: AnimationWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Validate props during development
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateProps({ children, className, delay, duration, viewportAmount } as any);
  }

  // Don't animate until mounted to avoid hydration issues
  if (!isMounted) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} // slightly more movement for visibility
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: viewportAmount, margin: "0px" }} // Trigger almost immediately upon entering viewport
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
