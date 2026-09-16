"use client";

import * as React from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { deleteProductAction } from "@/app/admin/(dashboard)/products/actions";

export function DeleteProductButton({ id }: { id: string }) {
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteProductAction(id);
    if (result && !result.ok) {
      toast.error(result.error ?? "Could not delete product.");
      setIsDeleting(false);
      setOpen(false);
    }
    // On success the action redirects — this component unmounts.
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Trash2 className="h-3.5 w-3.5" /> Delete
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this product?</DialogTitle>
            <DialogDescription>
              This will permanently remove the product and its images and
              documentation. This cannot be undone. Products with existing
              orders cannot be deleted — unpublish them instead.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting…" : "Delete Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
