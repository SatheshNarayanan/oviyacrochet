"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

const CATEGORY_NAMES: Record<string, string> = {
  amigurumi: "Amigurumi",
  bags: "Bags",
  "home-decor": "Home Decor",
  baby: "Baby",
  accessories: "Accessories",
  "gift-hampers": "Gift Hampers",
};

const SORT_NAMES: Record<string, string> = {
  newest: "New arrivals",
  price_asc: "Price: Low to high",
  price_desc: "Price: High to low",
};

export function ActiveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const maxPrice = searchParams.get("max_price");
  const sale = searchParams.get("sale") === "1";
  const isNew = searchParams.get("new") === "1";
  const inStock = searchParams.get("availability") === "in_stock";
  const sort = searchParams.get("sort");

  const hasCategory = category && category !== "all";
  const hasSort = sort && sort !== "featured" && sort in SORT_NAMES;

  const hasAnyFilter =
    hasCategory ||
    Boolean(maxPrice) ||
    sale ||
    isNew ||
    inStock ||
    hasSort;

  if (!hasAnyFilter) return null;

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    const qs = params.toString();
    router.push(`/shop${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const clearAll = () => {
    router.push("/shop", { scroll: false });
  };

  return (
    <div
      className="applied-filters"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
        padding: "8px 0 16px",
      }}
      aria-label="Active filters"
    >
      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
        Active filters:
      </span>

      {hasCategory && (
        <button
          type="button"
          className="chip chip--x"
          onClick={() => removeFilter("category")}
          aria-label={`Remove category filter: ${CATEGORY_NAMES[category] ?? category}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            borderRadius: 999,
            border: "1.5px solid var(--line)",
            background: "var(--surface)",
            padding: "4px 10px",
            fontSize: "0.85rem",
            color: "var(--ink)",
          }}
        >
          {CATEGORY_NAMES[category] ?? category}
          <X size={13} />
        </button>
      )}

      {maxPrice && (
        <button
          type="button"
          className="chip chip--x"
          onClick={() => removeFilter("max_price")}
          aria-label={`Remove price filter: Under ₹${maxPrice}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            borderRadius: 999,
            border: "1.5px solid var(--line)",
            background: "var(--surface)",
            padding: "4px 10px",
            fontSize: "0.85rem",
            color: "var(--ink)",
          }}
        >
          Under ₹{maxPrice}
          <X size={13} />
        </button>
      )}

      {sale && (
        <button
          type="button"
          className="chip chip--x"
          onClick={() => removeFilter("sale")}
          aria-label="Remove sale filter"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            borderRadius: 999,
            border: "1.5px solid var(--line)",
            background: "var(--surface)",
            padding: "4px 10px",
            fontSize: "0.85rem",
            color: "var(--ink)",
          }}
        >
          On sale
          <X size={13} />
        </button>
      )}

      {isNew && (
        <button
          type="button"
          className="chip chip--x"
          onClick={() => removeFilter("new")}
          aria-label="Remove new filter"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            borderRadius: 999,
            border: "1.5px solid var(--line)",
            background: "var(--surface)",
            padding: "4px 10px",
            fontSize: "0.85rem",
            color: "var(--ink)",
          }}
        >
          New arrivals
          <X size={13} />
        </button>
      )}

      {inStock && (
        <button
          type="button"
          className="chip chip--x"
          onClick={() => removeFilter("availability")}
          aria-label="Remove in stock filter"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            borderRadius: 999,
            border: "1.5px solid var(--line)",
            background: "var(--surface)",
            padding: "4px 10px",
            fontSize: "0.85rem",
            color: "var(--ink)",
          }}
        >
          In stock only
          <X size={13} />
        </button>
      )}

      {hasSort && (
        <button
          type="button"
          className="chip chip--x"
          onClick={() => removeFilter("sort")}
          aria-label={`Remove sort: ${SORT_NAMES[sort]}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            borderRadius: 999,
            border: "1.5px solid var(--line)",
            background: "var(--surface)",
            padding: "4px 10px",
            fontSize: "0.85rem",
            color: "var(--ink)",
          }}
        >
          {SORT_NAMES[sort]}
          <X size={13} />
        </button>
      )}

      <button
        type="button"
        className="clear-all"
        onClick={clearAll}
        style={{
          marginLeft: 4,
          background: "none",
          border: "none",
          color: "var(--mint)",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: "0.85rem",
          textDecoration: "underline",
        }}
      >
        Clear all
      </button>
    </div>
  );
}
