export const ORDER_STATUSES = [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "pending",
  "confirming",
  "paid",
  "failed",
  "expired",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Pending Payment",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Awaiting Payment",
  confirming: "Confirming",
  paid: "Paid",
  failed: "Failed",
  expired: "Expired",
};

const SHIPPING_FLAT_RATE = 1500; // $15.00 flat rate, in cents
const FREE_SHIPPING_THRESHOLD = 20000; // $200.00, in cents

export function calculateShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AXR-${timestamp}-${random}`;
}
