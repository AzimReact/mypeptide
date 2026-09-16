"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { ORDER_STATUSES } from "@/lib/orders";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
}

export async function updateOrderAction(
  id: string,
  input: { status: string; trackingNumber: string; notes: string }
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();

  if (!ORDER_STATUSES.includes(input.status as (typeof ORDER_STATUSES)[number])) {
    return { ok: false, error: "Invalid order status." };
  }

  await prisma.order.update({
    where: { id },
    data: {
      status: input.status,
      trackingNumber: input.trackingNumber.trim() || null,
      notes: input.notes.trim() || null,
    },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { ok: true };
}
