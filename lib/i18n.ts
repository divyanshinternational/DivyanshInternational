import type { Language } from "@/context/LanguageContext";

// =============================================================================
// TYPES
// =============================================================================

export type LocaleString = Partial<Record<Language, string>>;
export type LocaleText = Partial<Record<Language, string>>;

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Helper to retrieve localized content safely.
 * Prioritizes the requested language, falls back to English, then to the first available key.
 *
 * @param content - The localized object or direct string
 * @param language - The current language context
 * @returns The best available string or an empty string
 */
export function getLocalized(
  content: LocaleString | LocaleText | string | undefined | null,
  language: Language
): string {
  if (!content) return "";

  // If it's already a string, return it directly
  if (typeof content === "string") return content;

  // Try specific language
  if (content[language]) {
    return content[language]!;
  }

  // Fallback to English
  if (content["en"]) {
    return content["en"]!;
  }

  // Fallback to first available key
  const values = Object.values(content);
  if (values.length > 0 && values[0]) {
    return values[0];
  }

  return "";
}
