import type { Metadata } from "next";
import { z } from "zod";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActionButton from "@/components/FloatingActionButton";
import FloatingEnquiryBar from "@/components/FloatingEnquiryBar";
import EnquiryBuilder from "@/components/EnquiryBuilder";
import SkipLink from "@/components/ui/SkipLink";
import GA4 from "@/components/analytics/GA4";
import ThemeToggle from "@/components/ThemeToggle";
import StructuredData from "@/components/seo/StructuredData";
import ToastContainer from "@/components/ui/Toast";
import { client } from "@/lib/sanity/client";
import {
  footerQuery,
  headerQuery,
  productListQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// Runtime validation for Sanity CMS data
// =============================================================================

/**
 * SEO settings schema
 */
const seoSchema = z
  .object({
    siteUrl: z.string().url().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    ogType: z.string().optional(),
    twitterCardType: z.string().optional(),
  })
  .passthrough();

/**
 * Site settings schema
 */
const siteSettingsSchema = z
  .object({
    seo: seoSchema.optional(),
    organization: z.unknown().optional(),
    accessibility: z.unknown().optional(),
    themeToggle: z.unknown().optional(),
    footer: z.unknown().optional(),
    enquiry: z.unknown().optional(),
    whatsapp: z
      .object({
        phoneNumber: z.string().optional(),
        messageTemplate: z.string().optional(),
      })
      .optional(),
  })
  .passthrough()
  .nullable();

/**
 * Header data schema
 */
const headerSchema = z
  .object({
    _id: z.string().optional(),
  })
  .passthrough()
  .nullable();

/**
 * Footer data schema
 */
const footerSchema = z
  .object({
    _id: z.string().optional(),
  })
  .passthrough()
  .nullable();

/**
 * Product list item schema
 */
const productListItemSchema = z
  .object({
    _id: z.string(),
    slug: z
      .object({
        current: z.string(),
      })
      .optional(),
    title: z.unknown(),
  })
  .passthrough();

// =============================================================================
// METADATA CONFIGURATION
// Dynamic SEO metadata from CMS with fallbacks
// =============================================================================

const DEFAULT_META = {
  siteUrl: "https://divyanshinternational.com",
  title: "Divyansh International | Premium Dry Fruits & Nuts",
  description:
    "Leading exporter and supplier of premium quality dry fruits, nuts, and specialty products. Quality sourcing from trusted suppliers worldwide.",
} as const;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const rawSettings = await client.fetch(siteSettingsQuery);
    const result = siteSettingsSchema.safeParse(rawSettings);

    if (!result.success) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Layout] Site settings validation failed:", result.error.issues);
      }
      return {
        metadataBase: new URL(DEFAULT_META.siteUrl),
        title: DEFAULT_META.title,
        description: DEFAULT_META.description,
      };
    }

    const seo = result.data?.seo;
    const siteUrl = seo?.siteUrl ?? DEFAULT_META.siteUrl;
    const title = seo?.metaTitle ?? DEFAULT_META.title;
    const description = seo?.metaDescription ?? DEFAULT_META.description;

    return {
      metadataBase: new URL(siteUrl),
      title,
      description,
      keywords: seo?.keywords,
      openGraph: {
        title,
        description,
        type: (seo?.ogType as "website") ?? "website",
      },
      twitter: {
        card: (seo?.twitterCardType as "summary_large_image") ?? "summary_large_image",
        title,
        description,
      },
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Layout] Metadata fetch failed:", error);
    }
    return {
      metadataBase: new URL(DEFAULT_META.siteUrl),
      title: DEFAULT_META.title,
      description: DEFAULT_META.description,
    };
  }
}

// =============================================================================
// DATA FETCHING WITH VALIDATION
// =============================================================================

async function getLayoutData() {
  try {
    const [rawHeader, rawFooter, rawProducts, rawSettings] = await Promise.all([
      client.fetch(headerQuery),
      client.fetch(footerQuery),
      client.fetch(productListQuery),
      client.fetch(siteSettingsQuery),
    ]);

    // Validate data
    const headerResult = headerSchema.safeParse(rawHeader);
    const footerResult = footerSchema.safeParse(rawFooter);
    const productsResult = z.array(productListItemSchema).safeParse(rawProducts);
    const settingsResult = siteSettingsSchema.safeParse(rawSettings);

    // Development-only validation logging
    if (process.env.NODE_ENV === "development") {
      const errors: Array<{ source: string; issues: z.ZodIssue[] }> = [];

      if (!headerResult.success) {
        errors.push({ source: "Header", issues: headerResult.error.issues });
      }
      if (!footerResult.success) {
        errors.push({ source: "Footer", issues: footerResult.error.issues });
      }
      if (!productsResult.success) {
        errors.push({ source: "Products", issues: productsResult.error.issues });
      }
      if (!settingsResult.success) {
        errors.push({ source: "Settings", issues: settingsResult.error.issues });
      }

      if (errors.length > 0) {
        console.warn("[Layout] Validation warnings:", JSON.stringify(errors, null, 2));
      }
    }

    // Return raw data for component compatibility
    return {
      headerData: headerResult.success ? rawHeader : null,
      footerData: footerResult.success ? rawFooter : null,
      productsData: productsResult.success ? rawProducts : [],
      siteSettings: settingsResult.success ? rawSettings : null,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Layout] Failed to fetch layout data:", error);
    }
    return {
      headerData: null,
      footerData: null,
      productsData: [],
      siteSettings: null,
    };
  }
}

// =============================================================================
// LAYOUT COMPONENT (SERVER COMPONENT)
// =============================================================================

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { headerData, footerData, productsData, siteSettings } = await getLayoutData();

  // Derive logo URL safely
  const logoUrl = siteSettings?.seo?.siteUrl
    ? `${siteSettings.seo.siteUrl}/divyansh-logo.jpg`
    : "/divyansh-logo.jpg";

  return (
    <>
      <StructuredData
        organization={{
          ...siteSettings?.organization,
          logoUrl,
        }}
      />
      <GA4 />
      <SkipLink labels={siteSettings?.accessibility} />
      <ThemeToggle labels={siteSettings?.themeToggle} />
      <ToastContainer />
      <Header initialHeader={headerData} products={productsData} siteSettings={siteSettings} />
      <main id="main-content">{children}</main>
      <Footer
        initialFooter={footerData}
        labels={siteSettings?.footer}
        accessibility={siteSettings?.accessibility}
        products={productsData}
        siteSettings={siteSettings}
      />
      <EnquiryBuilder labels={siteSettings?.enquiry} />
      <FloatingEnquiryBar
        labels={siteSettings?.enquiry?.floatingBar}
        whatsappNumber={siteSettings?.whatsapp?.phoneNumber}
      />
      <FloatingActionButton
        whatsappNumber={siteSettings?.whatsapp?.phoneNumber}
        whatsappMessage={siteSettings?.whatsapp?.messageTemplate}
      />
    </>
  );
}
