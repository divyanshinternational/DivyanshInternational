"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { trackEvent } from "@/components/analytics/GA4";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalized, type LocaleString, type LocaleText } from "@/lib/i18n";
import { urlFor } from "@/lib/sanity/client-browser";
import type { SanityImageSource } from "@sanity/image-url";
import { useState, useEffect, useMemo } from "react";
import { HeroVisualElements, SectionVisualElements } from "@/components/VisualElements";
import { z } from "zod";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import OptimizedImage from "@/components/ui/OptimizedImage";
import ProductVarietiesSection, {
  type ProductVariety,
} from "@/components/sections/AlmondVarietiesSection";
import { Check } from "lucide-react";

// =============================================================================
// ZOD SCHEMAS & TYPES
// =============================================================================

// Primitives

// Structured Data
const VarietySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  grade: z.string().optional(),
  color: z.string().optional(),
});

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
  heroImageUrl: z.string().optional().nullable(),
  gallery: z
    .array(
      z.object({
        _key: z.string().optional(),
        image: z.custom<SanityImageSource>().optional(),
        imageUrl: z.string().optional().nullable(),
        alt: z.string().optional(),
      })
    )
    .optional(),
  rating: z.string().optional(),

  // Dynamic Fields
  pricing: z
    .object({
      currentPrice: z.number().optional(),
      originalPrice: z.number().optional(),
      discount: z.number().optional(),
    })
    .optional(),

  specifications: z
    .object({
      origin: z.string().optional(),
      variety: z.string().optional(),
      packaging: z.string().optional(),
      shelfLife: z.string().optional(),
      storage: z.string().optional(),
      qualitySealed: z.string().optional(),
      logistics: z.string().optional(),
      standardDimensions: z
        .object({
          cartonSize: z.string().optional(),
          cartonType: z.string().optional(),
          bagSize: z.string().optional(),
          bagType: z.string().optional(),
          shelfLife: z.string().optional(),
          storage: z.string().optional(),
        })
        .optional(),
    })
    .optional(),

  applications: z.array(z.string()).optional(),
  varieties: z.array(VarietySchema).optional(),
  grades: z.array(z.string()).optional(),
  almondVarieties: z.array(z.custom<ProductVariety>()).optional(),
});

// Labels from Site Settings
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LabelsSchema = z.object({
  productDetail: z.object({
    heroPlaceholder: z.string().optional(),
    addToEnquiry: z.string().optional(),
    backToProducts: z.string().optional(),
    programSuffix: z.string().optional(),
  }),
  common: z.object({
    addToEnquiry: z.string().optional(),
  }),
  navigation: z.object({
    home: z.string().optional(),
    products: z.string().optional(),
    homeUrl: z.string().optional(),
    productsUrl: z.string().optional(),
  }),
  apiConfig: z.object({
    breadcrumbSeparator: z.string().optional(),
    enquiryTypeTrade: z.string().optional(),
  }),
  routing: z.object({
    queryParamType: z.string().optional(),
    queryParamProduct: z.string().optional(),
    queryParamAction: z.string().optional(),
    scrollTargetContact: z.string().optional(),
    productsHash: z.string().optional(),
  }),
  analytics: z.object({
    eventAddToEnquiry: z.string().optional(),
    eventAddToEnquiryGA: z.string().optional(),
    locationProductPage: z.string().optional(),
  }),
});

type Product = z.infer<typeof ProductSchema>;
type Labels = z.infer<typeof LabelsSchema>;

interface ProductDetailProps {
  product: Product;
  labels: Labels;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ProductDetail({ product, labels }: ProductDetailProps) {
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "packaging" | "forms">("description");

  // Localized Content
  const productTitle = getLocalized(product.title, language) || "Product";
  const heroHeading = getLocalized(product.heroHeading, language);
  const description = getLocalized(product.description, language);
  const ctaLine = getLocalized(product.ctaLine, language);

  // Contacts
  const whatsappNumber = "+919876543210";
  const contactEmail = "info@divyanshint.com";

  // Build unified image array supporting both URL and Sanity images
  type ProductImage =
    | { type: "url"; url: string; alt: string }
    | { type: "sanity"; image: SanityImageSource; alt: string };

  const productImages = useMemo(() => {
    const images: ProductImage[] = [];

    // Add hero image
    if (product.heroImageUrl) {
      const driveUrl = getGoogleDriveImageUrl(product.heroImageUrl);
      if (driveUrl) images.push({ type: "url", url: driveUrl, alt: productTitle });
    } else if (product.heroImage) {
      images.push({ type: "sanity", image: product.heroImage, alt: productTitle });
    }

    // Add gallery images
    if (product.gallery) {
      for (const item of product.gallery) {
        if (item.imageUrl) {
          const driveUrl = getGoogleDriveImageUrl(item.imageUrl);
          if (driveUrl) images.push({ type: "url", url: driveUrl, alt: item.alt || productTitle });
        } else if (item.image) {
          images.push({ type: "sanity", image: item.image, alt: item.alt || productTitle });
        }
      }
    }

    return images;
  }, [product.heroImage, product.heroImageUrl, product.gallery, productTitle]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (productImages.length <= 1) return;

      if (e.key === "ArrowLeft") {
        setSelectedImage((prev) => (prev > 0 ? prev - 1 : productImages.length - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedImage((prev) => (prev < productImages.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [productImages.length]);

  const specs = [
    { label: "Origin", value: product.specifications?.origin || "Multiple Origins" },
    { label: "Variety", value: product.specifications?.variety || "Premium" },
    { label: "Packaging", value: product.specifications?.packaging || "Bulk" },
    { label: "Shelf Life", value: product.specifications?.shelfLife || "12 Months" },
    { label: "Storage", value: product.specifications?.storage || "Cool & Dry" },
  ];

  // const pricing = {
  //   current: product.pricing?.currentPrice,
  //   original: product.pricing?.originalPrice,
  //   discount: product.pricing?.discount,
  //   currency: "₹",
  // };

  // Handlers
  const handleAddToEnquiry = () => {
    const message = `Hi! I'm interested in ${productTitle}. Could you please provide more details about bulk pricing and availability?`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    if (typeof window !== "undefined" && labels.analytics?.eventAddToEnquiry) {
      const event = new CustomEvent(labels.analytics.eventAddToEnquiry, { detail: product });
      window.dispatchEvent(event);
      if (labels.analytics.eventAddToEnquiryGA) {
        trackEvent(labels.analytics.eventAddToEnquiryGA, {
          product: productTitle,
          location: labels.analytics.locationProductPage || "Product Page",
        });
      }
    }
  };

  const handleRequestForms = () => {
    const subject = `Product Forms Request - ${productTitle}`;
    const body = `Hello,\n\nI would like to request product forms and documentation for ${productTitle}.\n\nPlease send me:\n- Product specification sheets\n- Quality certificates\n- Packaging details\n- Sample request forms\n\nThank you!`;
    const emailUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-white pt-[72px] md:pt-24 relative overflow-hidden">
      <HeroVisualElements />

      <div className="relative z-10">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <nav className="flex gap-1 text-sm text-text-muted whitespace-nowrap overflow-x-auto no-scrollbar">
            <Link
              href={labels.navigation.homeUrl || "/"}
              className="hover:text-gold transition-colors"
            >
              {labels.navigation.home || "Home"}
            </Link>
            <span>{labels.apiConfig.breadcrumbSeparator || "/"}</span>
            <Link
              href={labels.navigation.productsUrl || "/products"}
              className="hover:text-gold transition-colors"
            >
              {labels.navigation.products || "Products"}
            </Link>
            <span>{labels.apiConfig.breadcrumbSeparator || "/"}</span>
            <span className="text-deep-brown">{productTitle}</span>
          </nav>
        </div>

        {/* Product Content */}
        <section className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24 relative">
          <SectionVisualElements />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden relative"
          >
            {/* Main Product Section */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 p-4 md:p-8">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden relative flex items-center justify-center max-h-[50vh] md:max-h-[600px] w-fit mx-auto">
                  {productImages[selectedImage] ? (
                    productImages[selectedImage].type === "url" ? (
                      <OptimizedImage
                        src={productImages[selectedImage].url}
                        alt={productImages[selectedImage].alt}
                        width={800}
                        height={1000}
                        className="w-auto h-auto max-h-[50vh] md:max-h-[600px] max-w-full"
                        imageClassName="object-scale-down"
                        priority
                        quality={100}
                      />
                    ) : (
                      <OptimizedImage
                        src={urlFor(productImages[selectedImage].image)
                          .width(800)
                          .height(1000)
                          .url()}
                        alt={productImages[selectedImage].alt}
                        width={800}
                        height={1000}
                        className="w-auto h-auto max-h-[50vh] md:max-h-[600px] max-w-full"
                        imageClassName="object-scale-down"
                        priority
                        quality={100}
                      />
                    )
                  ) : (
                    <div className="w-full aspect-square flex flex-col items-center justify-center text-gray-400 p-8">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">📸</span>
                      </div>
                      <p className="text-sm">
                        {labels.productDetail.heroPlaceholder || "Product Image"}
                      </p>
                    </div>
                  )}
                </div>

                {productImages.length > 1 ? (
                  <div className="flex gap-4 overflow-x-auto px-4 py-3 no-scrollbar">
                    {productImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? "border-gold shadow-md scale-110 z-10"
                            : "border-sand hover:border-gold/50"
                        }`}
                      >
                        {img.type === "url" ? (
                          <OptimizedImage
                            src={img.url}
                            alt={`${productTitle} ${index + 1}`}
                            fill
                            className="object-scale-down"
                            sizes="80px"
                          />
                        ) : (
                          <OptimizedImage
                            src={urlFor(img.image).width(200).height(200).url()}
                            alt={`${productTitle} ${index + 1}`}
                            fill
                            className="object-scale-down"
                            sizes="80px"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="flex text-gold">
                    {"★★★★★".split("").map((c, i) => (
                      <span key={i}>{c}</span>
                    ))}
                  </div>
                  <span className="text-sm text-text-muted">({product.rating || "4.8"})</span>
                </div>

                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-deep-brown mb-2 wrap-break-word leading-tight">
                    {heroHeading || productTitle}
                  </h1>
                  <p className="text-text-muted uppercase tracking-wide text-sm mb-2">
                    {product.category}
                  </p>
                  {ctaLine ? <p className="text-gold font-medium text-lg">{ctaLine}</p> : null}
                </div>

                {/* Pricing */}
                {/* {pricing.current ? (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-gold">
                      {pricing.currency}
                      {pricing.current}
                    </span>
                    {pricing.original ? (
                      <span className="text-xl text-gray-400 line-through">
                        {pricing.currency}
                        {pricing.original}
                      </span>
                    ) : null}
                    {pricing.discount ? (
                      <span className="bg-red-50 text-red-700 text-sm px-3 py-1 rounded-full font-medium border border-red-100">
                        {pricing.discount}% OFF
                      </span>
                    ) : null}
                  </div>
                ) : null} */}

                {/* Short Descriptions */}
                <div className="space-y-3 text-text-muted leading-relaxed">
                  {description ? <p>{description}</p> : null}
                  {product.introParagraphs?.map((p, i) => (
                    <p key={i}>{getLocalized(p, language)}</p>
                  ))}
                </div>

                {/* Specs Box */}
                <div className="bg-ivory rounded-xl p-4 border border-sand">
                  <h3 className="font-semibold text-deep-brown mb-3">Specifications</h3>
                  <div className="space-y-2">
                    {specs.map((spec, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-text-muted">{spec.label}:</span>
                        <span className="font-medium text-deep-brown text-right pl-4">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={handleAddToEnquiry}
                    className="flex-1 bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>💬</span>
                    {labels.common.addToEnquiry || "WhatsApp Enquiry"}
                  </button>
                  <button
                    onClick={handleRequestForms}
                    className="flex-1 border-2 border-deep-brown text-deep-brown hover:bg-deep-brown hover:text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <span>📄</span>
                    Product Forms
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-sand">
              <div className="flex border-b border-sand overflow-x-auto no-scrollbar">
                {(["description", "packaging", "forms"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 md:px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap shrink-0 ${
                      activeTab === tab
                        ? "border-b-2 border-gold text-gold"
                        : "text-text-muted hover:text-deep-brown"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
                    {tab === "packaging" ? "Info" : tab === "description" ? "Details" : ""}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {activeTab === "description" ? (
                  <div className="space-y-8">
                    {/* List Sections */}
                    {product.listSections?.map((section, idx) => (
                      <div key={idx}>
                        <h3 className="text-xl font-semibold text-deep-brown mb-3">
                          {getLocalized(section.title, language)}
                        </h3>
                        <ul className="space-y-2">
                          {section.items?.map((item, i) => {
                            const title = getLocalized(section.title, language) || "";
                            const isWhyChooseUs = title.toLowerCase().startsWith("why choose us");

                            return (
                              <li key={i} className="flex items-start gap-2">
                                {isWhyChooseUs ? (
                                  <Check className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                                ) : (
                                  <span className="w-1.5 h-1.5 bg-gold rounded-full mt-2.5 shrink-0" />
                                )}
                                <span className="text-text-muted">
                                  {getLocalized(item, language)}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}

                    {/* Applications List */}
                    {product.applications && product.applications.length > 0 ? (
                      <div>
                        <h3 className="text-xl font-semibold text-deep-brown mb-3">Applications</h3>
                        <ul className="space-y-2">
                          {product.applications.map((app, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-gold rounded-full mt-2.5 shrink-0" />
                              <span className="text-text-muted">{app}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {/* Product Varieties Section */}
                    {product.almondVarieties && product.almondVarieties.length > 0 ? (
                      <ProductVarietiesSection
                        varieties={product.almondVarieties}
                        title={
                          product.category === "almonds"
                            ? "California Almond Varieties"
                            : `${productTitle} Varieties`
                        }
                        subtitle={
                          product.category === "almonds"
                            ? "We source the finest California almonds, each variety offering unique characteristics perfect for different applications."
                            : `Explore our premium selection of ${productTitle} varieties.`
                        }
                        badge={
                          product.category === "almonds" ? "Premium Varieties" : "Our Selection"
                        }
                      />
                    ) : null}
                  </div>
                ) : null}

                {activeTab === "packaging" ? (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-deep-brown mb-4">
                      Packaging Information
                    </h2>
                    <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
                      {/* Visual Cards */}
                      {[
                        {
                          title: "Bulk Options",
                          desc: product.specifications?.packaging || "Bulk Sacks",
                          icon: "📦",
                        },
                        {
                          title: "Quality Sealed",
                          desc:
                            product.specifications?.qualitySealed ||
                            "Vacuum / Nitrogen Flush (On Request)",
                          icon: "🔒",
                        },
                        {
                          title: "Logistics",
                          desc: product.specifications?.logistics || "",
                          icon: "🚛",
                        },
                      ].map((card, i) => (
                        <div
                          key={i}
                          className="bg-ivory rounded-xl p-6 text-center border border-sand"
                        >
                          <div className="text-4xl mb-3">{card.icon}</div>
                          <h3 className="font-semibold text-deep-brown">{card.title}</h3>
                          <p className="text-sm text-text-muted">{card.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white border border-sand rounded-xl p-6">
                      <h3 className="font-semibold text-lg mb-4">Standard Dimensions</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                        <div className="p-3 bg-ivory rounded-lg">
                          <div className="font-medium text-deep-brown">
                            {product.specifications?.standardDimensions?.cartonSize || "10 KG"}
                          </div>
                          <div className="text-text-muted">
                            {product.specifications?.standardDimensions?.cartonType || "Carton"}
                          </div>
                        </div>
                        <div className="p-3 bg-ivory rounded-lg">
                          <div className="font-medium text-deep-brown">
                            {product.specifications?.standardDimensions?.bagSize || "25 KG"}
                          </div>
                          <div className="text-text-muted">
                            {product.specifications?.standardDimensions?.bagType || "PP Bag"}
                          </div>
                        </div>
                        <div className="p-3 bg-ivory rounded-lg">
                          <div className="font-medium text-deep-brown">
                            {product.specifications?.standardDimensions?.shelfLife || "12 Months"}
                          </div>
                          <div className="text-text-muted">Shelf Life</div>
                        </div>
                        <div className="p-3 bg-ivory rounded-lg">
                          <div className="font-medium text-deep-brown">
                            {product.specifications?.standardDimensions?.storage || "Ambient"}
                          </div>
                          <div className="text-text-muted">Storage</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {activeTab === "forms" ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">📄</div>
                    <h3 className="text-xl font-bold text-deep-brown mb-2">
                      Request Documentation
                    </h3>
                    <p className="text-text-muted max-w-md mx-auto mb-6">
                      We provide COA, Origin Certificates, and Quality Reports for all bulk
                      shipments.
                    </p>
                    <button
                      onClick={handleRequestForms}
                      className="bg-deep-brown text-white px-8 py-3 rounded-lg hover:bg-brown-900 transition-colors"
                    >
                      Request Documents
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
