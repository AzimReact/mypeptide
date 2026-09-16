import "server-only";
import { prisma } from "@/lib/db";

export async function getActiveCategories() {
  return prisma.category.findMany({
    where: { archived: false },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: { where: { active: true } } } },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}
