"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { z } from "zod";

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProductExcerptSchema = z.object({
  title: z.string(),
  slug: z.object({
    current: z.string(),
  }),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LabelsSchema = z.object({
  navigation: z.object({
    productsLabel: z.string().optional(),
    productsUrl: z.string().optional(),
  }),
});

// =============================================================================
// TYPES
// =============================================================================

type ProductExcerpt = z.infer<typeof ProductExcerptSchema>;
type Labels = z.infer<typeof LabelsSchema>;

interface ProductsDropdownProps {
  products: ProductExcerpt[];
  labels: Labels;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ProductsDropdown({ products, labels }: ProductsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useLanguage();

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Accessibility: Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const labelText = labels?.navigation?.productsLabel || "Products";
  const baseUrl = labels?.navigation?.productsUrl || "/products";

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-foreground hover:text-gold transition-colors focus-visible:outline-2 focus-visible:outline-gold focus-visible:rounded px-2 py-1 flex items-center gap-1 group"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="products-dropdown-menu"
        type="button"
      >
        <span className="font-medium">{labelText}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-gold" : "text-gray-400 group-hover:text-gold"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id="products-dropdown-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 pt-2 w-64 z-50"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="products-menu-button"
          >
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden ring-1 ring-black/5">
              {products.length > 0 ? (
                products.map((product) => (
                  <Link
                    key={product.slug.current}
                    href={`${baseUrl}/${product.slug.current}`}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-deep-brown transition-colors focus:outline-none focus:bg-orange-50 relative group"
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="relative z-10">{product.title}</span>
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-gold scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />
                  </Link>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-400 italic">No products found</div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
