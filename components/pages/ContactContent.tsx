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
import {
  LeafIcon,
  AlmondIcon,
  NutIcon,
  CashewIcon,
  WalnutIcon,
  PeanutIcon,
} from "@/components/assets/Decorations";

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

// Site settings schemas - passthrough to form components
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
// TYPE DEFINITIONS (Inferred from Zod Schemas)
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

  // Validate incoming data
  const contact = parseContactData(initialContact);
  const siteSettings = parseSiteSettings(rawSiteSettings);

  // Extract form and routing settings with fallbacks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formLabels = (siteSettings.forms ?? {}) as any;
  const routing = siteSettings.routing ?? {};

  const initialProduct = searchParams.get(routing.queryParamProduct ?? "product") ?? "";
  const initialAction = searchParams.get(routing.queryParamAction ?? "action") ?? "";

  // Error state if contact data is invalid
  if (!contact) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-deep-brown text-lg">Unable to load Contact page content.</p>
      </div>
    );
  }

  // Prepare props for form components - cast to expected types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analyticsConfig = siteSettings.analytics as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validationConfig = siteSettings.validation as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productListTyped = productList as any;

  return (
    <div className="bg-linear-to-b from-ivory via-cashew-cream to-beige min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <DecorativeBackground />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="uppercase tracking-[0.4em] text-xs text-(--color-muted) mb-4">
              {contact.eyebrow}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-deep-brown mb-6 font-heading">
              {contact.title}
            </h1>
            <p className="text-lg text-(--color-slate) max-w-3xl mx-auto leading-relaxed whitespace-pre-line">
              {contact.description}
            </p>
          </motion.div>
          <div className="absolute top-0 left-0 -z-10 opacity-10 -rotate-12" aria-hidden="true">
            <LeafIcon className="w-64 h-64 text-leaf-green" />
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-linear-to-br from-white to-ivory p-8 rounded-3xl border-2 border-gold-light shadow-xl hover:shadow-2xl transition-all duration-300"
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
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-linear-to-br from-cashew-cream to-beige p-8 rounded-3xl border-2 border-gold-light shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-xl font-bold text-deep-brown mb-4 font-heading">
          {contact.contactDetailsTitle}
        </h3>
        <div className="space-y-4 text-foreground">
          <div>
            <p className="font-semibold text-gold-dark mb-1">
              {siteSettings.contact?.officeLabel ?? "Office"}
            </p>
            <p className="whitespace-pre-line">{contact.contactDetails.address}</p>
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

      <div className="bg-linear-to-br from-cashew-cream to-beige p-8 rounded-3xl border-2 border-gold-light shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-xl font-bold text-deep-brown mb-4 font-heading">
          {contact.businessHoursTitle}
        </h3>
        <div className="space-y-2 text-foreground">
          <p>{contact.businessHours.weekdays}</p>
          <p>{contact.businessHours.sunday}</p>
        </div>
        <p className="mt-6 text-sm text-(--color-muted) italic">{contact.footerNote}</p>
      </div>
    </div>
  );
}

function DecorativeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Almonds */}
      <motion.div
        animate={{ rotate: [0, 12, -12, 0], y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute top-32 left-16 opacity-15"
      >
        <AlmondIcon className="w-28 h-28" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -15, 15, 0], x: [0, 12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 1.5 }}
        className="absolute top-1/3 right-12 opacity-15"
      >
        <AlmondIcon className="w-32 h-32" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 18, -18, 0], y: [0, 15, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 2.5 }}
        className="absolute bottom-40 left-1/4 opacity-15"
      >
        <AlmondIcon className="w-36 h-36" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -10, 10, 0], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute top-20 right-1/4 opacity-12"
      >
        <AlmondIcon className="w-30 h-30" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 13, -13, 0], y: [0, 12, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear", delay: 7 }}
        className="absolute bottom-20 right-20 opacity-15"
      >
        <AlmondIcon className="w-26 h-26" />
      </motion.div>

      {/* Nuts */}
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-10 text-deep-brown/8"
      >
        <NutIcon className="w-24 h-24" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -360], scale: [1, 1.15, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute bottom-32 right-1/4 text-deep-brown/8"
      >
        <NutIcon className="w-28 h-28" />
      </motion.div>

      {/* Cashews */}
      <motion.div
        animate={{ rotate: [0, 14, -14, 0], x: [0, 10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute top-1/4 right-20 opacity-15"
      >
        <CashewIcon className="w-26 h-26" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -11, 11, 0], y: [0, -12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 3 }}
        className="absolute bottom-1/4 left-16 opacity-15"
      >
        <CashewIcon className="w-30 h-30" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 12, -12, 0], y: [0, 8, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 6 }}
        className="absolute top-10 left-1/3 opacity-12"
      >
        <CashewIcon className="w-28 h-28" />
      </motion.div>

      {/* Walnuts */}
      <motion.div
        animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: 2.5 }}
        className="absolute top-2/3 left-1/3 opacity-15"
      >
        <WalnutIcon className="w-28 h-28" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -360], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute bottom-1/3 right-1/4 opacity-12"
      >
        <WalnutIcon className="w-26 h-26" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 10, -10, 0], x: [0, -10, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 7 }}
        className="absolute top-1/2 right-10 opacity-15"
      >
        <WalnutIcon className="w-24 h-24" />
      </motion.div>

      {/* Peanuts */}
      <motion.div
        animate={{ rotate: [0, -13, 13, 0], y: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 4 }}
        className="absolute top-1/3 left-1/4 opacity-15"
      >
        <PeanutIcon className="w-24 h-24" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 10, -10, 0], x: [0, -8, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute bottom-1/3 right-1/3 opacity-15"
      >
        <PeanutIcon className="w-20 h-20" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 14, -14, 0], y: [0, -10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: 8 }}
        className="absolute top-3/4 left-10 opacity-12"
      >
        <PeanutIcon className="w-22 h-22" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -12, 12, 0], x: [0, 10, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear", delay: 9 }}
        className="absolute bottom-10 right-1/4 opacity-15"
      >
        <PeanutIcon className="w-26 h-26" />
      </motion.div>

      {/* Extra Layer - More Almonds */}
      <motion.div
        animate={{ rotate: [0, 11, -11, 0], y: [0, -10, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear", delay: 10 }}
        className="absolute top-1/2 left-1/3 opacity-12"
      >
        <AlmondIcon className="w-28 h-28" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -14, 14, 0], x: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: 11 }}
        className="absolute bottom-1/2 right-1/3 opacity-15"
      >
        <AlmondIcon className="w-26 h-26" />
      </motion.div>

      {/* Extra Cashews */}
      <motion.div
        animate={{ rotate: [0, 15, -15, 0], y: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 12 }}
        className="absolute top-1/4 left-1/4 opacity-12"
      >
        <CashewIcon className="w-24 h-24" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -13, 13, 0], x: [0, -10, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 13 }}
        className="absolute bottom-1/4 right-1/4 opacity-15"
      >
        <CashewIcon className="w-28 h-28" />
      </motion.div>

      {/* Extra Walnuts */}
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.12, 1] }}
        transition={{ duration: 21, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute top-3/4 left-1/4 opacity-12"
      >
        <WalnutIcon className="w-22 h-22" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -360], scale: [1, 1.1, 1] }}
        transition={{ duration: 19, repeat: Infinity, ease: "linear", delay: 7 }}
        className="absolute bottom-1/3 left-1/3 opacity-15"
      >
        <WalnutIcon className="w-26 h-26" />
      </motion.div>

      {/* Corner Decorations */}
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.08, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 8 }}
        className="absolute top-10 left-10 opacity-8"
      >
        <CashewIcon className="w-18 h-18" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -360], scale: [1, 1.1, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 9 }}
        className="absolute top-10 right-10 opacity-8"
      >
        <PeanutIcon className="w-18 h-18" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.12, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear", delay: 10 }}
        className="absolute bottom-10 left-10 opacity-8"
      >
        <AlmondIcon className="w-18 h-18" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -360], scale: [1, 1.1, 1] }}
        transition={{ duration: 23, repeat: Infinity, ease: "linear", delay: 11 }}
        className="absolute bottom-10 right-10 opacity-8"
      >
        <WalnutIcon className="w-18 h-18" />
      </motion.div>
    </div>
  );
}
