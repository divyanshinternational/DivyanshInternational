import { z } from "zod";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/lib/sanity/client-browser";

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

/**
 * Schema to validate that a Sanity Image Source is provided.
 * Accepts any object or string as the SDK handles polymorphism, but rejects null/undefined.
 */
const SanityImageSourceSchema = z.custom<SanityImageSource>(
  (val) => val !== null && val !== undefined,
  { message: "Image source must be defined" }
);

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Generates an image URL builder for the given source.
 * Wraps the client-browser urlFor with input validation.
 *
 * @param source - The image source (Reference, Asset, or String)
 */
export const urlForImage = (source: SanityImageSource) => {
  // Validate input in development to catch missing assets early
  if (process.env.NODE_ENV === "development") {
    const result = SanityImageSourceSchema.safeParse(source);
    if (!result.success) {
      // We warn instead of throwing to prevent crashing the UI for a missing image
      console.warn("[urlForImage] Invalid image source provided:", source);
    }
  }

  return urlFor(source);
};
