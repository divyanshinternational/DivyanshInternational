import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { env } from "@/lib/env";

// =============================================================================
// CLIENT CONFIGURATION
// =============================================================================

export const browserClient = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: true, // Always true for browser client optimizaton
  perspective: "published",
  stega: {
    enabled: false,
    studioUrl: "/studio",
  },
});

// =============================================================================
// IMAGE URL BUILDER
// =============================================================================

const builder = createImageUrlBuilder({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
});

/**
 * Generate a safe image URL for a Sanity source.
 * Safe to call with null/undefined (will return builder in default state, handle with care or strict checks before calling).
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
