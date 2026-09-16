import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { PAYMENT_STATUS_LABELS, type OrderStatus, type PaymentStatus } from "@/lib/orders";

export const metadata: Metadata = { title: "Order Details", robots: { index: false } };

export default async function AdminOrderDetailPage(
  props: PageProps<"/admin/orders/[id]">
) {
  const { id } = await props.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payment: true },
  });

  if (!order) notFound();

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-graphite hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-mono text-xl font-semibold text-ink">{order.orderNumber}</h1>
          <p className="mt-1 text-[12px] text-graphite-light">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        {order.payment && (
          <Badge variant="neutral">
            Payment: {PAYMENT_STATUS_LABELS[order.payment.status as PaymentStatus]}
          </Badge>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <div className="border border-line-strong bg-paper">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Product</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="pr-5 text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="pl-5">
                      <p className="text-[13px] font-medium text-ink">{item.productName}</p>
                      <p className="font-mono text-[11px] uppercase text-graphite-light">
                        {item.productSku}
                      </p>
                    </TableCell>
                    <TableCell className="text-[13px] text-ink">{item.quantity}</TableCell>
                    <TableCell className="pr-5 text-right text-[13px] font-medium text-ink">
                      {formatPrice(item.lineTotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="space-y-2 border-t border-line px-5 py-4 text-[13px]">
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
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-line-strong p-5">
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-graphite">
                Customer
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-ink">
                {order.firstName} {order.lastName}
                <br />
                {order.email}
              </p>
            </div>
            <div className="border border-line-strong p-5">
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-graphite">
                Shipping Address
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-ink">
                {order.address}
                <br />
                {order.city}, {order.state} {order.zip}
                <br />
                {order.country}
              </p>
            </div>
          </div>

          {order.payment && (
            <div className="border border-line-strong p-5">
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-graphite">
                Payment Details
              </h2>
              <dl className="mt-3 grid gap-2 text-[13px] sm:grid-cols-2">
                <div className="flex justify-between gap-4 sm:block">
                  <dt className="text-graphite">Currency</dt>
                  <dd className="text-ink">{order.payment.currency}</dd>
                </div>
                <div className="flex justify-between gap-4 sm:block">
                  <dt className="text-graphite">Crypto Amount</dt>
                  <dd className="font-mono text-ink">{order.payment.cryptoAmount}</dd>
                </div>
                <div className="flex justify-between gap-4 sm:block">
                  <dt className="text-graphite">Wallet Address</dt>
                  <dd className="truncate font-mono text-ink">{order.payment.walletAddress}</dd>
                </div>
                <div className="flex justify-between gap-4 sm:block">
                  <dt className="text-graphite">Paid At</dt>
                  <dd className="text-ink">
                    {order.payment.paidAt ? formatDate(order.payment.paidAt) : "—"}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        <OrderStatusForm
          orderId={order.id}
          status={order.status as OrderStatus}
          trackingNumber={order.trackingNumber ?? ""}
          notes={order.notes ?? ""}
        />
      </div>
    </div>
  );
}
