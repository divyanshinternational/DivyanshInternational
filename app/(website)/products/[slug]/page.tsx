import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import ProductDetail from "@/components/ProductDetail";
import { client } from "@/lib/sanity/client";
import { getLocalized } from "@/lib/i18n";
import { productBySlugQuery, productListQuery, siteSettingsQuery } from "@/lib/sanity/queries";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// Runtime validation for Sanity CMS data - validates structure, allows passthrough
// =============================================================================

/**
 * Sanity slug schema
 */
const slugSchema = z.object({
  _type: z.literal("slug").optional(),
  current: z.string(),
});

/**
 * Product data schema (loose validation to allow component's expected types)
 */
const productSchema = z
  .object({
    _id: z.string(),
    slug: slugSchema,
    title: z.unknown(), // LocaleString type handled by component
    category: z.string().optional(),
    description: z.unknown().optional(), // LocaleText type
    heroHeading: z.unknown().optional(),
    introParagraphs: z.array(z.unknown()).optional(),
    listSections: z.array(z.unknown()).optional(),
    ctaLine: z.unknown().optional(),
    heroImage: z.unknown().optional(),
    gallery: z.array(z.unknown()).optional(),
    microVideo: z.string().nullable().optional(),
  })
  .passthrough()
  .nullable();

/**
 * Product list item schema (for generateStaticParams)
 */
const productListItemSchema = z.object({
  _id: z.string(),
  slug: slugSchema,
});

/**
 * Site settings schema
 */
const siteSettingsSchema = z
  .object({
    error: z
      .object({
        notFoundTitle: z.string().optional(),
      })
      .passthrough()
      .optional(),
    seo: z
      .object({
        siteUrl: z.string().optional(),
        metaTitleSuffix: z.string().optional(),
        ogType: z.string().optional(),
        twitterCardType: z.string().optional(),
      })
      .passthrough()
      .optional(),
    organization: z
      .object({
        name: z.string().optional(),
      })
      .passthrough()
      .optional(),
    productDetail: z.unknown().optional(),
    common: z.unknown().optional(),
    navigation: z.unknown().optional(),
    apiConfig: z.unknown().optional(),
    routing: z.unknown().optional(),
    analytics: z.unknown().optional(),
  })
  .passthrough()
  .nullable();

// =============================================================================
// PAGE PROPS TYPE
// =============================================================================

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// =============================================================================
// STATIC PARAMS GENERATION
// Pre-renders all product pages at build time
// =============================================================================

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const rawProducts = await client.fetch(productListQuery);
    const result = z.array(productListItemSchema).safeParse(rawProducts);

    if (!result.success) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Product Page] generateStaticParams validation failed:", result.error.issues);
      }
      return [];
    }

    return result.data.map((product) => ({
      slug: product.slug.current,
    }));
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Product Page] generateStaticParams failed:", error);
    }
    return [];
  }
}

// =============================================================================
// DATA FETCHING WITH VALIDATION
// =============================================================================

async function getProduct(slug: string) {
  try {
    const [rawProduct, rawSiteSettings] = await Promise.all([
      client.fetch(productBySlugQuery, { slug }),
      client.fetch(siteSettingsQuery),
    ]);

    const productResult = productSchema.safeParse(rawProduct);
    const siteSettingsResult = siteSettingsSchema.safeParse(rawSiteSettings);

    // Development-only validation logging
    if (process.env.NODE_ENV === "development") {
      if (!productResult.success && rawProduct) {
        console.warn("[Product Page] Product validation failed:", productResult.error.issues);
      }
      if (!siteSettingsResult.success) {
        console.warn(
          "[Product Page] Site settings validation failed:",
          siteSettingsResult.error.issues
        );
      }
    }

    return {
      product: productResult.success ? rawProduct : null,
      siteSettings: siteSettingsResult.success ? rawSiteSettings : null,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Product Page] Failed to fetch product:", error);
    }
    return { product: null, siteSettings: null };
  }
}

// =============================================================================
// METADATA GENERATION
// Dynamic SEO metadata for each product
// =============================================================================

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { product, siteSettings } = await getProduct(slug);

  // Product not found - return minimal metadata
  if (!product) {
    return {
      title: siteSettings?.error?.notFoundTitle ?? "Product Not Found",
    };
  }

  const productTitle = getLocalized(product.title, "en") || "Product";
  const productDescription =
    getLocalized(product.description, "en") ||
    `Premium quality ${productTitle} from Divyansh International`;

  const seo = siteSettings?.seo;
  const metaSuffix = seo?.metaTitleSuffix ?? " | Divyansh International";
  const fullTitle = `${productTitle}${metaSuffix}`;

  return {
    title: fullTitle,
    description: productDescription,
    openGraph: {
      title: fullTitle,
      description: productDescription,
      type: (seo?.ogType as "website") ?? "website",
      url: seo?.siteUrl ? `${seo.siteUrl}/products/${slug}` : undefined,
      siteName: siteSettings?.organization?.name ?? "Divyansh International",
    },
    twitter: {
      card: (seo?.twitterCardType as "summary_large_image") ?? "summary_large_image",
      title: fullTitle,
      description: productDescription,
    },
    alternates: {
      canonical: seo?.siteUrl ? `${seo.siteUrl}/products/${slug}` : undefined,
    },
  };
}

// =============================================================================
// PAGE COMPONENT (SERVER COMPONENT)
// =============================================================================

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const { product, siteSettings } = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} labels={siteSettings} />;
}
