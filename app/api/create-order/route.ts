import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { amount, currency = "INR", receipt } = body;

    // Minimum amount validation: 100 paise (₹1)
    if (!amount || typeof amount !== "number" || amount < 100) {
      return NextResponse.json(
        { error: "Amount must be at least 100 paise (₹1)" },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(amount),
      currency: currency.toUpperCase(),
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err: unknown) {
    console.error("[CREATE_ORDER_ERROR]", err);
    const errorMsg = err instanceof Error ? err.message : "Failed to create order";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
