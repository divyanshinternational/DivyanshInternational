import type { Metadata } from "next";
import { z } from "zod";

import CatalogueViewer from "@/components/CatalogueViewer";
import { client } from "@/lib/sanity/client";
import { catalogueSettingsQuery, siteSettingsQuery } from "@/lib/sanity/queries";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// Runtime validation for Sanity CMS data
// =============================================================================

const PageAssetSchema = z.object({
  _id: z.string(),
  url: z.string(),
});

const PageSchema = z.object({
  _key: z.string(),
  alt: z.string().optional().nullable(),
  caption: z.string().optional().nullable(),
  asset: PageAssetSchema.optional().nullable(),
});

const PdfAssetSchema = z.object({
  _id: z.string(),
  url: z.string().optional().nullable(),
  originalFilename: z.string().optional().nullable(),
  size: z.number().optional().nullable(),
});

/**
 * Catalogue settings schema with comprehensive validation
 */
const catalogueSettingsSchema = z
  .object({
    _id: z.string().optional(),
    title: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    contentType: z.enum(["pdf", "images"]).optional().nullable(),
    pdfFile: z.object({ asset: PdfAssetSchema.optional().nullable() }).optional().nullable(),
    pages: z.array(PageSchema).optional().nullable(),
    pdfDownloadUrl: z.string().optional().nullable(),
    coverImage: z.object({ asset: PageAssetSchema.optional().nullable() }).optional().nullable(),
    version: z.string().optional().nullable(),
    lastUpdated: z.string().optional().nullable(),
    isActive: z.boolean().optional().nullable(),
    showThumbnails: z.boolean().optional().nullable(),
    showPageNumbers: z.boolean().optional().nullable(),
  })
  .nullable();

/**
 * Site settings schema for SEO configuration
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
// COMPONENT PROP TYPES
// Match CatalogueViewer component's expected interface
// =============================================================================

interface CatalogueSettingsProp {
  _id?: string;
  title?: string | null;
  description?: string | null;
  contentType?: "pdf" | "images" | null;
  pdfFile?: {
    asset?: {
      _id: string;
      url?: string | null;
      originalFilename?: string | null;
      size?: number | null;
    } | null;
  } | null;
  pages?: Array<{
    _key: string;
    alt?: string | null;
    caption?: string | null;
    asset?: {
      _id: string;
      url: string;
    } | null;
  }> | null;
  pdfDownloadUrl?: string | null;
  coverImage?: {
    asset?: {
      _id: string;
      url: string;
    } | null;
  } | null;
  version?: string | null;
  lastUpdated?: string | null;
  isActive?: boolean | null;
  showThumbnails?: boolean | null;
  showPageNumbers?: boolean | null;
}

// =============================================================================
// METADATA CONFIGURATION
// Dynamic SEO metadata from CMS with fallbacks
// =============================================================================

const DEFAULT_META = {
  title: "Product Catalogue | Divyansh International",
  description:
    "Browse our interactive product catalogue featuring premium quality dry fruits, nuts, and specialty products.",
} as const;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [rawSettings, rawSiteSettings] = await Promise.all([
      client.fetch(catalogueSettingsQuery),
      client.fetch(siteSettingsQuery),
    ]);

    const settingsResult = catalogueSettingsSchema.safeParse(rawSettings);
    const siteSettingsResult = siteSettingsSchema.safeParse(rawSiteSettings);

    const settings = settingsResult.success ? settingsResult.data : null;
    const siteSettings = siteSettingsResult.success ? siteSettingsResult.data : null;

    const pageTitle = settings?.title
      ? `${settings.title} | ${siteSettings?.organization?.name ?? "Divyansh International"}`
      : DEFAULT_META.title;

    const pageDescription = settings?.description ?? DEFAULT_META.description;
    const seo = siteSettings?.seo;

    return {
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        type: (seo?.ogType as "website") ?? "website",
        url: seo?.siteUrl ? `${seo.siteUrl}/catalogue` : undefined,
        siteName: siteSettings?.organization?.name ?? "Divyansh International",
      },
      twitter: {
        card: (seo?.twitterCardType as "summary_large_image") ?? "summary_large_image",
        title: pageTitle,
        description: pageDescription,
      },
      alternates: {
        canonical: seo?.siteUrl ? `${seo.siteUrl}/catalogue` : undefined,
      },
    };
  } catch (error: unknown) {
    // Graceful fallback on fetch failure
    if (process.env.NODE_ENV === "development") {
      console.error("[Catalogue Page] Metadata fetch failed:", error);
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

async function getCatalogueSettings(): Promise<CatalogueSettingsProp | null> {
  try {
    const rawSettings = await client.fetch(catalogueSettingsQuery);
    const result = catalogueSettingsSchema.safeParse(rawSettings);

    if (!result.success && process.env.NODE_ENV === "development") {
      console.warn("[Catalogue Page] Settings validation failed:", result.error.issues);
    }

    // Type assertion is safe: Zod validated the structure
    return result.success ? (result.data as unknown as CatalogueSettingsProp) : null;
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Catalogue Page] Failed to fetch catalogue settings:", error);
    }
    return null;
  }
}

// =============================================================================
// PAGE COMPONENT (SERVER COMPONENT)
// =============================================================================

export default async function CataloguePage() {
  const catalogueSettings = await getCatalogueSettings();

  return <CatalogueViewer settings={catalogueSettings} />;
}
