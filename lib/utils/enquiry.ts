import { z } from "zod";

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

export const EnquiryItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productTitle: z.string(),
  grade: z.string().optional(),
  packFormat: z.string().optional(),
  quantity: z.string().optional(),
  MOQ: z.string().optional(),
  notes: z.string().optional(),
});

export const EnquiryListSchema = z.array(EnquiryItemSchema);

// =============================================================================
// TYPES
// =============================================================================

export type EnquiryItem = z.infer<typeof EnquiryItemSchema>;

// =============================================================================
// CONSTANTS
// =============================================================================

const STORAGE_KEY = "divyansh_enquiry";

// =============================================================================
// SNAPSHOT CACHING (Required for useSyncExternalStore)
// =============================================================================

// Cached snapshot to ensure referential stability
let cachedItems: EnquiryItem[] = [];
let cachedStorageValue: string | null = null;

// Empty array singleton for SSR and empty states
const EMPTY_ITEMS: EnquiryItem[] = [];

/**
 * Internal function to read and parse localStorage
 */
function readFromStorage(): EnquiryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return EMPTY_ITEMS;

    const parsed = JSON.parse(stored);
    const result = EnquiryListSchema.safeParse(parsed);

    if (!result.success) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Enquiry] Invalid storage data:", result.error.flatten());
      }
      return EMPTY_ITEMS;
    }

    return result.data;
  } catch (error) {
    console.error("[Enquiry] Failed to retrieve items:", error);
    return EMPTY_ITEMS;
  }
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Retrieves the enquiry list from local storage with schema validation.
 * Returns a cached reference to ensure useSyncExternalStore stability.
 */
export function getEnquiryItems(): EnquiryItem[] {
  if (typeof window === "undefined") return EMPTY_ITEMS;

  // Check if storage has changed
  const currentStorageValue = localStorage.getItem(STORAGE_KEY);

  // Return cached snapshot if storage hasn't changed
  if (currentStorageValue === cachedStorageValue) {
    return cachedItems;
  }

  // Update cache with new data
  cachedStorageValue = currentStorageValue;
  cachedItems = readFromStorage();

  return cachedItems;
}

/**
 * Saves the enquiry list to local storage.
 */
export function saveEnquiryItems(items: EnquiryItem[]): void {
  if (typeof window === "undefined") return;

  try {
    // Validate before saving to ensure integrity
    const result = EnquiryListSchema.safeParse(items);
    if (result.success) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
    } else {
      console.error("[Enquiry] Attempted to save invalid items:", result.error);
    }
  } catch (error) {
    console.error("[Enquiry] Failed to save items:", error);
  }
}

/**
 * Adds a new item to the enquiry list.
 * Auto-generates a unique ID.
 */
export function addEnquiryItem(item: Omit<EnquiryItem, "id">): EnquiryItem[] {
  const items = getEnquiryItems();
  const newItem: EnquiryItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
  };

  // Prevent duplicate logical items if needed (optional optimization)
  // For now, we allow multiple same products with potentially different configs

  const updated = [...items, newItem];
  saveEnquiryItems(updated);
  return updated;
}

/**
 * Updates an existing item in the enquiry list.
 */
export function updateEnquiryItem(id: string, updates: Partial<EnquiryItem>): EnquiryItem[] {
  const items = getEnquiryItems();
  const updated = items.map((item) => (item.id === id ? { ...item, ...updates } : item));
  saveEnquiryItems(updated);
  return updated;
}

/**
 * Removes an item from the enquiry list.
 */
export function removeEnquiryItem(id: string): EnquiryItem[] {
  const items = getEnquiryItems();
  const updated = items.filter((item) => item.id !== id);
  saveEnquiryItems(updated);
  return updated;
}

/**
 * Clears all items from the enquiry list.
 */
export function clearEnquiryItems(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("[Enquiry] Failed to clear items:", error);
  }
}
