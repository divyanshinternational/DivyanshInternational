import type { Metadata } from "next";
import { z } from "zod";

import ContactContent from "@/components/pages/ContactContent";
import { SectionVisualElements } from "@/components/VisualElements";
import { client } from "@/lib/sanity/client";
import { contactPageQuery, siteSettingsQuery, productListQuery } from "@/lib/sanity/queries";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// Runtime validation for Sanity CMS data
// =============================================================================

/**
 * Contact details schema
 */
const contactDetailsSchema = z
  .object({
    address: z.string().optional(),
    phone: z.array(z.string()).optional(),
    email: z.string().email().optional(),
  })
  .passthrough();

/**
 * Business hours schema
 */
const businessHoursSchema = z
  .object({
    weekdays: z.string().optional(),
    sunday: z.string().optional(),
  })
  .passthrough();

/**
 * Contact page data schema
 */
const contactPageDataSchema = z
  .object({
    _id: z.string().optional(),
    eyebrow: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    generalEnquiryLabel: z.string().optional(),
    tradeEnquiryLabel: z.string().optional(),
    contactDetailsTitle: z.string().optional(),
    businessHoursTitle: z.string().optional(),
    footerNote: z.string().optional(),
    contactDetails: contactDetailsSchema.optional(),
    businessHours: businessHoursSchema.optional(),
  })
  .passthrough()
  .nullable();

/**
 * Product list item schema
 */
const productListItemSchema = z
  .object({
    _id: z.string(),
    title: z.string().optional(),
    slug: z
      .object({
        current: z.string(),
      })
      .optional(),
  })
  .passthrough();

/**
 * Site settings schema for SEO and contact info
 */
const siteSettingsSchema = z
  .object({
    organization: z
      .object({
        name: z.string().optional(),
      })
      .optional(),
    contact: z
      .object({
        email: z.string().optional(),
        phone: z.string().optional(),
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
// Dynamic SEO metadata from CMS with fallbacks
// =============================================================================

const DEFAULT_META = {
  title: "Contact Us | Divyansh International",
  description:
    "Get in touch with Divyansh International for premium dry fruits and nuts. Contact us for trade enquiries, bulk orders, and general information.",
} as const;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [rawContactPage, rawSiteSettings] = await Promise.all([
      client.fetch(contactPageQuery),
      client.fetch(siteSettingsQuery),
    ]);

    const contactResult = contactPageDataSchema.safeParse(rawContactPage);
    const siteSettingsResult = siteSettingsSchema.safeParse(rawSiteSettings);

    const contactPage = contactResult.success ? contactResult.data : null;
    const siteSettings = siteSettingsResult.success ? siteSettingsResult.data : null;

    const org = siteSettings?.organization;
    const seo = siteSettings?.seo;

    const pageTitle = contactPage?.title
      ? `${contactPage.title} | ${org?.name ?? "Divyansh International"}`
      : DEFAULT_META.title;

    const pageDescription = contactPage?.description ?? DEFAULT_META.description;

    return {
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        type: (seo?.ogType as "website") ?? "website",
        url: seo?.siteUrl ? `${seo.siteUrl}/contact` : undefined,
        siteName: org?.name ?? "Divyansh International",
      },
      twitter: {
        card: (seo?.twitterCardType as "summary_large_image") ?? "summary_large_image",
        title: pageTitle,
        description: pageDescription,
      },
      alternates: {
        canonical: seo?.siteUrl ? `${seo.siteUrl}/contact` : undefined,
      },
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Contact Page] Metadata fetch failed:", error);
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
    const [rawContactPage, rawSiteSettings, rawProductList] = await Promise.all([
      client.fetch(contactPageQuery),
      client.fetch(siteSettingsQuery),
      client.fetch(productListQuery),
    ]);

    // Validate all data
    const contactResult = contactPageDataSchema.safeParse(rawContactPage);
    const siteSettingsResult = siteSettingsSchema.safeParse(rawSiteSettings);
    const productListResult = z.array(productListItemSchema).safeParse(rawProductList);

    // Development-only validation logging
    if (process.env.NODE_ENV === "development") {
      const validationErrors: Array<{ source: string; issues: z.ZodIssue[] }> = [];

      if (!contactResult.success) {
        validationErrors.push({
          source: "Contact Page",
          issues: contactResult.error.issues,
        });
      }
      if (!siteSettingsResult.success) {
        validationErrors.push({
          source: "Site Settings",
          issues: siteSettingsResult.error.issues,
        });
      }
      if (!productListResult.success) {
        validationErrors.push({
          source: "Product List",
          issues: productListResult.error.issues,
        });
      }

      if (validationErrors.length > 0) {
        console.warn(
          "[Contact Page] Validation warnings:",
          JSON.stringify(validationErrors, null, 2)
        );
      }
    }

    return {
      contactPage: contactResult.success ? contactResult.data : null,
      siteSettings: siteSettingsResult.success ? siteSettingsResult.data : null,
      productList: productListResult.success ? productListResult.data : [],
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Contact Page] Failed to fetch data:", error);
    }
    return {
      contactPage: null,
      siteSettings: null,
      productList: [],
    };
  }
}

// =============================================================================
// PAGE COMPONENT (SERVER COMPONENT)
// =============================================================================

export default async function ContactPage() {
  const { contactPage, siteSettings, productList } = await getData();

  return (
    <div className="relative overflow-hidden">
      {/* Background Visual Elements */}
      <SectionVisualElements />

      {/* Content */}
      <div className="relative z-10">
        <ContactContent
          initialContact={contactPage}
          siteSettings={siteSettings}
          productList={productList}
        />
      </div>
    </div>
  );
}
