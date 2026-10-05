"use client";

import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/components/ui/toast";

interface Props {
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  slug: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function AddToCartButton({ productId, name, price, originalPrice, image, slug, children, style, className }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { toast } = useToast();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ productId, name, price, originalPrice, image, slug });
    toast("Added to cart 🧶");
    openCart();
  };

  return (
    <button onClick={handleClick} style={style} className={className} type="button">
      {children ?? "Add to cart"}
    </button>
  );
}
