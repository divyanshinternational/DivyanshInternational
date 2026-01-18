import type { Metadata } from "next";
import { z } from "zod";

import ProductShowcase from "@/components/sections/ProductShowcase";
import { client } from "@/lib/sanity/client";
import { productsQuery, productsPageQuery, siteSettingsQuery } from "@/lib/sanity/queries";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// Runtime validation for Sanity CMS data
// =============================================================================

/**
 * Sanity image schema
 */
const sanityImageSchema = z
  .object({
    _type: z.literal("image").optional(),
    asset: z
      .object({
        _ref: z.string(),
      })
      .optional(),
  })
  .passthrough();

/**
 * Sanity slug schema
 */
const slugSchema = z
  .object({
    current: z.string(),
  })
  .passthrough();

/**
 * Product schema
 */
const productSchema = z
  .object({
    _id: z.string(),
    slug: slugSchema.optional(),
    title: z.unknown(), // LocaleString handled by component
    category: z.string().optional(),
    heroImage: sanityImageSchema.optional(),
    description: z.unknown().optional(),
  })
  .passthrough();

/**
 * Products page data schema
 */
const productsPageDataSchema = z
  .object({
    _id: z.string().optional(),
    eyebrow: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  })
  .passthrough()
  .nullable();

/**
 * Site settings schema for SEO
 */
const siteSettingsSchema = z
  .object({
    organization: z
      .object({
        name: z.string().optional(),
      })
      .optional(),
    seo: z
      .object({
        siteUrl: z.string().optional(),
        ogType: z.string().optional(),
        twitterCardType: z.string().optional(),
      })
      .optional(),
  })
  .passthrough()
  .nullable();

// =============================================================================
// METADATA CONFIGURATION
// Dynamic SEO metadata from CMS
// =============================================================================

const DEFAULT_META = {
  title: "Products | Divyansh International",
  description:
    "Explore our premium range of dry fruits, nuts, and specialty products. Quality sourcing from trusted suppliers worldwide.",
} as const;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [rawPageData, rawSiteSettings] = await Promise.all([
      client.fetch(productsPageQuery),
      client.fetch(siteSettingsQuery),
    ]);

    const pageResult = productsPageDataSchema.safeParse(rawPageData);
    const siteSettingsResult = siteSettingsSchema.safeParse(rawSiteSettings);

    const pageData = pageResult.success ? pageResult.data : null;
    const siteSettings = siteSettingsResult.success ? siteSettingsResult.data : null;

    const org = siteSettings?.organization;
    const seo = siteSettings?.seo;

    const pageTitle = pageData?.title
      ? `${pageData.title} | ${org?.name ?? "Divyansh International"}`
      : DEFAULT_META.title;

    const pageDescription = pageData?.description ?? DEFAULT_META.description;

    return {
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        type: (seo?.ogType as "website") ?? "website",
        url: seo?.siteUrl ? `${seo.siteUrl}/products` : undefined,
        siteName: org?.name ?? "Divyansh International",
      },
      twitter: {
        card: (seo?.twitterCardType as "summary_large_image") ?? "summary_large_image",
        title: pageTitle,
        description: pageDescription,
      },
      alternates: {
        canonical: seo?.siteUrl ? `${seo.siteUrl}/products` : undefined,
      },
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Products Page] Metadata fetch failed:", error);
    }
    return {
      title: DEFAULT_META.title,
      description: DEFAULT_META.description,
    };
  }
}

// =============================================================================
// DATA FETCHING WITH VALIDATION
// =============================================================================

async function getData() {
  try {
    const [rawProducts, rawPageData, rawSiteSettings] = await Promise.all([
      client.fetch(productsQuery),
      client.fetch(productsPageQuery),
      client.fetch(siteSettingsQuery),
    ]);

    // Validate data
    const productsResult = z.array(productSchema).safeParse(rawProducts);
    const pageResult = productsPageDataSchema.safeParse(rawPageData);
    const siteSettingsResult = siteSettingsSchema.safeParse(rawSiteSettings);

    // Development-only validation logging
    if (process.env.NODE_ENV === "development") {
      if (!productsResult.success) {
        console.warn("[Products Page] Products validation failed:", productsResult.error.issues);
      }
      if (!pageResult.success) {
        console.warn("[Products Page] Page data validation failed:", pageResult.error.issues);
      }
      if (!siteSettingsResult.success) {
        console.warn(
          "[Products Page] Site settings validation failed:",
          siteSettingsResult.error.issues
        );
      }
    }

    // Return raw data for component compatibility
    return {
      products: productsResult.success ? rawProducts : [],
      pageData: pageResult.success ? rawPageData : null,
      siteSettings: siteSettingsResult.success ? rawSiteSettings : null,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Products Page] Failed to fetch data:", error);
    }
    return {
      products: [],
      pageData: null,
      siteSettings: null,
    };
  }
}

// =============================================================================
// PAGE COMPONENT (SERVER COMPONENT)
// =============================================================================

export default async function ProductsPage() {
  const { products, pageData, siteSettings } = await getData();

  return (
    <div className="pt-24 min-h-screen bg-background relative overflow-hidden">
      <ProductShowcase
        initialProducts={products}
        headerData={pageData}
        siteSettings={siteSettings}
      />
    </div>
  );
}
