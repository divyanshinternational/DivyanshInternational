import { z } from "zod";

// =============================================================================
// ZOD SCHEMAS (Validation)
// =============================================================================

export const AddressSchema = z.object({
  streetAddress: z.string(),
  addressLocality: z.string(),
  addressRegion: z.string(),
  postalCode: z.string(),
  addressCountry: z.string(),
});

export const ContactPointSchema = z.object({
  telephone: z.string(),
  contactType: z.string(),
  areaServed: z.string(),
  availableLanguage: z.array(z.string()),
});

export const OrganizationInputSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  logoUrl: z.string().url(),
  description: z.string(),
  address: AddressSchema,
  contactPoint: ContactPointSchema,
});

export const WebsiteInputSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

export const ProductInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  heroImage: z.object({ url: z.string().optional() }).optional(),
  slug: z.object({ current: z.string().optional() }).optional(),
});

export const BrandInputSchema = z.object({
  name: z.string(),
  brandCopy: z.string(),
  heroImage: z.object({ url: z.string().optional() }).optional(),
});

// =============================================================================
// INFERRED TYPES (Inputs)
// =============================================================================

export type OrganizationInput = z.infer<typeof OrganizationInputSchema>;
export type WebsiteInput = z.infer<typeof WebsiteInputSchema>;
export type ProductInput = z.infer<typeof ProductInputSchema>;
export type BrandInput = z.infer<typeof BrandInputSchema>;

// =============================================================================
// SCHEMA.ORG INTERFACES (Outputs)
// =============================================================================

export interface JsonLdOrganization {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint: {
    "@type": "ContactPoint";
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string[];
  };
  sameAs: string[];
}

export interface JsonLdWebsite {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  potentialAction: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": "required name=search_term_string";
  };
}

export interface JsonLdProduct {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  description: string;
  image: string;
  url: string;
}

export interface JsonLdBrand {
  "@context": "https://schema.org";
  "@type": "Brand";
  name: string;
  description: string;
  image: string;
}
