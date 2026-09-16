import { formatDate, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/orders";
import { ORDER_BADGE_VARIANT } from "@/lib/order-badge-variant";

interface OrderDetailsCardProps {
  order: {
    orderNumber: string;
    status: string;
    total: number;
    subtotal: number;
    shipping: number;
    createdAt: Date | string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    trackingNumber: string | null;
    items: {
      id: string;
      productName: string;
      productSku: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
    }[];
    payment: { status: string } | null;
  };
}


const PAYMENT_BADGE_VARIANT: Record<PaymentStatus, "neutral" | "success" | "warn" | "danger"> = {
  pending: "warn",
  confirming: "warn",
  paid: "success",
  failed: "danger",
  expired: "danger",
};

export function OrderDetailsCard({ order }: OrderDetailsCardProps) {
  const orderStatus = order.status as OrderStatus;
  const paymentStatus = (order.payment?.status ?? "pending") as PaymentStatus;

  return (
    <div className="border border-line-strong">
      <div className="flex flex-col gap-4 border-b border-line p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-graphite">
            Order Number
          </p>
          <p className="mt-1 font-mono text-[15px] font-semibold text-ink">
            {order.orderNumber}
          </p>
          <p className="mt-1 text-[12px] text-graphite-light">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={ORDER_BADGE_VARIANT[orderStatus]} dot>
            {ORDER_STATUS_LABELS[orderStatus]}
          </Badge>
          <Badge variant={PAYMENT_BADGE_VARIANT[paymentStatus]} dot>
            {PAYMENT_STATUS_LABELS[paymentStatus]}
          </Badge>
        </div>
      </div>

      <div className="divide-y divide-line">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 px-6 py-4">
            <div>
              <p className="text-[13px] font-medium text-ink">{item.productName}</p>
              <p className="font-mono text-[11px] uppercase text-graphite-light">
                {item.productSku} · Qty {item.quantity}
              </p>
            </div>
            <p className="text-[13px] font-medium text-ink">
              {formatPrice(item.lineTotal)}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-line px-6 py-5 text-[13px]">
        <div className="flex justify-between text-graphite">
          <span>Subtotal</span>
          <span className="text-ink">{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-graphite">
          <span>Shipping</span>
          <span className="text-ink">
            {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
          </span>
        </div>
        <div className="flex justify-between border-t border-line pt-2 text-[14px] font-semibold text-ink">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="border-t border-line px-6 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-graphite">
          Shipping To
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink">
          {order.firstName} {order.lastName}
          <br />
          {order.address}
          <br />
          {order.city}, {order.state} {order.zip}
          <br />
          {order.country}
        </p>
        {order.trackingNumber && (
          <div className="mt-4 border-t border-line pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-graphite">
              Tracking Number
            </p>
            <p className="mt-1 font-mono text-[13px] text-ink">
              {order.trackingNumber}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
