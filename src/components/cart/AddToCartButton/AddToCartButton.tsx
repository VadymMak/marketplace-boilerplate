"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui";

type Props = {
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    slug: string;
    vendor: { name: string | null };
  };
};

export function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0] ?? null,
      slug: product.slug,
      vendorName: product.vendor.name,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <Button size="lg" onClick={handleAdd} style={{ width: "100%" }}>
      {added ? "✓ Added to Cart" : "Add to Cart"}
    </Button>
  );
}
