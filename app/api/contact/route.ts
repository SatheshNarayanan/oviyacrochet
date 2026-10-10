import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";
import { ownerNewContactMessage, type ContactMessage } from "@/lib/email/templates";

export const runtime = "nodejs";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const data: ContactMessage | null = body && {
    name: String(body.name ?? "").trim().slice(0, 100),
    email: String(body.email ?? "").trim().slice(0, 200),
    phone: String(body.phone ?? "").trim().slice(0, 50),
    topic: String(body.topic ?? "").trim().slice(0, 100),
    order: String(body.order ?? "").trim().slice(0, 50),
    message: String(body.message ?? "").trim().slice(0, 3000),
  };

  if (!data || !data.name || !EMAIL_RE.test(data.email) || !data.message || !data.topic) {
    return NextResponse.json({ error: "Please fill in all required fields correctly." }, { status: 400 });
  }

  const toOwner = ownerNewContactMessage(data);

  try {
    const ownerEmail = process.env.GMAIL_USER || process.env.OWNER_EMAIL || "oviyascrochet@gmail.com";
    await sendMail({ 
      to: ownerEmail, 
      replyTo: data.email, 
      ...toOwner 
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[CONTACT_EMAIL]", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
