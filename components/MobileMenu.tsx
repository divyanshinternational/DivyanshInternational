"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { z } from "zod";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalized, type LocaleString } from "@/lib/i18n";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const MobileMenuPropsSchema = z.object({
  isOpen: z.boolean(),
  onClose: z.function(),
  products: z
    .array(
      z.object({
        title: z.custom<LocaleString>(),
        slug: z.object({ current: z.string() }).or(z.string()),
      })
    )
    .optional()
    .default([]),
  menuItems: z
    .array(
      z.object({
        label: z.string(),
        url: z.string(),
      })
    )
    .optional()
    .default([]),
  productsLabel: z.string().optional().default("Products"),
  closeMenuAriaLabel: z.string().optional().default("Close menu"),
});

// =============================================================================
// TYPES
// =============================================================================

type MobileMenuProps = z.infer<typeof MobileMenuPropsSchema>;

// =============================================================================
// COMPONENT
// =============================================================================

export default function MobileMenu({
  isOpen,
  onClose,
  products = [],
  menuItems = [],
  productsLabel = "Products",
  closeMenuAriaLabel = "Close menu",
}: MobileMenuProps) {
  // Runtime validation in development
  if (process.env.NODE_ENV === "development") {
    const result = MobileMenuPropsSchema.safeParse({
      isOpen,
      onClose,
      products,
      menuItems,
      productsLabel,
      closeMenuAriaLabel,
    });
    if (!result.success) {
      console.warn("[MobileMenu] Prop validation warning:", result.error.flatten());
    }
  }

  const { language } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Mobile Menu Panel */}
          <motion.nav
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              opacity: { duration: 0.2 },
            }}
            className="fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] bg-white z-50 shadow-2xl overflow-y-auto border-l border-sand"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div className="p-6">
              {/* Header: Lang Switcher + Close Button */}
              <div className="flex justify-between items-center mb-6 border-b border-sand pb-4">
                <LanguageSwitcher />
                <button
                  onClick={onClose}
                  className="text-deep-brown hover:text-gold focus:outline-2 focus:outline-gold focus:rounded p-2 transition-colors rounded-full hover:bg-beige"
                  aria-label={closeMenuAriaLabel}
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

              {/* Main Navigation Items */}
              <ul className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={item.url}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1 + index * 0.05,
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <Link
                      href={item.url}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-deep-brown hover:bg-beige rounded-xl transition-all active:scale-95 focus:outline-2 focus:outline-gold focus:rounded"
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}

                {/* Products Section */}
                <motion.li
                  className="pt-6 border-t border-sand mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2 + menuItems.length * 0.05,
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <div className="px-4 py-2 text-sm font-bold text-almond-gold uppercase tracking-wider mb-2">
                    {productsLabel}
                  </div>
                  <ul className="space-y-1">
                    {products.map((product, index) => {
                      const slug =
                        typeof product.slug === "string" ? product.slug : product.slug.current;
                      return (
                        <motion.li
                          key={slug}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.3 + menuItems.length * 0.05 + index * 0.04,
                            duration: 0.3,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                        >
                          <Link
                            href={`/products/${slug}`}
                            className="block px-4 py-2 text-foreground hover:bg-beige hover:text-deep-brown rounded-lg transition-colors focus:outline-2 focus:outline-gold focus:rounded"
                            onClick={onClose}
                          >
                            {getLocalized(product.title, language)}
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </motion.li>
              </ul>
            </div>
          </motion.nav>
        </>
      ) : null}
    </AnimatePresence>
  );
}
