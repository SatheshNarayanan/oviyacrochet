import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { applyCoupon } from "@/lib/pricing";
import { toDiscountInput } from "@/lib/discount-mapper";

const Schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const body = Schema.safeParse(await req.json());
    if (!body.success) return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });

    const { code, subtotal } = body.data;
    const now = new Date();

    const discount = await prisma.discount.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        startsAt: { lte: now },
        OR: [{ endsAt: null }, { endsAt: { gte: now } }],
      },
      include: { products: true },
    });

    if (!discount) {
      return NextResponse.json({ ok: false, error: "Coupon code not found or expired." });
    }

    const { price, saving } = applyCoupon(subtotal, toDiscountInput(discount));

    return NextResponse.json({
      ok: true,
      discountId: discount.id,
      name: discount.name,
      saving,
      newSubtotal: price,
    });
  } catch (err) {
    console.error("[COUPON]", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
