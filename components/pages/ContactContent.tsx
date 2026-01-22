"use client";

/**
 * Contact Page Content Component
 *
 * Displays the contact forms, contact details, and business hours.
 * Uses useState for tab switching and framer-motion for animations - requires client component.
 *
 * All content is fetched from Sanity CMS and validated with Zod schemas
 * for runtime type safety.
 */

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { z } from "zod";

import TradeEnquiryForm from "@/components/forms/TradeEnquiryForm";
import { LeafIcon } from "@/components/assets/Decorations";
import DecorativeBackground from "@/components/ui/DecorativeBackground";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const ContactDetailsSchema = z.object({
  address: z.string(),
  phone: z.array(z.string()),
  email: z.string(),
});

const BusinessHoursSchema = z.object({
  weekdays: z.string(),
  sunday: z.string(),
});

const ContactPageDataSchema = z.object({
  _id: z.string(),
  eyebrow: z.string(),
  title: z.string(),
  description: z.string(),
  generalEnquiryLabel: z.string(),
  tradeEnquiryLabel: z.string(),
  contactDetailsTitle: z.string(),
  businessHoursTitle: z.string(),
  footerNote: z.string(),
  contactDetails: ContactDetailsSchema,
  businessHours: BusinessHoursSchema,
});

const SiteSettingsSchema = z
  .object({
    forms: z.record(z.string(), z.unknown()).nullish(),
    routing: z
      .object({
        queryParamType: z.string().nullish(),
        queryParamProduct: z.string().nullish(),
        queryParamAction: z.string().nullish(),
      })
      .nullish(),
    contact: z
      .object({
        officeLabel: z.string().nullish(),
        phoneLabel: z.string().nullish(),
        emailLabel: z.string().nullish(),
      })
      .nullish(),
    apiConfig: z
      .object({
        listSeparator: z.string().nullish(),
      })
      .nullish(),
    analytics: z.record(z.string(), z.unknown()).nullish(),
    validation: z.record(z.string(), z.unknown()).nullish(),
  })
  .partial();

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

type ContactPageData = z.infer<typeof ContactPageDataSchema>;
type SiteSettings = z.infer<typeof SiteSettingsSchema>;

interface ContactContentProps {
  initialContact: unknown;
  siteSettings: unknown;
  productList: unknown;
}

// =============================================================================
// VALIDATION & DATA PARSING
// =============================================================================

function parseContactData(data: unknown): ContactPageData | null {
  const result = ContactPageDataSchema.safeParse(data);
  if (!result.success) {
    console.error("[ContactContent] Contact data validation failed:", result.error.format());
    return null;
  }
  return result.data;
}

function parseSiteSettings(data: unknown): SiteSettings {
  const result = SiteSettingsSchema.safeParse(data);
  if (!result.success) {
    console.warn("[ContactContent] Site settings validation failed, using defaults");
    return {};
  }
  return result.data;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ContactContent({
  initialContact,
  siteSettings: rawSiteSettings,
  productList,
}: ContactContentProps) {
  const searchParams = useSearchParams();

  const contact = parseContactData(initialContact);
  const siteSettings = parseSiteSettings(rawSiteSettings);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formLabels = (siteSettings.forms ?? {}) as any;
  const routing = siteSettings.routing ?? {};

  const initialProduct = searchParams.get(routing.queryParamProduct ?? "product") ?? "";
  const initialAction = searchParams.get(routing.queryParamAction ?? "action") ?? "";

  if (!contact) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-deep-brown text-lg">Unable to load Contact page content.</p>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analyticsConfig = siteSettings.analytics as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validationConfig = siteSettings.validation as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productListTyped = productList as any;

  return (
    <div className="bg-paper min-h-screen pt-[72px] md:pt-24 pb-16 md:pb-24 relative">
      {/* Decorative Background Elements */}
      <DecorativeBackground variant="minimal" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="uppercase tracking-[0.4em] text-xs text-text-muted mb-4">
              {contact.eyebrow}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-deep-brown mb-6 font-heading">
              {contact.title}
            </h1>
            <p className="text-lg text-text-muted max-w-3xl mx-auto leading-relaxed whitespace-pre-line">
              {contact.description}
            </p>
          </motion.div>
          <div className="absolute top-0 left-0 -z-10 opacity-10 -rotate-12" aria-hidden="true">
            <LeafIcon className="w-64 h-64 text-leaf-green" />
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-8 rounded-3xl border-2 border-gold-light shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <TradeEnquiryForm
              productList={productListTyped}
              formLabels={formLabels}
              analytics={analyticsConfig}
              validation={validationConfig}
              initialProduct={initialProduct}
              initialAction={initialAction}
            />
          </motion.div>
        </div>

        {/* Contact Information */}
        <ContactInfoSection contact={contact} siteSettings={siteSettings} />
      </div>
    </div>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface ContactInfoSectionProps {
  contact: ContactPageData;
  siteSettings: SiteSettings;
}

function ContactInfoSection({ contact, siteSettings }: ContactInfoSectionProps) {
  const listSeparator = siteSettings.apiConfig?.listSeparator ?? ", ";

  return (
    <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="bg-ivory p-6 md:p-8 rounded-3xl border-2 border-gold-light shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-xl font-bold text-deep-brown mb-3 font-heading">
          {contact.contactDetailsTitle}
        </h3>
        <div className="space-y-3 md:space-y-4 text-foreground">
          <div>
            <p className="font-semibold text-gold-dark mb-1">
              {siteSettings.contact?.officeLabel ?? "Office"}
            </p>
            <p className="whitespace-pre-line">
              {contact.contactDetails.address
                ?.split("\n")
                .map((l) => l.trim())
                .filter(Boolean)
                .join("\n")}
            </p>
          </div>
          <div>
            <p className="font-semibold text-gold-dark mb-1">
              {siteSettings.contact?.phoneLabel ?? "Phone"}
            </p>
            <p>{contact.contactDetails.phone.join(listSeparator)}</p>
          </div>
          <div>
            <p className="font-semibold text-gold-dark mb-1">
              {siteSettings.contact?.emailLabel ?? "Email"}
            </p>
            <p>{contact.contactDetails.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-ivory p-6 md:p-8 rounded-3xl border-2 border-gold-light shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-xl font-bold text-deep-brown mb-3 font-heading">
          {contact.businessHoursTitle}
        </h3>
        <div className="space-y-1 md:space-y-2 text-foreground">
          <p>{contact.businessHours.weekdays}</p>
          <p>{contact.businessHours.sunday}</p>
        </div>
        <p className="mt-4 text-sm text-text-muted italic">{contact.footerNote}</p>
      </div>
    </div>
  );
}
