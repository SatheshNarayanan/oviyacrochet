"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/components/ui/toast";
import { formatINR } from "@/lib/utils";
import { YarnMascot } from "@/components/ui/yarn-mascot";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  primaryImage?: string;
  secondaryImage?: string;
  index?: number;
  inStock?: boolean;
  isNew?: boolean;
}

/**
 * Borderless product tile — UI/UX guide §4.2–4.3.
 * - 4:5 portrait image with hover secondary image
 * - One badge max (Sale > New > in-stock indicator)
 * - Heart wishlist (top-right overlay)
 * - "+ Quick add" reveals on hover (CSS handles it)
 * - No description snippets, no heavy card border
 * - Sold-out: dimmed + "Notify me" button instead
 */
export function ProductCard({
  id,
  name,
  slug,
  price,
  originalPrice,
  discountPercent = 0,
  primaryImage,
  secondaryImage,
  index = 0,
  inStock = true,
  isNew = false,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem({ productId: id, name, slug, image: primaryImage ?? "", price, originalPrice });
    toast("Added to cart 🧶");
    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((w) => !w);
    toast(wishlisted ? "Removed from wishlist" : "Saved to wishlist ♡");
  };

  /* Badge: priority = sold-out > sale > new */
  let badge: { label: string; mod: string } | null = null;
  if (!inStock)       badge = { label: "Sold out",        mod: "tile-badge--soldout" };
  else if (discountPercent > 0) badge = { label: `Sale –${Math.round(discountPercent)}%`, mod: "tile-badge--sale" };
  else if (isNew)     badge = { label: "New",             mod: "tile-badge--new" };

  return (
    <article className={`tile${!inStock ? " tile--soldout" : ""}`}>
      {/* Image area wrapper */}
      <div style={{ position: "relative" }}>
        <Link href={`/product/${slug}`} className="tile__media" tabIndex={-1} aria-hidden="true">
        {primaryImage ? (
          <>
            <Image
              className="tile__img"
              src={primaryImage}
              alt={name}
              fill
              sizes="(max-width: 767px) 50vw, (max-width: 1099px) 33vw, 25vw"
              style={{ objectFit: "cover" }}
              priority={index < 4}
            />
            {secondaryImage && (
              <Image
                className="tile__img tile__img--alt"
                src={secondaryImage}
                alt=""
                fill
                sizes="(max-width: 767px) 50vw, (max-width: 1099px) 33vw, 25vw"
                style={{ objectFit: "cover" }}
                aria-hidden="true"
              />
            )}
          </>
        ) : (
          <div style={{ display: "grid", placeItems: "center", height: "100%" }}>
            <YarnMascot size={48} animate={false} />
          </div>
        )}

        {/* Badge */}
        {badge && <span className={`tile-badge ${badge.mod}`}>{badge.label}</span>}
      </Link>

      {/* Wishlist heart — overlaps image, outside <a> for separate click target */}
      <button
        className="tile__heart"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={handleWishlist}
        style={{ color: wishlisted ? "var(--danger)" : "inherit" }}
      >
        <Heart size={16} fill={wishlisted ? "var(--danger)" : "none"} aria-hidden="true" />
      </button>

      {/* Quick add / Notify me — CSS shows on hover (desktop) or always (touch) */}
      {inStock ? (
        <button
          className="tile__add"
          aria-label={`Quick add ${name} to cart`}
          onClick={handleAddToCart}
        >
          + Quick add
        </button>
      ) : (
        <button
          className="tile__add notify-btn"
          aria-label={`Notify me when ${name} is back in stock`}
          onClick={(e) => { e.stopPropagation(); toast("We'll let you know when it's back! 📬"); }}
          style={{ opacity: 1, transform: "none", position: "absolute", left: 10, right: 10, bottom: 10 }}
        >
          Notify me when it&apos;s back
        </button>
      )}
      </div>

      {/* Text body */}
      <div className="tile__body">
        <h3 className="tile__title">
          <Link href={`/product/${slug}`}>{name}</Link>
        </h3>
        <p className="tile__price">
          <strong>{formatINR(price)}</strong>
          {discountPercent > 0 && (
            <s>{formatINR(originalPrice)}</s>
          )}
        </p>
      </div>
    </article>
  );
}
