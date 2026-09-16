"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation/checkout";
import { calculateShipping, generateOrderNumber } from "@/lib/orders";
import { getPaymentProvider } from "@/lib/payments";

export interface CheckoutResult {
  ok: false;
  error: string;
}

export async function submitCheckout(
  input: CheckoutInput
): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid checkout data" };
  }
  const data = parsed.data;

  const productIds = data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  // Server is the source of truth for price, quantity, and stock. Client
  // supplied prices are never trusted here — only productId + quantity.
  let subtotal = 0;
  const orderItemsData: {
    productId: string;
    productName: string;
    productSku: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[] = [];

  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return { ok: false, error: "One of the items in your cart is no longer available." };
    }
    if (product.stock < item.quantity) {
      return {
        ok: false,
        error: `Only ${product.stock} unit(s) of "${product.name}" remain in stock.`,
      };
    }
    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;
    orderItemsData.push({
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      unitPrice: product.price,
      quantity: item.quantity,
      lineTotal,
    });
  }

  if (orderItemsData.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      email: data.email.trim().toLowerCase(),
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
      subtotal,
      shipping,
      total,
      status: "pending_payment",
      ageConfirmed: data.ageConfirmed,
      researchUseConfirmed: data.researchUseConfirmed,
      termsAccepted: data.termsAccepted,
      items: { create: orderItemsData },
    },
  });

  const paymentProvider = getPaymentProvider();
  await paymentProvider.createPayment({
    orderId: order.id,
    amountUsdCents: total,
    currency: "BTC",
  });

  redirect(`/checkout/payment/${order.id}`);
}
