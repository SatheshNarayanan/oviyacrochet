"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { formatINR, phClass } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import {
  Search,
  Calendar,
  Clock,
  RotateCcw,
  X,
  Filter,
  CheckCircle2,
} from "lucide-react";

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

type QuickDateOption = "all" | "today" | "yesterday" | "last_week" | "last_2_weeks" | "custom";

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

// Convert Date object to YYYY-MM-DD in local time
function getLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getTodayRange(): [string, string] {
  const today = new Date();
  const s = getLocalDateStr(today);
  return [s, s];
}

function getYesterdayRange(): [string, string] {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const s = getLocalDateStr(y);
  return [s, s];
}

function getLast1WeekRange(): [string, string] {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  return [getLocalDateStr(start), getLocalDateStr(end)];
}

function getLast2WeeksRange(): [string, string] {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 14);
  return [getLocalDateStr(start), getLocalDateStr(end)];
}

// Formats date nicely for cards (e.g. "Today, 7:20 PM", "Yesterday, 11:43 PM", "10 Oct 2026, 6:13 PM")
function formatOrderDate(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    const now = new Date();
    const orderDateStr = getLocalDateStr(d);
    const todayStr = getLocalDateStr(now);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateStr(yesterday);

    const timeStr = d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (orderDateStr === todayStr) {
      return `Today, ${timeStr}`;
    }
    if (orderDateStr === yesterdayStr) {
      return `Yesterday, ${timeStr}`;
    }
    return (
      d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) + `, ${timeStr}`
    );
  } catch {
    return isoStr;
  }
}

// Full detailed date for header panel
function formatFullDate(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return isoStr;
  }
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

  // Date and search filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [quickDate, setQuickDate] = useState<QuickDateOption>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Filtered orders memo
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Status filter
      if (statusFilter !== "ALL" && order.status !== statusFilter) {
        return false;
      }

      // 2. Date filter (comparing YYYY-MM-DD local calendar dates)
      const orderDateStr = getLocalDateStr(new Date(order.createdAt));
      if (startDate && orderDateStr < startDate) {
        return false;
      }
      if (endDate && orderDateStr > endDate) {
        return false;
      }

      // 3. Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchOrderNum = order.orderNumber.toLowerCase().includes(q);
        const matchName = order.customerName.toLowerCase().includes(q);
        const matchEmail = order.customerEmail.toLowerCase().includes(q);
        const matchPhone = (order.customerPhone || "").toLowerCase().includes(q);
        const matchCity = (order.shippingAddress?.city || "").toLowerCase().includes(q);
        const matchItem = order.items.some((i) => i.name.toLowerCase().includes(q));
        if (!matchOrderNum && !matchName && !matchEmail && !matchPhone && !matchCity && !matchItem) {
          return false;
        }
      }

      return true;
    });
  }, [orders, statusFilter, startDate, endDate, searchQuery]);

  // Keep selected order in sync when filter changes
  useEffect(() => {
    if (selected && !filteredOrders.some((o) => o.id === selected.id)) {
      const next = filteredOrders[0] ?? null;
      setSelected(next);
      if (next) {
        setNewStatus(next.status);
      }
    } else if (!selected && filteredOrders.length > 0) {
      setSelected(filteredOrders[0]);
      setNewStatus(filteredOrders[0].status);
    }
  }, [filteredOrders, selected]);

  const handleQuickDate = (option: QuickDateOption) => {
    setQuickDate(option);
    if (option === "all") {
      setStartDate("");
      setEndDate("");
    } else if (option === "today") {
      const [s, e] = getTodayRange();
      setStartDate(s);
      setEndDate(e);
    } else if (option === "yesterday") {
      const [s, e] = getYesterdayRange();
      setStartDate(s);
      setEndDate(e);
    } else if (option === "last_week") {
      const [s, e] = getLast1WeekRange();
      setStartDate(s);
      setEndDate(e);
    } else if (option === "last_2_weeks") {
      const [s, e] = getLast2WeeksRange();
      setStartDate(s);
      setEndDate(e);
    }
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    setQuickDate("custom");
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    setQuickDate("custom");
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setQuickDate("all");
    setStartDate("");
    setEndDate("");
    setStatusFilter("ALL");
  };

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
        toast(`Status updated to ${ORDER_STATUSES.find((s) => s.value === newStatus)?.label}. Email sent to ${selected.customerEmail}`, "success");
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

  const isFilterActive =
    quickDate !== "all" || startDate !== "" || endDate !== "" || searchQuery !== "" || statusFilter !== "ALL";

  return (
    <>
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {[
          { label: "New orders", value: data.stats.newCount },
          { label: "This week", value: formatINR(data.stats.weekRevenue) },
          { label: "In production", value: data.stats.inProduction },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <b style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400 }}>
              {stat.value}
            </b>
            <span style={{ color: "var(--mute)", fontSize: 12 }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Date-Wise Search & Filter Panel */}
      <div
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--line)",
          borderRadius: 16,
          padding: "16px 18px",
          marginBottom: 20,
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        {/* Row 1: Search query and status dropdown */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <div style={{ flex: "1 1 240px", position: "relative" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--mute)",
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, customer name, phone, item..."
              id="orders-search-input"
              style={{
                width: "100%",
                padding: "9px 34px 9px 36px",
                borderRadius: 10,
                border: "1.5px solid var(--line)",
                background: "var(--bg)",
                fontSize: 13,
                outline: "none",
                fontFamily: "var(--font-body)",
                color: "var(--ink)",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: 0,
                  cursor: "pointer",
                  color: "var(--mute)",
                  padding: 2,
                }}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Filter size={15} style={{ color: "var(--mute)" }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              id="orders-status-filter"
              style={{
                padding: "9px 12px",
                borderRadius: 10,
                border: "1.5px solid var(--line)",
                background: "var(--bg)",
                fontSize: 13,
                color: "var(--ink)",
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                minWidth: 140,
              }}
            >
              <option value="ALL">All Statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Quick Date Picks */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--mute)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              marginRight: 4,
            }}
          >
            <Calendar size={13} /> Quick Picks:
          </span>

          {[
            { id: "all", label: "All Time" },
            { id: "today", label: "Today" },
            { id: "yesterday", label: "Yesterday" },
            { id: "last_week", label: "Last 1 week" },
            { id: "last_2_weeks", label: "Last 2 weeks" },
          ].map((opt) => {
            const isActive = quickDate === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                id={`quick-date-${opt.id}`}
                onClick={() => handleQuickDate(opt.id as QuickDateOption)}
                style={{
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 500,
                  borderRadius: 20,
                  border: isActive ? "1.5px solid var(--mint)" : "1.5px solid var(--line)",
                  background: isActive ? "var(--mint)" : "var(--bg)",
                  color: isActive ? "#ffffff" : "var(--ink)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {opt.label}
              </button>
            );
          })}

          {isFilterActive && (
            <button
              type="button"
              onClick={handleClearAll}
              id="clear-order-filters-btn"
              style={{
                marginLeft: "auto",
                padding: "5px 12px",
                fontSize: 12,
                fontWeight: 600,
                background: "none",
                border: "1px dashed var(--mute)",
                borderRadius: 8,
                color: "var(--mute)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <RotateCcw size={12} /> Reset Filters
            </button>
          )}
        </div>

        {/* Row 3: Custom Date Range pickers & Results count */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            paddingTop: 10,
            borderTop: "1px solid var(--line)",
            fontSize: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ color: "var(--mute)", fontWeight: 600 }}>Custom Range:</span>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--mute)" }}>
              From:
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                id="orders-date-from"
                style={{
                  padding: "5px 8px",
                  borderRadius: 8,
                  border: "1.5px solid var(--line)",
                  background: "var(--bg)",
                  fontSize: 12,
                  color: "var(--ink)",
                  fontFamily: "var(--font-body)",
                }}
              />
            </label>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--mute)" }}>
              To:
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                id="orders-date-to"
                style={{
                  padding: "5px 8px",
                  borderRadius: 8,
                  border: "1.5px solid var(--line)",
                  background: "var(--bg)",
                  fontSize: 12,
                  color: "var(--ink)",
                  fontFamily: "var(--font-body)",
                }}
              />
            </label>
          </div>

          <div style={{ color: "var(--mute)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <span>
              Showing <strong style={{ color: "var(--ink)" }}>{filteredOrders.length}</strong> of {orders.length} orders
            </span>
            {quickDate !== "all" && (
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 10,
                  background: "var(--ice-mint)",
                  color: "var(--ink)",
                  fontSize: 11,
                  fontWeight: 700,
                  border: "1px solid var(--mint)",
                }}
              >
                {quickDate === "today"
                  ? "Today"
                  : quickDate === "yesterday"
                  ? "Yesterday"
                  : quickDate === "last_week"
                  ? "Last 7 Days"
                  : quickDate === "last_2_weeks"
                  ? "Last 14 Days"
                  : "Custom Range"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="admin-layout" style={{ padding: 0 }}>
        {/* Orders list */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 className="text-box-h2" style={{ margin: 0 }}>Orders</h2>
            <span style={{ fontSize: 12, color: "var(--mute)", fontWeight: 600 }}>
              {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"}
            </span>
          </div>

          {filteredOrders.length === 0 ? (
            <div
              style={{
                padding: "36px 20px",
                textAlign: "center",
                background: "var(--surface)",
                borderRadius: 16,
                border: "2px dashed var(--line)",
              }}
            >
              <Calendar size={32} style={{ color: "var(--mute)", margin: "0 auto 8px" }} />
              <p style={{ color: "var(--ink)", fontWeight: 600, margin: "0 0 6px", fontSize: 15 }}>
                No orders match your filter
              </p>
              <p style={{ color: "var(--mute)", fontSize: 13, margin: "0 0 14px" }}>
                Try selecting a different date range or clearing your search.
              </p>
              <button
                type="button"
                className="btn btn-alt"
                style={{ padding: "6px 14px", fontSize: 13 }}
                onClick={handleClearAll}
              >
                Show all orders
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredOrders.map((order) => (
                <button
                  key={order.id}
                  className={`order-card ${selected?.id === order.id ? "selected" : ""}`}
                  onClick={() => selectOrder(order)}
                  id={`order-${order.id}`}
                  style={{ padding: "12px 14px", position: "relative" }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <b style={{ fontSize: 14, color: "var(--ink)" }}>{order.orderNumber}</b>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--mute)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 3,
                          fontWeight: 500,
                        }}
                      >
                        <Clock size={11} />
                        {formatOrderDate(order.createdAt)}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                      <small
                        style={{
                          color: "var(--mute)",
                          fontSize: 12,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "60%",
                        }}
                      >
                        {order.customerName} • {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </small>
                      <span style={{ fontWeight: 700, fontSize: 13, color: "var(--ink)" }}>
                        {formatINR(order.total)}
                      </span>
                    </div>
                  </div>

                  {!order.isSeenByAdmin ? (
                    <span className="badge-new" style={{ marginLeft: 8 }}>NEW</span>
                  ) : (
                    <span className="status-pill" style={{ marginLeft: 8 }}>{statusLabel(order.status)}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Order detail */}
        {selected ? (
          <div className="box">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div>
                <h2 className="text-box-h2" style={{ margin: "0 0 2px" }}>{selected.customerName}</h2>
                <div style={{ fontSize: 13, color: "var(--mute)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Calendar size={13} style={{ color: "var(--mint)" }} />
                  {formatFullDate(selected.createdAt)}
                </div>
              </div>
              <span className="status-pill" style={{ fontSize: 13, padding: "4px 10px" }}>
                {statusLabel(selected.status)}
              </span>
            </div>

            <p style={{ color: "var(--mute)", fontSize: 14, margin: "6px 0 2px" }}>
              {selected.shippingAddress?.line1 || "No address line 1"}, {selected.shippingAddress?.city || ""}{" "}
              {selected.shippingAddress?.pincode || ""}
            </p>
            <p style={{ color: "var(--mute)", fontSize: 14, margin: "0 0 16px" }}>
              {selected.customerPhone || "No phone"} • {selected.customerEmail}
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

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid var(--line)" }}>
              <span style={{ fontSize: 14, color: "var(--mute)", fontWeight: 600 }}>Total Amount:</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)" }}>{formatINR(selected.total)}</span>
            </div>

            <hr className="stitched-divider" />

            {/* Status update */}
            <label htmlFor="status-select" style={{ fontWeight: 600, fontSize: 14 }}>
              Update Order status
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
              Changing the status emails <strong>{selected.customerEmail}</strong>.
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
        ) : (
          <div className="box" style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ color: "var(--mute)", fontSize: 14 }}>Select an order to view its details.</p>
          </div>
        )}
      </div>
    </>
  );
}

