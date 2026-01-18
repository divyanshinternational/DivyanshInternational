"use client";

import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useCallback, useSyncExternalStore } from "react";
import { getEnquiryItems } from "@/lib/utils/enquiry";

// Cached empty array for server snapshot to prevent infinite loops
const EMPTY_ITEMS: ReturnType<typeof getEnquiryItems> = [];

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const FloatingEnquiryLabelsSchema = z.object({
  item: z.string().optional(),
  items: z.string().optional(),
  inYourEnquiry: z.string().optional(),
  readyToSubmit: z.string().optional(),
  viewEnquiry: z.string().optional(),
  submitEnquiry: z.string().optional(),
});

const FloatingEnquiryBarPropsSchema = z.object({
  labels: FloatingEnquiryLabelsSchema.optional(),
  whatsappNumber: z.string().optional(), // Now accepted as a prop
});

// =============================================================================
// TYPES
// =============================================================================

export type FloatingEnquiryLabels = z.infer<typeof FloatingEnquiryLabelsSchema>;
export type FloatingEnquiryBarProps = z.infer<typeof FloatingEnquiryBarPropsSchema>;

// =============================================================================
// COMPONENT
// =============================================================================

export default function FloatingEnquiryBar({
  labels,
  whatsappNumber = "919878122400", // Fallback to provided default if prop missing, but ideally passed from parent
}: FloatingEnquiryBarProps) {
  // Validate props in dev
  if (process.env.NODE_ENV === "development") {
    const result = FloatingEnquiryBarPropsSchema.safeParse({ labels, whatsappNumber });
    if (!result.success) {
      console.warn("[FloatingEnquiryBar] Prop validation warning:", result.error.flatten());
    }
  }

  // Optimized store subscription using new React 18 hook
  const items = useSyncExternalStore(
    useCallback((callback) => {
      window.addEventListener("enquiryUpdated", callback);
      return () => window.removeEventListener("enquiryUpdated", callback);
    }, []),
    getEnquiryItems,
    () => EMPTY_ITEMS
  );

  const itemCount = items.length;
  const isVisible = itemCount > 0;

  const handleSubmit = () => {
    if (items.length === 0) return;

    // Format for WhatsApp
    // Clean number just in case
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

    let message = "Hi! I would like to enquire about the following products:\n\n";

    items.forEach((item, index) => {
      // Use localized title if available or fallback string
      // Assuming item.productTitle is the string needed here
      const title = typeof item.productTitle === "string" ? item.productTitle : "Unknown Product";

      message += `${index + 1}. ${title}`;
      if (item.MOQ) {
        message += ` (MOQ: ${item.MOQ})`;
      }

      // Add quantity/notes if they exist and are useful context (optional improvement)
      if (item.quantity) message += ` - Qty: ${item.quantity}`;
      if (item.packFormat) message += ` (${item.packFormat})`;

      message += "\n";
    });

    message += "\nPlease provide pricing and availability details. Thank you!";

    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleOpenPanel = () => {
    const event = new CustomEvent("openEnquiryPanel");
    window.dispatchEvent(event);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-1001 bg-deep-brown text-white shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-gold/20"
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Status Section */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full">
                <div className="relative">
                  <svg
                    className="w-5 h-5 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>

                <span className="font-semibold text-lg">
                  {itemCount} {itemCount === 1 ? labels?.item || "Item" : labels?.items || "Items"}
                  <span className="text-white/60 text-sm font-normal ml-1 hidden xs:inline">
                    {labels?.inYourEnquiry || "in your enquiry"}
                  </span>
                </span>
              </div>
              <p className="text-sm text-gold-light/90 hidden md:block italic">
                {labels?.readyToSubmit || "Ready to request a quote?"}
              </p>
            </div>

            {/* Actions Section */}
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleOpenPanel}
                className="flex-1 sm:flex-none px-6 py-2.5 border border-white/20 hover:bg-white/10 text-white rounded-lg font-medium transition-all hover:scale-105 active:scale-95 focus:outline-2 focus:outline-white focus:outline-offset-2"
              >
                {labels?.viewEnquiry || "View List"}
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-linear-to-r from-gold to-gold-dark hover:brightness-110 text-white rounded-lg font-bold shadow-lg shadow-gold/20 transition-all hover:scale-105 active:scale-95 focus:outline-2 focus:outline-white focus:outline-offset-2 flex items-center justify-center gap-2"
              >
                <span>{labels?.submitEnquiry || "Request Quote"}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
