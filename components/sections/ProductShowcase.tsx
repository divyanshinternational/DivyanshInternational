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
import { Package } from "lucide-react";

import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import DecorativeBackground from "@/components/ui/DecorativeBackground";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import OptimizedImage from "@/components/ui/OptimizedImage";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface HeaderData {
  eyebrow?: string;
  title?: string;
  description?: string;
  backgroundImageUrl?: string;
}

interface ProductShowcaseProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialProducts?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  siteSettings?: any;
  headerData?: HeaderData;
}

// =============================================================================
// ZOD VALIDATION SCHEMAS
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
  backgroundImageUrl: z.unknown().optional(),
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
      staggerChildren: 0.06,
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
      duration: 0.4,
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
  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    validateProps({ initialProducts, siteSettings, headerData });
  }

  const products = initialProducts ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sectionId = siteSettings?.routing?.productsSectionId as string | undefined;
  const analyticsEventName = siteSettings?.analytics?.eventAddToEnquiry as string | undefined;

  const handleAddToEnquiry = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (product: any) => {
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

  const bgImage = headerData?.backgroundImageUrl
    ? getGoogleDriveImageUrl(headerData.backgroundImageUrl)
    : null;

  if (products.length === 0) return null;

  return (
    <section
      id={sectionId}
      className="py-16 md:py-24 bg-bg relative overflow-hidden"
      aria-labelledby="products-heading"
    >
      {/* Dynamic Background Image */}
      {bgImage ? (
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={bgImage}
            alt=""
            fill
            className="pointer-events-none scale-110 blur-[5px] opacity-100 object-cover"
            sizes="100vw"
            quality={100}
          />
        </div>
      ) : null}

      {/* Floating Dry Fruits Decorations */}
      <DecorativeBackground variant="scattered" />

      <div className="container mx-auto px-4 md:px-6 lg:px-10 relative z-10">
        {headerData ? (
          <div className="text-center mb-16 md:mb-24 max-w-4xl mx-auto bg-white/60 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-white/20">
            <SectionHeader headerData={headerData} />
          </div>
        ) : null}

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
}

function SectionHeader({ headerData }: SectionHeaderProps) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      {/* Icon */}
      <motion.div
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-gold mb-6 mx-auto"
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <Package className="w-8 h-8" />
      </motion.div>

      {headerData.eyebrow ? (
        <motion.div
          className="flex items-center justify-center gap-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="h-px w-8 bg-gold" />
          <span className="uppercase tracking-[0.3em] text-sm text-gold-dark font-semibold">
            {headerData.eyebrow}
          </span>
          <span className="h-px w-8 bg-gold" />
        </motion.div>
      ) : null}

      {headerData.title ? (
        <motion.h2
          id="products-heading"
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-brown mb-6 font-heading leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {headerData.title}
        </motion.h2>
      ) : null}

      {headerData.description ? (
        <motion.p
          className="text-lg text-deep-brown/80 leading-relaxed font-medium"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {headerData.description}
        </motion.p>
      ) : null}
    </div>
  );
}

interface ProductsGridProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  siteSettings: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAddToEnquiry: (product: any) => void;
}

function ProductsGrid({ products, siteSettings, onAddToEnquiry }: ProductsGridProps) {
  return (
    <motion.div
      className="columns-1 md:columns-2 lg:columns-3 gap-8"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05, margin: "0px" }}
      variants={staggerContainer}
    >
      {products.map((product) => (
        <motion.div key={product._id} variants={fadeInUp} className="break-inside-avoid mb-8">
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
