import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getEffectivePrice, applyCoupon } from "@/lib/pricing";
import { toDiscountInput } from "@/lib/discount-mapper";
import { generateOrderNumber } from "@/lib/utils";
import { auth } from "@/auth";
import Razorpay from "razorpay";

const CheckoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      customization: z.string().optional(),
    })
  ).min(1),
  contact: z.object({
    fullName: z.string().min(2),
    phone: z.string().regex(/^\d{10}$/),
    email: z.string().email(),
  }),
  address: z.object({
    line1: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().regex(/^\d{6}$/),
  }),
  paymentMethod: z.enum(["RAZORPAY", "COD"]),
  discountId: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
    }

    const { items, contact, address, paymentMethod, discountId } = parsed.data;
    const now = new Date();

    // Get logged-in user if any (to link order to account)
    const session = await auth();
    const loggedInUserId = session?.user?.id ?? null;

    // Check COD enabled
    if (paymentMethod === "COD") {
      const setting = await prisma.setting.findUnique({ where: { key: "codEnabled" } });
      if (!setting || !setting.value) {
        return NextResponse.json({ error: "Cash on delivery is not available." }, { status: 400 });
      }
    }

    // Fetch products from DB — never trust client prices
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { images: { where: { isPrimary: true } } },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "One or more products are unavailable." }, { status: 400 });
    }

    const rawDiscounts = await prisma.discount.findMany({
      where: {
        isActive: true,
        startsAt: { lte: now },
        OR: [{ endsAt: null }, { endsAt: { gte: now } }],
      },
      include: { products: true },
    });

    const discounts = rawDiscounts.map(toDiscountInput);

    // Fetch coupon if provided
    let couponDiscount: typeof rawDiscounts[0] | null = null;
    if (discountId) {
      couponDiscount = await prisma.discount.findFirst({
        where: { id: discountId, isActive: true, code: { not: null } },
        include: { products: true },
      });
    }

    // Compute line items server-side
    let subtotal = 0;
    let discountTotal = 0;
    const orderItems = [];

    for (const cartItem of items) {
      const product = products.find((p) => p.id === cartItem.productId)!;
      const pricing = getEffectivePrice(
        { id: product.id, price: Number(product.price), categoryId: product.categoryId },
        discounts,
        now
      );
      const lineDiscount = (pricing.originalPrice - pricing.finalPrice) * cartItem.quantity;
      subtotal += pricing.originalPrice * cartItem.quantity;
      discountTotal += lineDiscount;

      orderItems.push({
        productId: product.id,
        nameSnapshot: product.name,
        imageSnapshot: product.images[0]?.url ?? "",
        unitPrice: pricing.originalPrice,
        discountApplied: pricing.savingAmount,
        finalUnitPrice: pricing.finalPrice,
        quantity: cartItem.quantity,
        customization: cartItem.customization,
      });
    }

    let afterAutoDiscount = subtotal - discountTotal;

    // Apply coupon on top if provided
    if (couponDiscount) {
      const coupon = applyCoupon(afterAutoDiscount, toDiscountInput(couponDiscount));
      discountTotal += coupon.saving;
      afterAutoDiscount = coupon.price;
    }

    // Shipping
    const shippingFeeSetting = await prisma.setting.findUnique({ where: { key: "shippingFee" } });
    const shippingFee = afterAutoDiscount >= 1000 ? 0 : Number(shippingFeeSetting?.value ?? 60);
    const total = afterAutoDiscount + shippingFee;

    // Count orders to generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = generateOrderNumber(orderCount + 1);

    // Create order in DB
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: loggedInUserId,
        customerName: contact.fullName,
        customerEmail: contact.email,
        customerPhone: contact.phone,
        shippingAddress: {
          fullName: contact.fullName, phone: contact.phone,
          line1: address.line1, city: address.city,
          state: address.state, pincode: address.pincode,
          country: "India",
        },
        subtotal,
        discountTotal,
        shippingFee,
        total,
        discountId: couponDiscount?.id ?? null,
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
        status: paymentMethod === "COD" ? "PLACED" : "PENDING_PAYMENT",
        isSeenByAdmin: false,
        items: { create: orderItems },
        history: {
          create: {
            status: paymentMethod === "COD" ? "PLACED" : "PENDING_PAYMENT",
            note: "Order created",
          },
        },
      },
    });

    if (paymentMethod === "COD") {
      // Send confirmation emails (best-effort)
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ template: "order-confirmation", orderId: order.id }),
        });
      } catch { /* non-fatal */ }

      return NextResponse.json({ orderNumber: order.orderNumber, orderId: order.id });
    }

    // ── Demo mode: skip Razorpay when keys are placeholder ──────────────────
    const keyId = process.env.RAZORPAY_KEY_ID ?? "";
    const isDemoMode = !keyId || keyId.includes("xxxx") || keyId === "rzp_test_xxxxxxxxxxxx";

    if (isDemoMode) {
      // Mark the order as placed (simulating a successful payment)
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PLACED",
          paymentStatus: "PAID",
          history: {
            create: { status: "PLACED", note: "Demo mode — payment simulated" },
          },
        },
      });
      return NextResponse.json({
        orderNumber: order.orderNumber,
        orderId: order.id,
        demo: true,
      });
    }

    // ── Real Razorpay ────────────────────────────────────────────────────────
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // paise
      currency: "INR",
      receipt: order.orderNumber,
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: "razorpay",
        providerOrderId: rzpOrder.id,
        amount: total,
        status: "PENDING",
        rawPayload: JSON.parse(JSON.stringify(rzpOrder)),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      razorpayOrderId: rzpOrder.id,
      amount: Math.round(total * 100),
    });
  } catch (err) {
    console.error("[CHECKOUT]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

