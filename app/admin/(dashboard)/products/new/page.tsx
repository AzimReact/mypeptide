import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = { title: "New Product", robots: { index: false } };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { archived: false },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl tracking-tight text-ink">New Product</h1>
      <div className="mt-8">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
