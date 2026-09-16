"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/site/cart-provider";
import { Badge } from "@/components/ui/badge";
import type { ProductListItem } from "@/lib/data/products";

export function ProductCard({ product }: { product: ProductListItem }) {
  const { addItem } = useCart();
  const image = product.images[0]?.url ?? null;
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 10;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      image,
      stock: product.stock,
    });
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-dim">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : null}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <Badge variant="accent">Sale</Badge>
          )}
          {outOfStock && <Badge variant="danger">Sold Out</Badge>}
          {lowStock && <Badge variant="warn">Low Stock</Badge>}
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={outOfStock}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center bg-ink text-paper opacity-0 transition-all duration-300 hover:bg-accent-dark disabled:pointer-events-none disabled:opacity-0 group-hover:opacity-100"
          aria-label={`Quick add ${product.name} to cart`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-graphite-light">
          {product.category.name}
        </p>
        <h3 className="text-[14px] font-medium leading-snug text-ink">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-[14px] font-semibold text-ink">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-[12px] text-graphite-light line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
