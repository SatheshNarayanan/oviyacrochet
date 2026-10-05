"use client";

import { useState } from "react";
import Image from "next/image";
import { formatINR, phClass } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

const ORDER_STATUSES = [
  { value: "PLACED", label: "Placed" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "IN_PRODUCTION", label: "In production" },
  { value: "READY_TO_SHIP", label: "Ready to ship" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
];

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  status: string;
  paymentMethod: string;
  isSeenByAdmin: boolean;
  createdAt: string;
  shippingAddress: Record<string, string>;
  items: { id: string; name: string; quantity: number; price: number; image: string }[];
}

interface AdminData {
  orders: Order[];
  stats: { newCount: number; weekRevenue: number; inProduction: number };
}

export function AdminOrdersClient({ data }: { data: AdminData }) {
  const [orders, setOrders] = useState(data.orders);
  const [selected, setSelected] = useState<Order | null>(orders[0] ?? null);
  const [newStatus, setNewStatus] = useState(selected?.status ?? "PLACED");
  const [note, setNote] = useState("");
  const [tracking, setTracking] = useState("");
  const [courier, setCourier] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();

  const selectOrder = async (order: Order) => {
    setSelected(order);
    setNewStatus(order.status);
    setNote("");
    setTracking("");
    setCourier("");
    // Mark as seen
    if (!order.isSeenByAdmin) {
      await fetch("/api/admin/orders/mark-seen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      }).catch(() => {});
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, isSeenByAdmin: true } : o))
      );
    }
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selected.id,
          status: newStatus,
          note,
          trackingNumber: tracking || undefined,
          courierName: courier || undefined,
        }),
      });
      if (res.ok) {
        const updatedOrder = { ...selected, status: newStatus };
        setOrders((prev) =>
          prev.map((o) => (o.id === selected.id ? updatedOrder : o))
        );
        setSelected(updatedOrder);
        toast(`Status updated to ${ORDER_STATUSES.find(s => s.value === newStatus)?.label}. Email sent to ${selected.customerEmail}`, "success");
        setShowConfirm(false);
        setNote("");
        setTracking("");
        setCourier("");
      } else {
        toast("Failed to update order status.", "error");
      }
    } catch {
      toast("Error updating status.", "error");
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = (status: string) =>
    ORDER_STATUSES.find((s) => s.value === status)?.label ?? status;

  return (
    <>
      {/* Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 8, marginBottom: 20,
      }}>
        {[
          { label: "New orders", value: data.stats.newCount },
          { label: "This week", value: formatINR(data.stats.weekRevenue) },
          { label: "In production", value: data.stats.inProduction },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <b style={{ display: "block", fontFamily: "Baloo 2", fontSize: 22, fontWeight: 700 }}>
              {stat.value}
            </b>
            <span style={{ color: "var(--mute)", fontSize: 12 }}>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="admin-layout" style={{ padding: 0 }}>
        {/* Orders list */}
        <div>
          <h2 className="text-box-h2" style={{ marginBottom: 12 }}>Orders</h2>
          {orders.length === 0 ? (
            <p style={{ color: "var(--mute)" }}>No orders yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {orders.map((order) => (
                <button
                  key={order.id}
                  className={`order-card ${selected?.id === order.id ? "selected" : ""}`}
                  onClick={() => selectOrder(order)}
                  id={`order-${order.id}`}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b style={{ display: "block", fontSize: 14 }}>{order.orderNumber}</b>
                    <small style={{ color: "var(--mute)" }}>
                      {order.customerName}, {formatINR(order.total)}
                    </small>
                  </div>
                  {!order.isSeenByAdmin ? (
                    <span className="badge-new">NEW</span>
                  ) : (
                    <span className="status-pill">{statusLabel(order.status)}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Order detail */}
        {selected && (
          <div className="box">
            <h2 className="text-box-h2" style={{ marginBottom: 4 }}>{selected.customerName}</h2>
            <p style={{ color: "var(--mute)", fontSize: 14, margin: "0 0 4px" }}>
              {selected.shippingAddress.line1}, {selected.shippingAddress.city}{" "}
              {selected.shippingAddress.pincode}
            </p>
            <p style={{ color: "var(--mute)", fontSize: 14, margin: "0 0 16px" }}>
              {selected.customerPhone}
            </p>

            {/* Items */}
            <ul style={{ listStyle: "none", margin: "0 0 16px", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {selected.items.map((item, i) => (
                <li key={item.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div className={`ph ${phClass(i)}`} style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 10, position: "relative", overflow: "hidden" }}>
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill sizes="48px" style={{ objectFit: "cover" }} />
                    )}
                  </div>
                  <span style={{ flex: 1, fontSize: 14 }}>{item.name} ×{item.quantity}</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{formatINR(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <hr className="stitched-divider" />

            {/* Status update */}
            <label htmlFor="status-select" style={{ fontWeight: 600, fontSize: 14 }}>
              Order status
            </label>
            <select
              id="status-select"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              style={{
                width: "100%",
                border: "2px solid var(--pri)",
                borderRadius: 12,
                padding: "10px",
                background: "var(--bg)",
                minHeight: 44,
                margin: "8px 0",
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <p style={{ fontSize: 13, color: "var(--mute)", margin: "0 0 12px" }}>
              Changing the status emails{" "}
              <strong>{selected.customerEmail}</strong>.
            </p>

            <button
              className="btn"
              style={{ width: "100%" }}
              onClick={() => setShowConfirm(true)}
              id="update-send-email-btn"
            >
              Update and send email
            </button>

            {/* Confirmation dialog */}
            {showConfirm && (
              <div style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
                zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
                padding: 16,
              }}>
                <div className="box" style={{ maxWidth: 420, width: "100%", position: "relative" }}>
                  <h3 className="text-box-h2" style={{ marginBottom: 12 }}>Confirm status update</h3>
                  <p style={{ fontSize: 14, marginBottom: 16 }}>
                    Setting order <strong>{selected.orderNumber}</strong> to{" "}
                    <strong>{statusLabel(newStatus)}</strong> will send an email to{" "}
                    <strong>{selected.customerEmail}</strong>.
                  </p>

                  <label className="form-label" style={{ marginBottom: 12 }}>
                    Note to customer (optional)
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      className="input"
                      placeholder="Any special message..."
                    />
                  </label>

                  {newStatus === "SHIPPED" && (
                    <>
                      <label className="form-label" style={{ marginBottom: 12 }}>
                        Tracking number
                        <input className="input" value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="e.g. IN123456789" />
                      </label>
                      <label className="form-label" style={{ marginBottom: 16 }}>
                        Courier name
                        <input className="input" value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="e.g. Delhivery, DTDC" />
                      </label>
                    </>
                  )}

                  <div style={{ display: "flex", gap: 12 }}>
                    <button className="btn" style={{ flex: 1 }} onClick={handleUpdate} disabled={loading}>
                      {loading ? "Sending…" : "Confirm & send"}
                    </button>
                    <button className="btn btn-alt" style={{ flex: 1 }} onClick={() => setShowConfirm(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
