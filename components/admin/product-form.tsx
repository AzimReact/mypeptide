"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createProductAction,
  updateProductAction,
} from "@/app/admin/(dashboard)/products/actions";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ExistingImage {
  id: string;
  url: string;
  alt: string;
}

interface ExistingProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: string;
  shortDescription: string;
  description: string;
  specifications: string;
  stock: number;
  active: boolean;
  featured: boolean;
  images: ExistingImage[];
}

interface ProductFormProps {
  categories: { id: string; name: string }[];
  product?: ExistingProduct;
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);
  const isEditing = Boolean(product);

  const [name, setName] = React.useState(product?.name ?? "");
  // null = not manually edited yet, so the slug tracks the name automatically.
  const [manualSlug, setManualSlug] = React.useState<string | null>(product?.slug ?? null);
  const slug = manualSlug ?? slugify(name);
  const [specifications, setSpecifications] = React.useState<{ label: string; value: string }[]>(
    product ? JSON.parse(product.specifications) : [{ label: "", value: "" }]
  );
  const [removedImageIds, setRemovedImageIds] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function updateSpec(index: number, field: "label" | "value", value: string) {
    setSpecifications((current) =>
      current.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec))
    );
  }

  function addSpec() {
    setSpecifications((current) => [...current, { label: "", value: "" }]);
  }

  function removeSpec(index: number) {
    setSpecifications((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;
    setIsSubmitting(true);

    const formData = new FormData(formRef.current);
    const cleanSpecs = specifications.filter((s) => s.label.trim() && s.value.trim());
    formData.set("specifications", JSON.stringify(cleanSpecs));
    removedImageIds.forEach((id) => formData.append("removeImageIds", id));

    const result = isEditing
      ? await updateProductAction(product!.id, formData)
      : await createProductAction(formData);

    setIsSubmitting(false);

    if (!result.ok) {
      toast.error(result.error ?? "Something went wrong.");
      return;
    }

    toast.success(isEditing ? "Product updated" : "Product created");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
      <section className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            required
            className="mt-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            required
            className="mt-2 font-mono"
            value={slug}
            onChange={(e) => setManualSlug(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" required className="mt-2" defaultValue={product?.sku} />
        </div>
        <div>
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            className="mt-2"
            defaultValue={product ? (product.price / 100).toFixed(2) : undefined}
          />
        </div>
        <div>
          <Label htmlFor="compareAtPrice">Compare-at Price (optional)</Label>
          <Input
            id="compareAtPrice"
            name="compareAtPrice"
            type="number"
            step="0.01"
            min="0"
            className="mt-2"
            defaultValue={
              product?.compareAtPrice ? (product.compareAtPrice / 100).toFixed(2) : undefined
            }
          />
        </div>
        <div>
          <Label htmlFor="categoryId">Category</Label>
          <Select name="categoryId" defaultValue={product?.categoryId}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            required
            className="mt-2"
            defaultValue={product?.stock ?? 0}
          />
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea
            id="shortDescription"
            name="shortDescription"
            required
            rows={2}
            className="mt-2"
            defaultValue={product?.shortDescription}
          />
        </div>
        <div>
          <Label htmlFor="description">Full Description</Label>
          <Textarea
            id="description"
            name="description"
            required
            rows={6}
            className="mt-2"
            defaultValue={product?.description}
          />
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <Label>Specifications</Label>
          <Button type="button" size="sm" variant="outline" onClick={addSpec}>
            <Plus className="h-3.5 w-3.5" /> Add Row
          </Button>
        </div>
        <div className="space-y-3">
          {specifications.map((spec, index) => (
            <div key={index} className="flex gap-3">
              <Input
                placeholder="Label (e.g. Purity)"
                value={spec.label}
                onChange={(e) => updateSpec(index, "label", e.target.value)}
              />
              <Input
                placeholder="Value (e.g. ≥ 98%)"
                value={spec.value}
                onChange={(e) => updateSpec(index, "value", e.target.value)}
              />
              <Button type="button" size="icon" variant="ghost" onClick={() => removeSpec(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Label>Product Images</Label>
        {product && product.images.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {product.images.map((image) => {
              const marked = removedImageIds.includes(image.id);
              return (
                <div key={image.id} className="relative h-24 w-20 overflow-hidden border border-line-strong">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="80px"
                    className={marked ? "object-cover opacity-30" : "object-cover"}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setRemovedImageIds((current) =>
                        marked ? current.filter((id) => id !== image.id) : [...current, image.id]
                      )
                    }
                    className="absolute inset-x-0 bottom-0 bg-ink/80 py-1 text-[10px] font-semibold uppercase text-paper"
                  >
                    {marked ? "Undo" : "Remove"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <Input type="file" name="images" accept="image/png,image/jpeg,image/webp,image/avif" multiple className="mt-3" />
        <p className="mt-1.5 text-[12px] text-graphite-light">
          Upload one or more product images (JPEG, PNG, WebP, or AVIF).
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="coaFile">Certificate of Analysis (PDF)</Label>
          <Input id="coaFile" name="coaFile" type="file" accept="application/pdf" className="mt-2" />
        </div>
        <div>
          <Label htmlFor="sdsFile">Safety Data Sheet (PDF)</Label>
          <Input id="sdsFile" name="sdsFile" type="file" accept="application/pdf" className="mt-2" />
        </div>
      </section>

      <section className="flex flex-wrap gap-8">
        <label className="flex cursor-pointer items-center gap-3">
          <Checkbox name="active" defaultChecked={product?.active ?? true} />
          <span className="text-[13px] text-ink">Published</span>
        </label>
        <label className="flex cursor-pointer items-center gap-3">
          <Checkbox name="featured" defaultChecked={product?.featured ?? false} />
          <span className="text-[13px] text-ink">Featured on homepage</span>
        </label>
      </section>

      <div className="flex gap-3 border-t border-line pt-6">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isEditing ? "Save Changes" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
