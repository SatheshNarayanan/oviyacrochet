"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { User, MapPin, Package, LogOut, Plus, Trash2, Star, ChevronRight } from "lucide-react";

interface Address {
  id: string; fullName: string; phone: string;
  line1: string; line2: string; city: string;
  state: string; pincode: string; isDefault: boolean;
}
interface OrderItem { nameSnapshot: string; quantity: number; }
interface Order {
  id: string; orderNumber: string; status: string;
  total: number; createdAt: string; items: OrderItem[];
}
interface Props {
  user: { id: string; name: string; email: string; phone: string };
  addresses: Address[];
  orders: Order[];
}

const STATUS_COLOR: Record<string, string> = {
  PENDING_PAYMENT: "#f59e0b", PLACED: "#6F4FB0", CONFIRMED: "#6F4FB0",
  IN_PRODUCTION: "#3b82f6", READY_TO_SHIP: "#8b5cf6", SHIPPED: "#10b981",
  DELIVERED: "#10b981", CANCELLED: "#ef4444", REFUNDED: "#6b7280",
};
const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "Pending payment", PLACED: "Order placed", CONFIRMED: "Confirmed",
  IN_PRODUCTION: "In production", READY_TO_SHIP: "Ready to ship", SHIPPED: "Shipped",
  DELIVERED: "Delivered", CANCELLED: "Cancelled", REFUNDED: "Refunded",
};

export function AccountClient({ user, addresses: initialAddresses, orders }: Props) {
  const [tab, setTab] = useState<"profile" | "addresses" | "orders">("profile");
  const [addresses, setAddresses] = useState(initialAddresses);
  const [deleting, setDeleting] = useState<string | null>(null);

  const deleteAddress = async (id: string) => {
    if (!confirm("Remove this address?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/auth/address/${id}`, { method: "DELETE" });
      if (res.ok) setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch { /* ignore */ } finally {
      setDeleting(null);
    }
  };

  const setDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/auth/address/${id}/default`, { method: "PATCH" });
      if (res.ok) setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    } catch { /* ignore */ }
  };

  const tabBtn = (t: typeof tab, label: string, Icon: React.ElementType) => (
    <button
      onClick={() => setTab(t)}
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
        background: tab === t ? "var(--pri)" : "transparent",
        color: tab === t ? "#fff" : "var(--ink)",
        border: "none", borderRadius: 10, cursor: "pointer",
        fontFamily: "inherit", fontWeight: 600, fontSize: 14, transition: "all 0.2s",
        flex: 1, justifyContent: "center",
      }}
    >
      <Icon size={15} /> {label}
    </button>
  );

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px var(--pad-mobile) 60px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 2px" }}>Hi, {user.name.split(" ")[0]} 👋</h1>
          <p style={{ color: "var(--mute)", fontSize: 13, margin: 0 }}>{user.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="btn btn-sm btn-alt"
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <LogOut size={13} /> Sign out
        </button>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 8, background: "var(--surface)", padding: 6, borderRadius: 14, marginBottom: 20 }}>
        {tabBtn("profile", "Profile", User)}
        {tabBtn("addresses", "Addresses", MapPin)}
        {tabBtn("orders", "Orders", Package)}
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <div className="box" style={{ padding: 24 }}>
          <h2 className="text-box-h2" style={{ marginBottom: 16 }}>Account details</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Name", value: user.name },
              { label: "Email", value: user.email },
              { label: "Phone", value: user.phone || "—" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                <span style={{ fontSize: 13, color: "var(--mute)", fontWeight: 500 }}>{label}</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{value}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--mute)", marginTop: 16 }}>
            To update your details, contact us at{" "}
            <a href="mailto:hello@oviyas.in" style={{ color: "var(--pri)" }}>hello@oviyas.in</a>
          </p>
        </div>
      )}

      {/* Addresses tab */}
      {tab === "addresses" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {addresses.length === 0 ? (
            <div className="box" style={{ padding: 32, textAlign: "center" }}>
              <MapPin size={32} style={{ color: "var(--mute)", marginBottom: 10 }} />
              <p style={{ color: "var(--mute)", marginBottom: 16 }}>No saved addresses yet.</p>
              <Link href="/account/address/new" className="btn btn-sm">
                <Plus size={14} /> Add address
              </Link>
            </div>
          ) : (
            <>
              {addresses.map((a) => (
                <div key={a.id} className="box" style={{ padding: 18, position: "relative", borderColor: a.isDefault ? "var(--pri)" : undefined }}>
                  {a.isDefault && (
                    <span style={{ position: "absolute", top: 12, right: 12, background: "var(--pri)", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 8px" }}>
                      Default
                    </span>
                  )}
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>{a.fullName}</p>
                  <p style={{ fontSize: 13, color: "var(--mute)", lineHeight: 1.6 }}>
                    {a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />
                    {a.city}, {a.state} — {a.pincode}<br />
                    📞 {a.phone}
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    {!a.isDefault && (
                      <button onClick={() => setDefault(a.id)} className="btn btn-sm btn-alt"
                        style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                        <Star size={12} /> Set default
                      </button>
                    )}
                    <button onClick={() => deleteAddress(a.id)} disabled={deleting === a.id}
                      style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, background: "none", border: "1.5px solid var(--line)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "var(--pink)", fontFamily: "inherit" }}>
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}
              <Link href="/account/address/new" className="btn btn-alt"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Plus size={14} /> Add new address
              </Link>
            </>
          )}
        </div>
      )}

      {/* Orders tab */}
      {tab === "orders" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.length === 0 ? (
            <div className="box" style={{ padding: 32, textAlign: "center" }}>
              <Package size={32} style={{ color: "var(--mute)", marginBottom: 10 }} />
              <p style={{ color: "var(--mute)", marginBottom: 16 }}>No orders yet.</p>
              <Link href="/shop" className="btn btn-sm">Start shopping</Link>
            </div>
          ) : (
            orders.map((o) => (
              <Link key={o.id} href={`/track?orderNumber=${o.orderNumber}`}
                style={{ textDecoration: "none", color: "inherit" }}>
                <div className="box" style={{ padding: 18, display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>#{o.orderNumber}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 8px",
                        background: `${STATUS_COLOR[o.status] ?? "#888"}20`,
                        color: STATUS_COLOR[o.status] ?? "#888",
                      }}>
                        {STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--mute)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {o.items.map((i) => `${i.nameSnapshot} ×${i.quantity}`).join(", ")}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--mute)", margin: "4px 0 0" }}>
                      {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontWeight: 400, fontFamily: "var(--font-display)" }}>₹{o.total.toLocaleString("en-IN")}</p>
                    <ChevronRight size={16} style={{ color: "var(--mute)" }} />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
