"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, type Language } from "@/context/LanguageContext";
import { z } from "zod";

// =============================================================================
// CONFIGURATION
// =============================================================================

const LanguageOptionSchema = z.object({
  code: z.string(), // Typed as Language in usage
  label: z.string(),
  flag: z.string(),
});

type LanguageOption = z.infer<typeof LanguageOptionSchema> & { code: Language };

const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

// Runtime config validation
if (process.env.NODE_ENV === "development") {
  z.array(LanguageOptionSchema).parse(LANGUAGES);
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!currentLang) return null;

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-beige transition-colors focus:outline-2 focus:outline-gold"
        aria-label={t("selectLanguage")}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-xl" aria-hidden="true">
          {currentLang.flag}
        </span>
        <span className="text-sm font-medium text-deep-brown uppercase">{currentLang.code}</span>
        <svg
          className={`w-4 h-4 text-deep-brown transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 md:left-auto md:right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-sand overflow-hidden z-50"
            role="listbox"
          >
            <div className="py-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-beige transition-colors ${
                    language === lang.code ? "bg-beige" : ""
                  }`}
                  role="option"
                  aria-selected={language === lang.code}
                >
                  <span className="text-xl" aria-hidden="true">
                    {lang.flag}
                  </span>
                  <span className="text-sm font-medium text-deep-brown">{lang.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
