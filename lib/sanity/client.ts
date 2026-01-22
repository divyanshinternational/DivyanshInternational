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
  useCdn: false,
  token: env.SANITY_API_TOKEN,
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

/**
 * Standardized fetch wrapper for Server Components.
 * Handles caching, revalidation tags, and type safety.
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, params, {
    next: {
      // Use on-demand revalidation via webhook (see /api/revalidate)
      // This is a fallback TTL in case webhook fails - 5 minutes in production
      revalidate: process.env.NODE_ENV === "development" ? 30 : 300,
      tags,
    },
  });
}
