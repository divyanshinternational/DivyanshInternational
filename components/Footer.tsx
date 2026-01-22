"use client";

import Link from "next/link";
import { z } from "zod";
import type { SanityImageSource } from "@sanity/image-url";
import { useLanguage } from "@/context/LanguageContext";
import OptimizedImage from "@/components/ui/OptimizedImage";

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
        title: z.string(),
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

  useLanguage();

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
      label: p.title,
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
    <footer className="bg-deep-brown pt-24 pb-12 relative overflow-hidden text-ivory border-t-4 border-gold">
      {/* Subtle Gold Glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gold/20"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 md:mb-24">
          {/* Brand Column (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <Link href="/" className="inline-block mb-6 bg-ivory p-2 rounded-xl shadow-sm">
                <OptimizedImage
                  src="/Logo.png"
                  alt={companyName}
                  width={400}
                  height={312}
                  className="w-24 h-16 md:w-28 md:h-20 flex items-center shrink-0"
                  imageClassName="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  overflowVisible={true}
                  priority
                  quality={100}
                />
              </Link>
              <h3 className="text-3xl font-bold mb-4 text-gold-light! font-heading tracking-wide">
                {labels?.companyTitle || companyName}
              </h3>
              <p className="text-base leading-relaxed text-ivory/90! max-w-sm">
                {labels?.companyDescription}
              </p>
            </div>

            {/* Social Links with enhanced hover */}
            <div className="flex gap-3 pt-2">
              {[
                {
                  link: footer.socialLinks.facebook,
                  label: accessibility?.socialFacebookAria,
                  path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                },
                {
                  link: footer.socialLinks.twitter,
                  label: accessibility?.socialTwitterAria,
                  path: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
                },
                {
                  link: footer.socialLinks.instagram,
                  label: accessibility?.socialInstagramAria,
                  path: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.315 1.347 20.646.935 19.856.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
                },
              ].map((social, idx) =>
                social.link && social.link !== "#" ? (
                  <a
                    key={idx}
                    href={social.link}
                    className="bg-ivory/10 hover:bg-gold hover:text-deep-brown text-ivory transition-all duration-300 rounded-full p-2.5 flex items-center justify-center border border-ivory/20 hover:border-gold hover:-translate-y-1"
                    aria-label={social.label}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.path} />
                    </svg>
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* Quick Links (2 columns) */}
          <div className="lg:col-span-2">
            <h4 className="text-xl font-bold mb-6 text-gold-light! tracking-widest uppercase border-b-2 border-gold/30 pb-2 inline-block">
              {labels?.quickLinksTitle || "Quick Links"}
            </h4>
            <ul className="space-y-4">
              {footer.quickLinks
                .filter((link) => link.label !== "Contact" && link.label !== "Make an Enquiry")
                .map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.url}
                      className="text-ivory/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  href="/contact"
                  className="text-ivory/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm font-medium"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories (3 columns) */}
          <div className="lg:col-span-3">
            <h4 className="text-xl font-bold mb-6 text-gold-light! tracking-widest uppercase border-b-2 border-gold/30 pb-2 inline-block">
              {labels?.productsTitle || "Our Range"}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              {dynamicProductLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-ivory/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications (3 columns) */}
          <div className="lg:col-span-3">
            <h4 className="text-xl font-bold mb-6 text-gold-light! tracking-widest uppercase border-b-2 border-gold/30 pb-2 inline-block">
              {labels?.certificationsTitle || "Certifications"}
            </h4>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {labels?.isoLabel ? (
                  <div className="px-4 py-2 border border-gold/40 rounded bg-gold/10 text-xs font-bold text-gold tracking-wider uppercase">
                    {labels.isoLabel}
                  </div>
                ) : null}
                {labels?.fssaiLabel ? (
                  <div className="px-4 py-2 border border-gold/40 rounded bg-gold/10 text-xs font-bold text-gold tracking-wider uppercase">
                    {labels.fssaiLabel}
                  </div>
                ) : null}
              </div>

              <button
                onClick={handleMakeEnquiry}
                className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-gold/20 hover:shadow-gold/40 hover:-translate-y-0.5 transition-all duration-300 text-sm tracking-wide"
              >
                Make an Enquiry
              </button>

              {labels?.servingText ? (
                <p className="text-xs text-ivory/50! italic border-l-2 border-gold/30 pl-3">
                  {labels.servingText}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-ivory/10 pt-12 mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ivory/60! font-medium">{copyright}</p>

          <div className="flex items-center gap-6 text-xs font-medium">
            <Link
              href="/privacy-policy"
              className="text-ivory/60! hover:text-gold transition-colors"
            >
              {labels?.privacyPolicyText || "Privacy Policy"}
            </Link>
            {footer.privacyNote ? (
              <span className="text-ivory/40! hidden md:inline">| {footer.privacyNote}</span>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
