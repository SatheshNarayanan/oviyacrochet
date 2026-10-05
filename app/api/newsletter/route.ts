import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const Schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const body = Schema.safeParse(await req.json());
    if (!body.success) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }
    // In production, save to a mailing list or send via Resend
    // For now, just acknowledge
    return NextResponse.json({ ok: true, message: "Subscribed successfully!" });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
