import Link from "next/link";
import { z } from "zod";

import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// Runtime validation for Sanity CMS data
// =============================================================================

/**
 * Error labels schema
 */
const errorLabelsSchema = z
  .object({
    notFoundTitle: z.string().optional(),
    notFoundText: z.string().optional(),
    backHomeButton: z.string().optional(),
  })
  .passthrough();

/**
 * Navigation schema
 */
const navigationSchema = z
  .object({
    productsUrl: z.string().optional(),
  })
  .passthrough();

/**
 * Site settings schema (partial - only what we need)
 */
const siteSettingsSchema = z
  .object({
    error: errorLabelsSchema.optional(),
    navigation: navigationSchema.optional(),
  })
  .passthrough()
  .nullable();

// =============================================================================
// DEFAULT FALLBACK VALUES
// Used when CMS data is unavailable
// =============================================================================

const DEFAULTS = {
  notFoundTitle: "Product Not Found",
  notFoundText: "The product you're looking for doesn't exist or has been removed.",
  backHomeButton: "Browse Products",
  productsUrl: "/products",
} as const;

// =============================================================================
// DATA FETCHING WITH VALIDATION
// =============================================================================

async function getData() {
  try {
    const rawSettings = await client.fetch(siteSettingsQuery);
    const result = siteSettingsSchema.safeParse(rawSettings);

    if (!result.success && process.env.NODE_ENV === "development") {
      console.warn("[Product Not Found] Settings validation failed:", result.error.issues);
    }

    return result.success ? result.data : null;
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Product Not Found] Failed to fetch settings:", error);
    }
    return null;
  }
}

// =============================================================================
// NOT FOUND COMPONENT (SERVER COMPONENT)
// =============================================================================

export default async function ProductNotFound() {
  const siteSettings = await getData();

  // Safe access with fallbacks
  const labels = siteSettings?.error;
  const navigation = siteSettings?.navigation;

  const notFoundTitle = labels?.notFoundTitle ?? DEFAULTS.notFoundTitle;
  const notFoundText = labels?.notFoundText ?? DEFAULTS.notFoundText;
  const backHomeButton = labels?.backHomeButton ?? DEFAULTS.backHomeButton;
  const productsUrl = navigation?.productsUrl ?? DEFAULTS.productsUrl;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-deep-brown mb-4 font-serif">{notFoundTitle}</h1>
      <p className="text-(--color-muted) mb-8 max-w-md">{notFoundText}</p>
      <Link
        href={productsUrl}
        className="bg-gold text-white px-8 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors focus:outline-2 focus:outline-gold-dark focus:outline-offset-2"
      >
        {backHomeButton}
      </Link>
    </div>
  );
}
