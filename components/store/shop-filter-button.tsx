"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ShopFilterPanel } from "./shop-filter-panel";

export function ShopFilterButton() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  // Calculate active filter count
  let activeCount = 0;
  const category = searchParams.get("category");
  if (category && category !== "all") activeCount++;
  if (searchParams.get("max_price")) activeCount++;
  if (searchParams.get("sale") === "1") activeCount++;
  if (searchParams.get("new") === "1") activeCount++;
  if (searchParams.get("availability") === "in_stock") activeCount++;
  const sort = searchParams.get("sort");
  if (sort && sort !== "featured") activeCount++;

  return (
    <>
      <button
        id="open-filter-btn"
        className="btn-filter shop-filter-mobile"
        aria-label="Open filters"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        style={{
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <SlidersHorizontal size={15} />
        Filter &amp; sort
        {activeCount > 0 && (
          <span
            className="count"
            style={{
              background: "var(--ink)",
              color: "#fff",
              borderRadius: 999,
              padding: "1px 7px",
              fontSize: "0.75rem",
              fontWeight: 700,
              marginLeft: 4,
            }}
          >
            {activeCount}
          </span>
        )}
      </button>

      <ShopFilterPanel
        mode="drawer"
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
