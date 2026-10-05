"use client";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export function SortSelect({ activeSort }: { activeSort: string }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
      <span style={{ color: "var(--mute)" }}>Sort:</span>
      <select
        defaultValue={activeSort}
        style={{
          border: "1px solid var(--line)",
          borderRadius: 8,
          padding: "4px 8px",
          background: "var(--bg)",
          fontSize: 14,
          color: "var(--ink)",
        }}
        onChange={(e) => {
          const url = new URL(window.location.href);
          url.searchParams.set("sort", e.target.value);
          window.location.href = url.toString();
        }}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
