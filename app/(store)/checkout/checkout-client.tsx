"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { formatINR, phClass } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Plus, Check } from "lucide-react";

interface SavedAddress {
  id: string; fullName: string; phone: string;
  line1: string; line2: string | null; city: string;
  state: string; pincode: string; isDefault: boolean;
}

interface CheckoutFormProps {
  shippingFee: number;
  codEnabled: boolean;
  razorpayKeyId: string;
  savedAddresses?: SavedAddress[];
  userEmail?: string;
  userName?: string;
}

export function CheckoutForm({
  shippingFee, codEnabled, razorpayKeyId,
  savedAddresses = [], userEmail = "", userName = "",
}: CheckoutFormProps) {
  const { items, subtotal, clearCart } = useCartStore();

  const hasSaved = savedAddresses.length > 0;
  const defaultAddr = savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0];

  // Address mode: "saved" (pick from list) | "new" (manual form)
  const [addrMode, setAddrMode] = useState<"saved" | "new">(hasSaved ? "saved" : "new");
  const [selectedAddrId, setSelectedAddrId] = useState<string>(defaultAddr?.id ?? "");

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [appliedCouponId, setAppliedCouponId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: userName, phone: "", email: userEmail,
    pincode: "", address: "", city: "", state: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sub = subtotal();
  const freeShipping = sub >= 1000;
  const shipping = freeShipping ? 0 : shippingFee;
  const total = Math.max(0, sub - couponDiscount + shipping);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal: sub }),
      });
      const data = await res.json();
      if (data.ok) {
        setCouponDiscount(data.saving);
        setAppliedCouponId(data.discountId);
        setCouponMessage(`✓ ${data.name} applied — saving ${formatINR(data.saving)}`);
      } else {
        setCouponMessage(data.error ?? "Invalid coupon code.");
        setCouponDiscount(0);
        setAppliedCouponId(null);
      }
    } catch {
      setCouponMessage("Could not validate coupon. Try again.");
    }
  };

  const validate = () => {
    if (addrMode === "saved") {
      const e: Record<string, string> = {};
      if (!selectedAddrId) e.savedAddr = "Please select a delivery address.";
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address.";
      setErrors(e);
      return Object.keys(e).length === 0;
    }
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid 10-digit phone number.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email address.";
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode))
      e.pincode = "Enter a valid 6-digit PIN code.";
    if (!form.address.trim()) e.address = "Address is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.state.trim()) e.state = "State is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildContactAndAddress = () => {
    if (addrMode === "saved") {
      const addr = savedAddresses.find((a) => a.id === selectedAddrId)!;
      return {
        contact: { fullName: addr.fullName, phone: addr.phone, email: form.email },
        address: {
          line1: addr.line1, line2: addr.line2 ?? undefined,
          city: addr.city, state: addr.state, pincode: addr.pincode,
        },
      };
    }
    return {
      contact: { fullName: form.fullName, phone: form.phone, email: form.email },
      address: {
        line1: form.address, city: form.city, state: form.state, pincode: form.pincode,
      },
    };
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (items.length === 0) return;
    setLoading(true);

    try {
      const { contact, address } = buildContactAndAddress();
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId, quantity: i.quantity, customization: i.customization,
          })),
          contact, address, paymentMethod, discountId: appliedCouponId,
        }),
      });

      const data = await res.json();
      if (!res.ok) { alert(data.error ?? "Checkout failed. Please try again."); setLoading(false); return; }

      if (paymentMethod === "COD" || data.demo) {
        clearCart();
        window.location.href = `/order/${data.orderNumber}/success`;
        return;
      }

      const rzp = new (window as unknown as { Razorpay: new (opts: unknown) => { open(): void } }).Razorpay({
        key: razorpayKeyId,
        order_id: data.razorpayOrderId,
        amount: data.amount,
        currency: "INR",
        name: "Oviya's Crochet",
        description: "Handmade crochet order",
        prefill: { name: contact.fullName, email: contact.email, contact: contact.phone },
        theme: { color: "#6F4FB0" },
        handler: async (response: {
          razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payments/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          if (verifyRes.ok) { clearCart(); window.location.href = `/order/${data.orderNumber}/success`; }
          else alert("Payment verification failed. Please contact support.");
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, label: string, type = "text", inputMode?: string) => (
    <label className="form-label" htmlFor={`field-${key}`}>
      {label}
      <input
        id={`field-${key}`}
        type={type}
        inputMode={inputMode as React.HTMLAttributes<HTMLInputElement>["inputMode"]}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className={`input ${errors[key] ? "error" : ""}`}
        aria-describedby={errors[key] ? `err-${key}` : undefined}
        aria-invalid={!!errors[key]}
      />
      {errors[key] && (
        <span id={`err-${key}`} role="alert" style={{ color: "#c53030", fontSize: 12 }}>
          {errors[key]}
        </span>
      )}
    </label>
  );

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--mute)" }}>
        <p style={{ marginBottom: 16 }}>Your cart is empty.</p>
        <a href="/shop" className="btn btn-alt">Browse the shop</a>
      </div>
    );
  }

  return (
    <div className="checkout-grid">
      {/* ── Delivery details ── */}
      <div className="box">
        <h2 className="text-box-h2" style={{ marginBottom: 16 }}>Delivery details</h2>

        {/* Address mode toggle — only if user has saved addresses */}
        {hasSaved && (
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => setAddrMode("saved")}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                border: `2px solid ${addrMode === "saved" ? "var(--pri)" : "var(--line)"}`,
                background: addrMode === "saved" ? "color-mix(in srgb, var(--pri) 8%, var(--bg))" : "var(--bg)",
                color: addrMode === "saved" ? "var(--pri)" : "var(--mute)",
                fontWeight: 600, fontSize: 13, fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <MapPin size={14} /> Saved address
            </button>
            <button
              type="button"
              onClick={() => setAddrMode("new")}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                border: `2px solid ${addrMode === "new" ? "var(--pri)" : "var(--line)"}`,
                background: addrMode === "new" ? "color-mix(in srgb, var(--pri) 8%, var(--bg))" : "var(--bg)",
                color: addrMode === "new" ? "var(--pri)" : "var(--mute)",
                fontWeight: 600, fontSize: 13, fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <Plus size={14} /> New address
            </button>
          </div>
        )}

        {/* Saved address picker */}
        {addrMode === "saved" && hasSaved && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {savedAddresses.map((addr) => (
              <button
                key={addr.id}
                type="button"
                onClick={() => setSelectedAddrId(addr.id)}
                style={{
                  width: "100%", textAlign: "left", padding: "14px 16px", borderRadius: 12,
                  border: `2px solid ${selectedAddrId === addr.id ? "var(--pri)" : "var(--line)"}`,
                  background: selectedAddrId === addr.id
                    ? "color-mix(in srgb, var(--pri) 6%, var(--bg))"
                    : "var(--bg)",
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", gap: 12, alignItems: "flex-start",
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                  border: `2px solid ${selectedAddrId === addr.id ? "var(--pri)" : "var(--line)"}`,
                  background: selectedAddrId === addr.id ? "var(--pri)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {selectedAddrId === addr.id && <Check size={11} color="white" strokeWidth={3} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{addr.fullName}</span>
                    {addr.isDefault && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, background: "var(--pri)",
                        color: "#fff", borderRadius: 4, padding: "1px 6px",
                      }}>Default</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--mute)", margin: 0, lineHeight: 1.5 }}>
                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--mute)", margin: "2px 0 0" }}>📞 {addr.phone}</p>
                </div>
              </button>
            ))}
            {errors.savedAddr && (
              <span style={{ color: "#c53030", fontSize: 12 }}>{errors.savedAddr}</span>
            )}

            {/* Manage addresses link */}
            <Link href="/account" style={{ fontSize: 13, color: "var(--pri)", fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={12} /> Manage saved addresses
            </Link>

            {/* Email still needed even with saved address */}
            <div style={{ marginTop: 8 }}>
              {field("email", "Email address (for order updates)", "email", "email")}
            </div>
          </div>
        )}

        {/* New / manual address form */}
        {addrMode === "new" && (
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
            {field("fullName", "Full name")}
            {field("phone", "Phone", "tel", "tel")}
            {field("email", "Email", "email", "email")}
            {field("pincode", "PIN code", "text", "numeric")}
            <div style={{ gridColumn: "1 / -1" }}>
              {field("address", "Address")}
            </div>
            {field("city", "City")}
            {field("state", "State")}
          </div>
        )}

        {/* Not logged in nudge */}
        {!hasSaved && !userEmail && (
          <p style={{ fontSize: 13, color: "var(--mute)", marginTop: 12 }}>
            <Link href="/account/login?callbackUrl=/checkout" style={{ color: "var(--pri)", fontWeight: 600 }}>
              Sign in
            </Link>{" "}
            to use your saved addresses at checkout.
          </p>
        )}
      </div>

      {/* ── Order summary ── */}
      <div className="box">
        <h2 className="text-box-h2" style={{ marginBottom: 16 }}>Your order</h2>

        <ul style={{ listStyle: "none", margin: "0 0 16px", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item, i) => (
            <li key={item.productId} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div className={`ph ${phClass(i)}`} style={{ width: 56, height: 56, flexShrink: 0, borderRadius: 12, position: "relative", overflow: "hidden" }}>
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="56px" style={{ objectFit: "cover" }} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                <p style={{ fontSize: 12, color: "var(--mute)" }}>Qty {item.quantity}</p>
              </div>
              <p style={{ fontWeight: 700 }}>{formatINR(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>

        {/* Coupon */}
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            aria-label="Coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Coupon code"
            className="input-pill"
            style={{ flex: 1 }}
            onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
          />
          <button className="btn btn-alt btn-sm" onClick={applyCoupon} type="button">Apply</button>
        </div>
        {couponMessage && (
          <p style={{ fontSize: 13, marginBottom: 8, color: couponDiscount > 0 ? "var(--pri)" : "#c53030" }}>
            {couponMessage}
          </p>
        )}

        {/* Totals */}
        <hr className="stitched-divider" />
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ color: "var(--mute)", fontSize: 14 }}>Subtotal</span>
          <span>{formatINR(sub)}</span>
        </div>
        {couponDiscount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "var(--pri)" }}>
            <span style={{ fontSize: 14 }}>Coupon discount</span>
            <span>−{formatINR(couponDiscount)}</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ color: "var(--mute)", fontSize: 14 }}>Shipping</span>
          <span>{freeShipping ? <span style={{ color: "var(--pri)" }}>Free!</span> : formatINR(shipping)}</span>
        </div>
        {freeShipping && (
          <p style={{ fontSize: 12, color: "var(--pri)", marginBottom: 8 }}>
            ✓ Free shipping on orders above ₹1,000
          </p>
        )}
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 18,
          borderTop: "2px solid var(--color-pewter-gray)", paddingTop: 10, marginTop: 6,
        }}>
          <span>Total</span>
          <span>{formatINR(total)}</span>
        </div>

        {/* Payment method */}
        {codEnabled && (
          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
              <input type="radio" name="payment" value="RAZORPAY" checked={paymentMethod === "RAZORPAY"} onChange={() => setPaymentMethod("RAZORPAY")} />
              Pay online
            </label>
            <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
              <input type="radio" name="payment" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
              Cash on delivery
            </label>
          </div>
        )}

        <button
          className="btn"
          style={{ width: "100%", marginTop: 16, fontSize: 16 }}
          onClick={handleSubmit}
          disabled={loading}
          id="checkout-pay-btn"
        >
          {loading
            ? "Processing…"
            : paymentMethod === "COD"
            ? `Place order — ${formatINR(total)}`
            : `Pay ${formatINR(total)} with Razorpay`}
        </button>
        <p style={{ fontSize: 12, color: "var(--mute)", textAlign: "center", marginTop: 8 }}>
          {paymentMethod === "RAZORPAY" ? "UPI, cards and netbanking accepted" : "Pay when your order arrives"}
        </p>
      </div>
    </div>
  );
}
