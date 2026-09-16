export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  price: number; // cents, display only — server recalculates at checkout
  image: string | null;
  quantity: number;
  stock: number;
}

export const CART_STORAGE_KEY = "axiom-cart-v1";

export function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function writeCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}
