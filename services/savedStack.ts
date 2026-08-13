/**
 * savedStack.ts — Saved Supplement Stacks Service
 * --------------------------------------------------
 * LocalStorage-based persistence (no login required for MVP).
 * Uses short product IDs (p_001) to minimize payload size — consistent
 * with the SIR 7+1 Slot Compression model for MCP efficiency.
 *
 * Storage Key: ntt_saved_stacks
 * Format: ISavedStack[]
 */

export interface ISavedStack {
  id: string;             // uuid-like: timestamp + random suffix
  name: string;           // User-defined label e.g. "Stack เช้า"
  created_at: string;     // ISO date string
  product_ids: string[];  // Short IDs e.g. ["p_001", "p_003"] — SIR-compressed
  product_names: string[];// Cached display names to avoid re-lookup
  safety_score?: number;  // Last MCP safety score (optional cache)
  note?: string;          // Optional user note
}

export const SAVED_STACKS_KEY = 'ntt_saved_stacks';
export const SAVED_STACKS_UPDATED_EVENT = 'nutritrust_saved_stacks_updated';

/** Generate a short unique ID */
function genId(): string {
  return `stk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

/** Read all saved stacks from LocalStorage */
export function getSavedStacks(): ISavedStack[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_STACKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Save the current stack to LocalStorage */
export function saveStack(
  name: string,
  productIds: string[],
  productNames: string[],
  safetyScore?: number,
  note?: string
): ISavedStack {
  if (typeof window === 'undefined') throw new Error('Browser only');
  const stacks = getSavedStacks();
  const newStack: ISavedStack = {
    id: genId(),
    name: name.trim() || `Stack ${new Date().toLocaleDateString('th-TH')}`,
    created_at: new Date().toISOString(),
    product_ids: productIds,
    product_names: productNames,
    safety_score: safetyScore,
    note
  };
  const updated = [newStack, ...stacks];
  const payload = JSON.stringify(updated);
  localStorage.setItem(SAVED_STACKS_KEY, payload);
  window.dispatchEvent(new CustomEvent(SAVED_STACKS_UPDATED_EVENT, { detail: updated }));
  return newStack;
}

/** Delete a saved stack by its ID */
export function deleteSavedStack(stackId: string): void {
  if (typeof window === 'undefined') return;
  const updated = getSavedStacks().filter((s) => s.id !== stackId);
  const payload = JSON.stringify(updated);
  localStorage.setItem(SAVED_STACKS_KEY, payload);
  window.dispatchEvent(new CustomEvent(SAVED_STACKS_UPDATED_EVENT, { detail: updated }));
}

/** Get a single saved stack by ID */
export function getSavedStackById(stackId: string): ISavedStack | null {
  return getSavedStacks().find((s) => s.id === stackId) ?? null;
}
