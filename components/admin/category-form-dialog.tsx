"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { categorySchema, type CategoryInput } from "@/lib/validation/product";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/app/admin/(dashboard)/categories/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: { id: string; name: string; slug: string; description: string | null } | null;
  onSaved: () => void;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSaved,
}: CategoryFormDialogProps) {
  const isEditing = Boolean(category);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "", description: "" },
  });

  const name = watch("name");
  const [slugTouched, setSlugTouched] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      reset({
        name: category?.name ?? "",
        slug: category?.slug ?? "",
        description: category?.description ?? "",
      });
      setSlugTouched(false);
    }
  }, [open, category, reset]);

  React.useEffect(() => {
    if (!slugTouched && !isEditing) {
      setValue("slug", slugify(name || ""));
    }
  }, [name, slugTouched, isEditing, setValue]);

  async function onSubmit(values: CategoryInput) {
    const result = isEditing
      ? await updateCategoryAction(category!.id, values)
      : await createCategoryAction(values);

    if (!result.ok) {
      toast.error(result.error ?? "Something went wrong.");
      return;
    }

    toast.success(isEditing ? "Category updated" : "Category created");
    onOpenChange(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Category" : "New Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="cat-name">Name</Label>
            <Input id="cat-name" className="mt-2" {...register("name")} />
            {errors.name && <p className="mt-1.5 text-[12px] text-danger">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="cat-slug">Slug</Label>
            <Input
              id="cat-slug"
              className="mt-2 font-mono"
              {...register("slug", { onChange: () => setSlugTouched(true) })}
            />
            {errors.slug && <p className="mt-1.5 text-[12px] text-danger">{errors.slug.message}</p>}
          </div>
          <div>
            <Label htmlFor="cat-description">Description</Label>
            <Textarea id="cat-description" className="mt-2" rows={3} {...register("description")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
