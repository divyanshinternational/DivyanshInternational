"use client";

/**
 * Toast Component
 *
 * Client-side notification system using Custom Events.
 * Refactored for modularity, accessibility, and type safety.
 */

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { z } from "zod";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const ToastTypeSchema = z.enum(["success", "error", "info"]);

const ToastPayloadSchema = z.object({
  message: z.string().min(1, "Message is required"),
  type: ToastTypeSchema.default("success"),
  duration: z.number().int().positive().optional().default(3000),
});

// =============================================================================
// TYPES
// =============================================================================

export type ToastType = z.infer<typeof ToastTypeSchema>;
export type ToastPayload = z.infer<typeof ToastPayloadSchema>;
export type ToastItem = ToastPayload & { id: string };

// =============================================================================
// ICONS
// =============================================================================

function SuccessIcon() {
  return (
    <svg
      className="w-6 h-6 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      className="w-6 h-6 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      className="w-6 h-6 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handleShowToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastPayload>;

      // Validate payload at runtime
      const result = ToastPayloadSchema.safeParse(customEvent.detail);

      if (!result.success) {
        console.error("[Toast] Invalid toast payload:", result.error.flatten());
        return;
      }

      const payload = result.data;
      const newToast: ToastItem = {
        ...payload,
        id: crypto.randomUUID(),
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss
      setTimeout(() => {
        removeToast(newToast.id);
      }, payload.duration);
    };

    window.addEventListener("showToast", handleShowToast);
    return () => window.removeEventListener("showToast", handleShowToast);
  }, [removeToast]);

  return (
    <div
      className="fixed top-20 right-4 z-50 space-y-2 pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
              "pointer-events-auto px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] border border-white/10 backdrop-blur-xs",
              {
                "bg-green-600 text-white shadow-green-900/20": toast.type === "success",
                "bg-red-600 text-white shadow-red-900/20": toast.type === "error",
                "bg-blue-600 text-white shadow-blue-900/20": toast.type === "info",
              }
            )}
            role="alert"
          >
            {toast.type === "success" ? <SuccessIcon /> : null}
            {toast.type === "error" ? <ErrorIcon /> : null}
            {toast.type === "info" ? <InfoIcon /> : null}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// UTILITY FUNCTION
// =============================================================================

export function showToast(message: string, type: ToastType = "success", duration = 3000) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("showToast", {
        detail: { message, type, duration },
      })
    );
  }
}
