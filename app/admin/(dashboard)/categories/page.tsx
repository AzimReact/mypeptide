import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { CategoriesManager } from "@/components/admin/categories-manager";

export const metadata: Metadata = { title: "Categories", robots: { index: false } };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return <CategoriesManager categories={categories} />;
}
