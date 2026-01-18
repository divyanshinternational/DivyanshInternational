/**
 * Sitemap Generator
 * Dynamically generates sitemap.xml from Sanity CMS configuration and product data
 */

import type { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { z } from "zod";

import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";

// =============================================================================
// GROQ QUERIES
// =============================================================================

const sitemapProductsQuery = groq`
  *[_type == "product"] { 
    "slug": slug.current, 
    _updatedAt 
  }
`;

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const productSchema = z.object({
  slug: z.string(),
  _updatedAt: z.string(),
});

const staticPageSchema = z.object({
  path: z.string(),
  changeFrequency: z.enum(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]),
  priority: z.number().min(0).max(1),
});

const productDefaultsSchema = z.object({
  changeFrequency: z.enum(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]),
  priority: z.number().min(0).max(1),
});

const sitemapConfigSchema = z.object({
  staticPages: z.array(staticPageSchema).optional(),
  productDefaults: productDefaultsSchema.optional(),
});

const seoSchema = z.object({
  siteUrl: z.string().url().optional(),
  sitemap: sitemapConfigSchema.optional(),
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
  siteUrl: "https://divyanshinternational.com",
  productDefaults: {
    changeFrequency: "weekly" as const,
    priority: 0.8,
  },
  staticPages: [
    { path: "/", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/products", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/catalogue", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/community", changeFrequency: "monthly" as const, priority: 0.5 },
  ],
} as const;

// =============================================================================
// SITEMAP GENERATOR
// =============================================================================

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch configuration and products in parallel
    const [rawSettings, rawProducts] = await Promise.all([
      client.fetch(siteSettingsQuery),
      client.fetch(sitemapProductsQuery),
    ]);

    // Validate settings
    const settingsResult = siteSettingsSchema.safeParse(rawSettings);
    if (!settingsResult.success && process.env.NODE_ENV === "development") {
      console.warn("[Sitemap] Settings validation failed:", settingsResult.error.issues);
    }

    const seo = settingsResult.success ? settingsResult.data.seo : null;
    const baseUrl = seo?.siteUrl ?? DEFAULTS.siteUrl;
    const sitemapConfig = seo?.sitemap;
    const productDefaults = sitemapConfig?.productDefaults ?? DEFAULTS.productDefaults;

    // Validate products
    const productsResult = z.array(productSchema).safeParse(rawProducts);
    if (!productsResult.success && process.env.NODE_ENV === "development") {
      console.warn("[Sitemap] Products validation failed:", productsResult.error.issues);
    }

    const products = productsResult.success ? productsResult.data : [];

    // Build product URLs
    const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(product._updatedAt),
      changeFrequency: productDefaults.changeFrequency,
      priority: productDefaults.priority,
    }));

    // Get static pages from config or use defaults
    const staticPagesConfig = sitemapConfig?.staticPages ?? DEFAULTS.staticPages;

    // Build static page URLs
    const staticUrls: MetadataRoute.Sitemap = staticPagesConfig.map((page) => ({
      url: `${baseUrl}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }));

    return [...staticUrls, ...productUrls];
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Sitemap] Failed to generate sitemap:", error);
    }

    // Return minimal sitemap on error
    return [
      {
        url: DEFAULTS.siteUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ];
  }
}
