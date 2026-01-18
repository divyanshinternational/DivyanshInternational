/**
 * Skip Link Component
 *
 * An accessibility feature allowing keyboard users to skip navigation.
 * Validates props with Zod and provides sensible defaults.
 */

import { z } from "zod";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const AccessibilityLabelsSchema = z.object({
  skipLinkText: z.string().optional(),
  skipLinkTarget: z.string().optional(),
});

const LabelsSchema = z.object({
  accessibility: AccessibilityLabelsSchema.optional(),
});

const SkipLinkPropsSchema = z.object({
  labels: LabelsSchema.optional(),
});

// =============================================================================
// TYPES
// =============================================================================

export type SkipLinkProps = z.infer<typeof SkipLinkPropsSchema>;

// =============================================================================
// COMPONENT
// =============================================================================

export default function SkipLink({ labels }: SkipLinkProps) {
  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    const result = SkipLinkPropsSchema.safeParse({ labels });
    if (!result.success) {
      console.warn("[SkipLink] Prop validation warning:", result.error.flatten());
    }
  }

  // Safe defaults
  const skipText = labels?.accessibility?.skipLinkText ?? "Skip to main content";
  const skipTarget = labels?.accessibility?.skipLinkTarget ?? "#main-content";

  return (
    <a
      href={skipTarget}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-deep-brown focus:text-white focus:rounded focus:outline-2 focus:outline-white transition-all"
    >
      {skipText}
    </a>
  );
}
