import Script from "next/script";
import { z } from "zod";

import HeroSlider from "@/components/sections/HeroSlider";
import ProductShowcase from "@/components/sections/ProductShowcase";
import VideoTestimonialsSection from "@/components/sections/VideoTestimonials";
import SustainabilitySection from "@/components/sections/SustainabilitySection";
import TrustSection from "@/components/sections/TrustSection";
import CTASection from "@/components/sections/CTASection";
import FeaturedBanner from "@/components/sections/FeaturedBanner";
import DroneDiaries from "@/components/sections/DroneDiaries";
import ProcessFlowSection from "@/components/sections/ProcessFlowSection";

import SpiralQuote from "@/components/SpiralQuote";
import AnimationWrapper from "@/components/ui/AnimationWrapper";
import { HeroVisualElements } from "@/components/VisualElements";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/seo/schema";

import { client } from "@/lib/sanity/client";
import {
  productsQuery,
  heroSlidesQuery,
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
// =============================================================================

/**
 * Site settings schema
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
    processSection: z.unknown().optional(),
    productShowcaseSection: z.unknown().optional(),
    sustainabilitySection: z.unknown().optional(),
    trustSection: z.unknown().optional(),
    featuredBanner: z.unknown().optional(),
    droneDiaries: z.unknown().optional(),
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
  siteUrl: "https://divyanshint.com",
} as const;

// =============================================================================
// DATA FETCHING WITH VALIDATION
// =============================================================================

async function getData() {
  try {
    const [
      products,
      heroSlides,
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
// HOME PAGE COMPONENT
// =============================================================================

export default async function Home() {
  const {
    products,
    heroSlides,
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

  // Generate JSON-LD schemas
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

        <HeroSlider
          initialSlides={heroSlides}
          stats={homePage?.heroStats}
          accessibility={siteSettings?.accessibility}
          heroConfig={siteSettings?.heroConfig}
          routing={siteSettings?.routing}
        />

        {/* Process Flow Section */}
        <AnimationWrapper delay={0.1}>
          <ProcessFlowSection
            initialProcessSteps={processSteps}
            sectionSettings={homePage?.processSection}
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

        {/* Product Showcase */}
        <AnimationWrapper delay={0.1}>
          <ProductShowcase
            initialProducts={products}
            siteSettings={siteSettings}
            headerData={homePage?.productShowcaseSection}
          />
        </AnimationWrapper>

        {/* Featured Visual Banner */}
        <AnimationWrapper delay={0.1}>
          <FeaturedBanner bannerData={homePage?.featuredBanner} />
        </AnimationWrapper>

        {/* Trust & Certifications */}
        <AnimationWrapper delay={0.1}>
          <TrustSection
            initialCertificates={certificates}
            sectionSettings={homePage?.trustSection}
            routing={siteSettings?.routing}
          />
        </AnimationWrapper>

        {/* Drone Diaries Video Gallery */}
        <AnimationWrapper delay={0.1}>
          <DroneDiaries sectionData={homePage?.droneDiaries} />
        </AnimationWrapper>

        {/* Video Testimonials */}
        <AnimationWrapper delay={0.1}>
          <VideoTestimonialsSection
            initialTestimonials={testimonials}
            sectionSettings={testimonialsSection}
            routing={siteSettings?.routing}
          />
        </AnimationWrapper>

        {/* Sustainability */}
        <AnimationWrapper delay={0.1}>
          <SustainabilitySection
            initialPillars={sustainabilityPillars}
            sectionSettings={homePage?.sustainabilitySection}
            routing={siteSettings?.routing}
          />
        </AnimationWrapper>

        {/* Final CTA */}
        <AnimationWrapper delay={0.1}>
          <CTASection initialCTA={cta} />
        </AnimationWrapper>
      </div>
    </div>
  );
}
