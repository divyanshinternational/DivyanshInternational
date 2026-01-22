/**
 * Root Layout
 * Provides core HTML structure, fonts, and context providers for the entire application.
 * This is the outermost layout that wraps all pages.
 */

import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";

import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import { LanguageProvider } from "@/context/LanguageContext";

// =============================================================================
// FONT CONFIGURATION
// =============================================================================

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

// =============================================================================
// METADATA CONFIGURATION
// =============================================================================

export const metadata: Metadata = {
  title: {
    default: "Divyansh International",
    template: "%s | Divyansh International",
  },
  description: "Premium Quality Dry Fruits & Spices - Leading exporter and supplier worldwide.",
  other: {
    "screen-orientation": "portrait",
    orientation: "portrait",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
};

// =============================================================================
// VIEWPORT CONFIGURATION
// =============================================================================

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffcf7" },
    { media: "(prefers-color-scheme: dark)", color: "#3e2f23" },
  ],
};

// =============================================================================
// ROOT LAYOUT COMPONENT
// =============================================================================

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="en"
      className={`hydrated ${inter.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <LanguageProvider>
          <SmoothScrolling>{children}</SmoothScrolling>
        </LanguageProvider>
      </body>
    </html>
  );
}
