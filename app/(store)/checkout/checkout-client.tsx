"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { formatINR, phClass } from "@/lib/utils";
import Image from "next/image";

interface CheckoutFormProps {
  shippingFee: number;
  codEnabled: boolean;
  razorpayKeyId: string;
}

export function CheckoutForm({ shippingFee, codEnabled, razorpayKeyId }: CheckoutFormProps) {
  const { items, subtotal, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [appliedCouponId, setAppliedCouponId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "",
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

  const handleSubmit = async () => {
    if (!validate()) return;
    if (items.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId, quantity: i.quantity,
            customization: i.customization,
          })),
          contact: {
            fullName: form.fullName, phone: form.phone, email: form.email,
          },
          address: {
            line1: form.address, city: form.city,
            state: form.state, pincode: form.pincode,
          },
          paymentMethod,
          discountId: appliedCouponId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? "Checkout failed. Please try again.");
        setLoading(false);
        return;
      }

      if (paymentMethod === "COD") {
        clearCart();
        window.location.href = `/order/${data.orderNumber}/success`;
        return;
      }

      // Razorpay
      const rzp = new (window as unknown as { Razorpay: new (opts: unknown) => { open(): void } }).Razorpay({
        key: razorpayKeyId,
        order_id: data.razorpayOrderId,
        amount: data.amount,
        currency: "INR",
        name: "Oviya's Crochet",
        description: "Handmade crochet order",
        prefill: { name: form.fullName, email: form.email, contact: form.phone },
        theme: { color: "#6F4FB0" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
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
          if (verifyRes.ok) {
            clearCart();
            window.location.href = `/order/${data.orderNumber}/success`;
          } else {
            alert("Payment verification failed. Please contact support.");
          }
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
      {/* Delivery details */}
      <div className="box">
        <h2 className="text-box-h2" style={{ marginBottom: 16 }}>Delivery details</h2>
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
      </div>

      {/* Order summary */}
      <div className="box">
        <h2 className="text-box-h2" style={{ marginBottom: 16 }}>Your order</h2>

        {/* Line items */}
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
          <button className="btn btn-alt btn-sm" onClick={applyCoupon} type="button">
            Apply
          </button>
        </div>
        {couponMessage && (
          <p style={{
            fontSize: 13, marginBottom: 8,
            color: couponDiscount > 0 ? "var(--pri)" : "#c53030",
          }}>
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
          fontFamily: "Baloo 2", fontWeight: 700, fontSize: 18,
          borderTop: "2px dashed var(--line)", paddingTop: 10, marginTop: 6,
        }}>
          <span>Total</span>
          <span>{formatINR(total)}</span>
        </div>

        {/* Payment method */}
        {codEnabled && (
          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
              <input
                type="radio"
                name="payment"
                value="RAZORPAY"
                checked={paymentMethod === "RAZORPAY"}
                onChange={() => setPaymentMethod("RAZORPAY")}
              />
              Pay online
            </label>
            <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
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
          {paymentMethod === "RAZORPAY"
            ? "UPI, cards and netbanking accepted"
            : "Pay when your order arrives"}
        </p>
      </div>
    </div>
  );
}
