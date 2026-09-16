"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { productSchema } from "@/lib/validation/product";
import { saveProductImage, saveProductDocument, deleteUploadedFile, UploadError } from "@/lib/storage";

export interface ProductActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
}

function parseProductFormData(formData: FormData) {
  const priceDollars = Number(formData.get("price") ?? 0);
  const compareAtRaw = formData.get("compareAtPrice");
  const compareAtDollars = compareAtRaw ? Number(compareAtRaw) : null;

  let specifications: { label: string; value: string }[] = [];
  try {
    specifications = JSON.parse(String(formData.get("specifications") ?? "[]"));
  } catch {
    specifications = [];
  }

  return {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    sku: String(formData.get("sku") ?? ""),
    price: Math.round(priceDollars * 100),
    compareAtPrice: compareAtDollars ? Math.round(compareAtDollars * 100) : null,
    categoryId: String(formData.get("categoryId") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    specifications,
    stock: Number(formData.get("stock") ?? 0),
    active: formData.get("active") === "on",
    featured: formData.get("featured") === "on",
  };
}

function getUploadedFiles(formData: FormData, key: string): File[] {
  return formData
    .getAll(key)
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

export async function createProductAction(formData: FormData): Promise<ProductActionResult> {
  await requireAdmin();

  const parsed = productSchema.safeParse(parseProductFormData(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid product data" };
  }
  const data = parsed.data;

  const [slugExists, skuExists] = await Promise.all([
    prisma.product.findUnique({ where: { slug: data.slug } }),
    prisma.product.findUnique({ where: { sku: data.sku } }),
  ]);
  if (slugExists) return { ok: false, error: "A product with this slug already exists." };
  if (skuExists) return { ok: false, error: "A product with this SKU already exists." };

  const imageFiles = getUploadedFiles(formData, "images");
  const coaFile = getUploadedFiles(formData, "coaFile")[0];
  const sdsFile = getUploadedFiles(formData, "sdsFile")[0];

  try {
    const imageUrls = await Promise.all(imageFiles.map((file) => saveProductImage(file)));
    const documents: { type: string; title: string; url: string }[] = [];
    if (coaFile) {
      documents.push({ type: "COA", title: "Certificate of Analysis", url: await saveProductDocument(coaFile) });
    }
    if (sdsFile) {
      documents.push({ type: "SDS", title: "Safety Data Sheet", url: await saveProductDocument(sdsFile) });
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        specifications: JSON.stringify(data.specifications),
        images: { create: imageUrls.map((url, i) => ({ url, alt: data.name, position: i })) },
        documents: { create: documents },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { ok: true, id: product.id };
  } catch (error) {
    if (error instanceof UploadError) return { ok: false, error: error.message };
    throw error;
  }
}

export async function updateProductAction(
  id: string,
  formData: FormData
): Promise<ProductActionResult> {
  await requireAdmin();

  const parsed = productSchema.safeParse(parseProductFormData(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid product data" };
  }
  const data = parsed.data;

  const [slugConflict, skuConflict] = await Promise.all([
    prisma.product.findUnique({ where: { slug: data.slug } }),
    prisma.product.findUnique({ where: { sku: data.sku } }),
  ]);
  if (slugConflict && slugConflict.id !== id) {
    return { ok: false, error: "A product with this slug already exists." };
  }
  if (skuConflict && skuConflict.id !== id) {
    return { ok: false, error: "A product with this SKU already exists." };
  }

  const imageFiles = getUploadedFiles(formData, "images");
  const coaFile = getUploadedFiles(formData, "coaFile")[0];
  const sdsFile = getUploadedFiles(formData, "sdsFile")[0];
  const removeImageIds = formData.getAll("removeImageIds").map(String);

  try {
    const newImageUrls = await Promise.all(imageFiles.map((file) => saveProductImage(file)));

    if (removeImageIds.length > 0) {
      const imagesToRemove = await prisma.productImage.findMany({
        where: { id: { in: removeImageIds }, productId: id },
      });
      await prisma.productImage.deleteMany({ where: { id: { in: removeImageIds } } });
      await Promise.all(imagesToRemove.map((img) => deleteUploadedFile(img.url)));
    }

    if (newImageUrls.length > 0) {
      const currentMax = await prisma.productImage.count({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: newImageUrls.map((url, i) => ({
          productId: id,
          url,
          alt: data.name,
          position: currentMax + i,
        })),
      });
    }

    for (const [type, file] of [
      ["COA", coaFile],
      ["SDS", sdsFile],
    ] as const) {
      if (!file) continue;
      const existingDoc = await prisma.productDocument.findFirst({ where: { productId: id, type } });
      const url = await saveProductDocument(file);
      if (existingDoc) {
        await prisma.productDocument.update({ where: { id: existingDoc.id }, data: { url } });
        await deleteUploadedFile(existingDoc.url);
      } else {
        await prisma.productDocument.create({
          data: {
            productId: id,
            type,
            title: type === "COA" ? "Certificate of Analysis" : "Safety Data Sheet",
            url,
          },
        });
      }
    }

    await prisma.product.update({
      where: { id },
      data: { ...data, specifications: JSON.stringify(data.specifications) },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/shop");
    revalidatePath(`/product/${data.slug}`);
    return { ok: true, id };
  } catch (error) {
    if (error instanceof UploadError) return { ok: false, error: error.message };
    throw error;
  }
}

export async function setProductActiveAction(id: string, active: boolean) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { active } });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, documents: true, orderItems: { take: 1 } },
  });
  if (!product) return { ok: false, error: "Product not found." };
  if (product.orderItems.length > 0) {
    return {
      ok: false,
      error: "This product has existing orders and cannot be deleted. Archive it instead.",
    };
  }

  await prisma.product.delete({ where: { id } });
  await Promise.all([
    ...product.images.map((img) => deleteUploadedFile(img.url)),
    ...product.documents.map((doc) => deleteUploadedFile(doc.url)),
  ]);

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}
