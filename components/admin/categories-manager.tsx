"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Archive, ArchiveRestore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { setCategoryArchivedAction } from "@/app/admin/(dashboard)/categories/actions";

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  archived: boolean;
  _count: { products: number };
}

export function CategoriesManager({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CategoryRow | null>(null);
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(category: CategoryRow) {
    setEditing(category);
    setDialogOpen(true);
  }

  async function toggleArchived(category: CategoryRow) {
    setPendingId(category.id);
    const result = await setCategoryArchivedAction(category.id, !category.archived);
    setPendingId(null);
    if (!result.ok) {
      toast.error(result.error ?? "Something went wrong.");
      return;
    }
    toast.success(category.archived ? "Category restored" : "Category archived");
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl tracking-tight text-ink">Categories</h1>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5" /> New Category
        </Button>
      </div>

      <div className="mt-6 border border-line-strong bg-paper">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="pl-5 font-medium text-ink">{category.name}</TableCell>
                <TableCell className="font-mono text-[12px] text-graphite">{category.slug}</TableCell>
                <TableCell>{category._count.products}</TableCell>
                <TableCell>
                  <Badge variant={category.archived ? "neutral" : "success"} dot>
                    {category.archived ? "Archived" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="pr-5 text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(category)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={pendingId === category.id}
                      onClick={() => toggleArchived(category)}
                    >
                      {category.archived ? (
                        <ArchiveRestore className="h-3.5 w-3.5" />
                      ) : (
                        <Archive className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-graphite">
                  No categories yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editing}
        onSaved={() => router.refresh()}
      />
    </div>
  );
}
