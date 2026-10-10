import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";
import {
  customRequestReceived,
  ownerNewCustomRequest,
  type CustomRequest,
} from "@/lib/email/templates";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  
  if (body?.website) {
    // Honeypot filled, ignore silently
    return NextResponse.json({ ok: true });
  }

  const data: CustomRequest | null = body && {
    name: String(body.name ?? "").trim().slice(0, 100),
    email: String(body.email ?? "").trim().slice(0, 200),
    phone: String(body.phone ?? "").trim().slice(0, 50),
    itemType: String(body.itemType ?? "").trim().slice(0, 100),
    character: String(body.character ?? "").trim().slice(0, 150),
    size: String(body.size ?? "").trim().slice(0, 100),
    colours: String(body.colours ?? "").trim().slice(0, 200),
    neededBy: String(body.neededBy ?? "").trim().slice(0, 50),
    referenceLinks: String(body.referenceLinks ?? "").trim().slice(0, 1000),
    details: String(body.details ?? "").trim().slice(0, 3000),
    consent: Boolean(body.consent),
  };

  if (!data || !data.name || !EMAIL_RE.test(data.email) || !data.itemType || !data.size || !data.details) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  if (!data.consent) {
    return NextResponse.json({ error: "You must agree to be contacted to submit a request." }, { status: 400 });
  }

  // 1. Send both emails; one failing should not hide the other
  const toCustomer = customRequestReceived(data);
  const toOwner = ownerNewCustomRequest(data);

  const results = await Promise.allSettled([
    sendMail({ to: data.email, ...toCustomer }),
    sendMail({ to: process.env.OWNER_EMAIL || "oviyascrochet@gmail.com", replyTo: data.email, ...toOwner }),
  ]);

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`[email] custom-request mail ${i} failed:`, r.reason);
    }
  });

  return NextResponse.json({ ok: true });
}
