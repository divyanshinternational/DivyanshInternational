"use client";

/**
 * Privacy Policy Page Content Component
 *
 * Displays the privacy policy content with sections rendered via PortableText.
 * Uses framer-motion for animations - requires client component.
 *
 * All content is fetched from Sanity CMS and validated with Zod schemas
 * for runtime type safety.
 */

import { motion } from "framer-motion";
import { PortableText, type PortableTextBlock } from "next-sanity";
import { z } from "zod";
import { LeafIcon } from "@/components/assets/Decorations";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const ContentSectionSchema = z.object({
  _key: z.string().optional(),
  heading: z.string().optional(),
  body: z.array(z.unknown()).optional(),
});

const PrivacyPolicyDataSchema = z.object({
  _id: z.string().optional(),
  title: z.string(),
  lastUpdated: z.string(),
  content: z.array(ContentSectionSchema).optional(),
});

const AddressSchema = z.object({
  streetAddress: z.string().optional(),
  addressLocality: z.string().optional(),
  postalCode: z.string().optional(),
  addressRegion: z.string().optional(),
  addressCountry: z.string().optional(),
});

const ContactPointSchema = z.object({
  telephone: z.string().optional(),
  contactType: z.string().optional(),
  email: z.string().optional(),
});

const OrganizationSchema = z.object({
  name: z.string().optional(),
  address: AddressSchema.optional(),
  contactPoint: ContactPointSchema.optional(),
});

const SiteSettingsSchema = z
  .object({
    organization: OrganizationSchema.nullish(),
    contact: z
      .object({
        contactDetails: z
          .object({
            email: z.string().optional(),
          })
          .optional(),
      })
      .nullish(),
  })
  .partial();

// =============================================================================
// TYPE DEFINITIONS (Inferred from Zod Schemas)
// =============================================================================

type PrivacyPolicyData = z.infer<typeof PrivacyPolicyDataSchema>;
type SiteSettings = z.infer<typeof SiteSettingsSchema>;

interface PrivacyPolicyContentProps {
  privacyPolicy: unknown;
  siteSettings: unknown;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const COUNTRY_NAME_MAP: Record<string, string> = {
  IN: "India",
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
};

const DEFAULT_EMAIL = "Care@divyanshinternational.com";

// =============================================================================
// VALIDATION & DATA PARSING
// =============================================================================

function parsePrivacyPolicyData(data: unknown): PrivacyPolicyData | null {
  const result = PrivacyPolicyDataSchema.safeParse(data);
  if (!result.success) {
    console.error(
      "[PrivacyPolicyContent] Privacy policy validation failed:",
      result.error.format()
    );
    return null;
  }
  return result.data;
}

function parseSiteSettings(data: unknown): SiteSettings {
  const result = SiteSettingsSchema.safeParse(data);
  if (!result.success) {
    console.warn("[PrivacyPolicyContent] Site settings validation failed, using defaults");
    return {};
  }
  return result.data;
}

function formatCountryName(countryCode: string | undefined): string {
  if (!countryCode) return "";
  return COUNTRY_NAME_MAP[countryCode] ?? countryCode;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function PrivacyPolicyContent({
  privacyPolicy: rawPrivacyPolicy,
  siteSettings: rawSiteSettings,
}: PrivacyPolicyContentProps) {
  // Validate incoming data
  const privacyPolicy = parsePrivacyPolicyData(rawPrivacyPolicy);
  const siteSettings = parseSiteSettings(rawSiteSettings);

  // Error state if privacy policy data is invalid
  if (!privacyPolicy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-deep-brown text-lg">Unable to load Privacy Policy content.</p>
      </div>
    );
  }

  const organization = siteSettings.organization;
  const contactEmail =
    siteSettings.contact?.contactDetails?.email ??
    organization?.contactPoint?.email ??
    DEFAULT_EMAIL;
  const contactPhone = organization?.contactPoint?.telephone;

  return (
    <div className="bg-background min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="uppercase tracking-[0.4em] text-xs text-(--color-muted) mb-4">Legal</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-deep-brown mb-6 font-heading">
              {privacyPolicy.title}
            </h1>
            <p className="text-lg text-(--color-slate) max-w-3xl mx-auto leading-relaxed">
              Last updated:{" "}
              {new Date(privacyPolicy.lastUpdated).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </motion.div>
          <div className="absolute top-0 left-0 -z-10 opacity-10 -rotate-12" aria-hidden="true">
            <LeafIcon className="w-64 h-64 text-leaf-green" />
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-sand shadow-sm">
          <div className="prose prose-lg max-w-none text-foreground">
            {privacyPolicy.content?.map((section, index) => (
              <section key={section._key ?? index} className="mb-8">
                {section.heading ? (
                  <h3 className="text-deep-brown font-heading mt-8 mb-4 text-2xl font-bold">
                    {section.heading}
                  </h3>
                ) : null}
                {section.body && section.body.length > 0 ? (
                  <PortableText value={section.body as PortableTextBlock[]} />
                ) : null}
              </section>
            ))}

            {/* Contact Section */}
            {organization ? (
              <ContactInfoCard
                organization={organization}
                email={contactEmail}
                phone={contactPhone}
              />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface ContactInfoCardProps {
  organization: NonNullable<SiteSettings["organization"]>;
  email: string;
  phone: string | undefined;
}

function ContactInfoCard({ organization, email, phone }: ContactInfoCardProps) {
  const address = organization.address;

  return (
    <address className="bg-beige p-6 rounded-xl border border-sand mt-8 not-italic">
      {organization.name ? <p className="font-bold text-deep-brown">{organization.name}</p> : null}

      {address?.streetAddress ? <p>{address.streetAddress}</p> : null}

      {address?.addressLocality || address?.postalCode || address?.addressRegion ? (
        <p>
          {address.addressLocality}
          {address.postalCode ? ` – ${address.postalCode}` : ""}
          {address.addressRegion ? `, ${address.addressRegion}` : ""}
          {address.addressCountry ? `, ${formatCountryName(address.addressCountry)}` : ""}
        </p>
      ) : null}

      <p className="mt-2">
        <strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a>
      </p>

      {phone ? (
        <p>
          <strong>Phone:</strong> <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>
        </p>
      ) : null}
    </address>
  );
}
