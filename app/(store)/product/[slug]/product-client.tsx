"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Heart, MapPin } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/components/ui/toast";
import { formatINR, phClass } from "@/lib/utils";
import { YarnMascot } from "@/components/ui/yarn-mascot";

interface ProductGalleryProps {
  images: { url: string; alt: string; isPrimary: boolean }[];
  productName: string;
  discountPercent?: number;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const sorted = [...images].sort((a) => (a.isPrimary ? -1 : 1));

  return (
    <div>
      {/* v2 Main image — .pdp__main */}
      <div className={`pdp__main ph ${phClass(0)}`} style={{ position: "relative" }}>
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
          <div style={{ display: "grid", placeItems: "center", height: "100%" }}>
            <YarnMascot size={120} animate={false} />
          </div>
        )}
      </div>

      {/* v2 Thumbnails — .pdp__thumbs */}
      {sorted.length > 1 && (
        <div className="pdp__thumbs">
          {sorted.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              className={`ph ${phClass(i)}`}
              style={{ position: "relative" }}
            >
              {img.url && (
                <Image
                  src={img.url}
                  alt={img.alt || productName}
                  fill
                  sizes="80px"
                  style={{ objectFit: "cover" }}
                />
              )}
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
  const [activeTab, setActiveTab] = useState<"details" | "shipping">("details");
  const [wishlisted, setWishlisted] = useState(false);
  const [pin, setPin] = useState("");
  const [pinMsg, setPinMsg] = useState("");
  const [pinOk, setPinOk] = useState(false);
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

  const checkPin = () => {
    if (/^\d{6}$/.test(pin)) {
      setPinOk(true);
      setPinMsg("Delivery available! Ships in 5-7 working days.");
    } else {
      setPinOk(false);
      setPinMsg("Please enter a valid 6-digit PIN code.");
    }
  };

  const savePercent = discountPercent && discountPercent > 0 ? Math.round(discountPercent) : 0;

  return (
    <div>
      {/* Head row: title + wishlist */}
      <div className="pdp__head">
        <div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {categoryName}
          </p>
          <h1 className="pdp__title">{name}</h1>
        </div>
        <button
          className="icon-btn"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => { setWishlisted((w) => !w); toast(wishlisted ? "Removed from wishlist" : "Saved to wishlist ♡"); }}
          style={{ color: wishlisted ? "var(--danger)" : undefined, flexShrink: 0 }}
        >
          <Heart size={18} fill={wishlisted ? "var(--danger)" : "none"} aria-hidden="true" />
        </button>
      </div>

      {/* v2 Price block */}
      <div className="pdp__price">
        <span className="now">{formatINR(price)}</span>
        {savePercent > 0 && (
          <>
            <span className="mrp">MRP <s>{formatINR(originalPrice)}</s></span>
            <span className="badge-save">SAVE {savePercent}%</span>
          </>
        )}
      </div>
      <p className="pdp__gst">GST Included · Free shipping on orders ₹999+</p>

      {/* Description */}
      <p style={{ lineHeight: 1.7, color: "var(--text)", marginBottom: 16, fontSize: "0.95rem" }}>{description}</p>

      {/* Cream info chips */}
      <div className="chips">
        <span className="chip-info">✋ Handmade in India</span>
        <span className="chip-info">100% Cotton Yarn</span>
        <span className="chip-info">Made to Order</span>
      </div>

      {/* Policy line */}
      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 16 }}>
        🔄 Easy exchange within 7 days · Ships in 5–7 working days
      </p>

      {/* Pincode / delivery check */}
      <div className="pincode">
        <MapPin size={18} aria-hidden="true" style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        <input 
          type="text" 
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter pincode for delivery info" 
          style={{ fontSize: "0.9rem", color: "var(--text)", border: "none", outline: "none", background: "transparent", flex: 1, padding: 0 }}
        />
        <button type="button" onClick={checkPin} style={{ color: "var(--mint)", fontWeight: 600 }}>Check</button>
      </div>
      {pinMsg && (
        <p style={{ marginTop: 8, fontSize: "0.85rem", color: pinOk ? "var(--mint)" : "var(--danger)", fontWeight: 500 }}>
          {pinMsg}
        </p>
      )}

      {/* Color options */}
      {colors && colors.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontWeight: 600, marginBottom: 8, fontSize: "0.9rem" }}>
            Colour: <strong>{selectedColor}</strong>
          </p>
          <div className="options">
            {colors.map((c) => (
              <button
                key={c}
                className={`option${selectedColor === c ? " is-selected" : ""}`}
                aria-pressed={selectedColor === c}
                onClick={() => setSelectedColor(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity label */}
      <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 8, marginTop: colors && colors.length > 0 ? 0 : 16 }}>
        Quantity
      </p>

      {/* v2 Buy row: qty stepper + Add to cart */}
      <div className="buy-row">
        <div className="qty">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span style={{ width: "48px", textAlign: "center", fontWeight: 600, fontSize: "1rem" }} aria-label="Quantity">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
        <button className="btn btn--wide" onClick={handleAdd}>
          Add to cart
        </button>
      </div>

      {/* v2 Tabs: More Details | Shipping & Return */}
      <div className="tabs" role="tablist" aria-label="Product information">
        <button
          role="tab"
          aria-selected={activeTab === "details"}
          onClick={() => setActiveTab("details")}
        >
          More Details
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "shipping"}
          onClick={() => setActiveTab("shipping")}
        >
          Shipping &amp; Return
        </button>
      </div>

      <div className="tab-panel" role="tabpanel">
        {activeTab === "details" ? (
          <div>
            <p>{description}</p>
            <ul style={{ paddingLeft: "1.2em", marginTop: 12, lineHeight: 1.8 }}>
              <li>100% cotton yarn — soft, durable, hypoallergenic</li>
              <li>Crocheted by hand in Kanniyakumari, India</li>
              <li>Made to order — allow 5–7 working days</li>
              <li>Perfect as a gift — gift wrapping available on request</li>
            </ul>
          </div>
        ) : (
          <div>
            <p><strong>Shipping:</strong> Free on orders over ₹999. Standard delivery in 5–7 working days across India.</p>
            <p style={{ marginTop: 12 }}><strong>Returns &amp; Exchanges:</strong> We accept exchanges within 7 days of delivery for unused items. Custom / made-to-order items cannot be returned unless defective.</p>
            <p style={{ marginTop: 12 }}><strong>Packaging:</strong> Gift-wrapped in recycled tissue. We&apos;d love to add a personalised note — just mention it at checkout.</p>
          </div>
        )}
      </div>
    </div>
  );
}
