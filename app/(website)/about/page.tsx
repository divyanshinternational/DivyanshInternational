import type { Metadata } from "next";
import type { SanityImageSource } from "@sanity/image-url";
import { z } from "zod";

import AboutContent from "@/components/pages/AboutContent";
import type { ContentBannerData } from "@/components/ui/ContentBanner";

export const dynamic = "force-dynamic";

import { SectionVisualElements } from "@/components/VisualElements";
import { client } from "@/lib/sanity/client";
import {
  teamMembersQuery,
  timelineQuery,
  aboutQuery,
  siteSettingsQuery,
  capabilitiesQuery,
} from "@/lib/sanity/queries";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// Runtime validation for CMS data integrity
// =============================================================================

/**
 * Schema for Sanity image objects
 * Uses passthrough to allow Sanity's dynamic image properties
 */
const sanityImageSchema = z
  .object({
    _type: z.literal("image").optional(),
    asset: z
      .object({
        _ref: z.string(),
        _type: z.literal("reference").optional(),
      })
      .optional(),
  })
  .passthrough();

/**
 * Team member schema - validates core fields
 */
const teamMemberSchema = z
  .object({
    _id: z.string(),
    name: z.string().min(1, "Team member name is required"),
    role: z.string().default(""),
    image: sanityImageSchema.nullable().optional(),
    bio: z.string().optional().nullable(),
  })
  .passthrough();

/**
 * Timeline entry schema with year validation
 */
const timelineEntrySchema = z
  .object({
    _id: z.string(),
    year: z.number().int().min(1900).max(2100),
    title: z.string().min(1, "Timeline title is required"),
    description: z.string().default(""),
    image: sanityImageSchema.nullable().optional(),
  })
  .passthrough();

/**
 * Stats item schema for "Who We Are" section
 */
const statsItemSchema = z
  .object({
    _key: z.string().optional(),
    value: z.string().optional(),
    label: z.string().optional(),
  })
  .passthrough();

/**
 * Distribution region schema for map markers
 */
const distributionRegionSchema = z
  .object({
    _key: z.string().optional(),
    name: z.string().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
  })
  .passthrough();

/**
 * Section with title and description (reusable)
 */
const sectionSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
  })
  .passthrough();

/**
 * Section with eyebrow, title pattern
 */
const eyebrowSectionSchema = z
  .object({
    eyebrow: z.string().optional(),
    title: z.string().optional(),
  })
  .passthrough();

/**
 * ContentBanner schema for reusable banner sections
 */
const contentBannerSchema = z.object({
  _key: z.string().optional(),
  _type: z.literal("contentBanner").optional(),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  highlight: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  layout: z
    .enum(["bottom-image", "right-image", "left-image", "background-image", "text-only"])
    .optional(),
  imageUrl: z.string().optional(),
  bgOverlay: z.enum(["none", "black-10", "black-20", "black-40", "white-10"]).optional(),
  theme: z.enum(["light", "dark"]).optional(),
});

/**
 * Poster Slider Section Schema
 */
const posterSliderSectionSchema = z.object({
  enabled: z.boolean().optional(),
  autoPlayInterval: z.number().optional(),
  posters: z.array(contentBannerSchema).optional(),
});

/**
 * Main about page data schema
 */
const aboutDataSchema = z
  .object({
    _id: z.string().optional(),
    whoWeAre: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        image: sanityImageSchema.nullable().optional(),
        stats: z.array(statsItemSchema).optional(),
      })
      .passthrough()
      .optional(),
    mission: sectionSchema.optional(),
    vision: sectionSchema.optional(),
    ourStory: z
      .object({
        eyebrow: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
      })
      .passthrough()
      .optional(),
    posterSliderSection: posterSliderSectionSchema.optional(),
    commitment: sectionSchema.optional(),
    teamSection: eyebrowSectionSchema.optional(),
    journeySection: eyebrowSectionSchema.optional(),
    distributionRegions: z.array(distributionRegionSchema).optional(),
  })
  .passthrough()
  .nullable();

/**
 * Site settings schema for distribution and SEO
 */
const siteSettingsSchema = z
  .object({
    _id: z.string().optional(),
    organization: z
      .object({
        name: z.string().optional(),
        tagline: z.string().optional(),
      })
      .passthrough()
      .optional(),
    distribution: z
      .object({
        heading: z.string().optional(),
        subheading: z.string().optional(),
      })
      .passthrough()
      .optional(),
    seo: z
      .object({
        siteUrl: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        ogType: z.string().optional(),
        twitterCardType: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
  .nullable();

/**
 * Capability item schema for infographics
 */
const capabilitySchema = z
  .object({
    _id: z.string(),
    title: z.string(),
    description: z.string(),
    metric: z.string().nullable().optional(),
    icon: z.string().nullable().optional(),
  })
  .passthrough();

// =============================================================================
// COMPONENT PROP TYPES
// Match AboutContent.tsx internal types exactly for strict TS compatibility
// =============================================================================

type TeamMember = {
  _id: string;
  name: string;
  role: string;
  image: SanityImageSource | string;
  bio?: string;
};

type TimelineEntry = {
  _id: string;
  year: number;
  title: string;
  description: string;
};

type Capability = {
  _id: string;
  title: string;
  description: string;
  metric?: string;
  icon?: string;
};

interface AboutData {
  whoWeAre?: { title: string; description: string; image?: SanityImageSource };
  mission?: { title: string; description: string };
  vision?: { title: string; description: string };
  ourStory?: { eyebrow: string; title: string; description: string };
  commitment?: { title: string; description: string };
  teamSection?: { eyebrow: string; title: string };
  journeySection?: { eyebrow: string; title: string };
  posterSliderSection?: z.infer<typeof posterSliderSectionSchema>;
  distributionRegions?: unknown;
}

// =============================================================================
// METADATA CONFIGURATION
// Dynamic SEO metadata pulled from CMS with intelligent fallbacks
// =============================================================================

const DEFAULT_META = {
  title: "About Us | Divyansh International",
  description:
    "Learn about Divyansh International - our story, mission, vision, and the team behind premium quality dry fruits and nuts exports since 1999.",
} as const;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteSettings = await client.fetch(siteSettingsQuery);
    const validatedSettings = siteSettingsSchema.safeParse(siteSettings);

    const seo = validatedSettings.success ? validatedSettings.data?.seo : null;
    const org = validatedSettings.success ? validatedSettings.data?.organization : null;

    const pageTitle = `About Us | ${org?.name ?? "Divyansh International"}`;
    const pageDescription = DEFAULT_META.description;

    return {
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        type: (seo?.ogType as "website") ?? "website",
        url: seo?.siteUrl ? `${seo.siteUrl}/about` : undefined,
        siteName: org?.name ?? "Divyansh International",
      },
      twitter: {
        card: (seo?.twitterCardType as "summary_large_image") ?? "summary_large_image",
        title: pageTitle,
        description: pageDescription,
      },
      alternates: {
        canonical: seo?.siteUrl ? `${seo.siteUrl}/about` : undefined,
      },
    };
  } catch (error) {
    // Graceful fallback on fetch failure
    if (process.env.NODE_ENV === "development") {
      console.error("[About Page] Metadata fetch failed:", error);
    }
    return {
      title: DEFAULT_META.title,
      description: DEFAULT_META.description,
    };
  }
}

// =============================================================================
// DATA FETCHING WITH VALIDATION
// Parallel fetching with comprehensive error handling
// =============================================================================

async function getData(): Promise<{
  teamMembers: TeamMember[];
  timeline: TimelineEntry[];
  about: AboutData | null;
  siteSettings: unknown;
  capabilities: Capability[];
  posterSliderSection: z.infer<typeof posterSliderSectionSchema> | null;
}> {
  const [rawTeamMembers, rawTimeline, rawAbout, rawSiteSettings, rawCapabilities] =
    await Promise.all([
      client.fetch(teamMembersQuery),
      client.fetch(timelineQuery),
      client.fetch(aboutQuery),
      client.fetch(siteSettingsQuery),
      client.fetch(capabilitiesQuery),
    ]);

  // Validate all data with zod - safeParse for graceful degradation
  const teamMembersResult = z.array(teamMemberSchema).safeParse(rawTeamMembers);
  const timelineResult = z.array(timelineEntrySchema).safeParse(rawTimeline);
  const aboutResult = aboutDataSchema.safeParse(rawAbout);
  const siteSettingsResult = siteSettingsSchema.safeParse(rawSiteSettings);
  const capabilitiesResult = z.array(capabilitySchema).safeParse(rawCapabilities);

  // Development-only validation logging with detailed error output
  if (process.env.NODE_ENV === "development") {
    const validationErrors: Array<{ source: string; issues: z.ZodIssue[] }> = [];

    if (!teamMembersResult.success) {
      validationErrors.push({
        source: "Team Members",
        issues: teamMembersResult.error.issues,
      });
    }
    if (!timelineResult.success) {
      validationErrors.push({
        source: "Timeline",
        issues: timelineResult.error.issues,
      });
    }
    if (!aboutResult.success) {
      validationErrors.push({
        source: "About Data",
        issues: aboutResult.error.issues,
      });
    }
    if (!siteSettingsResult.success) {
      validationErrors.push({
        source: "Site Settings",
        issues: siteSettingsResult.error.issues,
      });
    }

    if (validationErrors.length > 0) {
      console.warn("[About Page] Validation warnings:", JSON.stringify(validationErrors, null, 2));
    }
  }

  // Transform validated data to component-compatible types
  // Type assertions are safe: Zod has validated structure, types match component expectations
  return {
    teamMembers: teamMembersResult.success
      ? (teamMembersResult.data as unknown as TeamMember[])
      : [],
    timeline: timelineResult.success ? (timelineResult.data as unknown as TimelineEntry[]) : [],
    about: aboutResult.success ? (aboutResult.data as unknown as AboutData) : null,
    siteSettings: siteSettingsResult.success ? siteSettingsResult.data : null,
    capabilities: capabilitiesResult.success
      ? (capabilitiesResult.data as unknown as Capability[])
      : [],
    posterSliderSection:
      rawAbout?.posterSliderSection &&
      posterSliderSectionSchema.safeParse(rawAbout.posterSliderSection).success
        ? posterSliderSectionSchema.parse(rawAbout.posterSliderSection)
        : null,
  };
}

// =============================================================================
// PAGE COMPONENT (SERVER COMPONENT)
// Renders the About page with validated CMS data
// =============================================================================

export default async function AboutPage() {
  const data = await getData();

  return (
    <div className="relative overflow-hidden">
      {/* Background Visual Elements */}
      <SectionVisualElements />

      {/* Content - data validated at runtime via zod in getData() */}
      <div className="relative z-10">
        <AboutContent
          initialTeamMembers={data.teamMembers}
          initialTimeline={data.timeline}
          initialAbout={data.about}
          siteSettings={data.siteSettings}
          capabilities={data.capabilities}
          posterSliderSection={
            (data.posterSliderSection as {
              enabled?: boolean;
              autoPlayInterval?: number;
              posters?: ContentBannerData[];
            }) ?? undefined
          }
        />
      </div>
    </div>
  );
}
