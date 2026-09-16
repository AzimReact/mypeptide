import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";
import { ProductDocuments } from "@/components/site/product-documents";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const metadata: Metadata = { title: "Edit Product", robots: { index: false } };

export default async function EditProductPage(
  props: PageProps<"/admin/products/[id]">
) {
  const { id } = await props.params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { position: "asc" } }, documents: true },
    }),
    prisma.category.findMany({
      where: { archived: false },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl tracking-tight text-ink">Edit Product</h1>
        <DeleteProductButton id={product.id} />
      </div>

      <div className="mt-8">
        <ProductForm
          categories={categories}
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            categoryId: product.categoryId,
            shortDescription: product.shortDescription,
            description: product.description,
            specifications: product.specifications,
            stock: product.stock,
            active: product.active,
            featured: product.featured,
            images: product.images,
          }}
        />
      </div>

      <div className="mt-10 border-t border-line pt-8">
        <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink">
          Current Documentation
        </h2>
        <ProductDocuments documents={product.documents} />
      </div>
    </div>
  );
}
