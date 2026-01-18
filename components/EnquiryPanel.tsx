"use client";

/**
 * Enquiry Panel Component
 *
 * Side drawer for managing enquiry items.
 * Refactored to use useSyncExternalStore for rigid state synchronization.
 * Validated with Zod for prop safety.
 */

import { useEffect, useCallback, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import {
  getEnquiryItems,
  removeEnquiryItem,
  updateEnquiryItem,
  clearEnquiryItems,
  type EnquiryItem,
} from "@/lib/utils/enquiry";

// Cached empty array for server snapshot to prevent infinite loops
const EMPTY_ITEMS: ReturnType<typeof getEnquiryItems> = [];

import EnquiryItemComponent from "@/components/EnquiryItem";
import { trackEvent } from "@/components/analytics/GA4";

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
  gradePlaceholder: z.string().optional(),
  packFormatPlaceholder: z.string().optional(),
  quantityPlaceholder: z.string().optional(),
  notesPlaceholder: z.string().optional(),
  removeAriaLabel: z.string().optional(),
});

const EnquiryPanelLabelsSchema = z.object({
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

const EnquiryPanelPropsSchema = z.object({
  isOpen: z.boolean(),
  onClose: z.function(),
  onExportPDF: z.function(),
  onSubmit: z.function(),
  labels: EnquiryPanelLabelsSchema.optional(),
});

// =============================================================================
// TYPES
// =============================================================================

export type EnquiryPanelLabels = z.infer<typeof EnquiryPanelLabelsSchema>;
export type EnquiryPanelProps = z.infer<typeof EnquiryPanelPropsSchema>;

// =============================================================================
// COMPONENT
// =============================================================================

export default function EnquiryPanel({
  isOpen,
  onClose,
  onExportPDF,
  onSubmit,
  labels,
}: EnquiryPanelProps) {
  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    const result = EnquiryPanelPropsSchema.safeParse({
      isOpen,
      onClose,
      onExportPDF,
      onSubmit,
      labels,
    });
    if (!result.success) {
      console.warn("[EnquiryPanel] Prop validation warning:", result.error.flatten());
    }
  }

  // Use useSyncExternalStore for reliable external state synchronization
  // This replaces the useEffect + useState pattern and avoids "setState during render" issues
  const items = useSyncExternalStore(
    useCallback((callback) => {
      window.addEventListener("enquiryUpdated", callback);
      return () => window.removeEventListener("enquiryUpdated", callback);
    }, []),
    getEnquiryItems,
    // Server snapshot (cached to prevent infinite loops)
    () => EMPTY_ITEMS
  );

  const handleItemUpdate = (id: string, updates: Partial<EnquiryItem>) => {
    updateEnquiryItem(id, updates);
    window.dispatchEvent(new Event("enquiryUpdated"));
  };

  const handleRemove = (id: string) => {
    removeEnquiryItem(id);
    window.dispatchEvent(new Event("enquiryUpdated"));
    trackEvent("enquiry_item_removed", { item_id: id });
  };

  const handleClear = () => {
    if (confirm(labels?.confirmClear || "Are you sure you want to clear all items?")) {
      clearEnquiryItems();
      window.dispatchEvent(new Event("enquiryUpdated"));
      trackEvent("enquiry_cleared");
    }
  };

  const handleExport = () => {
    trackEvent("enquiry_pdf_export", { item_count: items.length });
    onExportPDF();
  };

  const handleSubmit = () => {
    trackEvent("enquiry_submit_initiated", { item_count: items.length });
    onSubmit();
  };

  // Lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-9990"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[460px] bg-ivory z-9999 shadow-2xl overflow-y-auto border-l border-[#e9ddca]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-panel-title"
          >
            <div className="sticky top-0 bg-ivory/95 backdrop-blur border-b border-[#e5d8c3] p-5 flex justify-between items-center z-10">
              <h2
                id="enquiry-panel-title"
                className="text-xl font-semibold text-(--color-graphite)"
              >
                {labels?.title || "Your Enquiry"} ({items.length})
              </h2>
              <button
                onClick={onClose}
                className="text-(--color-muted) hover:text-(--color-graphite) focus:outline-2 focus:outline-gold focus:rounded-full p-2 transition-colors"
                aria-label={labels?.closePanelAria || "Close panel"}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-5">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-(--color-muted) mb-4 text-lg">
                    {labels?.emptyState || "Your enquiry list is empty"}
                  </p>
                  <p className="text-sm text-(--color-muted)">
                    {labels?.emptyStateSub || "Browse our products to add items."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <EnquiryItemComponent
                        key={item.id}
                        item={item}
                        // Function references are now stable, but wrapper still needed for args
                        onUpdate={handleItemUpdate}
                        onRemove={handleRemove}
                        labels={labels?.itemLabels ?? {}}
                      />
                    ))}
                  </div>

                  {/* Response Time Information */}
                  <div className="bg-linear-to-br from-ivory to-cashew-cream p-4 rounded-xl border border-sand mb-6">
                    <h4 className="text-sm font-bold text-deep-brown mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-almond-gold rounded-full animate-pulse"></span>
                      Response Times
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-almond-gold font-semibold">📧 Email:</span>
                        <span className="text-(--color-slate)">24-48 hours response</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-almond-gold font-semibold">📱 WhatsApp:</span>
                        <span className="text-(--color-slate)">12 hours response</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 sticky bottom-0 bg-ivory pt-4 pb-2 border-t border-[#e5d8c3]">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleExport}
                        className="col-span-1 bg-black text-white px-4 py-3 rounded-full font-semibold tracking-wide hover:bg-(--color-graphite) transition shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-black"
                      >
                        {labels?.exportPdf || "Export PDF"}
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="col-span-1 bg-gold hover:bg-gold-dark text-white px-4 py-3 rounded-full font-semibold tracking-wide transition shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-gold"
                      >
                        {labels?.submitEnquiry || "Submit Items"}
                      </button>
                    </div>
                    <button
                      onClick={handleClear}
                      className="w-full text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition"
                    >
                      {labels?.clearAll || "Clear all items"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
