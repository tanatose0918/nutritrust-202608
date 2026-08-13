export interface IBucketItem {
  _id: string;
  name: string;
  brand_name?: string;
  category?: string;
  price_thb?: number;
  image_url?: string;
  form?: string;
  active_ingredients?: Array<{
    name: string;
    amount_per_serving?: string;
  }>;
}

export const BUCKET_KEY = 'ntt_supplement_bucket';
export const BUCKET_UPDATED_EVENT = 'nutritrust_bucket_updated';

/**
 * Read current bucket items from local storage
 */
export function getBucketItems(): IBucketItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BUCKET_KEY) || sessionStorage.getItem(BUCKET_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading bucket items:', err);
    return [];
  }
}

/**
 * Add a product to the bucket
 */
export function addToBucket(product: IBucketItem): void {
  if (typeof window === 'undefined' || !product?._id) return;
  try {
    const items = getBucketItems();
    if (!items.some((item) => item._id === product._id)) {
      const updated = [...items, product];
      const payload = JSON.stringify(updated);
      localStorage.setItem(BUCKET_KEY, payload);
      sessionStorage.setItem(BUCKET_KEY, payload);
      window.dispatchEvent(new CustomEvent(BUCKET_UPDATED_EVENT, { detail: updated }));
    }
  } catch (err) {
    console.error('Error adding product to bucket:', err);
  }
}

/**
 * Remove a product from the bucket by ID
 */
export function removeFromBucket(productId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const items = getBucketItems();
    const updated = items.filter((item) => item._id !== productId);
    const payload = JSON.stringify(updated);
    localStorage.setItem(BUCKET_KEY, payload);
    sessionStorage.setItem(BUCKET_KEY, payload);
    window.dispatchEvent(new CustomEvent(BUCKET_UPDATED_EVENT, { detail: updated }));
  } catch (err) {
    console.error('Error removing product from bucket:', err);
  }
}

/**
 * Clear all items in bucket
 */
export function clearBucket(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(BUCKET_KEY);
    sessionStorage.removeItem(BUCKET_KEY);
    window.dispatchEvent(new CustomEvent(BUCKET_UPDATED_EVENT, { detail: [] }));
  } catch (err) {
    console.error('Error clearing bucket:', err);
  }
}

/**
 * Check if a product is currently in the bucket
 */
export function isInBucket(productId: string): boolean {
  if (typeof window === 'undefined' || !productId) return false;
  const items = getBucketItems();
  return items.some((item) => item._id === productId);
}

// Aliases for stack backward compatibility
export type IStackItem = IBucketItem;
export const getStackItems = getBucketItems;
export const addToStack = addToBucket;
export const removeFromStack = removeFromBucket;
export const clearStack = clearBucket;
export const isInStack = isInBucket;
export const STACK_UPDATED_EVENT = BUCKET_UPDATED_EVENT;

