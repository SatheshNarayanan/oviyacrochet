"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Search,
  ShoppingBag,
  CreditCard,
  Truck,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type { Customer, CustomerOrder, CustomersAdminData } from "./page";

const STATUS_BADGES: Record<string, { bg: string; color: string; label: string }> = {
  PLACED: { bg: "#EBF5FF", color: "#1E429F", label: "Placed" },
  CONFIRMED: { bg: "#DEF7EC", color: "#03543F", label: "Confirmed" },
  IN_PRODUCTION: { bg: "#FDF2F8", color: "#99154B", label: "In Production" },
  READY_TO_SHIP: { bg: "#FEF08A", color: "#854D0E", label: "Ready to Ship" },
  SHIPPED: { bg: "#E1EFFE", color: "#1A56DB", label: "Shipped" },
  DELIVERED: { bg: "#D1E7DD", color: "#0F5132", label: "Delivered" },
  CANCELLED: { bg: "#FDE8E8", color: "#9B1C1C", label: "Cancelled" },
  REFUNDED: { bg: "#EDEBFE", color: "#5521B5", label: "Refunded" },
};

export function AdminCustomersClient({ data }: { data: CustomersAdminData }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "WITH_ORDERS" | "REGISTERED">("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(
    data.customers[0]?.id ?? null
  );

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return data.customers.filter((c) => {
      // Tab filter
      if (filter === "WITH_ORDERS" && c.totalOrders === 0) return false;
      if (filter === "REGISTERED" && !c.isRegistered) return false;

      // Search query
      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      const nameMatch = c.name.toLowerCase().includes(q);
      const emailMatch = c.email.toLowerCase().includes(q);
      const phoneMatch = c.phone.toLowerCase().includes(q);
      const orderMatch = c.orders.some((o) =>
        o.orderNumber.toLowerCase().includes(q)
      );

      return nameMatch || emailMatch || phoneMatch || orderMatch;
    });
  }, [data.customers, search, filter]);

  // Selected customer
  const selected = useMemo(() => {
    return (
      filteredCustomers.find((c) => c.id === selectedId) ??
      filteredCustomers[0] ??
      null
    );
  }, [filteredCustomers, selectedId]);

  return (
    <>
      {/* ── Key Metrics Overview ────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div className="stat-card">
          <b
            style={{
              display: "block",
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 400,
            }}
          >
            {data.stats.totalCustomers}
          </b>
          <span style={{ color: "var(--mute)", fontSize: 13 }}>
            Total Customers
          </span>
        </div>

        <div className="stat-card">
          <b
            style={{
              display: "block",
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 400,
            }}
          >
            {data.stats.totalOrders}
          </b>
          <span style={{ color: "var(--mute)", fontSize: 13 }}>
            Total Orders Placed
          </span>
        </div>

        <div className="stat-card">
          <b
            style={{
              display: "block",
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 400,
              color: "var(--pri)",
            }}
          >
            {formatINR(data.stats.totalRevenue)}
          </b>
          <span style={{ color: "var(--mute)", fontSize: 13 }}>
            Total Customer Spend
          </span>
        </div>

        <div className="stat-card">
          <b
            style={{
              display: "block",
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 400,
            }}
          >
            {data.stats.repeatCustomers}
          </b>
          <span style={{ color: "var(--mute)", fontSize: 13 }}>
            Repeat Buyers (&gt;1 order)
          </span>
        </div>
      </div>

      {/* ── Main Layout: Customer List (Left) & Customer Detail (Right) ───── */}
      <div className="admin-layout" style={{ padding: 0, gap: 24 }}>
        {/* LEFT COLUMN: Customer Selection & Search */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Search Input */}
          <div style={{ position: "relative" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--mute)",
              }}
            />
            <input
              type="text"
              placeholder="Search by name, email, phone or order #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{
                paddingLeft: 42,
                borderRadius: "var(--r-pill)",
                height: 44,
                fontSize: 14,
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { id: "ALL", label: `All (${data.customers.length})` },
              {
                id: "WITH_ORDERS",
                label: `With Orders (${data.customers.filter((c) => c.totalOrders > 0).length})`,
              },
              {
                id: "REGISTERED",
                label: `Registered (${data.customers.filter((c) => c.isRegistered).length})`,
              },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id as typeof filter)}
                style={{
                  border:
                    filter === btn.id
                      ? "1.5px solid var(--pri)"
                      : "1px solid var(--line)",
                  background:
                    filter === btn.id ? "var(--lav)" : "var(--surface)",
                  color:
                    filter === btn.id ? "var(--pri)" : "var(--ink)",
                  padding: "6px 12px",
                  borderRadius: "var(--r-pill)",
                  fontSize: 12,
                  fontWeight: filter === btn.id ? 600 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Customers Scrollable List */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              maxHeight: "calc(100vh - 280px)",
              overflowY: "auto",
              paddingRight: 4,
            }}
          >
            {filteredCustomers.length === 0 ? (
              <div
                className="box"
                style={{ textAlign: "center", padding: "40px 20px" }}
              >
                <User
                  size={36}
                  style={{
                    color: "var(--mute)",
                    margin: "0 auto 12px",
                    display: "block",
                  }}
                />
                <p style={{ fontWeight: 600, margin: "0 0 4px" }}>
                  No customers found
                </p>
                <p style={{ color: "var(--mute)", fontSize: 13, margin: 0 }}>
                  Try adjusting your search query or filters.
                </p>
              </div>
            ) : (
              filteredCustomers.map((c) => {
                const isSelected = selected?.id === c.id;
                const initials = c.name
                  ? c.name
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "U";

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 16px",
                      borderRadius: 14,
                      background: isSelected
                        ? "var(--lav)"
                        : "var(--surface)",
                      border: isSelected
                        ? "2px solid var(--pri)"
                        : "1px solid var(--line)",
                      cursor: "pointer",
                      textAlign: "left",
                      boxShadow: isSelected
                        ? "0 4px 16px rgba(111,79,176,0.12)"
                        : "0 1px 4px rgba(0,0,0,0.02)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {/* Avatar Initials */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: isSelected
                          ? "var(--pri)"
                          : "rgba(111,79,176,0.12)",
                        color: isSelected ? "#ffffff" : "var(--pri)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 15,
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>

                    {/* Customer Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 6,
                          marginBottom: 2,
                        }}
                      >
                        <strong
                          style={{
                            fontSize: 15,
                            color: "var(--ink)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {c.name || "Customer"}
                        </strong>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--pri)",
                          }}
                        >
                          {formatINR(c.totalSpent)}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--mute)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginBottom: 6,
                        }}
                      >
                        {c.email}
                      </div>

                      {/* Micro Tags */}
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: 11,
                            padding: "2px 8px",
                            borderRadius: "var(--r-pill)",
                            background: "rgba(0,0,0,0.05)",
                            color: "var(--ink)",
                            fontWeight: 500,
                          }}
                        >
                          {c.totalOrders}{" "}
                          {c.totalOrders === 1 ? "order" : "orders"}
                        </span>

                        {c.isRegistered ? (
                          <span
                            style={{
                              fontSize: 11,
                              padding: "2px 8px",
                              borderRadius: "var(--r-pill)",
                              background: "#DEF7EC",
                              color: "#03543F",
                              fontWeight: 600,
                            }}
                          >
                            Registered
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: 11,
                              padding: "2px 8px",
                              borderRadius: "var(--r-pill)",
                              background: "#F1F5F9",
                              color: "#64748B",
                              fontWeight: 500,
                            }}
                          >
                            Guest
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Customer Details & Descending Order History */}
        <div>
          {selected ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Profile Card */}
              <div
                className="box"
                style={{
                  padding: 24,
                  borderRadius: 16,
                  border: "1px solid var(--line)",
                  background: "var(--surface)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 16,
                    marginBottom: 20,
                  }}
                >
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--pri), #A282D7)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        fontWeight: 700,
                        boxShadow: "0 6px 18px rgba(111,79,176,0.25)",
                      }}
                    >
                      {selected.name
                        ? selected.name
                            .split(" ")
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </div>

                    <div>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: 20,
                          fontWeight: 700,
                          color: "var(--ink)",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        {selected.name || "Customer"}
                        {selected.isRegistered && (
                          <span
                            style={{
                              fontSize: 11,
                              background: "#DEF7EC",
                              color: "#03543F",
                              padding: "2px 8px",
                              borderRadius: "var(--r-pill)",
                              fontWeight: 600,
                            }}
                          >
                            Account holder
                          </span>
                        )}
                      </h2>

                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          flexWrap: "wrap",
                          marginTop: 6,
                          fontSize: 13,
                          color: "var(--mute)",
                        }}
                      >
                        <a
                          href={`mailto:${selected.email}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            color: "var(--pri)",
                            textDecoration: "none",
                            fontWeight: 500,
                          }}
                        >
                          <Mail size={14} />
                          {selected.email}
                        </a>

                        {selected.phone && (
                          <a
                            href={`tel:${selected.phone}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              color: "var(--ink)",
                              textDecoration: "none",
                            }}
                          >
                            <Phone size={14} />
                            {selected.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Summary Pills */}
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      background: "var(--bg)",
                      padding: "10px 16px",
                      borderRadius: 12,
                      border: "1px solid var(--line)",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: 11,
                          textTransform: "uppercase",
                          color: "var(--mute)",
                          fontWeight: 600,
                          display: "block",
                        }}
                      >
                        Orders
                      </span>
                      <strong style={{ fontSize: 16, color: "var(--ink)" }}>
                        {selected.totalOrders}
                      </strong>
                    </div>

                    <div
                      style={{
                        width: 1,
                        background: "var(--line)",
                        margin: "0 4px",
                      }}
                    />

                    <div style={{ textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: 11,
                          textTransform: "uppercase",
                          color: "var(--mute)",
                          fontWeight: 600,
                          display: "block",
                        }}
                      >
                        Lifetime Spend
                      </span>
                      <strong style={{ fontSize: 16, color: "var(--pri)" }}>
                        {formatINR(selected.totalSpent)}
                      </strong>
                    </div>

                    <div
                      style={{
                        width: 1,
                        background: "var(--line)",
                        margin: "0 4px",
                      }}
                    />

                    <div style={{ textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: 11,
                          textTransform: "uppercase",
                          color: "var(--mute)",
                          fontWeight: 600,
                          display: "block",
                        }}
                      >
                        Avg Value
                      </span>
                      <strong style={{ fontSize: 16, color: "var(--ink)" }}>
                        {formatINR(
                          selected.totalOrders > 0
                            ? Math.round(
                                selected.totalSpent / selected.totalOrders
                              )
                            : 0
                        )}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Addresses Preview (if any) */}
                {selected.addresses.length > 0 && (
                  <div
                    style={{
                      borderTop: "1px dashed var(--line)",
                      paddingTop: 14,
                      marginTop: 14,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        textTransform: "uppercase",
                        fontWeight: 700,
                        color: "var(--mute)",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        marginBottom: 8,
                      }}
                    >
                      <MapPin size={13} />
                      Known Delivery Address(es)
                    </span>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {selected.addresses.map((a, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: 12,
                            background: "var(--bg)",
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid var(--line)",
                            lineHeight: 1.5,
                            color: "var(--ink)",
                          }}
                        >
                          <strong>{a.fullName}</strong> ({a.phone})<br />
                          {a.line1}
                          {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} -{" "}
                          {a.pincode}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── All Orders in Descending Order ───────────────────────── */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <h3
                      className="text-box-h2"
                      style={{
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <ShoppingBag size={18} color="var(--pri)" />
                      Order Details ({selected.orders.length})
                    </h3>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: 12,
                        color: "var(--mute)",
                      }}
                    >
                      Displaying all customer orders in <strong>descending order</strong> (newest first).
                    </p>
                  </div>
                </div>

                {selected.orders.length === 0 ? (
                  <div
                    className="box"
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "var(--mute)",
                    }}
                  >
                    <ShoppingBag
                      size={32}
                      style={{ margin: "0 auto 8px", display: "block" }}
                    />
                    <p style={{ margin: 0, fontWeight: 500 }}>
                      No orders placed by this customer yet.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    {selected.orders.map((order, index) => {
                      const statusInfo =
                        STATUS_BADGES[order.status] ?? {
                          bg: "#F1F5F9",
                          color: "#334155",
                          label: order.status,
                        };

                      const isPaid = order.paymentStatus === "PAID";
                      const dateStr = new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Kolkata",
                      }).format(new Date(order.createdAt));

                      const addr = order.shippingAddress as Record<
                        string,
                        string
                      >;

                      return (
                        <div
                          key={order.id}
                          className="box"
                          style={{
                            padding: 20,
                            borderRadius: 14,
                            border: "1px solid var(--line)",
                            background: "var(--surface)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                          }}
                        >
                          {/* Order Header */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              gap: 12,
                              borderBottom: "1px solid var(--line)",
                              paddingBottom: 12,
                              marginBottom: 14,
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                  marginBottom: 4,
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: "monospace",
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: "var(--ink)",
                                  }}
                                >
                                  #{order.orderNumber}
                                </span>

                                {/* Status Badge */}
                                <span
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    padding: "3px 10px",
                                    borderRadius: "var(--r-pill)",
                                    background: statusInfo.bg,
                                    color: statusInfo.color,
                                  }}
                                >
                                  {statusInfo.label}
                                </span>

                                {/* Payment Badge */}
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    padding: "2px 8px",
                                    borderRadius: "var(--r-pill)",
                                    background: isPaid
                                      ? "#DEF7EC"
                                      : "#FEF08A",
                                    color: isPaid ? "#03543F" : "#854D0E",
                                  }}
                                >
                                  {isPaid ? "PAID" : "PENDING"}
                                </span>
                              </div>

                              <div
                                style={{
                                  fontSize: 12,
                                  color: "var(--mute)",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                }}
                              >
                                <Clock size={13} />
                                {dateStr} • {order.paymentMethod === "RAZORPAY" ? "Razorpay Online" : "Cash on Delivery"}
                              </div>
                            </div>

                            <div style={{ textAlign: "right" }}>
                              <div
                                style={{
                                  fontSize: 18,
                                  fontWeight: 800,
                                  color: "var(--pri)",
                                }}
                              >
                                {formatINR(order.total)}
                              </div>
                              <Link
                                href={`/admin/orders`}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                  fontSize: 12,
                                  color: "var(--pri)",
                                  textDecoration: "none",
                                  fontWeight: 600,
                                  marginTop: 4,
                                }}
                              >
                                Manage in Orders <ArrowRight size={13} />
                              </Link>
                            </div>
                          </div>

                          {/* Items Breakdown */}
                          <div style={{ marginBottom: 14 }}>
                            <span
                              style={{
                                fontSize: 12,
                                textTransform: "uppercase",
                                fontWeight: 700,
                                color: "var(--mute)",
                                display: "block",
                                marginBottom: 8,
                              }}
                            >
                              Ordered Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                            </span>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                              }}
                            >
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    background: "var(--bg)",
                                    padding: "8px 12px",
                                    borderRadius: 10,
                                  }}
                                >
                                  {/* Item Image */}
                                  <div
                                    style={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: 8,
                                      position: "relative",
                                      overflow: "hidden",
                                      background: "#EBE4F5",
                                      flexShrink: 0,
                                    }}
                                  >
                                    {item.image ? (
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="40px"
                                        style={{ objectFit: "cover" }}
                                      />
                                    ) : (
                                      <div
                                        style={{
                                          display: "grid",
                                          placeItems: "center",
                                          height: "100%",
                                          color: "var(--mute)",
                                          fontSize: 12,
                                        }}
                                      >
                                        🧶
                                      </div>
                                    )}
                                  </div>

                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                      style={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: "var(--ink)",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {item.name}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: 12,
                                        color: "var(--mute)",
                                      }}
                                    >
                                      Qty: {item.quantity} × {formatINR(item.price)}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      fontSize: 14,
                                      fontWeight: 600,
                                      color: "var(--ink)",
                                    }}
                                  >
                                    {formatINR(item.price * item.quantity)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Metadata Footer (Shipping & Tracking) */}
                          {(addr?.line1 || order.trackingNumber) && (
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 16,
                                paddingTop: 10,
                                borderTop: "1px dashed var(--line)",
                                fontSize: 12,
                                color: "var(--mute)",
                              }}
                            >
                              {addr?.line1 && (
                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                  <MapPin size={14} color="var(--pri)" />
                                  <span>
                                    Delivering to: {addr.fullName ? `${addr.fullName}, ` : ""}{addr.city}, {addr.pincode}
                                  </span>
                                </div>
                              )}

                              {order.trackingNumber && (
                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                  <Truck size={14} color="#1A56DB" />
                                  <span>
                                    Tracking: <strong>{order.trackingNumber}</strong>
                                    {order.courierName ? ` (${order.courierName})` : ""}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              className="box"
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "var(--mute)",
              }}
            >
              <User
                size={48}
                style={{
                  margin: "0 auto 12px",
                  display: "block",
                  opacity: 0.4,
                }}
              />
              <h3 style={{ margin: "0 0 6px", color: "var(--ink)" }}>
                Select a Customer
              </h3>
              <p style={{ fontSize: 14, margin: 0 }}>
                Choose a customer from the left list to inspect their purchase history.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
