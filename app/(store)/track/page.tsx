"use client";

import { useState } from "react";

export default function TrackPage() {
  const [form, setForm] = useState({ orderNumber: "", email: "" });
  const [result, setResult] = useState<null | { found: boolean; data?: Record<string, string> }>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(form.orderNumber)}&email=${encodeURIComponent(form.email)}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  };

  const STATUS_LABELS: Record<string, string> = {
    PENDING_PAYMENT: "Awaiting payment",
    PLACED: "Order placed",
    CONFIRMED: "Confirmed",
    IN_PRODUCTION: "Being crocheted ✨",
    READY_TO_SHIP: "Ready to ship",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered 🎉",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px var(--pad-mobile)" }}>
      <h1 className="text-section" style={{ marginBottom: 8 }}>Track your order</h1>
      <p style={{ color: "var(--mute)", marginBottom: 24, fontSize: 14 }}>
        Enter your order number and email address to see your order status.
      </p>

      <form onSubmit={handleSubmit} className="box" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label className="form-label">
          Order number
          <input
            className="input"
            placeholder="OC-2026-000001"
            value={form.orderNumber}
            onChange={(e) => setForm((f) => ({ ...f, orderNumber: e.target.value }))}
            required
          />
        </label>
        <label className="form-label">
          Email address
          <input
            className="input"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
        </label>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Looking up…" : "Track order"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          {!result.found ? (
            <div className="box" style={{ textAlign: "center", color: "var(--mute)" }}>
              <p>No order found with those details. Please check and try again.</p>
            </div>
          ) : (
            <div className="box">
              <p style={{ fontSize: 13, color: "var(--mute)", marginBottom: 4 }}>ORDER NUMBER</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 18, color: "var(--color-cotton-candy)", marginBottom: 16 }}>
                {result.data?.orderNumber}
              </p>
              <div style={{ background: "var(--lav)", borderRadius: 12, padding: "12px 16px", marginBottom: 12 }}>
                <p style={{ fontWeight: 700, fontSize: 16 }}>
                  {STATUS_LABELS[result.data?.status ?? ""] ?? result.data?.status}
                </p>
              </div>
              {result.data?.trackingNumber && (
                <div className="mint-note">
                  📦 Tracking: <strong>{result.data.trackingNumber}</strong>
                  {result.data.courierName && ` via ${result.data.courierName}`}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
