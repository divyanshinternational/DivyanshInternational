import Script from "next/script";
import { z } from "zod";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const AddressSchema = z.object({
  streetAddress: z.string().optional(),
  addressLocality: z.string().optional(),
  addressRegion: z.string().optional(),
  postalCode: z.string().optional(),
  addressCountry: z.string().optional(),
});

const ContactPointSchema = z.object({
  telephone: z.string().optional(),
  contactType: z.string().optional(),
  areaServed: z.string().optional(),
  availableLanguage: z.array(z.string()).optional(),
});

const OrganizationDataSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  logoUrl: z.string().url().optional(),
  description: z.string().optional(),
  address: AddressSchema.optional(),
  contactPoint: ContactPointSchema.optional(),
});

const StructuredDataPropsSchema = z.object({
  organization: OrganizationDataSchema.optional(),
});

// =============================================================================
// TYPE DEFINITIONS (Inferred from Zod Schemas)
// =============================================================================

export type OrganizationData = z.infer<typeof OrganizationDataSchema>;
export type StructuredDataProps = z.infer<typeof StructuredDataPropsSchema>;

// =============================================================================
// COMPONENT
// =============================================================================

export default function StructuredData({ organization }: StructuredDataProps) {
  // Validate props during development to catch data issues early
  if (process.env.NODE_ENV === "development") {
    const result = StructuredDataPropsSchema.safeParse({ organization });
    if (!result.success) {
      console.warn("[StructuredData] Validation failed:", result.error.flatten());
    }
  }

  if (!organization) return null;

  // Build address object only if address data exists
  const addressJsonLd = organization.address
    ? {
        "@type": "PostalAddress" as const,
        ...(organization.address.streetAddress && {
          streetAddress: organization.address.streetAddress,
        }),
        ...(organization.address.addressLocality && {
          addressLocality: organization.address.addressLocality,
        }),
        ...(organization.address.addressRegion && {
          addressRegion: organization.address.addressRegion,
        }),
        ...(organization.address.postalCode && {
          postalCode: organization.address.postalCode,
        }),
        ...(organization.address.addressCountry && {
          addressCountry: organization.address.addressCountry,
        }),
      }
    : undefined;

  // Build contact point object only if contact data exists
  const contactPointJsonLd = organization.contactPoint
    ? {
        "@type": "ContactPoint" as const,
        ...(organization.contactPoint.telephone && {
          telephone: organization.contactPoint.telephone,
        }),
        ...(organization.contactPoint.contactType && {
          contactType: organization.contactPoint.contactType,
        }),
        ...(organization.contactPoint.areaServed && {
          areaServed: organization.contactPoint.areaServed,
        }),
        ...(organization.contactPoint.availableLanguage && {
          availableLanguage: organization.contactPoint.availableLanguage,
        }),
      }
    : undefined;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organization.name,
    url: organization.url,
    ...(organization.logoUrl && { logo: organization.logoUrl }),
    ...(organization.description && { description: organization.description }),
    ...(addressJsonLd && { address: addressJsonLd }),
    ...(contactPointJsonLd && { contactPoint: contactPointJsonLd }),
  };

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
    />
  );
}
