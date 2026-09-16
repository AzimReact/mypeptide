"use server";

import { prisma } from "@/lib/db";
import { getPaymentProvider, mockCryptoPaymentProvider } from "@/lib/payments";
import { cryptoCurrencySchema } from "@/lib/validation/checkout";
import { generatePaymentQrDataUrl } from "@/lib/qr";

export async function getPaymentStatusAction(orderId: string) {
  const provider = getPaymentProvider();
  const payment = await provider.getPaymentStatus(orderId);
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true },
  });
  return {
    status: payment.status,
    orderStatus: order?.status ?? null,
    expiresAt: payment.expiresAt.toISOString(),
  };
}

export async function changeCurrencyAction(orderId: string, currencyInput: string) {
  const currency = cryptoCurrencySchema.parse(currencyInput);
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
  const provider = getPaymentProvider();
  const payment = await provider.createPayment({
    orderId,
    amountUsdCents: order.total,
    currency,
  });
  const qrDataUrl = await generatePaymentQrDataUrl(
    `${payment.currency}:${payment.walletAddress}`
  );

  return {
    currency: payment.currency,
    cryptoAmount: payment.cryptoAmount,
    walletAddress: payment.walletAddress,
    expiresAt: payment.expiresAt.toISOString(),
    status: payment.status,
    qrDataUrl,
  };
}

export async function simulatePaidAction(orderId: string) {
  const payment = await mockCryptoPaymentProvider.simulateCustomerPaid(orderId);
  return { status: payment.status };
}
