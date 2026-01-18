"use client";

/**
 * Product Showcase Section Component
 *
 * Displays a grid of products with modal for specs and enquiry functionality.
 * Uses useState for modal state - requires client component.
 *
 * All content is passed via props from parent components that fetch from Sanity CMS.
 * Data is validated with Zod schemas for runtime type safety.
 */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { z } from "zod";

import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import {
  LeafIcon,
  NutIcon,
  AlmondIcon,
  CashewIcon,
  WalnutIcon,
  PeanutIcon,
} from "@/components/assets/Decorations";
import { useLanguage, type Language } from "@/context/LanguageContext";
import { getLocalized, type LocaleString, type LocaleText } from "@/lib/i18n";
import type { SanityImageSource } from "@sanity/image-url";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface Product {
  _id: string;
  title: LocaleString;
  category: string;
  slug?: { current?: string };
  heroHeading?: LocaleString;
  introParagraphs?: LocaleText[];
  listSections?: { title: LocaleString; items: LocaleString[] }[];
  ctaLine?: LocaleString;
  description?: LocaleText;
  heroImage?: SanityImageSource;
}

interface HeaderData {
  eyebrow?: string | LocaleString;
  title?: string | LocaleString;
  description?: string | LocaleText;
}

interface ProductShowcaseProps {
  initialProducts?: Product[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  siteSettings?: any;
  headerData?: HeaderData;
}

// =============================================================================
// ZOD VALIDATION SCHEMAS (for runtime validation)
// =============================================================================

const ProductSchema = z.object({
  _id: z.string(),
  title: z.unknown(),
  category: z.string(),
  slug: z.object({ current: z.string().optional() }).optional(),
  heroHeading: z.unknown().optional(),
  introParagraphs: z.array(z.unknown()).optional(),
  listSections: z.array(z.unknown()).optional(),
  ctaLine: z.unknown().optional(),
  description: z.unknown().optional(),
  heroImage: z.unknown().optional(),
});

const HeaderDataSchema = z.object({
  eyebrow: z.unknown().optional(),
  title: z.unknown().optional(),
  description: z.unknown().optional(),
});

const ProductShowcasePropsSchema = z.object({
  initialProducts: z.array(ProductSchema).optional(),
  siteSettings: z.unknown().optional(),
  headerData: HeaderDataSchema.optional(),
});

// =============================================================================
// VALIDATION
// =============================================================================

function validateProps(props: unknown): void {
  const result = ProductShowcasePropsSchema.safeParse(props);
  if (!result.success) {
    console.warn("[ProductShowcase] Props validation warning:", result.error.format());
  }
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06, // Standard fast stagger
      delayChildren: 0.05,
      ease: "easeOut" as const,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4, // Snappier
      ease: "easeOut" as const,
    },
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function ProductShowcase({
  initialProducts,
  siteSettings,
  headerData,
}: ProductShowcaseProps) {
  const { language } = useLanguage();

  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    validateProps({ initialProducts, siteSettings, headerData });
  }

  const products = initialProducts ?? [];
  const [selectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sectionId = siteSettings?.routing?.productsSectionId as string | undefined;
  const analyticsEventName = siteSettings?.analytics?.eventAddToEnquiry as string | undefined;

  const handleAddToEnquiry = useCallback(
    (product: Product) => {
      if (typeof window !== "undefined" && analyticsEventName) {
        const event = new CustomEvent(analyticsEventName, { detail: product });
        window.dispatchEvent(event);
      }
    },
    [analyticsEventName]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleModalAddToEnquiry = useCallback(() => {
    if (selectedProduct) {
      handleAddToEnquiry(selectedProduct);
    }
  }, [selectedProduct, handleAddToEnquiry]);

  if (products.length === 0) return null;

  return (
    <section
      id={sectionId}
      className="py-20 bg-linear-to-b from-ivory via-cashew-cream to-beige relative overflow-hidden"
      aria-labelledby="products-heading"
    >
      {/* Floating Dry Fruits Decorations */}
      <DecorativeBackground />

      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        {/* Section Header */}
        {headerData ? <SectionHeader headerData={headerData} language={language} /> : null}

        {/* Products Grid */}
        <ProductsGrid
          products={products}
          siteSettings={siteSettings}
          onAddToEnquiry={handleAddToEnquiry}
        />

        {/* Product Modal */}
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToEnquiry={handleModalAddToEnquiry}
          labels={siteSettings}
        />
      </div>
    </section>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface SectionHeaderProps {
  headerData: HeaderData;
  language: Language;
}

function SectionHeader({ headerData, language }: SectionHeaderProps) {
  return (
    <div className="text-center mb-16 max-w-3xl mx-auto">
      {headerData.eyebrow ? (
        <motion.p
          className="uppercase tracking-[0.4em] text-xs text-(--color-muted) mb-4 font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {getLocalized(headerData.eyebrow, language)}
        </motion.p>
      ) : null}

      {headerData.title ? (
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-(--color-graphite) mb-6 font-heading leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {getLocalized(headerData.title, language)}
        </motion.h2>
      ) : null}

      {headerData.description ? (
        <motion.div
          className="text-lg text-(--color-slate) leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p>{getLocalized(headerData.description, language)}</p>
        </motion.div>
      ) : null}
    </div>
  );
}

interface ProductsGridProps {
  products: Product[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  siteSettings: any;
  onAddToEnquiry: (product: Product) => void;
}

function ProductsGrid({ products, siteSettings, onAddToEnquiry }: ProductsGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -50px 0px" }}
      variants={staggerContainer}
    >
      {products.map((product) => (
        <motion.div key={product._id} variants={fadeInUp}>
          <ProductCard
            product={product}
            onAddToEnquiry={() => onAddToEnquiry(product)}
            labels={siteSettings}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

function DecorativeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Large Background Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-0 text-gold/5"
      >
        <LeafIcon className="w-80 h-80" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute bottom-10 right-0 text-gold/5"
      >
        <NutIcon className="w-96 h-96" />
      </motion.div>

      {/* Almonds */}
      <motion.div
        animate={{ rotate: [0, 10, -10, 0], y: [0, -12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 right-16 opacity-15"
      >
        <AlmondIcon className="w-28 h-28" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -14, 14, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute bottom-1/3 left-20 opacity-15"
      >
        <AlmondIcon className="w-32 h-32" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 12, -12, 0], y: [0, 10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 4 }}
        className="absolute top-10 left-10 opacity-12"
      >
        <AlmondIcon className="w-30 h-30" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -13, 13, 0], x: [0, 12, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear", delay: 6 }}
        className="absolute bottom-10 right-10 opacity-15"
      >
        <AlmondIcon className="w-26 h-26" />
      </motion.div>

      {/* Cashews */}
      <motion.div
        animate={{ rotate: [0, 12, -12, 0], y: [0, 10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 1.5 }}
        className="absolute top-1/2 left-10 opacity-15"
      >
        <CashewIcon className="w-24 h-24" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -10, 10, 0], x: [0, 12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 3 }}
        className="absolute bottom-1/4 right-24 opacity-15"
      >
        <CashewIcon className="w-26 h-26" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 13, -13, 0], y: [0, -12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute top-20 left-1/3 opacity-12"
      >
        <CashewIcon className="w-28 h-28" />
      </motion.div>

      {/* Walnuts */}
      <motion.div
        animate={{ rotate: [0, -9, 9, 0], y: [0, -8, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear", delay: 2.5 }}
        className="absolute top-1/3 left-1/4 opacity-15"
      >
        <WalnutIcon className="w-26 h-26" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute bottom-40 right-1/3 opacity-12"
      >
        <WalnutIcon className="w-30 h-30" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -10, 10, 0], x: [0, 10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: 6 }}
        className="absolute top-1/4 right-1/4 opacity-15"
      >
        <WalnutIcon className="w-24 h-24" />
      </motion.div>

      {/* Peanuts */}
      <motion.div
        animate={{ rotate: [0, 11, -11, 0], x: [0, 8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: 4 }}
        className="absolute bottom-1/3 left-1/3 opacity-15"
      >
        <PeanutIcon className="w-22 h-22" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -14, 14, 0], y: [0, 10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute top-2/3 right-20 opacity-12"
      >
        <PeanutIcon className="w-24 h-24" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 12, -12, 0], x: [0, -10, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear", delay: 7 }}
        className="absolute bottom-20 left-20 opacity-15"
      >
        <PeanutIcon className="w-20 h-20" />
      </motion.div>

      {/* Scattered Small Nuts */}
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute top-10 left-1/3 opacity-8"
      >
        <AlmondIcon className="w-18 h-18" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -360], scale: [1, 1.12, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 6 }}
        className="absolute top-10 right-1/3 opacity-8"
      >
        <CashewIcon className="w-18 h-18" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.08, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 7 }}
        className="absolute bottom-10 left-1/3 opacity-8"
      >
        <WalnutIcon className="w-18 h-18" />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -360], scale: [1, 1.1, 1] }}
        transition={{ duration: 21, repeat: Infinity, ease: "linear", delay: 8 }}
        className="absolute bottom-10 right-1/3 opacity-8"
      >
        <PeanutIcon className="w-18 h-18" />
      </motion.div>
    </div>
  );
}
