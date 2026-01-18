import type { Metadata } from "next";
import { z } from "zod";

import PrivacyPolicyContent from "@/components/pages/PrivacyPolicyContent";
import { client } from "@/lib/sanity/client";
import { privacyPolicyQuery, siteSettingsQuery } from "@/lib/sanity/queries";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// Runtime validation for Sanity CMS data
// =============================================================================

/**
 * Portable Text block schema (simplified - allows any block structure)
 */
const portableTextBlockSchema = z
  .object({
    _key: z.string().optional(),
    _type: z.string().optional(),
  })
  .passthrough();

/**
 * Content section schema
 */
const contentSectionSchema = z
  .object({
    _key: z.string().optional(),
    heading: z.string().optional(),
    body: z.array(portableTextBlockSchema).optional(),
  })
  .passthrough();

/**
 * Privacy policy data schema
 */
const privacyPolicyDataSchema = z
  .object({
    _id: z.string().optional(),
    title: z.string().optional(),
    lastUpdated: z.string().optional(),
    content: z.array(contentSectionSchema).optional(),
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
// COMPONENT PROP TYPES
// Match PrivacyPolicyContent component's expected interface
// =============================================================================

interface PrivacyPolicyDataProp {
  title: string;
  lastUpdated: string;
  content: Array<{
    heading: string;
    body: unknown[];
  }>;
}

// =============================================================================
// METADATA CONFIGURATION
// Dynamic SEO metadata from CMS with fallbacks
// =============================================================================

const DEFAULT_META = {
  title: "Privacy Policy | Divyansh International",
  description:
    "Privacy Policy for Divyansh International. Learn how we collect, use, and protect your information.",
} as const;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [rawPrivacyPolicy, rawSiteSettings] = await Promise.all([
      client.fetch(privacyPolicyQuery),
      client.fetch(siteSettingsQuery),
    ]);

    const privacyResult = privacyPolicyDataSchema.safeParse(rawPrivacyPolicy);
    const siteSettingsResult = siteSettingsSchema.safeParse(rawSiteSettings);

    const privacyPolicy = privacyResult.success ? privacyResult.data : null;
    const siteSettings = siteSettingsResult.success ? siteSettingsResult.data : null;

    const org = siteSettings?.organization;
    const seo = siteSettings?.seo;

    const pageTitle = privacyPolicy?.title
      ? `${privacyPolicy.title} | ${org?.name ?? "Divyansh International"}`
      : DEFAULT_META.title;

    return {
      title: pageTitle,
      description: DEFAULT_META.description,
      openGraph: {
        title: pageTitle,
        description: DEFAULT_META.description,
        type: (seo?.ogType as "website") ?? "website",
        url: seo?.siteUrl ? `${seo.siteUrl}/privacy-policy` : undefined,
        siteName: org?.name ?? "Divyansh International",
      },
      twitter: {
        card: (seo?.twitterCardType as "summary_large_image") ?? "summary",
        title: pageTitle,
        description: DEFAULT_META.description,
      },
      alternates: {
        canonical: seo?.siteUrl ? `${seo.siteUrl}/privacy-policy` : undefined,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Privacy Policy Page] Metadata fetch failed:", error);
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

async function getData(): Promise<{
  privacyPolicy: PrivacyPolicyDataProp | null;
  siteSettings: unknown;
}> {
  try {
    const [rawPrivacyPolicy, rawSiteSettings] = await Promise.all([
      client.fetch(privacyPolicyQuery),
      client.fetch(siteSettingsQuery),
    ]);

    // Validate data
    const privacyResult = privacyPolicyDataSchema.safeParse(rawPrivacyPolicy);
    const siteSettingsResult = siteSettingsSchema.safeParse(rawSiteSettings);

    // Development-only validation logging
    if (process.env.NODE_ENV === "development") {
      if (!privacyResult.success) {
        console.warn(
          "[Privacy Policy Page] Privacy policy validation failed:",
          privacyResult.error.issues
        );
      }
      if (!siteSettingsResult.success) {
        console.warn(
          "[Privacy Policy Page] Site settings validation failed:",
          siteSettingsResult.error.issues
        );
      }
    }

    // Type assertion is safe: Zod validated the structure
    return {
      privacyPolicy: privacyResult.success
        ? (privacyResult.data as unknown as PrivacyPolicyDataProp)
        : null,
      siteSettings: siteSettingsResult.success ? siteSettingsResult.data : null,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Privacy Policy Page] Failed to fetch data:", error);
    }
    return { privacyPolicy: null, siteSettings: null };
  }
}

// =============================================================================
// PAGE COMPONENT (SERVER COMPONENT)
// =============================================================================

export default async function PrivacyPolicyPage() {
  const { privacyPolicy, siteSettings } = await getData();

  return <PrivacyPolicyContent privacyPolicy={privacyPolicy} siteSettings={siteSettings} />;
}
