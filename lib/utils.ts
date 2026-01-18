import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

// =============================================================================
// TAILWIND UTILS
// =============================================================================

/**
 * Merges class names with Tailwind CSS conflict resolution.
 * critical hot-path utility, bypassing runtime Zod validation for performance.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// =============================================================================
// FORMATTING UTILS
// =============================================================================

const FormatDateSchema = z.object({
  date: z.union([z.string(), z.number(), z.date()]),
  locale: z.string().optional().default("en-IN"),
  options: z.custom<Intl.DateTimeFormatOptions>().optional(),
});

/**
 * Formats a date string, number, or object into a localized string.
 * Defaults to 'en-IN' locale.
 */
export function formatDate(
  date: string | number | Date,
  locale: string = "en-IN",
  options?: Intl.DateTimeFormatOptions
) {
  // Runtime safety check during dev
  if (process.env.NODE_ENV === "development") {
    const result = FormatDateSchema.safeParse({ date, locale, options });
    if (!result.success) {
      console.warn("[utils] Invalid date input:", result.error);
      return "Invalid Date";
    }
  }

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "Invalid Date";

    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      ...options,
    }).format(dateObj);
  } catch (error) {
    console.error("[utils] Date formatting error:", error);
    return "Date Error";
  }
}

const FormatCurrencySchema = z.object({
  amount: z.number(),
  currency: z.string().optional().default("INR"),
  locale: z.string().optional().default("en-IN"),
});

/**
 * Formats a number into a currency string.
 * Defaults to INR and en-IN locale.
 */
export const formatCurrency = (
  amount: number,
  currency: string = "INR",
  locale: string = "en-IN"
) => {
  // Runtime safety check during dev
  if (process.env.NODE_ENV === "development") {
    const result = FormatCurrencySchema.safeParse({ amount, currency, locale });
    if (!result.success) {
      console.warn("[utils] Invalid currency input:", result.error);
      return "NaN";
    }
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error("[utils] Currency formatting error:", error);
    return `${amount}`;
  }
};

/**
 * Delays execution for a specified number of milliseconds.
 * Useful for simulating network latency or debouncing.
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// =============================================================================
// VIDEO UTILS
// =============================================================================

export function getGoogleDriveVideoUrl(url: string): string {
  if (!url) return "";

  const patterns = [
    /drive\.google\.com\/file\/d\/([^/]+)/,
    /drive\.google\.com\/uc\?.*?id=([^&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
  }

  return url;
}

/**
 * Detects if a URL is a YouTube URL and returns the embed URL.
 * Supports: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID
 * Returns null if not a YouTube URL.
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;

  // Pattern for youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch?.[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&loop=1&playlist=${shortMatch[1]}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
  }

  // Pattern for youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch?.[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&loop=1&playlist=${watchMatch[1]}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
  }

  // Pattern for youtube.com/embed/VIDEO_ID (already embed format)
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch?.[1]) {
    // Add autoplay params if not present
    if (!url.includes("autoplay")) {
      return `${url.split("?")[0]}?autoplay=1&loop=1&playlist=${embedMatch[1]}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
    }
    return url;
  }

  return null;
}

export function isYouTubeUrl(url: string): boolean {
  return getYouTubeEmbedUrl(url) !== null;
}

export function isValidVideoUrl(url: string): boolean {
  return typeof url === "string" && url.trim().length > 0;
}
