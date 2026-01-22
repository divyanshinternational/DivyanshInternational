"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackEvent } from "@/components/analytics/GA4";

/**
 * PerformanceMonitor Component
 *
 * Captures Core Web Vitals and sends them to Google Analytics 4
 * via the standard 'trackEvent' utility which handles validation/safety.
 *
 * - CLS (Cumulative Layout Shift)
 * - FID (First Input Delay)
 * - LCP (Largest Contentful Paint)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 * - INP (Interaction to Next Paint)
 */

export default function PerformanceMonitor() {
  useReportWebVitals((metric) => {
    // 1. Log to console in development
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("[Web Vitals]", metric);
    }

    // 2. Send to GA4 for production monitoring
    const { id, name, label, value } = metric;

    trackEvent(name, {
      event_category: "Web Vitals",
      event_label: id,
      value: Math.round(name === "CLS" ? value * 1000 : value),
      metric_id: id,
      metric_value: value,
      metric_delta: metric.delta,
      metric_rating: label,
      non_interaction: true,
    });
  });

  return null;
}
