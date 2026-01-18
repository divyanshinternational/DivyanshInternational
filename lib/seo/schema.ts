import {
  OrganizationInputSchema,
  type JsonLdOrganization,
  type JsonLdWebsite,
  type JsonLdProduct,
  type JsonLdBrand,
  type OrganizationInput,
  type WebsiteInput,
  type ProductInput,
  type BrandInput,
} from "./types";

// =============================================================================
// GENERATORS
// =============================================================================

export function generateOrganizationSchema(data: OrganizationInput): JsonLdOrganization {
  // Runtime check in dev
  if (process.env.NODE_ENV === "development") {
    OrganizationInputSchema.parse(data);
  }

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name,
    url: data.url,
    logo: data.logoUrl,
    description: data.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: data.contactPoint.telephone,
      contactType: data.contactPoint.contactType,
      areaServed: data.contactPoint.areaServed,
      availableLanguage: data.contactPoint.availableLanguage,
    },
    sameAs: [],
  };
}

export function generateWebSiteSchema(data: WebsiteInput): JsonLdWebsite {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: data.name,
    url: data.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${data.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateProductSchema(data: ProductInput, baseUrl: string): JsonLdProduct {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.title,
    description: data.description || "",
    image: data.heroImage?.url || "",
    url: `${baseUrl}/products/${data.slug?.current || ""}`,
  };
}

export function generateBrandSchema(data: BrandInput): JsonLdBrand {
  return {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: data.name,
    description: data.brandCopy,
    image: data.heroImage?.url || "",
  };
}
