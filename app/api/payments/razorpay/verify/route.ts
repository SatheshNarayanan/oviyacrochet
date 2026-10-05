import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Verify HMAC signature
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Idempotency check
    const existing = await prisma.payment.findFirst({
      where: { providerPaymentId: razorpay_payment_id, status: "PAID" },
    });
    if (existing) {
      return NextResponse.json({ ok: true, message: "Already processed" });
    }

    // Update payment & order
    await prisma.$transaction([
      prisma.payment.updateMany({
        where: { orderId, providerOrderId: razorpay_order_id },
        data: {
          providerPaymentId: razorpay_payment_id,
          signature: razorpay_signature,
          status: "PAID",
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          status: "PLACED",
          isSeenByAdmin: false,
        },
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId,
          status: "PLACED",
          note: "Payment verified via Razorpay",
          emailSent: false,
        },
      }),
    ]);

    // Send confirmation emails (best-effort, non-blocking)
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
      await fetch(`${siteUrl}/api/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: "order-confirmation", orderId }),
      });
      await fetch(`${siteUrl}/api/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: "admin-new-order", orderId }),
      });
    } catch { /* non-fatal */ }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[RAZORPAY_VERIFY]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
