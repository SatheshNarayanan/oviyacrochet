import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Indian Rupee */
export function formatINR(amount: number | string | { toNumber(): number }) {
  const n =
    typeof amount === "object" && "toNumber" in amount
      ? amount.toNumber()
      : Number(amount);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

/** Generate an order number e.g. OC-2026-000123 */
export function generateOrderNumber(seq: number): string {
  const year = new Date().getFullYear();
  return `OC-${year}-${String(seq).padStart(6, "0")}`;
}

/** Slugify a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Get placeholder gradient class by index */
export function phClass(index: number): string {
  const classes = ["ph-1", "ph-2", "ph-3", "ph-4", "ph-5", "ph-6"];
  return classes[index % classes.length];
}
