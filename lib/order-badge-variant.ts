import type { OrderStatus } from "@/lib/orders";

export const ORDER_BADGE_VARIANT: Record<
  OrderStatus,
  "neutral" | "success" | "warn" | "danger" | "accent"
> = {
  pending_payment: "warn",
  paid: "success",
  processing: "accent",
  shipped: "accent",
  delivered: "success",
  cancelled: "danger",
};
