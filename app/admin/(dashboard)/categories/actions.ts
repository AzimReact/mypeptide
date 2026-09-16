"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { categorySchema, type CategoryInput } from "@/lib/validation/product";

export interface CategoryActionResult {
  ok: boolean;
  error?: string;
}

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
}

export async function createCategoryAction(input: CategoryInput): Promise<CategoryActionResult> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid category data" };
  }

  const existing = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { ok: false, error: "A category with this slug already exists." };
  }

  await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  return { ok: true };
}

export async function updateCategoryAction(
  id: string,
  input: CategoryInput
): Promise<CategoryActionResult> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid category data" };
  }

  const existing = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== id) {
    return { ok: false, error: "A category with this slug already exists." };
  }

  await prisma.category.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  return { ok: true };
}

export async function setCategoryArchivedAction(
  id: string,
  archived: boolean
): Promise<CategoryActionResult> {
  await requireAdmin();

  if (archived) {
    const productCount = await prisma.product.count({ where: { categoryId: id, active: true } });
    if (productCount > 0) {
      return {
        ok: false,
        error: `Cannot archive — ${productCount} active product(s) still use this category.`,
      };
    }
  }

  await prisma.category.update({ where: { id }, data: { archived } });
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  return { ok: true };
}
