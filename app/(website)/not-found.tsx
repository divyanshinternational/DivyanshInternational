import Link from "next/link";
import { z } from "zod";

import { NutIcon } from "@/components/assets/Decorations";
import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// Runtime validation for Sanity CMS data
// =============================================================================

/**
 * Error settings schema
 */
const errorSettingsSchema = z
  .object({
    notFoundCode: z.string().optional(),
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
    homeUrl: z.string().optional(),
  })
  .passthrough();

/**
 * Site settings schema
 */
const siteSettingsSchema = z
  .object({
    error: errorSettingsSchema.optional(),
    navigation: navigationSchema.optional(),
  })
  .passthrough()
  .nullable();

// =============================================================================
// DEFAULT FALLBACK VALUES
// Used when CMS data is unavailable
// =============================================================================

const DEFAULTS = {
  notFoundCode: "404",
  notFoundTitle: "Page Not Found",
  notFoundText: "The page you're looking for doesn't exist or has been moved.",
  backHomeButton: "Back to Home",
  homeUrl: "/",
} as const;

// =============================================================================
// DATA FETCHING WITH VALIDATION
// =============================================================================

async function getData() {
  try {
    const rawSettings = await client.fetch(siteSettingsQuery);
    const result = siteSettingsSchema.safeParse(rawSettings);

    if (!result.success && process.env.NODE_ENV === "development") {
      console.warn("[Not Found Page] Settings validation failed:", result.error.issues);
    }

    return result.success ? result.data : null;
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Not Found Page] Failed to fetch settings:", error);
    }
    return null;
  }
}

// =============================================================================
// NOT FOUND PAGE COMPONENT (SERVER COMPONENT)
// =============================================================================

export default async function NotFound() {
  const siteSettings = await getData();

  // Safe access with fallbacks
  const errorSettings = siteSettings?.error;
  const navigation = siteSettings?.navigation;

  const notFoundCode = errorSettings?.notFoundCode ?? DEFAULTS.notFoundCode;
  const notFoundTitle = errorSettings?.notFoundTitle ?? DEFAULTS.notFoundTitle;
  const notFoundText = errorSettings?.notFoundText ?? DEFAULTS.notFoundText;
  const backHomeButton = errorSettings?.backHomeButton ?? DEFAULTS.backHomeButton;
  const homeUrl = navigation?.homeUrl ?? DEFAULTS.homeUrl;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      {/* Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-5" aria-hidden="true">
        <NutIcon className="absolute top-10 left-10 w-64 h-64 text-gold animate-spin-slow" />
        <NutIcon className="absolute bottom-10 right-10 w-96 h-96 text-gold animate-spin-slow-reverse" />
      </div>

      <div className="relative z-10">
        <h1 className="text-9xl font-bold text-gold opacity-20 font-heading" aria-hidden="true">
          {notFoundCode}
        </h1>
        <div className="-mt-16">
          <h2 className="text-3xl md:text-4xl font-bold text-deep-brown mb-4 font-heading">
            {notFoundTitle}
          </h2>
          <p className="text-lg text-(--color-slate) mb-8 max-w-md mx-auto">{notFoundText}</p>
          <Link
            href={homeUrl}
            className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-gold rounded-full hover:bg-gold-dark transition-all shadow-lg hover:-translate-y-1 focus:outline-2 focus:outline-gold-dark focus:outline-offset-2"
          >
            {backHomeButton}
          </Link>
        </div>
      </div>
    </div>
  );
}
