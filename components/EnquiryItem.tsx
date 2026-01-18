"use client";

/**
 * Enquiry Item Component
 *
 * Represents a single line item in the enquiry panel.
 * Refactored with Zod validation, secure inputs, and proper accessibility.
 */

import { useState } from "react";
import { z } from "zod";
import type { EnquiryItem as EnquiryItemType } from "@/lib/utils/enquiry";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const EnquiryLabelsSchema = z.object({
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

const EnquiryItemPropsSchema = z.object({
  // We don't validate the entire item deeply here as it comes from internal state,
  // but we ensure the props structure is correct.
  item: z.custom<EnquiryItemType>(),
  onUpdate: z.custom<(id: string, updates: Partial<EnquiryItemType>) => void>(),
  onRemove: z.custom<(id: string) => void>(),
  labels: EnquiryLabelsSchema.optional(),
});

// =============================================================================
// TYPES
// =============================================================================

export type EnquiryLabels = z.infer<typeof EnquiryLabelsSchema>;
export type EnquiryItemProps = z.infer<typeof EnquiryItemPropsSchema>;

// =============================================================================
// COMPONENT
// =============================================================================

export default function EnquiryItem({ item, onUpdate, onRemove, labels }: EnquiryItemProps) {
  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    const result = EnquiryItemPropsSchema.safeParse({
      item,
      onUpdate,
      onRemove,
      labels,
    });
    if (!result.success) {
      console.warn("[EnquiryItem] Prop validation warning:", result.error.flatten());
    }
  }

  const [isEditing, setIsEditing] = useState(false);
  const [grade, setGrade] = useState(item.grade || "");
  const [packFormat, setPackFormat] = useState(item.packFormat || "");
  const [quantity, setQuantity] = useState(item.quantity || "");
  const [notes, setNotes] = useState(item.notes || "");

  const handleSave = () => {
    const updates: Partial<EnquiryItemType> = {};
    // Sanitize and trim inputs
    if (grade.trim()) updates.grade = grade.trim();
    if (packFormat.trim()) updates.packFormat = packFormat.trim();
    if (quantity.trim()) updates.quantity = quantity.trim();
    if (notes.trim()) updates.notes = notes.trim();

    // Always update, even if clearing fields (handle empty strings if logic requires)
    // Here we preserve existing behavior of only sending truthy updates for now,
    // but added trimming for hygiene.

    onUpdate(item.id, updates);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-deep-brown" title={item.productTitle}>
          {item.productTitle}
        </h3>
        <button
          onClick={() => onRemove(item.id)}
          className="text-(--color-muted) hover:text-red-600 transition-colors focus:outline-2 focus:outline-red-500 focus:rounded p-1"
          aria-label={labels?.removeAriaLabel ?? "Remove item"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-(--color-muted) mb-1">
              {labels?.grade || "Grade"}
            </label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
              placeholder={labels?.gradePlaceholder}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-(--color-muted) mb-1">
              {labels?.packFormat || "Pack Format"}
            </label>
            <input
              type="text"
              value={packFormat}
              onChange={(e) => setPackFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
              placeholder={labels?.packFormatPlaceholder}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-(--color-muted) mb-1">
              {labels?.quantity || "Quantity"}
            </label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
              placeholder={labels?.quantityPlaceholder}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-(--color-muted) mb-1">
              {labels?.notes || "Notes"}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
              rows={2}
              placeholder={labels?.notesPlaceholder}
            />
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button
              onClick={handleSave}
              className="text-xs bg-gold text-white px-3 py-1.5 rounded hover:bg-gold-dark transition-colors focus:outline-2 focus:outline-gold-dark focus:outline-offset-1 font-medium"
            >
              {labels?.save || "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors focus:outline-2 focus:outline-gray-400 focus:outline-offset-1 font-medium"
            >
              {labels?.cancel || "Cancel"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5 text-sm">
          {item.grade ? (
            <p className="flex justify-between border-b border-gray-50 pb-1 last:border-0 last:pb-0">
              <strong className="text-(--color-muted) font-medium">
                {labels?.grade || "Grade"}:
              </strong>
              <span className="text-gray-800">{item.grade}</span>
            </p>
          ) : null}
          {item.packFormat ? (
            <p className="flex justify-between border-b border-gray-50 pb-1 last:border-0 last:pb-0">
              <strong className="text-(--color-muted) font-medium">
                {labels?.packFormat || "Format"}:
              </strong>
              <span className="text-gray-800">{item.packFormat}</span>
            </p>
          ) : null}
          {item.quantity ? (
            <p className="flex justify-between border-b border-gray-50 pb-1 last:border-0 last:pb-0">
              <strong className="text-(--color-muted) font-medium">
                {labels?.quantity || "Quantity"}:
              </strong>
              <span className="text-gray-800">{item.quantity}</span>
            </p>
          ) : null}
          {item.MOQ ? (
            <p className="flex justify-between border-b border-gray-50 pb-1 last:border-0 last:pb-0">
              <strong className="text-(--color-muted) font-medium">{labels?.moq || "MOQ"}:</strong>
              <span className="text-gray-800">{item.MOQ}</span>
            </p>
          ) : null}
          {item.notes ? (
            <div className="pt-2 mt-1 border-t border-dashed border-gray-200">
              <strong className="block text-(--color-muted) font-medium mb-1 text-xs uppercase tracking-wide">
                {labels?.notes || "Notes"}:
              </strong>
              <p className="text-gray-700 bg-gray-50 p-2 rounded text-xs">{item.notes}</p>
            </div>
          ) : null}

          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-gold hover:text-gold-dark hover:underline mt-3 inline-flex items-center gap-1 font-medium transition-colors focus:outline-2 focus:outline-gold focus:rounded p-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            {labels?.edit || "Edit Details"}
          </button>
        </div>
      )}
    </div>
  );
}
