import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/lib/cart";

export function OrderSummary({
  items,
  subtotal,
  shipping,
  total,
}: {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}) {
  return (
    <div className="border border-line-strong p-6">
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-ink">
        Order Summary
      </h2>

      <div className="mt-5 max-h-80 space-y-4 overflow-y-auto">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-3">
            <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-paper-dim">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              )}
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-paper">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-medium leading-snug text-ink">
                {item.name}
              </p>
              <p className="font-mono text-[11px] uppercase text-graphite-light">
                {item.sku}
              </p>
            </div>
            <p className="text-[13px] font-medium text-ink">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-line pt-5 text-[13px]">
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
        <div className="flex justify-between border-t border-line pt-3 text-[15px] font-semibold text-ink">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
