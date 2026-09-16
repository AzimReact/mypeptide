"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  type CartItem,
  readCartFromStorage,
  writeCartToStorage,
} from "@/lib/cart";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  isHydrated: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    // Deliberately deferred to after mount: the server always renders an
    // empty cart, and syncing from localStorage during render would cause
    // a hydration mismatch between server and client output.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readCartFromStorage());
    setIsHydrated(true);
  }, []);

  React.useEffect(() => {
    if (isHydrated) writeCartToStorage(items);
  }, [items, isHydrated]);

  const addItem = React.useCallback<CartContextValue["addItem"]>(
    (item, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((i) => i.productId === item.productId);
        if (existing) {
          const nextQuantity = Math.min(
            existing.quantity + quantity,
            item.stock || 99
          );
          return current.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: nextQuantity }
              : i
          );
        }
        return [...current, { ...item, quantity }];
      });
      toast.success(`Added ${item.name} to cart`);
      setIsOpen(true);
    },
    []
  );

  const removeItem = React.useCallback((productId: string) => {
    setItems((current) => current.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = React.useCallback(
    (productId: string, quantity: number) => {
      setItems((current) =>
        current
          .map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock || 99)) }
              : i
          )
          .filter((i) => i.quantity > 0)
      );
    },
    []
  );

  const clearCart = React.useCallback(() => setItems([]), []);

  const subtotal = React.useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const itemCount = React.useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    itemCount,
    subtotal,
    isOpen,
    isHydrated,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
