import "server-only";
import { z } from "zod";
import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

export const GeoCoordinatesSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const SeoSettingsSchema = z.object({
  siteUrl: z.string().url().optional().default("https://divyanshinternational.com"),
  metaTitle: z.string().optional().default("Divyansh International"),
  metaTitleSuffix: z.string().optional().default("| Premium Dry Fruits & Nuts"),
  metaDescription: z
    .string()
    .optional()
    .default("Premium exporter of high-quality dry fruits, nuts, and spices."),
  keywords: z.array(z.string()).optional().default([]),
  ogType: z.string().optional().default("website"),
  twitterCardType: z.string().optional().default("summary_large_image"),
  robots: z
    .object({
      index: z.boolean().optional().default(true),
      follow: z.boolean().optional().default(true),
    })
    .optional(),
});

export type SeoSettings = z.infer<typeof SeoSettingsSchema>;

// =============================================================================
// DATA FETCHING
// =============================================================================

/**
 * Fetches global SEO settings from Sanity.
 * Caches the result to minimize requests (Next.js request deduplication).
 */
export async function getGlobalSeo(): Promise<SeoSettings> {
  try {
    const data = await client.fetch(siteSettingsQuery);
    const seoData = data?.seo || {};

    // Validate and merge with defaults
    return SeoSettingsSchema.parse({
      ...seoData,
      // Map Sanity flat structure if needed, or pass directly if schema matches
    });
  } catch (error) {
    console.error("[SEO] Failed to fetch global settings:", error);
    // Return safe defaults on error
    return SeoSettingsSchema.parse({});
  }
}

// =============================================================================
// METADATA GENERATOR
// =============================================================================

interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
}

/**
 * Generates Next.js Metadata object using global settings and page-specific overrides.
 * @param globalSeo - The global SEO settings fetched from Sanity
 * @param options - Page specific overrides
 */
export function generateMetadata(
  globalSeo: SeoSettings,
  options: GenerateMetadataOptions = {}
): Metadata {
  const title = options.title
    ? `${options.title} ${globalSeo.metaTitleSuffix}`
    : globalSeo.metaTitle;

  const description = options.description || globalSeo.metaDescription;
  const url = options.path
    ? `${globalSeo.siteUrl}${options.path.startsWith("/") ? "" : "/"}${options.path}`
    : globalSeo.siteUrl;

  const images = options.image ? [{ url: options.image }] : []; // Fallback to a default OG image if configured in Sanity, but generic for now

  return {
    metadataBase: new URL(globalSeo.siteUrl),
    title,
    description,
    keywords: globalSeo.keywords,
    openGraph: {
      title,
      description,
      url,
      type: globalSeo.ogType as "website",
      siteName: globalSeo.metaTitle,
      images,
    },
    twitter: {
      card: globalSeo.twitterCardType as "summary_large_image",
      title,
      description,
      images,
    },
    robots: {
      index: options.noIndex ? false : globalSeo.robots?.index,
      follow: options.noIndex ? false : globalSeo.robots?.follow,
    },
    alternates: {
      canonical: url,
    },
  };
}
