import "server-only";

import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { env } from "@/lib/env";

// =============================================================================
// SERVER CLIENT CONFIGURATION
// =============================================================================

export const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: false, // Ensure fresh data on server
  token: env.SANITY_API_TOKEN, // Use token for server-side operations (optional but good for drafts/security)
  perspective: "published",
  stega: {
    enabled: false,
    studioUrl: "/studio",
  },
});

// =============================================================================
// IMAGE URL BUILDER (Server-Side)
// =============================================================================

const builder = createImageUrlBuilder({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
});

/**
 * Generate a safe image URL for a Sanity source on the server.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Checks if the Sanity configuration is valid.
 */
export function isSanityConfigured(): boolean {
  return !!env.NEXT_PUBLIC_SANITY_PROJECT_ID && !!env.NEXT_PUBLIC_SANITY_DATASET;
}
