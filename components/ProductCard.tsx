"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { z } from "zod";

import { urlFor } from "@/lib/sanity/client-browser";
import type { SanityImageSource } from "@sanity/image-url";
import { getLocalized, type LocaleString, type LocaleText } from "@/lib/i18n";
import { useLanguage, type Language } from "@/context/LanguageContext";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const ProductSchema = z.object({
  _id: z.string(),
  title: z.custom<LocaleString>(),
  category: z.string().nullable(),
  description: z.custom<LocaleText>().optional().nullable(),
  slug: z.object({ current: z.string().optional() }).optional().nullable(),
  heroHeading: z.custom<LocaleString>().optional().nullable(),
  introParagraphs: z.array(z.custom<LocaleText>()).optional().nullable(),
  listSections: z
    .array(
      z.object({
        title: z.custom<LocaleString>().optional().nullable(),
        items: z.array(z.custom<LocaleString>()).optional().nullable(),
      })
    )
    .optional()
    .nullable(),
  applications: z.array(z.string()).optional().nullable(),
  heroImage: z.custom<SanityImageSource>().optional().nullable(),
  MOQ: z.string().optional().nullable(),
  grades: z.array(z.string()).optional().nullable(),
  packFormats: z.array(z.string()).optional().nullable(),
});

const LabelsSchema = z.object({
  common: z.object({
    viewSpecs: z.string().optional(),
    addToEnquiry: z.string().optional(),
  }),
  productCard: z.object({
    placeholderText: z.string().optional(),
    specificationsTitle: z.string().optional(),
    varietyLabel: z.string().optional(),
    applicationsLabel: z.string().optional(),
    packLabel: z.string().optional(),
    moqLabel: z.string().optional(),
  }),
});

const ProductCardPropsSchema = z.object({
  product: ProductSchema,
  onAddToEnquiry: z.function(),
  labels: LabelsSchema.optional().nullable(),
});

// =============================================================================
// TYPES
// =============================================================================

type Product = z.infer<typeof ProductSchema>;
type Labels = z.infer<typeof LabelsSchema>;

interface ProductCardProps {
  product: Product;
  onAddToEnquiry: () => void;
  labels?: Labels | null;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function extractListInfo(
  listSections: Product["listSections"],
  keyword: string,
  language: Language
) {
  if (!listSections) return null;
  return listSections.find((section) =>
    getLocalized(section.title, language)?.toLowerCase().includes(keyword)
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ProductCard({ product, onAddToEnquiry, labels }: ProductCardProps) {
  // Runtime validation in development
  if (process.env.NODE_ENV === "development") {
    const result = ProductCardPropsSchema.safeParse({
      product,
      onAddToEnquiry,
      labels,
    });
    if (!result.success) {
      console.warn("[ProductCard] Prop validation warning:", result.error.flatten());
    }
  }

  const { language } = useLanguage();
  const productSlug = product.slug?.current || product.category;
  const productTitle = getLocalized(product.title, language);
  const heroHeading = getLocalized(product.heroHeading, language);
  const intro =
    getLocalized(product.introParagraphs?.[0], language) ||
    getLocalized(product.description, language) ||
    "";

  // Dynamic Labels with Fallbacks (null-safe)
  const specsTitle = labels?.productCard?.specificationsTitle || "Product Specifications";
  const varietyLabel = labels?.productCard?.varietyLabel || "Variety:";
  const appLabel = labels?.productCard?.applicationsLabel || "Applications:";
  const packLabel = labels?.productCard?.packLabel || "Pack:";
  const moqLabel = labels?.productCard?.moqLabel || "Min. Order:";

  const quickItems = (product.listSections?.[0]?.items || []).slice(0, 2);

  // Extracted Data
  const varietySection = extractListInfo(product.listSections, "variety", language);
  const packagingSection =
    extractListInfo(product.listSections, "packaging", language) ||
    extractListInfo(product.listSections, "format", language);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "linear" }}
      className="group relative flex flex-col h-full bg-linear-to-br from-white via-ivory to-cashew-cream rounded-3xl border-2 border-gold-light shadow-lg hover:shadow-2xl hover:border-almond-gold transition-all duration-300 overflow-hidden"
    >
      {/* Premium shine effect */}
      <div className="absolute inset-0 bg-linear-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <Link href={`/products/${productSlug}`} className="block flex-1 p-6 space-y-4">
        {/* Hero Image */}
        <div className="relative aspect-square w-full rounded-2xl border border-dashed border-deep-brown bg-beige flex items-center justify-center text-center overflow-hidden">
          {product.heroImage ? (
            <Image
              src={urlFor(product.heroImage).width(500).height(500).url()}
              alt={productTitle}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <span className="text-xs uppercase tracking-[0.3em] text-(--color-muted)">
              {labels?.productCard?.placeholderText || "Product Image"}
            </span>
          )}
        </div>

        {/* Header content */}
        <span className="inline-flex items-center px-3 py-1 text-xs uppercase tracking-[0.3em] text-(--color-muted) bg-white rounded-full border border-[#efe3d2] mb-4">
          {product.category}
        </span>
        <motion.h3
          className="text-xl font-bold text-deep-brown mb-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          {heroHeading || productTitle}
        </motion.h3>
        <p className="text-(--color-muted) text-sm mb-4 leading-relaxed line-clamp-3">{intro}</p>

        {/* Product Specifications Card */}
        <div className="space-y-3 bg-linear-to-br from-ivory to-white p-4 rounded-2xl border border-sand mb-4">
          <h4 className="text-xs font-bold text-deep-brown uppercase tracking-wider mb-2">
            {specsTitle}
          </h4>

          {/* Variety */}
          {varietySection ? (
            <div className="flex items-start gap-2">
              <span className="text-almond-gold font-semibold text-xs uppercase tracking-wider min-w-[50px]">
                {varietyLabel}
              </span>
              <span className="text-(--color-slate) text-xs font-medium">
                {(varietySection.items || [])
                  .slice(0, 2)
                  .map((item) => {
                    const text = getLocalized(item, language);
                    return (text || "").split("(")[0]?.trim() || "";
                  })
                  .join(", ")}
                {varietySection.items && varietySection.items.length > 2 ? "..." : ""}
              </span>
            </div>
          ) : null}

          {/* Applications */}
          {product.applications && product.applications.length > 0 ? (
            <div className="flex items-start gap-2">
              <span className="text-almond-gold font-semibold text-xs uppercase tracking-wider min-w-[50px]">
                {appLabel}
              </span>
              <span className="text-(--color-slate) text-xs font-medium">
                {product.applications.slice(0, 3).join(", ")}
                {product.applications.length > 3 ? "..." : ""}
              </span>
            </div>
          ) : null}

          {/* Packaging */}
          {packagingSection ? (
            <div className="flex items-start gap-2">
              <span className="text-almond-gold font-semibold text-xs uppercase tracking-wider min-w-[50px]">
                {packLabel}
              </span>
              <span className="text-(--color-slate) text-xs font-medium">
                {(packagingSection.items || [])
                  .slice(0, 2)
                  .map((item) => {
                    return (getLocalized(item, language) || "").split("(")[0]?.trim() || "";
                  })
                  .join(", ")}
                {(packagingSection.items?.length || 0) > 2 ? "..." : ""}
              </span>
            </div>
          ) : null}

          {/* MOQ */}
          {product.MOQ ? (
            <div className="flex items-start gap-2">
              <span className="text-almond-gold font-semibold text-xs uppercase tracking-wider min-w-[50px]">
                {moqLabel}
              </span>
              <span className="text-(--color-slate) text-xs font-medium">{product.MOQ}</span>
            </div>
          ) : null}
        </div>

        {/* Quick Items List */}
        {quickItems.length > 0 ? (
          <ul className="space-y-2 text-sm text-(--color-slate)">
            {quickItems.map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold mt-2" />
                <span>{getLocalized(item, language)}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </Link>

      {/* Footer Buttons */}
      <div className="px-6 pb-6 mt-auto flex flex-col sm:flex-row gap-2">
        <button
          onClick={onAddToEnquiry}
          className="w-full bg-linear-to-r from-almond-gold to-gold-dark hover:shadow-lg text-white px-4 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 focus:outline-2 focus:outline-gold-dark focus:outline-offset-2"
          aria-label={`${labels?.common?.addToEnquiry || "Add to Enquiry"} - ${productTitle}`}
        >
          {labels?.common?.addToEnquiry || "Add to Enquiry"}
        </button>
      </div>
    </motion.div>
  );
}
