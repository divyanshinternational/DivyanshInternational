"use client";

import { useState, useEffect, useRef } from "react";
import { z } from "zod";

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

const UseViewportAnimationOptionsSchema = z.object({
  threshold: z.number().min(0).max(1).optional().default(0.05),
  rootMargin: z.string().optional().default("0px 0px 10% 0px"),
  triggerOnce: z.boolean().optional().default(true),
});

type UseViewportAnimationOptions = z.infer<typeof UseViewportAnimationOptionsSchema>;

// =============================================================================
// HOOK
// =============================================================================

export function useViewportAnimation(
  options: UseViewportAnimationOptions = {
    threshold: 0,
    rootMargin: "",
    triggerOnce: false,
  }
) {
  // Runtime validation (soft fail with fallbacks if needed, but defaults handled by destructuring safely after safeParse or schema def)
  const result = UseViewportAnimationOptionsSchema.safeParse(options);
  const { threshold, rootMargin, triggerOnce } = result.success
    ? result.data
    : UseViewportAnimationOptionsSchema.parse({}); // Fallback to defaults

  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const element = elementRef.current;
    if (!element) return;

    // Browser check for IntersectionObserver
    if (!("IntersectionObserver" in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasAnimated(true); // Fallback to visible
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry?.isIntersecting ?? false;
        setIsInView(inView);

        if (inView && triggerOnce && !hasAnimated) {
          // Logic fix: check triggerOnce here
          setHasAnimated(true);
        } else if (inView && !triggerOnce) {
          setHasAnimated(true); // Track generic animation state if needed
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [isClient, threshold, rootMargin, triggerOnce, hasAnimated]);

  const shouldAnimate = isClient && (triggerOnce ? hasAnimated : isInView);

  return {
    elementRef,
    isInView: isClient ? isInView : true, // Default to true if not client (SSR safety)
    shouldAnimate,
    hasAnimated: isClient ? hasAnimated : true, // Default to true if not client
  };
}
