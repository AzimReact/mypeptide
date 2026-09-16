import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(140),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(140)
    .regex(slugPattern, "Use lowercase letters, numbers and hyphens only"),
  sku: z.string().min(1, "SKU is required").max(60),
  price: z.number().int().min(0, "Price cannot be negative"),
  compareAtPrice: z.number().int().min(0).nullable().optional(),
  categoryId: z.string().min(1, "Category is required"),
  shortDescription: z.string().min(1, "Short description is required").max(280),
  description: z.string().min(1, "Description is required"),
  specifications: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
      })
    )
    .default([]),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100)
    .regex(slugPattern, "Use lowercase letters, numbers and hyphens only"),
  description: z.string().max(500).optional().or(z.literal("")),
});

export type CategoryInput = z.infer<typeof categorySchema>;
