import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { OrderDetailsCard } from "@/components/site/order-details-card";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default async function OrderSuccessPage(
  props: PageProps<"/order/success/[orderId]">
) {
  const { orderId } = await props.params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, payment: true },
  });

  if (!order) notFound();
  if (order.status === "pending_payment") {
    redirect(`/checkout/payment/${order.id}`);
  }

  return (
    <div className="container-edit py-14 lg:py-20">
      <div className="mx-auto max-w-xl text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" strokeWidth={1.5} />
        <h1 className="mt-5 font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Order Confirmed
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-graphite">
          Thank you — your payment has been received. A confirmation has been
          recorded for order{" "}
          <span className="font-mono text-ink">{order.orderNumber}</span>. Keep
          your order number and email on hand to track its status.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-xl">
        <OrderDetailsCard order={order} />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="flex-1">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1">
            <Link href="/track-order">Track This Order</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
