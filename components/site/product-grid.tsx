import { FlaskConical } from "lucide-react";
import { ProductCard } from "@/components/site/product-card";
import type { ProductListItem } from "@/lib/data/products";

export function ProductGrid({ products }: { products: ProductListItem[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-line-strong py-24 text-center">
        <FlaskConical className="h-6 w-6 text-graphite-light" />
        <p className="text-[14px] text-graphite">
          No products match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
