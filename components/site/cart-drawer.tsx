"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { calculateShipping } from "@/lib/orders";
import { useCart } from "@/components/site/cart-provider";
import { CartItemRow } from "@/components/site/cart-item-row";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

export function CartDrawer() {
  const { items, subtotal, isOpen, closeCart } = useCart();
  const shipping = calculateShipping(subtotal);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader>
          <SheetTitle>Your Cart ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-8 w-8 text-graphite-light" />
            <p className="text-[14px] text-graphite">Your cart is empty.</p>
            <Button variant="outline" size="sm" onClick={closeCart} asChild>
              <Link href="/shop">Browse the Catalog</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {items.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>

            <SheetFooter className="space-y-4">
              <div className="space-y-1.5 text-[13px]">
                <div className="flex justify-between text-graphite">
                  <span>Subtotal</span>
                  <span className="text-ink">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-graphite">
                  <span>Shipping</span>
                  <span className="text-ink">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
              </div>
              <Button asChild size="lg" className="w-full" onClick={closeCart}>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button
                asChild
                variant="link"
                className="w-full justify-center"
                onClick={closeCart}
              >
                <Link href="/cart">View Full Cart</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
