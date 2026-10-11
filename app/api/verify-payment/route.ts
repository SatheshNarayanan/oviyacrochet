import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        { error: "Razorpay secret not configured" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const order_id = body.razorpay_order_id || body.order_id;
    const payment_id = body.razorpay_payment_id || body.payment_id;
    const signature = body.razorpay_signature || body.signature;

    if (!order_id || !payment_id || !signature) {
      return NextResponse.json(
        { error: "Missing required payment verification fields" },
        { status: 400 }
      );
    }

    // HMAC SHA256 verification: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${order_id}|${payment_id}`)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment signature verified successfully",
    });
  } catch (err: unknown) {
    console.error("[VERIFY_PAYMENT_ERROR]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
