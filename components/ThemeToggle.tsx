"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LabelsSchema = z.object({
  toggleAria: z.string().optional(),
  title: z.string().optional(),
  modernLabel: z.string().optional(),
  feminineLabel: z.string().optional(),
});

// =============================================================================
// TYPES
// =============================================================================

type Labels = z.infer<typeof LabelsSchema>;

interface ThemeToggleProps {
  labels: Labels;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ThemeToggle({ labels }: ThemeToggleProps) {
  const [fontTheme, setFontTheme] = useState<"modern" | "feminine">("modern");
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    const stored = localStorage.getItem("fontTheme") as "modern" | "feminine" | null;
    if (stored) {
      setFontTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const root = document.documentElement;
    if (fontTheme === "feminine") {
      root.style.setProperty("--font-heading-dynamic", "var(--font-playfair)");
      root.style.setProperty("--font-body-dynamic", "var(--font-lato)");
    } else {
      root.style.setProperty("--font-heading-dynamic", "var(--font-manrope)");
      root.style.setProperty("--font-body-dynamic", "var(--font-inter)");
    }
    localStorage.setItem("fontTheme", fontTheme);
  }, [fontTheme, isClient]);

  if (!isClient) return null;

  // Safe labels
  const title = labels.title || "Font Style";
  const modernLabel = labels.modernLabel || "Modern";
  const feminineLabel = labels.feminineLabel || "Elegant";
  const toggleAria = labels.toggleAria || "Toggle theme";

  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-4 rounded-xl shadow-xl border border-gold mb-2 w-48"
            role="dialog"
            aria-label={title}
          >
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-(--color-muted)">
                {title}
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setFontTheme("modern")}
                className={`px-4 py-3 rounded-lg text-sm transition-all flex items-center justify-between ${
                  fontTheme === "modern"
                    ? "bg-deep-brown text-white shadow-md ring-2 ring-deep-brown ring-offset-1"
                    : "bg-gray-50 text-deep-brown hover:bg-gray-100"
                }`}
                aria-pressed={fontTheme === "modern"}
              >
                <span>{modernLabel}</span>
                {fontTheme === "modern" ? <span className="text-white">✓</span> : null}
              </button>
              <button
                onClick={() => setFontTheme("feminine")}
                className={`px-4 py-3 rounded-lg text-sm transition-all flex items-center justify-between font-serif italic ${
                  fontTheme === "feminine"
                    ? "bg-deep-brown text-white shadow-md ring-2 ring-deep-brown ring-offset-1"
                    : "bg-gray-50 text-deep-brown hover:bg-gray-100"
                }`}
                aria-pressed={fontTheme === "feminine"}
              >
                <span>{feminineLabel}</span>
                {fontTheme === "feminine" ? <span className="text-white">✓</span> : null}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-deep-brown text-white p-3 rounded-full shadow-lg hover:bg-gold-dark transition-all hover:scale-105 active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-gold focus:ring-offset-2"
        aria-label={toggleAria}
        aria-expanded={isOpen}
      >
        <span className="sr-only">Toggle Theme Settings</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
    </div>
  );
}
