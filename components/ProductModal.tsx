"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/components/analytics/GA4";
import Script from "next/script";
import { generateProductSchema } from "@/lib/seo/schema";

import { useRouter } from "next/navigation";
import { urlFor } from "@/lib/sanity/client-browser";
import type { SanityImageSource } from "@sanity/image-url";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalized, type LocaleString, type LocaleText } from "@/lib/i18n";
import { z } from "zod";
import OptimizedImage from "@/components/ui/OptimizedImage";

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProductSchema = z.object({
  _id: z.string(),
  title: z.custom<LocaleString>(),
  category: z.string(),
  description: z.custom<LocaleText>().optional(),
  slug: z.object({ current: z.string().optional() }).optional(),
  heroHeading: z.custom<LocaleString>().optional(),
  introParagraphs: z.array(z.custom<LocaleText>()).optional(),
  listSections: z
    .array(
      z.object({
        title: z.custom<LocaleString>().optional(),
        items: z.array(z.custom<LocaleString>()).optional(),
      })
    )
    .optional(),
  ctaLine: z.custom<LocaleString>().optional(),
  heroImage: z.custom<SanityImageSource>().optional(),
  gallery: z.array(z.custom<SanityImageSource>()).optional(),
  microVideo: z.string().optional(),
  specSheetPDF: z.string().optional(),
  pricing: z
    .object({
      currentPrice: z.number().optional(),
      originalPrice: z.number().optional(),
      discount: z.number().optional(),
    })
    .optional(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LabelsSchema = z.object({
  productModal: z.object({
    closeAria: z.string().optional(),
    placeholder: z.string().optional(),
    addToEnquiry: z.string().optional(),
    requestSample: z.string().optional(),
  }),
  analytics: z.object({
    eventSampleRequest: z.string().optional(),
    eventAddToEnquiryGA: z.string().optional(),
    locationModal: z.string().optional(),
  }),
  routing: z.object({
    queryParamType: z.string().optional(),
    queryParamProduct: z.string().optional(),
  }),
  apiConfig: z.object({
    enquiryTypeTrade: z.string().optional(),
  }),
  seo: z.object({
    siteUrl: z.string().optional(),
  }),
});

// =============================================================================
// TYPES
// =============================================================================

type Product = z.infer<typeof ProductSchema>;
type Labels = z.infer<typeof LabelsSchema>;

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToEnquiry: () => void;
  labels: Labels;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToEnquiry,
  labels,
}: ProductModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const router = useRouter();

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [prevProductId, setPrevProductId] = useState(product?._id);

  // Reset to first image when product changes (Derived State pattern)
  if (product?._id !== prevProductId) {
    setPrevProductId(product?._id);
    setActiveMediaIndex(0);
  }

  // Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const totalItems = 1 + (product?.gallery?.length || 0); // 0 = Hero, 1+ = Gallery

      if (e.key === "ArrowLeft") {
        setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
      } else if (e.key === "ArrowRight") {
        setActiveMediaIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, product?.gallery?.length]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);

      // Trap focus
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      firstElement?.focus();
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!product) return null;

  // Localized Content
  const productTitle = getLocalized(product.title, language) || "Product";
  const productDescription = getLocalized(product.description, language);
  const heroHeading = getLocalized(product.heroHeading, language);
  const ctaLine = getLocalized(product.ctaLine, language);

  const currentImage =
    activeMediaIndex === 0 ? product.heroImage : product.gallery?.[activeMediaIndex - 1];

  // Handlers
  const handleRequestSample = () => {
    if (labels.analytics?.eventSampleRequest) {
      trackEvent(labels.analytics.eventSampleRequest, { product: productTitle });
    }

    const params = new URLSearchParams();
    if (labels?.routing?.queryParamType && labels?.apiConfig?.enquiryTypeTrade) {
      params.append(labels.routing.queryParamType, labels.apiConfig.enquiryTypeTrade);
    }
    if (labels?.routing?.queryParamProduct) {
      params.append(labels.routing.queryParamProduct, productTitle);
    }

    router.push(`/contact?${params.toString()}`);
  };

  const handleAddToEnquiry = () => {
    if (labels.analytics?.eventAddToEnquiryGA) {
      trackEvent(labels.analytics.eventAddToEnquiryGA, {
        product: productTitle,
        location: labels.analytics.locationModal || "Modal",
      });
    }
    onAddToEnquiry();
  };

  // SEO Schema
  const productSchema = generateProductSchema(
    {
      title: productTitle,
      description: productDescription || "",
      ...(product.slug?.current ? { slug: { current: product.slug.current } } : {}),
    },
    labels.seo?.siteUrl || "https://divyanshint.com"
  );

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <Script
            id={`product-schema-${product._id || "modal"}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(productSchema),
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-sand p-4 md:p-6 flex justify-between items-center z-10">
                <h2
                  id="product-modal-title"
                  className="text-xl md:text-2xl font-bold text-deep-brown truncate pr-4"
                >
                  {productTitle}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-sand/30 text-text-muted hover:text-deep-brown transition-colors focus:ring-2 focus:ring-gold"
                  aria-label={labels.productModal?.closeAria || "Close"}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Media Section */}
                <div className="rounded-2xl overflow-hidden bg-ivory aspect-video relative group shadow-inner border border-sand">
                  {activeMediaIndex === 0 && product.microVideo ? (
                    <video
                      src={product.microVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : currentImage ? (
                    <div
                      key={activeMediaIndex}
                      className="w-full h-full flex items-center justify-center p-2"
                    >
                      <OptimizedImage
                        src={urlFor(currentImage).width(1200).height(800).fit("max").url()}
                        alt={productTitle}
                        width={1200}
                        height={800}
                        className="w-auto h-auto max-w-full max-h-full mx-auto"
                        imageClassName="object-scale-down"
                        priority
                        quality={100}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center text-text-muted/60">
                      <div className="text-4xl mb-2">📸</div>
                      <div className="text-xs uppercase tracking-widest font-medium">
                        {labels.productModal?.placeholder || "No Image Available"}
                      </div>
                    </div>
                  )}

                  {/* Price Tag Overlay if available */}
                  {product.pricing?.currentPrice ? (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50">
                      <span className="font-bold text-deep-brown">
                        ₹{product.pricing.currentPrice}
                      </span>
                    </div>
                  ) : null}
                </div>

                {/* Gallery */}
                {product.heroImage || (product.gallery && product.gallery.length > 0) ? (
                  <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                    {product.heroImage ? (
                      <button
                        type="button"
                        onClick={() => setActiveMediaIndex(0)}
                        className={`relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all ${
                          activeMediaIndex === 0
                            ? "border-gold ring-2 ring-gold/30 scale-95"
                            : "border-sand hover:scale-105"
                        }`}
                      >
                        <OptimizedImage
                          src={urlFor(product.heroImage).width(200).url()}
                          alt={productTitle}
                          fill
                          className=""
                          imageClassName="object-scale-down"
                        />
                        {product.microVideo ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                              <span className="text-deep-brown">▶</span>
                            </div>
                          </div>
                        ) : null}
                      </button>
                    ) : null}
                    {product.gallery?.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveMediaIndex(index + 1)}
                        className={`relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all ${
                          activeMediaIndex === index + 1
                            ? "border-gold ring-2 ring-gold/30 scale-95"
                            : "border-sand hover:scale-105"
                        }`}
                      >
                        <OptimizedImage
                          src={urlFor(image).width(200).url()}
                          alt={`${productTitle} ${index + 1}`}
                          fill
                          className=""
                          imageClassName="object-scale-down"
                        />
                      </button>
                    ))}
                  </div>
                ) : null}

                {/* Text Content */}
                <div className="prose prose-brown max-w-none">
                  {heroHeading ? (
                    <h3 className="text-lg font-semibold text-deep-brown">{heroHeading}</h3>
                  ) : null}

                  {product.introParagraphs?.length ? (
                    <div className="space-y-4 text-text-muted leading-relaxed">
                      {product.introParagraphs.slice(0, 2).map((paragraph, idx) => (
                        <p key={idx}>{getLocalized(paragraph, language)}</p>
                      ))}
                    </div>
                  ) : (
                    productDescription && (
                      <p className="text-text-muted leading-relaxed">{productDescription}</p>
                    )
                  )}
                </div>

                {/* Features / Lists */}
                {product.listSections && product.listSections.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {product.listSections.slice(0, 4).map((section, idx) => (
                      <div
                        key={idx}
                        className="bg-amber-50/50 rounded-xl p-5 border border-gold/20"
                      >
                        <h4 className="font-semibold text-deep-brown mb-3 border-b border-gold/10 pb-2">
                          {getLocalized(section.title, language)}
                        </h4>
                        <ul className="space-y-2">
                          {section.items?.slice(0, 5).map((item, i) => (
                            <li
                              key={i}
                              className="flex gap-2.5 items-start text-sm text-text-muted"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0"
                              />
                              <span>{getLocalized(item, language)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}

                {ctaLine ? (
                  <div className="bg-deep-brown/5 text-deep-brown p-4 rounded-lg text-center font-medium border border-deep-brown/10">
                    {ctaLine}
                  </div>
                ) : null}
              </div>

              {/* Footer CTAs */}
              <div className="sticky bottom-0 bg-white border-t border-sand p-4 md:p-6 flex flex-col sm:flex-row gap-4 mt-auto">
                <button
                  onClick={handleAddToEnquiry}
                  className="flex-1 bg-gold hover:bg-gold-dark text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-gold/30 active:scale-95"
                >
                  {labels.productModal?.addToEnquiry || "Add to Enquiry"}
                </button>
                <button
                  onClick={handleRequestSample}
                  className="flex-1 border-2 border-deep-brown text-deep-brown hover:bg-deep-brown hover:text-white px-6 py-3.5 rounded-xl font-bold transition-all focus:ring-4 focus:ring-deep-brown/20 active:scale-95"
                >
                  {labels.productModal?.requestSample || "Request Sample"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
