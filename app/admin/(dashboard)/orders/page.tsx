import Link from "next/link";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ORDER_STATUS_LABELS, ORDER_STATUSES, type OrderStatus } from "@/lib/orders";
import { ORDER_BADGE_VARIANT } from "@/lib/order-badge-variant";

export const metadata: Metadata = { title: "Orders", robots: { index: false } };

export default async function AdminOrdersPage(
  props: PageProps<"/admin/orders">
) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "";

  const where: Prisma.OrderWhereInput = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { orderNumber: { contains: q } },
            { email: { contains: q } },
            { lastName: { contains: q } },
          ],
        }
      : {}),
  };

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { payment: true },
  });

  return (
    <div>
      <h1 className="font-display text-2xl tracking-tight text-ink">Orders</h1>

      <form className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          name="q"
          defaultValue={q}
          placeholder="Search by order number, email, or last name…"
          className="sm:max-w-xs"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-11 border border-line-strong bg-paper px-3.5 text-[14px] text-ink focus:border-ink focus:outline-none sm:w-52"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <Button type="submit" variant="outline">
            Filter
          </Button>
          {(q || status) && (
            <Button type="button" variant="ghost" asChild>
              <Link href="/admin/orders">Clear</Link>
            </Button>
          )}
        </div>
      </form>

      <div className="mt-6 border border-line-strong bg-paper">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="pr-5 text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="pl-5">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-mono text-[12px] text-ink hover:text-accent-dark"
                  >
                    {order.orderNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  <p className="text-[13px] text-ink">
                    {order.firstName} {order.lastName}
                  </p>
                  <p className="text-[11px] text-graphite-light">{order.email}</p>
                </TableCell>
                <TableCell>
                  <Badge variant={ORDER_BADGE_VARIANT[order.status as OrderStatus]} dot>
                    {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                  </Badge>
                </TableCell>
                <TableCell className="text-[12px] uppercase tracking-wide text-graphite">
                  {order.payment?.status ?? "—"}
                </TableCell>
                <TableCell className="text-[13px] font-medium text-ink">
                  {formatPrice(order.total)}
                </TableCell>
                <TableCell className="pr-5 text-right text-[12px] text-graphite-light">
                  {formatDate(order.createdAt)}
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-graphite">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
