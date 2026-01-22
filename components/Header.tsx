"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { z } from "zod";
import MobileMenu from "./MobileMenu";
import ProductsDropdown from "./ProductsDropdown";
import LanguageSwitcher from "./LanguageSwitcher";

import { urlForImage } from "@/lib/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const SanityImageSchema = z.custom<SanityImageSource>();

const NavLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

const HeaderDataSchema = z.object({
  logo: SanityImageSchema.optional(),
  navLinks: z.array(NavLinkSchema).optional(),
  tradeButtonText: z.string().optional(),
  logoAlt: z.string().optional(),
  homeAriaLabel: z.string().optional(),
  navAriaLabel: z.string().optional(),
  menuAriaLabel: z.string().optional(),
  closeMenuAriaLabel: z.string().optional(),
  productsLabel: z.string().optional(),
});

const ProductSlugSchema = z.object({
  current: z.string(),
});

const SiteSettingsSchema = z
  .object({
    organization: z
      .object({
        name: z.string().optional(),
        tagline: z.string().optional(),
        logo: SanityImageSchema.optional(),
      })
      .optional(),
    navigation: z
      .object({
        home: z.string().optional(),
        products: z.string().optional(),
        catalogue: z.string().optional(),
        homeUrl: z.string().optional(),
        productsUrl: z.string().optional(),
        catalogueUrl: z.string().optional(),
        productsLabel: z.string().optional(),
      })
      .optional(),
  })
  .passthrough();

const HeaderPropsSchema = z.object({
  initialHeader: HeaderDataSchema.nullable().optional(),
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

type HeaderProps = z.infer<typeof HeaderPropsSchema>;

// =============================================================================
// COMPONENT
// =============================================================================

export default function Header({ initialHeader, products, siteSettings }: HeaderProps) {
  // Runtime validation in development
  if (process.env.NODE_ENV === "development") {
    const result = HeaderPropsSchema.safeParse({
      initialHeader,
      products,
      siteSettings,
    });
    if (!result.success) {
      console.warn("[Header] Prop validation warning:", result.error.flatten());
    }
  }

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const header = initialHeader || {};

  // Resolve Logo URL
  const logoUrl = siteSettings?.organization?.logo
    ? urlForImage(siteSettings.organization.logo).width(600).auto("format").url()
    : "/Logo.png";

  // Dynamic Navigation Labels & URLs
  const nav = siteSettings?.navigation;
  const homeLabel = nav?.home || "Home";
  const homeUrl = nav?.homeUrl || "/";
  // const catalogueLabel = nav?.catalogue || "Catalogue";
  // const catalogueUrl = nav?.catalogueUrl || "/catalogue";
  const productsLabel = nav?.productsLabel || nav?.products || "Products";
  const tradeButtonText = header.tradeButtonText || "Get Quote";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          isScrolled
            ? "bg-bg/95 shadow-lg py-2 md:py-3 border-b border-border backdrop-blur-md"
            : "bg-bg/80 backdrop-blur-md py-3 md:py-4 shadow-sm"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo - Floating above header */}
            <div className="flex items-center shrink-0">
              <Link
                href={homeUrl}
                className="flex items-center space-x-2 md:space-x-3 focus:outline-2 focus:outline-gold focus:rounded"
                aria-label={header.homeAriaLabel || "Go to homepage"}
              >
                <OptimizedImage
                  src={logoUrl}
                  alt={
                    header.logoAlt ||
                    siteSettings?.organization?.name ||
                    "Divyansh International Logo"
                  }
                  width={400}
                  height={150}
                  className="w-16 h-12 md:w-20 md:h-16 flex items-center shrink-0"
                  imageClassName="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  overflowVisible={true}
                  priority
                  quality={100}
                />
                <div className="flex flex-col">
                  <span className="text-deep-brown font-bold text-base md:text-xl tracking-wide">
                    {siteSettings?.organization?.name || "Divyansh International"}
                  </span>
                  <span className="text-almond-gold text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                    {siteSettings?.organization?.tagline || "Premium Dry Fruits"}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center space-x-6"
              aria-label={header.navAriaLabel || "Main Navigation"}
            >
              <Link
                href={homeUrl}
                className="text-foreground hover:text-gold transition-colors focus:outline-2 focus:outline-gold focus:rounded px-2 py-1"
              >
                {homeLabel}
              </Link>

              <ProductsDropdown
                products={products || []}
                labels={
                  siteSettings as unknown as {
                    navigation: { productsLabel: string; productsUrl: string };
                  }
                }
              />

              {/* Catalogue Link - Hidden for now
              <Link
                href={catalogueUrl}
                className="text-foreground hover:text-gold transition-colors focus:outline-2 focus:outline-gold focus:rounded px-2 py-1"
              >
                {catalogueLabel}
              </Link>
              */}

              {header.navLinks?.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="text-foreground hover:text-gold transition-colors focus:outline-2 focus:outline-gold focus:rounded px-2 py-1"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/contact"
                className="bg-gold hover:bg-gold-dark hover:shadow-lg text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 focus:outline-2 focus:outline-gold-dark focus:outline-offset-2 whitespace-nowrap"
              >
                {tradeButtonText}
              </Link>

              <div className="pl-2 border-l border-sand">
                <LanguageSwitcher />
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-deep-brown focus:outline-2 focus:outline-gold focus:rounded p-2 hover:bg-beige rounded-lg transition-colors"
              aria-label={header.menuAriaLabel || "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        products={products || []}
        menuItems={[
          { label: homeLabel, url: homeUrl },
          // { label: catalogueLabel, url: catalogueUrl }, // Hidden for now
          ...(header.navLinks ?? []),
        ]}
        productsLabel={productsLabel}
        closeMenuAriaLabel={header.closeMenuAriaLabel || "Close menu"}
      />
    </>
  );
}
