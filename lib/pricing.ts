export interface DiscountInput {
  id: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  scope: "PRODUCT" | "CATEGORY" | "STOREWIDE";
  categoryId: string | null;
  startsAt: Date;
  endsAt: Date | null;
  isActive: boolean;
  code: string | null;
  products?: { productId: string }[];
}

export interface ProductInput {
  id: string;
  price: number;
  categoryId: string;
}

/**
 * Pure function — returns the effective unit price after applying the best
 * automatic discount. Coupon discounts are handled separately and may stack.
 *
 * @param product  Product with id, price, categoryId
 * @param discounts All active discounts from DB (filter active ones before passing)
 * @param now  Current date (injectable for testing)
 */
export function getEffectivePrice(
  product: ProductInput,
  discounts: DiscountInput[],
  now: Date = new Date()
): {
  originalPrice: number;
  finalPrice: number;
  bestDiscount: DiscountInput | null;
  savingAmount: number;
  savingPercent: number;
} {
  const originalPrice = Number(product.price);

  const applicable = discounts.filter((d) => {
    if (!d.isActive) return false;
    if (d.code !== null) return false; // skip coupon codes — handled at checkout
    if (d.startsAt > now) return false;
    if (d.endsAt && d.endsAt < now) return false;

    if (d.scope === "STOREWIDE") return true;
    if (d.scope === "CATEGORY" && d.categoryId === product.categoryId) return true;
    if (
      d.scope === "PRODUCT" &&
      d.products?.some((p) => p.productId === product.id)
    )
      return true;

    return false;
  });

  if (applicable.length === 0) {
    return {
      originalPrice,
      finalPrice: originalPrice,
      bestDiscount: null,
      savingAmount: 0,
      savingPercent: 0,
    };
  }

  // Pick discount with highest saving
  let bestDiscount: DiscountInput | null = null;
  let bestSaving = 0;

  for (const d of applicable) {
    const val = Number(d.value);
    const saving =
      d.type === "PERCENTAGE"
        ? (originalPrice * val) / 100
        : Math.min(val, originalPrice);
    if (saving > bestSaving) {
      bestSaving = saving;
      bestDiscount = d;
    }
  }

  const finalPrice = Math.max(0, originalPrice - bestSaving);
  const savingPercent = (bestSaving / originalPrice) * 100;

  return {
    originalPrice,
    finalPrice,
    bestDiscount,
    savingAmount: bestSaving,
    savingPercent,
  };
}

/**
 * Apply a coupon code discount on top of an already-discounted price.
 */
export function applyCoupon(
  price: number,
  coupon: DiscountInput
): { price: number; saving: number } {
  const val = Number(coupon.value);
  const saving =
    coupon.type === "PERCENTAGE"
      ? (price * val) / 100
      : Math.min(val, price);
  return { price: Math.max(0, price - saving), saving };
}
