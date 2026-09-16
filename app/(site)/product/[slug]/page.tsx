import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getRelatedProducts, getAllProductSlugs } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProductGallery } from "@/components/site/product-gallery";
import { AddToCartPanel } from "@/components/site/add-to-cart-panel";
import { ProductDocuments } from "@/components/site/product-documents";
import { ResearchUseNotice } from "@/components/site/research-use-notice";
import { ProductGrid } from "@/components/site/product-grid";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/product/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
  };
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id, 4);
  const specifications: { label: string; value: string }[] = JSON.parse(
    product.specifications
  );
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 10;

  return (
    <div className="container-edit py-10 lg:py-14">
      <nav className="mb-8 flex items-center gap-2 text-[12px] text-graphite">
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-ink">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <ProductGallery
          images={product.images.map((img) => ({ id: img.id, url: img.url, alt: img.alt || product.name }))}
        />

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
            {product.category.name}
          </p>
          <h1 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 font-mono text-[12px] uppercase tracking-wide text-graphite-light">
            SKU: {product.sku}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-2xl font-semibold text-ink">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-[15px] text-graphite-light line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="mt-4">
            {outOfStock ? (
              <Badge variant="danger">Out of Stock</Badge>
            ) : lowStock ? (
              <Badge variant="warn" dot>
                Only {product.stock} left
              </Badge>
            ) : (
              <Badge variant="success" dot>
                In Stock
              </Badge>
            )}
          </div>

          <p className="mt-6 max-w-lg text-[14px] leading-relaxed text-graphite">
            {product.shortDescription}
          </p>

          <div className="mt-8">
            <AddToCartPanel
              productId={product.id}
              name={product.name}
              slug={product.slug}
              sku={product.sku}
              price={product.price}
              image={product.images[0]?.url ?? null}
              stock={product.stock}
            />
          </div>

          <ResearchUseNotice className="mt-8" compact />
        </div>
      </div>

      <div className="mt-16 lg:mt-24">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <p className="max-w-3xl text-[14px] leading-relaxed text-graphite">
              {product.description}
            </p>
          </TabsContent>

          <TabsContent value="specifications">
            <dl className="grid max-w-2xl grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-2 sm:divide-y-0">
              {specifications.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center justify-between gap-4 border-line py-3.5 sm:border-b sm:py-3"
                >
                  <dt className="text-[12px] uppercase tracking-[0.06em] text-graphite">
                    {spec.label}
                  </dt>
                  <dd className="text-[13px] font-medium text-ink">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </TabsContent>

          <TabsContent value="documentation">
            <div className="max-w-2xl">
              <ProductDocuments
                documents={product.documents.map((d) => ({
                  id: d.id,
                  type: d.type,
                  title: d.title,
                  url: d.url,
                }))}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-20 border-t border-line pt-16 lg:mt-28">
          <h2 className="mb-8 font-display text-2xl tracking-tight text-ink">
            You May Also Consider
          </h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
