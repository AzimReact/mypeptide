"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/site/cart-provider";
import { CheckoutForm } from "@/components/site/checkout-form";
import { OrderSummary } from "@/components/site/order-summary";
import { ResearchUseNotice } from "@/components/site/research-use-notice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateShipping } from "@/lib/orders";

export default function CheckoutPage() {
  const { items, subtotal, isHydrated } = useCart();
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  if (!isHydrated) {
    return (
      <div className="container-edit py-14">
        <Skeleton className="h-10 w-48" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
          <Skeleton className="h-96" />
          <Skeleton className="h-72" />
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
          Add products to your cart before proceeding to checkout.
        </p>
        <Button asChild size="lg">
          <Link href="/shop">Shop the Catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-edit py-12 lg:py-16">
      <h1 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
        Checkout
      </h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
        <div>
          <CheckoutForm />
        </div>
        <div className="space-y-6">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
          />
          <ResearchUseNotice compact />
        </div>
      </div>
    </div>
  );
}
