"use client";

import Link from "next/link";
import { z } from "zod";
import type { SanityImageSource } from "@sanity/image-url";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalized, type LocaleString } from "@/lib/i18n";
import { FooterVisualElements } from "@/components/VisualElements";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const SanityImageSchema = z.custom<SanityImageSource>();

const QuickLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

const SocialLinksSchema = z.object({
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
});

const FooterDataSchema = z.object({
  quickLinks: z.array(QuickLinkSchema).optional(),
  certificationBadges: z.array(SanityImageSchema).optional(),
  socialLinks: SocialLinksSchema.optional(),
  copyrightText: z.string().optional(),
  privacyNote: z.string().optional(),
});

const FooterLabelsSchema = z.object({
  companyDescription: z.string().optional(),
  companyTitle: z.string().optional(),
  quickLinksTitle: z.string().optional(),
  productsTitle: z.string().optional(),
  certificationsTitle: z.string().optional(),
  copyrightText: z.string().optional(),
  privacyNote: z.string().optional(),
  privacyPolicyText: z.string().optional(),
  servingText: z.string().optional(),
  isoLabel: z.string().optional(),
  fssaiLabel: z.string().optional(),
});

const AccessibilityLabelsSchema = z
  .object({
    socialFacebookAria: z.string().optional(),
    socialTwitterAria: z.string().optional(),
    socialLinkedinAria: z.string().optional(),
    socialInstagramAria: z.string().optional(),
  })
  .passthrough();

const ProductSlugSchema = z.object({
  current: z.string(),
});

// Since strict mapping of Sanity objects can be complex with "unknown" fields,
// we define a permissive structure for siteSettings but strictly pick what we need.
const SiteSettingsSchema = z
  .object({
    whatsapp: z
      .object({
        phoneNumber: z.string().optional(),
        messageTemplate: z.string().optional(),
      })
      .optional()
      .nullable(),
    emailTemplates: z
      .object({
        fromEmail: z.string().optional(),
        companyName: z.string().optional(), // Inferred from schema presence
      })
      .optional()
      .nullable(),
    apiConfig: z
      .object({
        fallbackEmail: z.string().optional(),
      })
      .optional()
      .nullable(),
    organization: z
      .object({
        contactPoint: z
          .object({
            email: z.string().optional(),
          })
          .optional()
          .nullable(),
      })
      .optional()
      .nullable(),
    // For compatibility with legacy prop usage if it exists
    contact: z
      .object({
        email: z.string().optional(),
      })
      .optional()
      .nullable(),
  })
  .passthrough()
  .nullable();

const FooterPropsSchema = z.object({
  initialFooter: FooterDataSchema.nullable().optional(),
  labels: FooterLabelsSchema.optional(),
  accessibility: AccessibilityLabelsSchema.optional(),
  products: z
    .array(
      z.object({
        title: z.record(z.string(), z.string()), // LocaleString
        slug: ProductSlugSchema,
      })
    )
    .optional(),
  siteSettings: SiteSettingsSchema.optional(),
});

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

type FooterProps = z.infer<typeof FooterPropsSchema>;

// =============================================================================
// COMPONENT
// =============================================================================

export default function Footer({
  initialFooter,
  labels,
  accessibility,
  products,
  siteSettings,
}: FooterProps) {
  // Runtime validation in development
  if (process.env.NODE_ENV === "development") {
    const result = FooterPropsSchema.safeParse({
      initialFooter,
      labels,
      accessibility,
      products,
      siteSettings,
    });
    if (!result.success) {
      console.warn("[Footer] Prop validation warning:", result.error.flatten());
    }
  }

  const { language } = useLanguage();

  // Safe defaults
  const footer = {
    quickLinks: initialFooter?.quickLinks ?? [],
    certificationBadges: initialFooter?.certificationBadges ?? [],
    socialLinks: {
      facebook: initialFooter?.socialLinks?.facebook ?? "",
      twitter: initialFooter?.socialLinks?.twitter ?? "",
      linkedin: initialFooter?.socialLinks?.linkedin ?? "",
      instagram: initialFooter?.socialLinks?.instagram ?? "",
    },
    copyrightText: initialFooter?.copyrightText ?? "",
    privacyNote: initialFooter?.privacyNote ?? "",
  };

  const dynamicProductLinks =
    products?.map((p) => ({
      label: getLocalized(p.title as LocaleString, language),
      href: `/products/${p.slug.current}`,
    })) ?? [];

  // Robust field resolution
  const whatsappNumber = siteSettings?.whatsapp?.phoneNumber;

  // Resolve email from multiple potential sources in Sanity
  const contactEmail =
    siteSettings?.contact?.email ||
    siteSettings?.emailTemplates?.fromEmail ||
    siteSettings?.organization?.contactPoint?.email ||
    siteSettings?.apiConfig?.fallbackEmail;

  const whatsappTemplate =
    siteSettings?.whatsapp?.messageTemplate ??
    "Hi! I would like to make an enquiry about your products.";
  const companyName = siteSettings?.emailTemplates?.companyName ?? "Divyansh International";

  const handleMakeEnquiry = () => {
    if (whatsappNumber) {
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(whatsappTemplate)}`;
      window.open(whatsappUrl, "_blank");
    } else if (contactEmail) {
      const subject = `Product Enquiry - ${companyName}`;
      const body = `Hello,\n\nI would like to make an enquiry about your products. Please provide more information about:\n\n- Product availability\n- Pricing details\n- Minimum order quantities\n- Delivery options\n\nThank you!`;
      const emailUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(emailUrl, "_blank");
    } else {
      console.error("No contact method available (WhatsApp or Email).");
    }
  };

  const currentYear = new Date().getFullYear();
  const copyright =
    labels?.copyrightText ||
    footer.copyrightText ||
    `© ${currentYear} ${companyName}. All rights reserved.`;

  return (
    <footer className="bg-[#1a120b] py-16 relative overflow-hidden text-white border-t border-gold/20">
      {/* Visual Elements */}
      <FooterVisualElements />

      {/* Decorative overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTEyIDM4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

      {/* Subtle Gold Glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-linear-to-r from-transparent via-gold/40 to-transparent"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-3 text-almond-gold font-heading tracking-wide">
                {labels?.companyTitle || companyName}
              </h3>
              <p className="text-sm leading-relaxed text-ivory/80 max-w-sm">
                {labels?.companyDescription}
              </p>
            </div>

            <div className="flex gap-3">
              {/* Social Media Links */}
              {footer.socialLinks.facebook && footer.socialLinks.facebook !== "#" ? (
                <a
                  href={footer.socialLinks.facebook}
                  className="bg-white/5 hover:bg-gold hover:text-deep-brown text-white transition-all duration-300 rounded-full p-2.5 flex items-center justify-center border border-white/10 hover:border-gold"
                  aria-label={accessibility?.socialFacebookAria}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              ) : null}
              {footer.socialLinks.twitter && footer.socialLinks.twitter !== "#" ? (
                <a
                  href={footer.socialLinks.twitter}
                  className="bg-white/5 hover:bg-gold hover:text-deep-brown text-white transition-all duration-300 rounded-full p-2.5 flex items-center justify-center border border-white/10 hover:border-gold"
                  aria-label={accessibility?.socialTwitterAria}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              ) : null}
              {footer.socialLinks.linkedin && footer.socialLinks.linkedin !== "#" ? (
                <a
                  href={footer.socialLinks.linkedin}
                  className="bg-white/5 hover:bg-gold hover:text-deep-brown text-white transition-all duration-300 rounded-full p-2.5 flex items-center justify-center border border-white/10 hover:border-gold"
                  aria-label={accessibility?.socialLinkedinAria}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              ) : null}
              {footer.socialLinks.instagram && footer.socialLinks.instagram !== "#" ? (
                <a
                  href={footer.socialLinks.instagram}
                  className="bg-white/5 hover:bg-gold hover:text-deep-brown text-white transition-all duration-300 rounded-full p-2.5 flex items-center justify-center border border-white/10 hover:border-gold"
                  aria-label={accessibility?.socialInstagramAria}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.315 1.347 20.646.935 19.856.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
              ) : null}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide">
              {labels?.quickLinksTitle}
            </h4>
            <ul className="space-y-3">
              {/* Make an Enquiry Button */}
              <li>
                <button
                  onClick={handleMakeEnquiry}
                  className="group relative overflow-hidden bg-linear-to-r from-almond-gold via-gold to-almond-gold text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all duration-300 hover:shadow-gold/20 hover:scale-[1.02] active:scale-95 w-full md:w-auto text-center"
                >
                  <span className="relative z-10">Make an Enquiry</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
              </li>

              {footer.quickLinks
                .filter((link) => link.label !== "Contact" && link.label !== "Make an Enquiry")
                .map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.url}
                      className="text-ivory/70 hover:text-gold transition-colors text-sm block hover:translate-x-1 duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide">
              {labels?.productsTitle}
            </h4>
            <ul className="space-y-3">
              {dynamicProductLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-ivory/70 hover:text-gold transition-colors text-sm block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications & Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide">
              {labels?.certificationsTitle}
            </h4>
            <div className="space-y-6">
              {/* Certification Badges */}
              <div className="flex gap-3 flex-wrap">
                {labels?.isoLabel ? (
                  <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-md text-xs font-bold text-white tracking-wider uppercase backdrop-blur-sm hover:bg-gold hover:text-deep-brown hover:border-gold transition-colors cursor-default">
                    {labels.isoLabel}
                  </div>
                ) : null}
                {labels?.fssaiLabel ? (
                  <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-md text-xs font-bold text-white tracking-wider uppercase backdrop-blur-sm hover:bg-gold hover:text-deep-brown hover:border-gold transition-colors cursor-default">
                    {labels.fssaiLabel}
                  </div>
                ) : null}
              </div>

              <div className="pt-2">
                <p className="text-xs text-ivory/50 italic">{labels?.servingText}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ivory/60">
            <p className="font-medium">{copyright}</p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy-policy"
                className="hover:text-gold transition-colors focus:outline-2 focus:outline-gold focus:rounded"
              >
                {labels?.privacyPolicyText}
              </Link>
              <div className="w-1 h-1 rounded-full bg-white/30" />
              <span>{footer.privacyNote || labels?.privacyNote}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
