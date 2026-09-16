import Link from "next/link";
import type { Metadata } from "next";
import {
  ShoppingCart,
  CheckCircle2,
  Clock,
  Package,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";
import { getDashboardStats, getRecentOrders, getRecentProducts } from "@/lib/data/admin";
import { StatsCard } from "@/components/admin/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/orders";
import { ORDER_BADGE_VARIANT } from "@/lib/order-badge-variant";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };

export default async function AdminDashboardPage() {
  const [stats, recentOrders, recentProducts] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(),
    getRecentProducts(),
  ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl tracking-tight text-ink">Dashboard</h1>
          <p className="mt-1 text-[13px] text-graphite">
            Overview of store activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/categories">
              <Plus className="h-3.5 w-3.5" /> Category
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/products/new">
              <Plus className="h-3.5 w-3.5" /> Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard label="Total Orders" value={stats.totalOrders} icon={ShoppingCart} />
        <StatsCard label="Paid Orders" value={stats.paidOrders} icon={CheckCircle2} />
        <StatsCard
          label="Pending Payments"
          value={stats.pendingPayments}
          icon={Clock}
          tone="warn"
        />
        <StatsCard label="Products" value={stats.totalProducts} icon={Package} />
        <StatsCard
          label="Low Stock"
          value={stats.lowStockProducts}
          icon={AlertTriangle}
          tone={stats.lowStockProducts > 0 ? "danger" : "default"}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="border border-line-strong bg-paper">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink">
              Recent Orders
            </h2>
            <Link href="/admin/orders" className="text-[12px] text-accent hover:text-accent-dark">
              View All
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5 text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
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
                    <Badge variant={ORDER_BADGE_VARIANT[order.status as OrderStatus]} dot>
                      {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-5 text-right font-medium text-ink">
                    {formatPrice(order.total)}
                  </TableCell>
                </TableRow>
              ))}
              {recentOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center text-graphite">
                    No orders yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="border border-line-strong bg-paper">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink">
              Recent Products
            </h2>
            <Link href="/admin/products" className="text-[12px] text-accent hover:text-accent-dark">
              View All
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Name</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="pr-5 text-right">Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="pl-5">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-[13px] text-ink hover:text-accent-dark"
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-[13px] text-ink">{product.stock}</TableCell>
                  <TableCell className="pr-5 text-right text-[12px] text-graphite-light">
                    {formatDate(product.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
              {recentProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center text-graphite">
                    No products yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
