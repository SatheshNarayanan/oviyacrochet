"use client";

/* 5 sort options per the UI/UX update guide §4.5 */
const SORT_OPTIONS = [
  { value: "featured",    label: "Featured" },
  { value: "newest",      label: "New arrivals" },
  { value: "best_selling",label: "Best selling" },
  { value: "price_asc",   label: "Price: low to high" },
  { value: "price_desc",  label: "Price: high to low" },
];

export function SortSelect({ activeSort }: { activeSort: string }) {
  return (
    <label className="sort-label">
      <span>Sort:</span>
      <select
        className="sort-select"
        defaultValue={activeSort}
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
