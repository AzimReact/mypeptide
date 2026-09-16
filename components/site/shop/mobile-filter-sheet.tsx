"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ProductFilters } from "@/components/site/shop/product-filters";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

export function MobileFilterSheet({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="lg:hidden"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filters
      </Button>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="px-6 py-6">
          <ProductFilters categories={categories} />
        </div>
        <SheetFooter>
          <Button className="w-full" onClick={() => setOpen(false)}>
            Show Results
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
