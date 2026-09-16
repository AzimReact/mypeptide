"use server";

import { prisma } from "@/lib/db";
import { trackOrderSchema } from "@/lib/validation/checkout";

export async function lookupOrderAction(input: { orderNumber: string; email: string }) {
  const parsed = trackOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Enter a valid order number and email." };
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber: parsed.data.orderNumber.trim(),
      email: parsed.data.email.trim().toLowerCase(),
    },
    include: { items: true, payment: true },
  });

  if (!order) {
    return {
      ok: false as const,
      error: "No order found matching that order number and email.",
    };
  }

  return { ok: true as const, order };
}
