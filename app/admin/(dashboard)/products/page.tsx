import Link from "next/link";
import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductStatusToggle } from "@/components/admin/product-status-toggle";

export const metadata: Metadata = { title: "Products", robots: { index: false } };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, images: { take: 1, orderBy: { position: "asc" } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl tracking-tight text-ink">Products</h1>
        <Button asChild size="sm">
          <Link href="/admin/products/new">
            <Plus className="h-3.5 w-3.5" /> New Product
          </Link>
        </Button>
      </div>

      <div className="mt-6 border border-line-strong bg-paper">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="pl-5">
                  <div>
                    <p className="text-[13px] font-medium text-ink">{product.name}</p>
                    <p className="font-mono text-[11px] uppercase text-graphite-light">
                      {product.sku}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-[13px] text-graphite">{product.category.name}</TableCell>
                <TableCell className="text-[13px] text-ink">{formatPrice(product.price)}</TableCell>
                <TableCell>
                  {product.stock === 0 ? (
                    <Badge variant="danger">0</Badge>
                  ) : product.stock <= 10 ? (
                    <Badge variant="warn">{product.stock}</Badge>
                  ) : (
                    <span className="text-[13px] text-ink">{product.stock}</span>
                  )}
                </TableCell>
                <TableCell>
                  <ProductStatusToggle id={product.id} active={product.active} />
                </TableCell>
                <TableCell className="pr-5 text-right">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink hover:text-accent-dark"
                  >
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-graphite">
                  No products yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
