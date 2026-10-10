import { NextResponse } from "next/server";
import { sendMail, verifyMailer } from "@/lib/mailer";

export const runtime = "nodejs";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }
  
  try {
    await verifyMailer(); // throws if login fails
    await sendMail({
      to: process.env.OWNER_EMAIL || process.env.GMAIL_USER || "test@example.com",
      subject: "Oviya's Crochet test email",
      html: "<p>If you can read this, Gmail sending works perfectly!</p>",
      text: "If you can read this, Gmail sending works perfectly!",
    });
    return NextResponse.json({ ok: true, message: "Test email sent successfully!" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
