/**
 * Robots.txt Generator
 * Dynamically generates robots.txt from Sanity CMS configuration
 */

import type { MetadataRoute } from "next";
import { z } from "zod";

import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const robotsConfigSchema = z.object({
  userAgent: z.string().optional(),
  allowPath: z.string().optional(),
  disallowPath: z.string().optional(),
  sitemapPath: z.string().optional(),
});

const seoSchema = z.object({
  siteUrl: z.string().url().optional(),
  robots: robotsConfigSchema.optional(),
});

const siteSettingsSchema = z
  .object({
    seo: seoSchema.optional(),
  })
  .passthrough();

// =============================================================================
// DEFAULT FALLBACK VALUES
// =============================================================================

const DEFAULTS = {
  userAgent: "*",
  allowPath: "/",
  disallowPath: "/studio",
  sitemapPath: "/sitemap.xml",
  siteUrl: "https://divyanshinternational.com",
} as const;

// =============================================================================
// ROBOTS.TXT GENERATOR
// =============================================================================

export default async function robots(): Promise<MetadataRoute.Robots> {
  try {
    const rawSettings = await client.fetch(siteSettingsQuery);
    const result = siteSettingsSchema.safeParse(rawSettings);

    if (!result.success && process.env.NODE_ENV === "development") {
      console.warn("[Robots] Settings validation failed:", result.error.issues);
    }

    const seo = result.success ? result.data.seo : null;
    const robotsConfig = seo?.robots;

    const siteUrl = seo?.siteUrl ?? DEFAULTS.siteUrl;
    const userAgent = robotsConfig?.userAgent ?? DEFAULTS.userAgent;
    const allowPath = robotsConfig?.allowPath ?? DEFAULTS.allowPath;
    const disallowPath = robotsConfig?.disallowPath ?? DEFAULTS.disallowPath;
    const sitemapPath = robotsConfig?.sitemapPath ?? DEFAULTS.sitemapPath;

    return {
      rules: {
        userAgent,
        allow: allowPath,
        disallow: disallowPath,
      },
      sitemap: `${siteUrl}${sitemapPath}`,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Robots] Failed to fetch settings:", error);
    }

    // Return safe defaults on error
    return {
      rules: {
        userAgent: DEFAULTS.userAgent,
        allow: DEFAULTS.allowPath,
        disallow: DEFAULTS.disallowPath,
      },
      sitemap: `${DEFAULTS.siteUrl}${DEFAULTS.sitemapPath}`,
    };
  }
}
