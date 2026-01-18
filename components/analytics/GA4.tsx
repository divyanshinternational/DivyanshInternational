"use client";

/**
 * Google Analytics 4 Component
 * Loads GA4 tracking script and provides event tracking utilities.
 * Respects user privacy - won't load if GA4 ID is not configured.
 */

import Script from "next/script";
import { z } from "zod";

import { env } from "@/lib/env";

// =============================================================================
// TYPE DECLARATIONS
// =============================================================================

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

interface Gtag {
  (command: "js", date: Date): void;
  (command: "config", targetId: string, config?: GtagConfig): void;
  (command: "event", eventName: string, eventParams?: EventParams): void;
  (command: "set", config: Record<string, unknown>): void;
  (command: "consent", action: "default" | "update", config: ConsentConfig): void;
}

interface GtagConfig {
  page_path?: string | undefined;
  page_title?: string | undefined;
  send_page_view?: boolean | undefined;
  [key: string]: unknown;
}

interface EventParams {
  event_category?: string | undefined;
  event_label?: string | undefined;
  value?: number | undefined;
  [key: string]: unknown;
}

interface ConsentConfig {
  analytics_storage?: "granted" | "denied" | undefined;
  ad_storage?: "granted" | "denied" | undefined;
  [key: string]: unknown;
}

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

const eventParamsSchema = z.record(z.string(), z.unknown()).optional();

// =============================================================================
// GA4 COMPONENT
// =============================================================================

export default function GA4() {
  const ga4Id = env.NEXT_PUBLIC_GA4_ID;

  // Don't render if GA4 is not configured
  if (!ga4Id) {
    return null;
  }

  return (
    <>
      {/* Load GA4 gtag.js library */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
        strategy="afterInteractive"
      />

      {/* Initialize GA4 */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ga4Id}');
        `}
      </Script>
    </>
  );
}

// =============================================================================
// EVENT TRACKING UTILITIES
// =============================================================================

/**
 * Track a custom event in GA4
 * @param eventName - Name of the event (e.g., 'login', 'purchase', 'share')
 * @param eventParams - Optional parameters for the event
 */
export function trackEvent(eventName: string, eventParams?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  // Validate event params
  const validation = eventParamsSchema.safeParse(eventParams);
  if (!validation.success && process.env.NODE_ENV === "development") {
    console.warn("[GA4] Invalid event params:", validation.error.issues);
    return;
  }

  window.gtag("event", eventName, eventParams);
}

/**
 * Track a page view in GA4
 * @param pagePath - The path of the page
 * @param pageTitle - Optional title of the page
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  const ga4Id = env.NEXT_PUBLIC_GA4_ID;
  if (!ga4Id) {
    return;
  }

  window.gtag("config", ga4Id, {
    page_path: pagePath,
    page_title: pageTitle,
  });
}

/**
 * Update consent state for GDPR compliance
 * @param analyticsStorage - Whether analytics storage is granted
 * @param adStorage - Whether ad storage is granted
 */
export function updateConsent(
  analyticsStorage: "granted" | "denied",
  adStorage: "granted" | "denied" = "denied"
): void {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("consent", "update", {
    analytics_storage: analyticsStorage,
    ad_storage: adStorage,
  });
}
