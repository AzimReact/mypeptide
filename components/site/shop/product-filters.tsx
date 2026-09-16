"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

export function ProductFilters({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category");
  const inStockOnly = searchParams.get("inStock") === "true";

  function buildHref(params: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(params)) {
      if (value === null) next.delete(key);
      else next.set(key, value);
    }
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function toggleInStock(checked: boolean) {
    router.push(buildHref({ inStock: checked ? "true" : null }));
  }

  const hasActiveFilters = Boolean(activeCategory || inStockOnly);

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-graphite">
            Category
          </h3>
          {hasActiveFilters && (
            <Link
              href={pathname}
              className="text-[11px] font-medium text-accent hover:text-accent-dark"
            >
              Clear all
            </Link>
          )}
        </div>
        <ul className="space-y-2.5">
          <li>
            <Link
              href={buildHref({ category: null })}
              className={cn(
                "text-[13px] transition-colors",
                !activeCategory
                  ? "font-semibold text-ink"
                  : "text-graphite hover:text-ink"
              )}
            >
              All Products
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={buildHref({ category: category.slug })}
                className={cn(
                  "flex items-center justify-between gap-2 text-[13px] transition-colors",
                  activeCategory === category.slug
                    ? "font-semibold text-ink"
                    : "text-graphite hover:text-ink"
                )}
              >
                <span>{category.name}</span>
                <span className="text-graphite-light">
                  {category._count.products}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line pt-6">
        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-graphite">
          Availability
        </h3>
        <label className="flex cursor-pointer items-center gap-3">
          <Checkbox
            checked={inStockOnly}
            onCheckedChange={(v) => toggleInStock(v === true)}
          />
          <span className="text-[13px] text-ink">In stock only</span>
        </label>
      </div>
    </div>
  );
}
