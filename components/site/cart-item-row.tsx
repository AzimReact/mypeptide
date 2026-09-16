"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/lib/cart";
import { useCart } from "@/components/site/cart-provider";
import { QuantitySelector } from "@/components/site/quantity-selector";

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-5">
      <Link
        href={`/product/${item.slug}`}
        className="relative h-24 w-20 shrink-0 overflow-hidden bg-paper-dim"
      >
        {item.image && (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/product/${item.slug}`}
              className="text-[13px] font-medium leading-snug text-ink hover:text-accent-dark"
            >
              {item.name}
            </Link>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-graphite-light">
              {item.sku}
            </p>
          </div>
          <button
            onClick={() => removeItem(item.productId)}
            className="text-graphite transition-colors hover:text-danger"
            aria-label={`Remove ${item.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-end justify-between">
          <QuantitySelector
            value={item.quantity}
            max={item.stock || 99}
            onChange={(q) => updateQuantity(item.productId, q)}
            size="sm"
          />
          <p className="text-[13px] font-semibold text-ink">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
