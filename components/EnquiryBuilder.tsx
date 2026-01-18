"use client";

/**
 * Enquiry Builder Component
 *
 * Floating action button and panel for managing product enquiries.
 * Refactored to Zod validation, removal of 'any' types, and secure navigation.
 */

import { useState, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { addEnquiryItem, getEnquiryItems } from "@/lib/utils/enquiry";
import EnquiryPanel from "@/components/EnquiryPanel";
import { trackEvent } from "@/components/analytics/GA4";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalized } from "@/lib/i18n";
import { showToast } from "@/components/ui/Toast";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const ItemLabelsSchema = z.object({
  grade: z.string().optional(),
  packFormat: z.string().optional(),
  quantity: z.string().optional(),
  moq: z.string().optional(),
  notes: z.string().optional(),
  save: z.string().optional(),
  cancel: z.string().optional(),
  edit: z.string().optional(),
});

const PanelLabelsSchema = z.object({
  title: z.string().optional(),
  emptyState: z.string().optional(),
  emptyStateSub: z.string().optional(),
  exportPdf: z.string().optional(),
  submitEnquiry: z.string().optional(),
  clearAll: z.string().optional(),
  confirmClear: z.string().optional(),
  itemLabels: ItemLabelsSchema.optional(),
  closePanelAria: z.string().optional(),
});

const BuilderLabelsSchema = z.object({
  buttonLabel: z.string().optional(),
});

const EnquiryBuilderLabelsSchema = z.object({
  panel: PanelLabelsSchema.optional(),
  builder: BuilderLabelsSchema.optional(),
  pdfError: z.string().optional(),
  emptyEnquiryError: z.string().optional(),
  openBuilderAria: z.string().optional(),
});

const EnquiryBuilderPropsSchema = z.object({
  labels: EnquiryBuilderLabelsSchema.optional(),
});

// =============================================================================
// TYPES
// =============================================================================

export type EnquiryBuilderProps = z.infer<typeof EnquiryBuilderPropsSchema>;
export type PanelLabels = z.infer<typeof PanelLabelsSchema>;

interface ProductDetail {
  _id?: string;
  id?: string;
  title: Record<string, string> | string;
  MOQ?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function EnquiryBuilder({ labels }: EnquiryBuilderProps) {
  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    const result = EnquiryBuilderPropsSchema.safeParse({ labels });
    if (!result.success) {
      console.warn("[EnquiryBuilder] Prop validation warning:", result.error.flatten());
    }
  }

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { language } = useLanguage();
  const router = useRouter();

  const itemCount = useSyncExternalStore(
    (callback) => {
      window.addEventListener("enquiryUpdated", callback);
      return () => window.removeEventListener("enquiryUpdated", callback);
    },
    () => getEnquiryItems().length,
    () => 0
  );

  useEffect(() => {
    const handleAddToEnquiry = (event: Event) => {
      const customEvent = event as CustomEvent<ProductDetail>;
      const product = customEvent.detail;

      // Handle localized title safely with better type guards
      let productTitle = "Unknown Product";
      if (typeof product.title === "string") {
        productTitle = product.title;
      } else if (product.title && typeof product.title === "object") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        productTitle = getLocalized(product.title as any, language);
      }

      addEnquiryItem({
        productId: product._id || product.id || `unknown-${Date.now()}`,
        productTitle: productTitle,
        MOQ: product.MOQ || "",
      });

      window.dispatchEvent(new Event("enquiryUpdated"));
      trackEvent("add_to_enquiry", { product: productTitle, location: "builder" });

      showToast(`${productTitle} added to enquiry!`, "success");
    };

    const handleOpenPanel = () => {
      setIsPanelOpen(true);
      trackEvent("enquiry_panel_opened", { source: "floating_bar" });
    };

    window.addEventListener("addToEnquiry", handleAddToEnquiry);
    window.addEventListener("openEnquiryPanel", handleOpenPanel);

    return () => {
      window.removeEventListener("addToEnquiry", handleAddToEnquiry);
      window.removeEventListener("openEnquiryPanel", handleOpenPanel);
    };
  }, [language]);

  const handleExportPDF = async () => {
    const items = getEnquiryItems();
    try {
      const response = await fetch("/api/enquiry/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `enquiry-${new Date().toISOString().split("T")[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        trackEvent("enquiry_pdf_exported");
      } else {
        alert(labels?.pdfError ?? "Failed to generate PDF. Please try again.");
      }
    } catch {
      alert(labels?.pdfError ?? "An error occurred. Please try again.");
    }
  };

  const handleSubmit = () => {
    const items = getEnquiryItems();
    if (items.length === 0) {
      alert(labels?.emptyEnquiryError ?? "Your enquiry list is empty.");
      return;
    }

    sessionStorage.setItem("pendingEnquiryPopulation", JSON.stringify(items));
    setIsPanelOpen(false);

    // Secure navigation using Next.js router
    router.push("/contact?type=trade");
  };

  if (itemCount === 0 && !isPanelOpen) return null;

  return (
    <>
      <AnimatePresence>
        {itemCount > 0 || isPanelOpen ? (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsPanelOpen(true);
              trackEvent("enquiry_panel_opened");
            }}
            className="fixed bottom-24 right-6 md:bottom-28 md:right-8 z-40 bg-gold hover:bg-gold-dark text-white rounded-full px-6 py-4 shadow-[0_25px_60px_rgba(0,0,0,0.35)] flex items-center gap-3 focus:outline-2 focus:outline-white focus:outline-offset-2"
            aria-label={labels?.openBuilderAria ?? "Open Enquiry Builder"}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <span className="hidden sm:inline font-semibold tracking-wide">
              {labels?.builder?.buttonLabel ?? "Enquiry List"}
            </span>
            {itemCount > 0 ? (
              <span className="bg-white/90 text-gold-dark rounded-full px-3 py-1 text-xs font-bold">
                {itemCount}
              </span>
            ) : null}
          </motion.button>
        ) : null}
      </AnimatePresence>

      <EnquiryPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onExportPDF={handleExportPDF}
        onSubmit={handleSubmit}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        labels={labels?.panel as any}
      />
    </>
  );
}
