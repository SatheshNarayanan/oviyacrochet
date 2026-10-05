"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/components/ui/toast";
import { formatINR, phClass } from "@/lib/utils";
import { YarnMascot } from "@/components/ui/yarn-mascot";

interface ProductGalleryProps {
  images: { url: string; alt: string; isPrimary: boolean }[];
  productName: string;
  discountPercent?: number;
}

export function ProductGallery({ images, productName, discountPercent }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const sorted = [...images].sort((a, b) => (a.isPrimary ? -1 : 1));

  return (
    <div>
      {/* Main image */}
      <div
        className={`ph ${phClass(0)}`}
        style={{ borderRadius: "var(--r-img)", position: "relative", aspectRatio: "1", overflow: "hidden" }}
      >
        {discountPercent && discountPercent > 0 ? (
          <span className="badge-discount" aria-label={`${Math.round(discountPercent)}% discount`}>
            {Math.round(discountPercent)}% off
          </span>
        ) : null}
        {sorted[active]?.url ? (
          <Image
            src={sorted[active].url}
            alt={sorted[active]?.alt || productName}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
            priority
          />
        ) : (
          <YarnMascot size={120} animate={false} />
        )}
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(sorted.length, 4)}, 1fr)`,
          gap: 8, marginTop: 8,
        }}>
          {sorted.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              style={{
                border: `2px solid ${i === active ? "var(--pri)" : "var(--line)"}`,
                borderRadius: "var(--r-thumb)",
                overflow: "hidden",
                aspectRatio: "1",
                cursor: "pointer",
                padding: 0,
                background: "none",
                position: "relative",
              }}
            >
              <div className={`ph ${phClass(i)}`} style={{ borderRadius: 0, aspectRatio: "1" }}>
                {img.url && (
                  <Image src={img.url} alt={img.alt || productName} fill sizes="80px" style={{ objectFit: "cover" }} />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface ProductActionsProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  description: string;
  categoryName: string;
  primaryImage?: string;
  colors?: string[];
}

export function ProductActions({
  id, name, slug, price, originalPrice, discountPercent,
  description, categoryName, primaryImage, colors,
}: ProductActionsProps) {
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colors?.[0]);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { toast } = useToast();

  const handleAdd = () => {
    addItem({
      productId: id, name, slug,
      image: primaryImage ?? "",
      price, originalPrice,
      quantity: qty,
      customization: selectedColor,
    });
    toast(`Added ${qty}× ${name} to cart 🧶`);
    openCart();
  };

  return (
    <div>
      <p style={{ color: "var(--mute)", margin: "0 0 4px", fontSize: 13 }}>{categoryName}</p>
      <h1 className="text-pdp-h1" style={{ marginBottom: 12 }}>{name}</h1>

      {/* Price */}
      <p style={{ marginBottom: 16 }}>
        <span className="text-price">{formatINR(price)}</span>
        {discountPercent && discountPercent > 0 ? (
          <s style={{ fontFamily: "DM Sans", fontWeight: 400, fontSize: 16, color: "var(--mute)", marginLeft: 10 }}>
            {formatINR(originalPrice)}
          </s>
        ) : null}
      </p>

      <p style={{ color: "var(--ink)", lineHeight: 1.6, marginBottom: 16, fontSize: 15 }}>{description}</p>

      {/* Color swatches */}
      {colors && colors.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Colour</p>
          <div style={{ display: "flex", gap: 10 }}>
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                aria-label={`Select colour ${c}`}
                style={{
                  width: 32, height: 32,
                  borderRadius: "50%",
                  background: c,
                  border: "3px solid var(--surface)",
                  outline: selectedColor === c ? "2px solid var(--pri)" : "2px solid var(--line)",
                  cursor: "pointer",
                  transition: "outline 0.15s",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quantity + Add to cart */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <div className="qty-stepper">
          <button
            className="qty-btn"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span style={{ padding: "0 16px", fontWeight: 700, minWidth: 40, textAlign: "center" }}>
            {qty}
          </span>
          <button
            className="qty-btn"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
        <button className="btn" onClick={handleAdd} style={{ flex: 1 }}>
          Add to cart
        </button>
      </div>

      {/* Made to order note */}
      <div className="mint-note">
        🪡 Made to order. Ships in 5 to 7 days.
      </div>
    </div>
  );
}
