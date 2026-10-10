"use client";

import { useEffect, useRef } from "react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import { formatINR, phClass } from "@/lib/utils";
import { YarnMascotSleepy } from "@/components/ui/yarn-mascot";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } =
    useCartStore();
  const overlayRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Trap focus and scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      drawerRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCart]);

  const total = subtotal();

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={closeCart}
        aria-hidden="true"
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(2px)",
          zIndex: 80,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.25s",
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        style={{
          position: "fixed",
          top: 0, right: 0, bottom: 0,
          width: "min(400px, 100vw)",
          background: "var(--surface)",
          zIndex: 90,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          borderLeft: "2px solid var(--line)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "16px 20px",
          borderBottom: "2px dashed var(--line)",
        }}>
          <ShoppingBag size={20} aria-hidden="true" />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 20, flex: 1 }}>
            Your cart
          </span>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            style={{
              border: 0, background: "none", cursor: "pointer",
              padding: 8, borderRadius: "var(--r-pill)",
              color: "var(--mute)",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {items.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 16, height: "100%", color: "var(--mute)",
              textAlign: "center",
            }}>
              <YarnMascotSleepy size={80} />
              <p style={{ fontWeight: 500 }}>Your cart is empty</p>
              <p style={{ fontSize: 13 }}>Add something handmade to get started!</p>
              <Link href="/shop" className="btn btn-sm" onClick={closeCart}>
                Browse the shop
              </Link>
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item, i) => (
                <li key={item.productId} style={{
                  display: "flex", gap: 12, alignItems: "center",
                  padding: 12, borderRadius: 16,
                  background: "var(--bg)",
                  border: "1px solid var(--line)",
                }}>
                  {/* Thumbnail */}
                  <div className={`ph ${phClass(i)}`} style={{
                    width: 64, height: 64, flexShrink: 0,
                    borderRadius: 12, position: "relative", overflow: "hidden",
                  }}>
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} sizes="64px" />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name}
                    </p>
                    <p style={{ fontWeight: 700, color: "var(--color-cotton-candy)", fontSize: 15 }}>
                      {formatINR(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Quantity + Remove */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div className="qty-stepper">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        style={{ width: 32, height: 32, fontSize: 16 }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ padding: "0 10px", fontWeight: 700, fontSize: 14 }}>{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                        style={{ width: 32, height: 32, fontSize: 16 }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Remove ${item.name} from cart`}
                      style={{
                        border: 0, background: "none", cursor: "pointer",
                        color: "var(--mute)", fontSize: 11, padding: 2,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--line)",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            {/* Free-shipping progress bar (guide §4.9) */}
            {(() => {
              const FREE_SHIPPING_THRESHOLD = 999;
              const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
              const pct = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));
              return (
                <div className="shipping-progress">
                  {remaining > 0
                    ? <span>₹{remaining.toLocaleString("en-IN")} away from free shipping 🚚</span>
                    : <span style={{ color: "var(--mint-deep)", fontWeight: 600 }}>You&apos;ve unlocked free shipping! 🎉</span>
                  }
                  <div className="shipping-progress__bar">
                    <span className="shipping-progress__fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })()}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--mute)", fontSize: 14 }}>Subtotal</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 20 }}>
                {formatINR(total)}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "var(--mute)", margin: 0 }}>
              Shipping and discounts calculated at checkout.
            </p>
            <Link
              href="/checkout"
              className="btn"
              style={{ textAlign: "center" }}
              onClick={closeCart}
            >
              Proceed to checkout
            </Link>
            <Link
              href="/cart"
              className="btn btn-alt btn-sm"
              style={{ textAlign: "center" }}
              onClick={closeCart}
            >
              View cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
