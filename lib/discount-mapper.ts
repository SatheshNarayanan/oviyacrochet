import type { DiscountInput } from "./pricing";

// Prisma Discount row from DB (with products included)
type PrismaDiscountRow = {
  id: string;
  name: string;
  code: string | null;
  type: "PERCENTAGE" | "FIXED";
  value: { toNumber(): number } | number;
  scope: "PRODUCT" | "CATEGORY" | "STOREWIDE";
  categoryId: string | null;
  startsAt: Date;
  endsAt: Date | null;
  isActive: boolean;
  stackable: boolean;
  products: { productId: string; discountId: string }[];
};

/** Map a Prisma Discount row to the DiscountInput shape used by pricing.ts */
export function toDiscountInput(d: PrismaDiscountRow): DiscountInput {
  return {
    id: d.id,
    type: d.type,
    value: typeof d.value === "object" ? d.value.toNumber() : Number(d.value),
    scope: d.scope,
    categoryId: d.categoryId,
    startsAt: d.startsAt,
    endsAt: d.endsAt,
    isActive: d.isActive,
    code: d.code,
    products: d.products,
  };
}
