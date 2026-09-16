import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts, type ProductFilters } from "@/lib/data/products";
import { getActiveCategories } from "@/lib/data/categories";
import { ProductGrid } from "@/components/site/product-grid";
import { ProductFilters as ProductFiltersPanel } from "@/components/site/shop/product-filters";
import { SortSelect } from "@/components/site/shop/sort-select";
import { ShopSearch } from "@/components/site/shop/shop-search";
import { MobileFilterSheet } from "@/components/site/shop/mobile-filter-sheet";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse Axiom Research's full catalog of documented reference compounds, reagents, and laboratory consumables.",
};

function parseSort(value?: string): ProductFilters["sort"] {
  const allowed: ProductFilters["sort"][] = [
    "featured",
    "price-asc",
    "price-desc",
    "newest",
    "name",
  ];
  return allowed.includes(value as ProductFilters["sort"])
    ? (value as ProductFilters["sort"])
    : "featured";
}

export default async function ShopPage(props: PageProps<"/shop">) {
  const searchParams = await props.searchParams;
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const query = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const sort = parseSort(typeof searchParams.sort === "string" ? searchParams.sort : undefined);
  const inStockOnly = searchParams.inStock === "true";
  const featuredOnly = searchParams.featured === "true";

  const [products, categories] = await Promise.all([
    getProducts({ categorySlug: category, query, sort, inStockOnly, featuredOnly }),
    getActiveCategories(),
  ]);

  return (
    <div className="container-edit py-12 lg:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
          Catalog
        </p>
        <h1 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
          {featuredOnly ? "Featured Products" : "Shop All Products"}
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-graphite">
          Every product ships with independent batch documentation. For
          laboratory and research use only.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
        <aside className="hidden lg:block">
          <Suspense>
            <ProductFiltersPanel categories={categories} />
          </Suspense>
        </aside>

        <div>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Suspense>
              <ShopSearch />
            </Suspense>
            <div className="flex items-center gap-3">
              <Suspense>
                <MobileFilterSheet categories={categories} />
              </Suspense>
              <Suspense>
                <SortSelect />
              </Suspense>
            </div>
          </div>

          <p className="mb-6 text-[12px] uppercase tracking-[0.08em] text-graphite-light">
            {products.length} {products.length === 1 ? "Product" : "Products"}
          </p>

          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
