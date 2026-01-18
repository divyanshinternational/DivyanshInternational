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
