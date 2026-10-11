"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "featured",    label: "Featured" },
  { value: "newest",      label: "New arrivals" },
  { value: "price_asc",   label: "Price: low to high" },
  { value: "price_desc",  label: "Price: high to low" },
];

export function SortSelect({ activeSort }: { activeSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort && newSort !== "featured") {
      params.set("sort", newSort);
    } else {
      params.delete("sort");
    }
    const qs = params.toString();
    router.push(`/shop${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  return (
    <label className="sort-label">
      <span>Sort:</span>
      <select
        className="sort-select"
        value={activeSort}
        onChange={(e) => handleChange(e.target.value)}
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
