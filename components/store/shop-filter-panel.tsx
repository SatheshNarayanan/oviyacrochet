"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Check } from "lucide-react";

export const CATEGORIES_FILTER = [
  { slug: "all", label: "All Products" },
  { slug: "amigurumi", label: "Amigurumi" },
  { slug: "bags", label: "Bags" },
  { slug: "home-decor", label: "Home Decor" },
  { slug: "baby", label: "Baby" },
  { slug: "accessories", label: "Accessories" },
  { slug: "gift-hampers", label: "Gift Hampers" },
];

export const PRICE_OPTIONS = [
  { value: "", label: "All prices" },
  { value: "500", label: "Under ₹500" },
  { value: "999", label: "Under ₹999" },
  { value: "2000", label: "Under ₹2,000" },
];

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "New arrivals" },
  { value: "price_asc", label: "Price: Low to high" },
  { value: "price_desc", label: "Price: High to low" },
];

interface ShopFilterPanelProps {
  mode?: "desktop" | "drawer";
  isOpen?: boolean;
  onClose?: () => void;
}

export function ShopFilterPanel({
  mode = "desktop",
  isOpen = false,
  onClose = () => {},
}: ShopFilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "all";
  const activeSort = searchParams.get("sort") ?? "featured";
  const activeMaxPrice = searchParams.get("max_price") ?? "";
  const isSale = searchParams.get("sale") === "1";
  const isNew = searchParams.get("new") === "1";
  const isInStock = searchParams.get("availability") === "in_stock";

  const hasAnyFilter =
    (activeCategory && activeCategory !== "all") ||
    Boolean(activeMaxPrice) ||
    isSale ||
    isNew ||
    isInStock ||
    (activeSort && activeSort !== "featured");

  const buildUrl = useCallback(
    (extra: Record<string, string>) => {
      const p = new URLSearchParams(searchParams.toString());
      Object.entries(extra).forEach(([k, v]) => {
        if (v && v !== "all" && v !== "featured") {
          p.set(k, v);
        } else {
          p.delete(k);
        }
      });
      const qs = p.toString();
      return `/shop${qs ? `?${qs}` : ""}`;
    },
    [searchParams]
  );

  const navigate = (extra: Record<string, string>) => {
    router.push(buildUrl(extra), { scroll: false });
  };

  const clearAll = () => {
    router.push("/shop", { scroll: false });
    if (mode === "drawer") onClose();
  };

  /* Custom radio bullet indicator */
  const Radio = ({ active }: { active: boolean }) => (
    <span
      style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        border: `2px solid ${active ? "var(--mint)" : "#C9D3DB"}`,
        background: active ? "var(--mint)" : "transparent",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.15s ease",
      }}
    >
      {active && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#fff",
            display: "block",
          }}
        />
      )}
    </span>
  );

  /* Custom checkbox indicator */
  const Checkbox = ({ active }: { active: boolean }) => (
    <span
      style={{
        width: 18,
        height: 18,
        borderRadius: 4,
        border: `2px solid ${active ? "var(--mint)" : "#C9D3DB"}`,
        background: active ? "var(--mint)" : "transparent",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.15s ease",
      }}
    >
      {active && <Check size={12} color="#fff" strokeWidth={3} />}
    </span>
  );

  const filterItemStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    padding: "8px 0",
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontFamily: "var(--font-body)",
    fontSize: "0.95rem",
  };

  const content = (
    <>
      {/* Category Accordion */}
      <details className="fgroup" open>
        <summary>Category</summary>
        <div className="fgroup__body" style={{ padding: "8px 0 16px" }}>
          {CATEGORIES_FILTER.map((cat) => {
            const isSelected = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => navigate({ category: cat.slug })}
                style={filterItemStyle}
              >
                <Radio active={isSelected} />
                <span
                  style={{
                    color: isSelected ? "var(--mint)" : "var(--ink)",
                    fontWeight: isSelected ? 700 : 400,
                  }}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </details>

      {/* Price Accordion */}
      <details className="fgroup" open>
        <summary>Price</summary>
        <div className="fgroup__body" style={{ padding: "8px 0 16px" }}>
          {PRICE_OPTIONS.map((opt) => {
            const isSelected = activeMaxPrice === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => navigate({ max_price: opt.value })}
                style={filterItemStyle}
              >
                <Radio active={isSelected} />
                <span
                  style={{
                    color: isSelected ? "var(--mint)" : "var(--ink)",
                    fontWeight: isSelected ? 700 : 400,
                  }}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </details>

      {/* Availability Accordion */}
      <details className="fgroup" open>
        <summary>Availability</summary>
        <div className="fgroup__body" style={{ padding: "8px 0 16px" }}>
          <button
            type="button"
            onClick={() =>
              navigate({ availability: isInStock ? "" : "in_stock" })
            }
            style={filterItemStyle}
          >
            <Checkbox active={isInStock} />
            <span
              style={{
                color: isInStock ? "var(--mint)" : "var(--ink)",
                fontWeight: isInStock ? 700 : 400,
              }}
            >
              In stock only
            </span>
          </button>
        </div>
      </details>

      {/* Highlights Accordion */}
      <details className="fgroup" open>
        <summary>Special</summary>
        <div className="fgroup__body" style={{ padding: "8px 0 16px" }}>
          <button
            type="button"
            onClick={() => navigate({ sale: isSale ? "" : "1" })}
            style={filterItemStyle}
          >
            <Checkbox active={isSale} />
            <span
              style={{
                color: isSale ? "var(--mint)" : "var(--ink)",
                fontWeight: isSale ? 700 : 400,
              }}
            >
              On sale
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate({ new: isNew ? "" : "1" })}
            style={filterItemStyle}
          >
            <Checkbox active={isNew} />
            <span
              style={{
                color: isNew ? "var(--mint)" : "var(--ink)",
                fontWeight: isNew ? 700 : 400,
              }}
            >
              New arrivals
            </span>
          </button>
        </div>
      </details>

      {/* Sort Accordion */}
      <details className="fgroup" open>
        <summary>Sort by</summary>
        <div className="fgroup__body" style={{ padding: "8px 0 16px" }}>
          {SORT_OPTIONS.map((opt) => {
            const isSelected = activeSort === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => navigate({ sort: opt.value })}
                style={filterItemStyle}
              >
                <Radio active={isSelected} />
                <span
                  style={{
                    color: isSelected ? "var(--mint)" : "var(--ink)",
                    fontWeight: isSelected ? 700 : 400,
                  }}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </details>

      {/* Reset all button */}
      {hasAnyFilter && (
        <button
          type="button"
          onClick={clearAll}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "10px 0",
            border: "1.5px solid var(--line)",
            borderRadius: "var(--r-pill)",
            background: "none",
            color: "var(--ink)",
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--mint)";
            (e.currentTarget as HTMLElement).style.color = "var(--mint)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--line)";
            (e.currentTarget as HTMLElement).style.color = "var(--ink)";
          }}
        >
          Clear all filters
        </button>
      )}
    </>
  );

  // Desktop sidebar mode
  if (mode === "desktop") {
    return (
      <aside
        aria-label="Product filters"
        className="filters-sidebar"
        id="desktop-filters-sidebar"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 12,
            borderBottom: "1px solid var(--line)",
            marginBottom: 8,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.1rem",
              fontWeight: 700,
              fontFamily: "var(--font-heading)",
              color: "var(--ink)",
            }}
          >
            Filters
          </h2>
          {hasAnyFilter && (
            <button
              type="button"
              onClick={clearAll}
              style={{
                background: "none",
                border: "none",
                color: "var(--mint)",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
              }}
            >
              Reset
            </button>
          )}
        </div>
        {content}
      </aside>
    );
  }

  // Mobile drawer mode
  return (
    <>
      {/* Backdrop */}
      <div
        className={`filter-overlay ${isOpen ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
        style={{
          display: isOpen ? "block" : "none",
        }}
      />

      {/* Drawer */}
      <div
        className={`filter-drawer ${isOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filter & Sort"
        style={{
          display: isOpen ? "flex" : "none",
        }}
      >
        <div className="filter-drawer__head">
          <span style={{ fontWeight: 700 }}>Filter &amp; Sort</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              color: "var(--ink)",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="filter-drawer__body">{content}</div>

        <div className="filter-drawer__foot">
          {hasAnyFilter && (
            <button
              type="button"
              onClick={clearAll}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary"
            style={{ flex: 2 }}
          >
            View Products
          </button>
        </div>
      </div>
    </>
  );
}
