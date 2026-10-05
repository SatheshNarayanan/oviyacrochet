"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/components/ui/toast";
import { formatINR, phClass } from "@/lib/utils";
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
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  originalPrice,
  discountPercent,
  primaryImage,
  secondaryImage,
  index = 0,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: id,
      name,
      slug,
      image: primaryImage ?? "",
      price,
      originalPrice,
    });
    toast("Added to cart 🧶");
    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((w) => !w);
    toast(wishlisted ? "Removed from wishlist" : "Saved to wishlist ♡");
  };

  const showSecond = hovered && secondaryImage;
  const imgSrc = showSecond ? secondaryImage! : primaryImage;

  return (
    <Link
      href={`/product/${slug}`}
      className="card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "block", textDecoration: "none" }}
    >
      {discountPercent && discountPercent > 0 ? (
        <span className="badge-discount" aria-label={`${discountPercent}% discount`}>
          {Math.round(discountPercent)}% off
        </span>
      ) : null}

      <button
        className="heart-btn"
        aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
        onClick={handleWishlist}
        style={{
          position: "absolute",
          top: 12, right: 12,
          width: 34, height: 34,
          borderRadius: "50%",
          border: 0,
          background: "var(--surface)",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          zIndex: 2,
          color: "var(--pink)",
          transition: "transform 0.15s",
        }}
      >
        <Heart
          size={16}
          fill={wishlisted ? "var(--pink)" : "none"}
          aria-hidden="true"
        />
      </button>

      {/* Product image */}
      <div className={`ph ${phClass(index)}`} style={{ borderRadius: "var(--r-tile)" }}>
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{ objectFit: "cover", borderRadius: "var(--r-tile)", transition: "opacity 0.3s" }}
          />
        ) : (
          <YarnMascot size={46} animate={false} />
        )}
      </div>

      <h3 className="text-card" style={{ margin: "10px 4px 2px" }}>{name}</h3>

      <p className="price" style={{ margin: "0 4px" }}>
        <span style={{ fontWeight: 700 }}>{formatINR(price)}</span>
        {discountPercent && discountPercent > 0 && (
          <s style={{ color: "var(--mute)", fontWeight: 400, marginLeft: 6, fontSize: 13 }}>
            {formatINR(originalPrice)}
          </s>
        )}
      </p>

      <button
        className="add-btn"
        onClick={handleAddToCart}
        aria-label={`Add ${name} to cart`}
        style={{
          margin: "8px 4px 0",
          width: "calc(100% - 8px)",
          border: "2px solid var(--pri)",
          background: "transparent",
          color: "var(--pri)",
          borderRadius: "var(--r-pill)",
          padding: "8px",
          fontWeight: 700,
          cursor: "pointer",
          minHeight: 44,
          fontSize: 14,
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--pri)";
          e.currentTarget.style.color = "var(--pri-ink)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--pri)";
        }}
      >
        Add to cart
      </button>
    </Link>
  );
}
