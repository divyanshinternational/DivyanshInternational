"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { z } from "zod";

// =============================================================================
// ZOD SCHEMAS & TYPES
// =============================================================================

const LanguageSchema = z.enum(["en", "ar", "hi", "fr"]);
export type Language = z.infer<typeof LanguageSchema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TranslationKeySchema = z.enum([
  "home",
  "about",
  "products",
  "contact",
  "trade",
  "selectLanguage",
]);
type TranslationKey = z.infer<typeof TranslationKeySchema>;

// Strict Dictionary Type
type Translations = Record<Language, Record<TranslationKey, string>>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey | string) => string;
  dir: "ltr" | "rtl";
}

// =============================================================================
// STATIC DATA (UI LABELS)
// =============================================================================

const TRANSLATIONS: Translations = {
  en: {
    home: "Home",
    about: "About Us",
    products: "Products",
    contact: "Contact",
    trade: "Trade Enquiry",
    selectLanguage: "Select Language",
  },
  ar: {
    home: "الرئيسية",
    about: "من نحن",
    products: "منتجاتنا",
    contact: "اتصل بنا",
    trade: "استفسار تجاري",
    selectLanguage: "اختر اللغة",
  },
  hi: {
    home: "होम",
    about: "हमारे बारे में",
    products: "उत्पाद",
    contact: "संपर्क करें",
    trade: "व्यापार पूछताछ",
    selectLanguage: "भाषा चुनें",
  },
  fr: {
    home: "Accueil",
    about: "À propos",
    products: "Produits",
    contact: "Contact",
    trade: "Demande commerciale",
    selectLanguage: "Choisir la langue",
  },
};

// =============================================================================
// CONTEXT
// =============================================================================

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [isClient, setIsClient] = useState(false);

  // Hydration safety
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);

    // Attempt to recover saved language
    try {
      const savedLang = localStorage.getItem("language");
      const result = LanguageSchema.safeParse(savedLang);
      if (result.success) {
        setLanguage(result.data);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Update document attributes
  useEffect(() => {
    if (!isClient) return;

    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("language", language);
  }, [language, isClient]);

  const t = (key: TranslationKey | string) => {
    // Fallback for dynamic keys not in schema
    const keys = Object.keys(TRANSLATIONS[language]);
    if (keys.includes(key)) {
      return TRANSLATIONS[language][key as TranslationKey];
    }
    return key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        dir: language === "ar" ? "rtl" : "ltr",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
