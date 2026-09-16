"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/site/quantity-selector";
import { useCart } from "@/components/site/cart-provider";

interface AddToCartPanelProps {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  image: string | null;
  stock: number;
}

export function AddToCartPanel(props: AddToCartPanelProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [justAdded, setJustAdded] = React.useState(false);
  const outOfStock = props.stock <= 0;

  function handleAdd() {
    if (outOfStock) return;
    addItem(
      {
        productId: props.productId,
        name: props.name,
        slug: props.slug,
        sku: props.sku,
        price: props.price,
        image: props.image,
        stock: props.stock,
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <QuantitySelector
        className="self-start"
        value={quantity}
        onChange={setQuantity}
        max={Math.max(props.stock, 1)}
      />
      <Button
        size="lg"
        className="sm:flex-1"
        onClick={handleAdd}
        disabled={outOfStock}
      >
        {outOfStock ? (
          "Out of Stock"
        ) : justAdded ? (
          <>
            <Check className="h-4 w-4" /> Added to Cart
          </>
        ) : (
          "Add to Cart"
        )}
      </Button>
    </div>
  );
}
