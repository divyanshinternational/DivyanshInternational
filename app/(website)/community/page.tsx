import type { Metadata } from "next";
import { z } from "zod";

import CommunityContent from "@/components/pages/CommunityContent";
import { SectionVisualElements } from "@/components/VisualElements";
import { client } from "@/lib/sanity/client";
import { communityQuery, siteSettingsQuery } from "@/lib/sanity/queries";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// Runtime validation for Sanity CMS data
// =============================================================================

/**
 * Environmental Initiative schema
 */
const environmentalInitiativeSchema = z
  .object({
    _key: z.string(),
    icon: z.string(),
    text: z.string(),
  })
  .passthrough();

/**
 * Trade Event schema
 */
const tradeEventSchema = z
  .object({
    _key: z.string(),
    name: z.string(),
    date: z.string(),
    location: z.string(),
  })
  .passthrough();

/**
 * CSR Initiative schema
 */
const csrInitiativeSchema = z
  .object({
    _key: z.string(),
    title: z.string(),
    description: z.string(),
  })
  .passthrough();

/**
 * Community data schema
 */
const communityDataSchema = z
  .object({
    _id: z.string(),
    header: z
      .object({
        eyebrow: z.string(),
        title: z.string(),
        subtitle: z.string(),
      })
      .optional(),
    corePhilosophy: z
      .object({
        paragraph: z.string(),
        highlight: z.string(),
      })
      .optional(),
    educationSection: z
      .object({
        icon: z.string(),
        title: z.string(),
        paragraphs: z.array(z.string()),
        quote: z.string(),
      })
      .optional(),
    womenEmpowerment: z
      .object({
        icon: z.string(),
        title: z.string(),
        paragraphs: z.array(z.string()),
      })
      .optional(),
    childcareSection: z
      .object({
        icon: z.string(),
        title: z.string(),
        paragraphs: z.array(z.string()),
        highlight: z.string(),
      })
      .optional(),
    industryCollaboration: z
      .object({
        icon: z.string(),
        title: z.string(),
        paragraphs: z.array(z.string()),
      })
      .optional(),
    environmentalSection: z
      .object({
        icon: z.string(),
        title: z.string(),
        introText: z.string(),
        initiatives: z.array(environmentalInitiativeSchema),
      })
      .optional(),
    tradeEventsSection: z
      .object({
        title: z.string(),
        subtitle: z.string(),
      })
      .optional(),
    tradeEvents: z.array(tradeEventSchema).optional(),
    closingMessage: z
      .object({
        title: z.string(),
        paragraphs: z.array(z.string()),
        finalHighlight: z.string(),
      })
      .optional(),
    csrInitiatives: z.array(csrInitiativeSchema).optional(),
  })
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
// Match CommunityContent component's expected interface
// =============================================================================

interface CommunityDataProp {
  _id: string;
  header?: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  corePhilosophy?: {
    paragraph: string;
    highlight: string;
  };
  educationSection?: {
    icon: string;
    title: string;
    paragraphs: string[];
    quote: string;
  };
  womenEmpowerment?: {
    icon: string;
    title: string;
    paragraphs: string[];
  };
  childcareSection?: {
    icon: string;
    title: string;
    paragraphs: string[];
    highlight: string;
  };
  industryCollaboration?: {
    icon: string;
    title: string;
    paragraphs: string[];
  };
  environmentalSection?: {
    icon: string;
    title: string;
    introText: string;
    initiatives: { _key: string; icon: string; text: string }[];
  };
  tradeEventsSection?: {
    title: string;
    subtitle: string;
  };
  tradeEvents?: { _key: string; name: string; date: string; location: string }[];
  closingMessage?: {
    title: string;
    paragraphs: string[];
    finalHighlight: string;
  };
  csrInitiatives?: { _key: string; title: string; description: string }[];
}

// =============================================================================
// METADATA CONFIGURATION
// Dynamic SEO metadata with fallbacks
// =============================================================================

const DEFAULT_META = {
  title: "Community & CSR | Divyansh International",
  description:
    "Learn about our community initiatives, CSR programs, and trade events. Divyansh International is committed to sustainable practices and community development.",
} as const;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const rawSiteSettings = await client.fetch(siteSettingsQuery);
    const siteSettingsResult = siteSettingsSchema.safeParse(rawSiteSettings);
    const siteSettings = siteSettingsResult.success ? siteSettingsResult.data : null;

    const org = siteSettings?.organization;
    const seo = siteSettings?.seo;

    const pageTitle = `Community & CSR | ${org?.name ?? "Divyansh International"}`;
    const pageDescription = DEFAULT_META.description;

    return {
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        type: (seo?.ogType as "website") ?? "website",
        url: seo?.siteUrl ? `${seo.siteUrl}/community` : undefined,
        siteName: org?.name ?? "Divyansh International",
      },
      twitter: {
        card: (seo?.twitterCardType as "summary_large_image") ?? "summary_large_image",
        title: pageTitle,
        description: pageDescription,
      },
      alternates: {
        canonical: seo?.siteUrl ? `${seo.siteUrl}/community` : undefined,
      },
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Community Page] Metadata fetch failed:", error);
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

async function getData(): Promise<{ community: CommunityDataProp | null }> {
  try {
    const rawCommunity = await client.fetch(communityQuery);
    const result = communityDataSchema.safeParse(rawCommunity);

    if (!result.success && process.env.NODE_ENV === "development") {
      console.warn("[Community Page] Data validation failed:", result.error.issues);
    }

    // Type assertion is safe: Zod validated the structure
    return {
      community: result.success ? (result.data as unknown as CommunityDataProp) : null,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Community Page] Failed to fetch data:", error);
    }
    return { community: null };
  }
}

// =============================================================================
// PAGE COMPONENT (SERVER COMPONENT)
// =============================================================================

export default async function CommunityPage() {
  const { community } = await getData();

  return (
    <div className="relative overflow-hidden">
      {/* Background Visual Elements */}
      <SectionVisualElements />

      {/* Content */}
      <div className="relative z-10">
        <CommunityContent initialCommunity={community} />
      </div>
    </div>
  );
}
