import "server-only";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

const productListInclude = {
  images: { orderBy: { position: "asc" as const }, take: 1 },
  category: true,
} satisfies Prisma.ProductInclude;

const productDetailInclude = {
  images: { orderBy: { position: "asc" as const } },
  documents: { orderBy: { createdAt: "asc" as const } },
  category: true,
} satisfies Prisma.ProductInclude;

export interface ProductFilters {
  categorySlug?: string;
  query?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "newest" | "name";
  inStockOnly?: boolean;
  featuredOnly?: boolean;
}

function buildOrderBy(
  sort: ProductFilters["sort"]
): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "price-asc":
      return [{ price: "asc" }];
    case "price-desc":
      return [{ price: "desc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    case "name":
      return [{ name: "asc" }];
    case "featured":
    default:
      return [{ featured: "desc" }, { createdAt: "desc" }];
  }
}

export async function getProducts(filters: ProductFilters = {}) {
  const where: Prisma.ProductWhereInput = {
    active: true,
    ...(filters.categorySlug
      ? { category: { slug: filters.categorySlug } }
      : {}),
    ...(filters.inStockOnly ? { stock: { gt: 0 } } : {}),
    ...(filters.featuredOnly ? { featured: true } : {}),
    ...(filters.query
      ? {
          OR: [
            { name: { contains: filters.query } },
            { shortDescription: { contains: filters.query } },
            { sku: { contains: filters.query } },
          ],
        }
      : {}),
  };

  return prisma.product.findMany({
    where,
    include: productListInclude,
    orderBy: buildOrderBy(filters.sort),
  });
}

export async function getFeaturedProducts(take = 4) {
  return prisma.product.findMany({
    where: { active: true, featured: true },
    include: productListInclude,
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: productDetailInclude,
  });
}

export async function getRelatedProducts(
  categoryId: string,
  excludeProductId: string,
  take = 4
) {
  return prisma.product.findMany({
    where: {
      categoryId,
      active: true,
      id: { not: excludeProductId },
    },
    include: productListInclude,
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getAllProductSlugs() {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true },
  });
  return products.map((p) => p.slug);
}

export type ProductListItem = Awaited<ReturnType<typeof getProducts>>[number];
export type ProductDetail = NonNullable<
  Awaited<ReturnType<typeof getProductBySlug>>
>;
