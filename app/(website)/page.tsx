import Script from "next/script";
import { z } from "zod";

import HeroSlider from "@/components/sections/HeroSlider";
import CapabilitiesSection from "@/components/sections/CapabilitiesSection";
import ProductShowcase from "@/components/sections/ProductShowcase";
import ProcessSection from "@/components/sections/ProcessSection";
import VideoTestimonialsSection from "@/components/sections/VideoTestimonials";
import SustainabilitySection from "@/components/sections/SustainabilitySection";
import TrustSection from "@/components/sections/TrustSection";
import CTASection from "@/components/sections/CTASection";

import SpiralQuote from "@/components/SpiralQuote";
import AnimationWrapper from "@/components/ui/AnimationWrapper";
import { HeroVisualElements } from "@/components/VisualElements";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/seo/schema";

import { client } from "@/lib/sanity/client";
import {
  productsQuery,
  heroSlidesQuery,
  capabilitiesQuery,
  certificatesQuery,
  testimonialsQuery,
  processQuery as processStepsQuery,
  sustainabilityQuery as sustainabilityPillarsQuery,
  ctaQuery,
  quoteQuery,
  siteSettingsQuery,
  testimonialsSectionQuery,
  homePageQuery,
} from "@/lib/sanity/queries";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// Runtime validation for core CMS data structures
// =============================================================================

/**
 * Site settings schema (validates critical fields)
 */
const siteSettingsSchema = z
  .object({
    organization: z
      .object({
        name: z.string().optional(),
      })
      .passthrough()
      .optional(),
    seo: z
      .object({
        siteUrl: z.string().optional(),
      })
      .passthrough()
      .optional(),
    accessibility: z.unknown().optional(),
    heroConfig: z.unknown().optional(),
    routing: z.unknown().optional(),
    navigation: z.unknown().optional(),
  })
  .passthrough()
  .nullable();

/**
 * Home page data schema
 */
const homePageSchema = z
  .object({
    heroStats: z.unknown().optional(),
    spiralQuoteSection: z.unknown().optional(),
    capabilitiesSection: z.unknown().optional(),
    processSection: z.unknown().optional(),
    productShowcaseSection: z.unknown().optional(),
    sustainabilitySection: z.unknown().optional(),
    trustSection: z.unknown().optional(),
  })
  .passthrough()
  .nullable();

/**
 * Generic array schema for section data
 */
const arrayDataSchema = z.array(z.unknown());

// =============================================================================
// DEFAULT FALLBACK VALUES
// =============================================================================

const DEFAULTS = {
  organizationName: "Divyansh International",
  siteUrl: "https://divyanshinternational.com",
} as const;

// =============================================================================
// DATA FETCHING WITH VALIDATION
// =============================================================================

async function getData() {
  try {
    const [
      products,
      heroSlides,
      capabilities,
      certificates,
      testimonials,
      processSteps,
      sustainabilityPillars,
      cta,
      quote,
      rawSiteSettings,
      testimonialsSection,
      rawHomePage,
    ] = await Promise.all([
      client.fetch(productsQuery),
      client.fetch(heroSlidesQuery),
      client.fetch(capabilitiesQuery),
      client.fetch(certificatesQuery),
      client.fetch(testimonialsQuery),
      client.fetch(processStepsQuery),
      client.fetch(sustainabilityPillarsQuery),
      client.fetch(ctaQuery),
      client.fetch(quoteQuery),
      client.fetch(siteSettingsQuery),
      client.fetch(testimonialsSectionQuery),
      client.fetch(homePageQuery),
    ]);

    // Validate critical data
    const siteSettingsResult = siteSettingsSchema.safeParse(rawSiteSettings);
    const homePageResult = homePageSchema.safeParse(rawHomePage);

    // Development-only validation logging
    if (process.env.NODE_ENV === "development") {
      if (!siteSettingsResult.success) {
        console.warn(
          "[Home Page] Site settings validation failed:",
          siteSettingsResult.error.issues
        );
      }
      if (!homePageResult.success) {
        console.warn("[Home Page] Home page data validation failed:", homePageResult.error.issues);
      }
    }

    return {
      products: arrayDataSchema.safeParse(products).success ? products : [],
      heroSlides: arrayDataSchema.safeParse(heroSlides).success ? heroSlides : [],
      capabilities: arrayDataSchema.safeParse(capabilities).success ? capabilities : [],
      certificates: arrayDataSchema.safeParse(certificates).success ? certificates : [],
      testimonials: arrayDataSchema.safeParse(testimonials).success ? testimonials : [],
      processSteps: arrayDataSchema.safeParse(processSteps).success ? processSteps : [],
      sustainabilityPillars: arrayDataSchema.safeParse(sustainabilityPillars).success
        ? sustainabilityPillars
        : [],
      cta,
      quote,
      siteSettings: siteSettingsResult.success ? rawSiteSettings : null,
      testimonialsSection,
      homePage: homePageResult.success ? rawHomePage : null,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Home Page] Failed to fetch data:", error);
    }
    return {
      products: [],
      heroSlides: [],
      capabilities: [],
      certificates: [],
      testimonials: [],
      processSteps: [],
      sustainabilityPillars: [],
      cta: null,
      quote: null,
      siteSettings: null,
      testimonialsSection: null,
      homePage: null,
    };
  }
}

// =============================================================================
// HOME PAGE COMPONENT (SERVER COMPONENT)
// =============================================================================

export default async function Home() {
  const {
    products,
    heroSlides,
    capabilities,
    certificates,
    testimonials,
    processSteps,
    sustainabilityPillars,
    cta,
    quote,
    siteSettings,
    testimonialsSection,
    homePage,
  } = await getData();

  // Safe access for schema generation
  const organization = siteSettings?.organization ?? { name: DEFAULTS.organizationName };
  const siteUrl = siteSettings?.seo?.siteUrl ?? DEFAULTS.siteUrl;

  // Generate JSON-LD schemas (safe - no user input, only CMS data)
  const organizationSchema = generateOrganizationSchema(organization);
  const websiteSchema = generateWebSiteSchema({
    name: organization.name ?? DEFAULTS.organizationName,
    url: siteUrl,
  });

  return (
    <div className="relative overflow-hidden">
      {/* Background Visual Elements */}
      <HeroVisualElements />

      {/* Content */}
      <div className="relative z-10">
        {/* Structured Data - JSON-LD is safe for dangerouslySetInnerHTML as content is from CMS */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        <AnimationWrapper>
          <HeroSlider
            initialSlides={heroSlides}
            stats={homePage?.heroStats}
            accessibility={siteSettings?.accessibility}
            heroConfig={siteSettings?.heroConfig}
            routing={siteSettings?.routing}
          />
        </AnimationWrapper>

        <AnimationWrapper delay={0.1}>
          <SpiralQuote
            initialQuote={quote}
            labels={{
              spiralQuoteSection: homePage?.spiralQuoteSection,
              navigation: siteSettings?.navigation,
            }}
          />
        </AnimationWrapper>

        <AnimationWrapper delay={0.2}>
          <CapabilitiesSection
            initialCapabilities={capabilities}
            initialCertificates={certificates}
            sectionSettings={homePage?.capabilitiesSection}
          />
        </AnimationWrapper>

        <AnimationWrapper delay={0.4}>
          <ProcessSection
            initialProcessSteps={processSteps}
            sectionSettings={homePage?.processSection}
            routing={siteSettings?.routing}
          />
        </AnimationWrapper>

        <AnimationWrapper delay={0.3}>
          <ProductShowcase
            initialProducts={products}
            siteSettings={siteSettings}
            headerData={homePage?.productShowcaseSection}
          />
        </AnimationWrapper>

        <AnimationWrapper delay={0.5}>
          <VideoTestimonialsSection
            initialTestimonials={testimonials}
            sectionSettings={testimonialsSection}
            routing={siteSettings?.routing}
          />
        </AnimationWrapper>

        <AnimationWrapper delay={0.6}>
          <SustainabilitySection
            initialPillars={sustainabilityPillars}
            sectionSettings={homePage?.sustainabilitySection}
            routing={siteSettings?.routing}
          />
        </AnimationWrapper>

        <AnimationWrapper delay={0.7}>
          <TrustSection
            initialCertificates={certificates}
            sectionSettings={homePage?.trustSection}
            routing={siteSettings?.routing}
          />
        </AnimationWrapper>

        <AnimationWrapper delay={0.8}>
          <CTASection initialCTA={cta} />
        </AnimationWrapper>
      </div>
    </div>
  );
}
