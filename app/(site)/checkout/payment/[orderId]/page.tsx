import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { generatePaymentQrDataUrl } from "@/lib/qr";
import { CryptoPayment } from "@/components/site/crypto-payment";
import { ClearCartOnMount } from "@/components/site/clear-cart-on-mount";
import type { CryptoCurrency } from "@/lib/validation/checkout";

export const metadata: Metadata = {
  title: "Complete Your Payment",
  robots: { index: false, follow: false },
};

export default async function PaymentPage(
  props: PageProps<"/checkout/payment/[orderId]">
) {
  const { orderId } = await props.params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true },
  });

  if (!order || !order.payment) notFound();

  if (order.payment.status === "paid") {
    redirect(`/order/success/${order.id}`);
  }

  const qrDataUrl = await generatePaymentQrDataUrl(
    `${order.payment.currency}:${order.payment.walletAddress}`
  );

  return (
    <div className="container-edit py-14 lg:py-20">
      <ClearCartOnMount />
      <CryptoPayment
        orderId={order.id}
        orderNumber={order.orderNumber}
        totalUsdCents={order.total}
        initial={{
          currency: order.payment.currency as CryptoCurrency,
          cryptoAmount: order.payment.cryptoAmount,
          walletAddress: order.payment.walletAddress,
          expiresAt: order.payment.expiresAt.toISOString(),
          status: order.payment.status as "pending" | "confirming" | "paid" | "failed" | "expired",
          qrDataUrl,
        }}
      />
    </div>
  );
}
