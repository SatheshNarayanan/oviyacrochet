import { NextRequest, NextResponse } from "next/server";
import { sendOrderEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { template, orderId } = await req.json();
    if (!template || !orderId) {
      return NextResponse.json({ error: "Missing template or orderId" }, { status: 400 });
    }
    await sendOrderEmail(orderId, template);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[EMAIL_SEND]", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
