"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { calculateShipping } from "@/lib/orders";
import { useCart } from "@/components/site/cart-provider";
import { CartItemRow } from "@/components/site/cart-item-row";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartPage() {
  const { items, subtotal, isHydrated } = useCart();
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  if (!isHydrated) {
    return (
      <div className="container-edit py-14">
        <Skeleton className="h-10 w-48" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <Skeleton className="h-96" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-edit flex flex-col items-center gap-5 py-28 text-center">
        <ShoppingBag className="h-9 w-9 text-graphite-light" />
        <h1 className="font-display text-2xl tracking-tight text-ink">
          Your cart is empty
        </h1>
        <p className="max-w-sm text-[14px] text-graphite">
          Browse our catalog of documented reference compounds to get
          started.
        </p>
        <Button asChild size="lg">
          <Link href="/shop">
            Shop the Catalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-edit py-12 lg:py-16">
      <h1 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
        Your Cart
      </h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <CartItemRow key={item.productId} item={item} />
          ))}
        </div>

        <div className="h-fit space-y-6 border border-line-strong p-6">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-ink">
            Order Summary
          </h2>
          <div className="space-y-3 text-[13px]">
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
            <div className="flex justify-between border-t border-line pt-3 text-[14px] font-semibold text-ink">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Button asChild size="lg" className="w-full">
            <Link href="/checkout">
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="text-center text-[11px] text-graphite-light">
            Shipping is free on orders over $200.
          </p>
        </div>
      </div>
    </div>
  );
}
