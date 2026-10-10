# Gmail Email Setup for Oviyas Crochet (Next.js)

Guide for sending order and update emails from the Next.js app using **oviyascrochet@gmail.com**.

---

## 1. Overview

| Item | Decision |
|---|---|
| Sender account | `oviyascrochet@gmail.com` |
| Library | [Nodemailer](https://nodemailer.com) |
| Transport | Gmail SMTP (`smtp.gmail.com`, port 465, SSL) |
| Authentication | Google **App Password** (needs 2-Step Verification) |
| Runs on | Server only: API routes / server actions (Node.js runtime) |

**Emails the app will send**

1. **Order confirmation** to the customer when an order is placed.
2. **Order status updates** to the customer (confirmed, in progress, shipped, delivered).
3. **Custom order request received** to the customer ("We'll reach back to you by email").
4. **New order / new custom request alert** to the shop owner (so you never miss one).

**Important facts about Gmail sending**

- Gmail always uses the authenticated account as the sender. `From` will show `oviyascrochet@gmail.com` regardless of what you set.
- Personal Gmail allows about **500 recipients per rolling 24 hours**. Going over returns error `550 5.4.5`.
- SMTP allows at most **100 recipients per message**.
- Regular account passwords no longer work for SMTP. You must use an App Password (or OAuth 2.0).
- For a small shop this is fine. If orders grow or emails land in spam, see section 12 for upgrade options.

---

## 2. One-time Google account setup

You need access to the `oviyascrochet@gmail.com` account.

1. Go to **myaccount.google.com → Security**.
2. Turn on **2-Step Verification** (required; App Passwords do not appear without it).
3. Open **https://myaccount.google.com/apppasswords**.
4. Create a new App Password. Name it `Oviyas website`.
5. Copy the 16-character password Google shows. **You will not see it again.** Remove spaces when pasting it into the env file.
6. Keep the Gmail account's recovery phone/email up to date, so you can regain access if needed.

If the App Passwords page is missing: 2-Step Verification is not on, or the account is a Workspace account whose admin has disabled it.

---

## 3. Environment variables

Create `.env.local` in the project root (already ignored by git in a default Next.js project; confirm `.env*.local` is in `.gitignore`):

```env
GMAIL_USER=oviyascrochet@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop

# Where owner alerts go (can be the same address)
OWNER_EMAIL=oviyascrochet@gmail.com

# Used for links inside emails
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Rules:

- Never prefix the Gmail variables with `NEXT_PUBLIC_`. That would expose them in the browser.
- Add the same variables in your hosting dashboard (Vercel: **Project → Settings → Environment Variables**), then redeploy.
- Never commit the App Password or paste it into chat, tickets or screenshots. If it leaks, revoke it at the App Passwords page and create a new one.

---

## 4. Install

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

---

## 5. Mailer utility

`lib/mailer.ts`

```ts
import nodemailer from "nodemailer";

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;

if (!user || !pass) {
  throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be set");
}

// Reuse one transporter per server instance
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user, pass },
});

export type MailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string; // plain-text fallback, helps deliverability
  replyTo?: string;
};

export async function sendMail({ to, subject, html, text, replyTo }: MailInput) {
  return transporter.sendMail({
    from: `"Oviyas Crochet" <${user}>`,
    to,
    subject,
    html,
    text,
    replyTo: replyTo ?? user,
  });
}

// Use in a test route to confirm the credentials work
export async function verifyMailer() {
  return transporter.verify();
}
```

> This file must only be imported from server code (route handlers, server actions, server components). Never import it in a `"use client"` file.

---

## 6. Email templates

Keep templates in one place so wording and styling stay consistent.

`lib/email/templates.ts`

```ts
const BRAND = {
  name: "Oviyas Crochet",
  pink: "#f06aa0",
  navy: "#1e3350",
  bg: "#edf4fb",
};

// Escape anything that came from a user before putting it into HTML
export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function layout(title: string, bodyHtml: string) {
  return `<!doctype html>
<html>
<body style="margin:0;padding:24px;background:${BRAND.bg};font-family:Arial,Helvetica,sans-serif;color:${BRAND.navy};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background:${BRAND.navy};padding:20px 28px;color:#ffffff;font-size:20px;font-weight:bold;">
          ${BRAND.name}
        </td></tr>
        <tr><td style="padding:28px;line-height:1.6;font-size:15px;">
          <h1 style="margin:0 0 16px;font-size:22px;color:${BRAND.navy};">${esc(title)}</h1>
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:16px 28px;background:#f6f9fd;font-size:12px;color:#55627a;">
          Handmade with love by ${BRAND.name}. Just reply to this email if you have any questions.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export type OrderItem = { name: string; qty: number; price: number };
export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  currency?: string; // e.g. "INR"
};

const money = (n: number, c = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: c }).format(n);

/* 1. Order confirmation (to customer) */
export function orderConfirmation(order: Order) {
  const rows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;">${esc(i.name)} × ${i.qty}</td>
         <td align="right">${money(i.price * i.qty, order.currency)}</td></tr>`
    )
    .join("");

  const html = layout(
    `Thank you, ${order.customerName}!`,
    `<p>We've received your order <strong>#${esc(order.id)}</strong>. We'll start on it soon and keep you updated by email.</p>
     <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e3ebf5;border-bottom:1px solid #e3ebf5;margin:16px 0;">
       ${rows}
       <tr><td style="padding:10px 0;font-weight:bold;">Total</td>
           <td align="right" style="font-weight:bold;">${money(order.total, order.currency)}</td></tr>
     </table>`
  );

  const text = `Thank you, ${order.customerName}!\n\nWe've received your order #${order.id}.\n${order.items
    .map((i) => `- ${i.name} x ${i.qty}`)
    .join("\n")}\nTotal: ${money(order.total, order.currency)}\n\nWe'll keep you updated by email.`;

  return { subject: `Order #${order.id} received - Oviyas Crochet`, html, text };
}

/* 2. Status update (to customer) */
export type OrderStatus = "confirmed" | "in_progress" | "shipped" | "delivered";

const STATUS_COPY: Record<OrderStatus, { subject: string; message: string }> = {
  confirmed: { subject: "Your order is confirmed", message: "Your order is confirmed and in our queue." },
  in_progress: { subject: "We've started crocheting", message: "We've started crocheting your order." },
  shipped: { subject: "Your order is on its way", message: "Your order has been shipped." },
  delivered: { subject: "Your order was delivered", message: "Your order has been delivered. We hope you love it!" },
};

export function orderStatusUpdate(order: Order, status: OrderStatus, trackingInfo?: string) {
  const c = STATUS_COPY[status];
  const tracking = trackingInfo ? `<p><strong>Tracking:</strong> ${esc(trackingInfo)}</p>` : "";
  const html = layout(c.subject, `<p>Hi ${esc(order.customerName)},</p><p>${c.message}</p>${tracking}<p>Order <strong>#${esc(order.id)}</strong></p>`);
  const text = `Hi ${order.customerName},\n\n${c.message}\n${trackingInfo ? `Tracking: ${trackingInfo}\n` : ""}Order #${order.id}`;
  return { subject: `${c.subject} - Order #${order.id}`, html, text };
}

/* 3. Custom request received (to customer) */
export type CustomRequest = {
  name: string;
  email: string;
  character?: string;
  details: string;
};

export function customRequestReceived(req: CustomRequest) {
  const html = layout(
    "We got your custom request",
    `<p>Hi ${esc(req.name)},</p>
     <p>Thank you for your custom request${req.character ? ` for <strong>${esc(req.character)}</strong>` : ""}. <strong>We'll reach back to you by email</strong> to confirm the design and price. We start crocheting only after you approve.</p>
     <p style="color:#55627a;">Your message:<br>${esc(req.details).replace(/\n/g, "<br>")}</p>`
  );
  const text = `Hi ${req.name},\n\nThank you for your custom request${req.character ? ` for ${req.character}` : ""}. We'll reach back to you by email to confirm the design and price. We start crocheting only after you approve.\n\nYour message:\n${req.details}`;
  return { subject: "We received your custom request - Oviyas Crochet", html, text };
}

/* 4. Owner alerts */
export function ownerNewOrder(order: Order) {
  const html = layout(
    `New order #${order.id}`,
    `<p><strong>${esc(order.customerName)}</strong> (${esc(order.customerEmail)})</p>
     <p>${order.items.map((i) => `${esc(i.name)} × ${i.qty}`).join("<br>")}</p>
     <p><strong>Total:</strong> ${money(order.total, order.currency)}</p>`
  );
  const text = `New order #${order.id}\n${order.customerName} (${order.customerEmail})\n${order.items.map((i) => `${i.name} x ${i.qty}`).join("\n")}\nTotal: ${money(order.total, order.currency)}`;
  return { subject: `New order #${order.id}`, html, text };
}

export function ownerNewCustomRequest(req: CustomRequest) {
  const html = layout(
    "New custom request",
    `<p><strong>${esc(req.name)}</strong> (${esc(req.email)})</p>
     <p><strong>Character / idea:</strong> ${esc(req.character || "-")}</p>
     <p>${esc(req.details).replace(/\n/g, "<br>")}</p>
     <p>Reply to this email to answer the customer directly.</p>`
  );
  const text = `New custom request\n${req.name} (${req.email})\nCharacter: ${req.character || "-"}\n\n${req.details}`;
  return { subject: `Custom request from ${req.name}`, html, text };
}
```

> Escape every user-provided value with `esc()` before it goes into HTML. This stops customers (or bots) injecting HTML or links into your emails.

---

## 7. Hooking it into the app

### 7.1 Custom order request (the "Request a custom piece" page)

`app/api/custom-request/route.ts`

```ts
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";
import {
  customRequestReceived,
  ownerNewCustomRequest,
  type CustomRequest,
} from "@/lib/email/templates";

export const runtime = "nodejs"; // Nodemailer does not run on the Edge runtime

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const data: CustomRequest | null = body && {
    name: String(body.name ?? "").trim().slice(0, 100),
    email: String(body.email ?? "").trim().slice(0, 200),
    character: String(body.character ?? "").trim().slice(0, 150),
    details: String(body.details ?? "").trim().slice(0, 3000),
  };

  if (!data || !data.name || !EMAIL_RE.test(data.email) || !data.details) {
    return NextResponse.json({ error: "Please fill in your name, a valid email and details." }, { status: 400 });
  }

  // 1. Save the request in your database here FIRST (so it is never lost if email fails)

  // 2. Send both emails; one failing should not hide the other
  const toCustomer = customRequestReceived(data);
  const toOwner = ownerNewCustomRequest(data);

  const results = await Promise.allSettled([
    sendMail({ to: data.email, ...toCustomer }),
    sendMail({ to: process.env.OWNER_EMAIL!, replyTo: data.email, ...toOwner }),
  ]);

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`[email] custom-request mail ${i} failed:`, r.reason);
    }
  });

  return NextResponse.json({ ok: true });
}
```

Notes:

- `replyTo: data.email` on the owner alert means pressing Reply in Gmail answers the customer directly.
- The response is `ok` even if the email fails, because the request itself was saved. Check your logs (or build a retry, section 9) for failed emails.

### 7.2 Order placed

```ts
// inside your order-creation route/server action, AFTER the order is saved
import { sendMail } from "@/lib/mailer";
import { orderConfirmation, ownerNewOrder } from "@/lib/email/templates";

const confirm = orderConfirmation(order);
const alert = ownerNewOrder(order);

await Promise.allSettled([
  sendMail({ to: order.customerEmail, ...confirm }),
  sendMail({ to: process.env.OWNER_EMAIL!, replyTo: order.customerEmail, ...alert }),
]);
```

### 7.3 Status updates (admin changes an order's status)

```ts
import { sendMail } from "@/lib/mailer";
import { orderStatusUpdate, type OrderStatus } from "@/lib/email/templates";

export async function updateOrderStatus(orderId: string, status: OrderStatus, tracking?: string) {
  // 1. Update status in the database, load the order
  const order = await getOrder(orderId); // your own function

  // 2. Notify the customer
  const mail = orderStatusUpdate(order, status, tracking);
  try {
    await sendMail({ to: order.customerEmail, ...mail });
  } catch (err) {
    console.error("[email] status update failed", orderId, err);
  }
}
```

---

## 8. Serverless hosting notes (Vercel and similar)

- **Always `await` the send** inside the request. On serverless platforms the function can be frozen as soon as the response is returned, so un-awaited emails may never leave.
- Use the **Node.js runtime** (`export const runtime = "nodejs"`) for any route that sends mail.
- Keep each request fast: send the customer and owner emails in parallel (`Promise.allSettled`).
- Do not send many emails in one request (for example, a newsletter to hundreds of people). Use a queue or a proper email service for that.

---

## 9. Error handling and reliability

1. **Save first, email second.** An order or request must be stored in your database before any email is attempted.
2. **Never fail the order because email failed.** Catch errors, log them, and continue.
3. **Track email status.** Add an `emailStatus` field (`pending`, `sent`, `failed`) to orders/requests. Set it after each send so you can see what needs resending.
4. **Simple retry.** For failures, retry once or twice with a short delay; for anything longer, resend later from an admin page or a scheduled job.
5. **Watch the daily cap.** At about 500 recipients per day, Gmail starts rejecting messages. Each order sends 2 emails (customer and owner), so that is roughly 250 orders a day, plenty for now.

---

## 10. Testing

**Temporary test route** (delete before going live, or protect it):

`app/api/test-email/route.ts`

```ts
import { NextResponse } from "next/server";
import { sendMail, verifyMailer } from "@/lib/mailer";

export const runtime = "nodejs";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }
  await verifyMailer(); // throws if login fails
  await sendMail({
    to: process.env.OWNER_EMAIL!,
    subject: "Oviyas test email",
    html: "<p>If you can read this, Gmail sending works.</p>",
    text: "If you can read this, Gmail sending works.",
  });
  return NextResponse.json({ ok: true });
}
```

Test checklist:

- [ ] `GET /api/test-email` returns `{ ok: true }` and the email arrives.
- [ ] Check the **Spam** folder on first send; mark as "Not spam".
- [ ] Place a test order with your own personal email as the customer.
- [ ] Submit the custom request form; confirm both the customer and owner emails arrive.
- [ ] Change an order status; confirm the update email arrives.
- [ ] View an email on mobile and in dark mode.
- [ ] Try a name like `<b>Test</b>` in the form; confirm it shows as plain text in the email (escaping works).

---

## 11. Security checklist

- [ ] App Password is only in env vars, never in code, git, or client bundles.
- [ ] All user input is validated (length, email format) and escaped with `esc()`.
- [ ] Forms are protected against spam bots: add a hidden honeypot field, a rate limit per IP (for example Upstash Ratelimit), or a CAPTCHA such as Cloudflare Turnstile. Without this, bots can use your forms to burn through the 500/day cap.
- [ ] The recipient of customer emails always comes from the saved order, never directly from an unvalidated URL parameter.
- [ ] Test route is removed or disabled in production.
- [ ] App Password is revoked and replaced if anyone who had it leaves the project.

---

## 12. Limits, deliverability and upgrade path

- **Spam folder:** emails from a Gmail address sent through SMTP are generally trusted by Gmail, but other providers may still filter them. Keep subjects plain, include a plain-text version (already done above), and avoid ALL CAPS or lots of links.
- **Customer expectations:** tell customers on the checkout and request pages to **check spam** for emails from `oviyascrochet@gmail.com`.
- **Sender name:** Gmail will show the account's name. Set the display name to "Oviyas Crochet" in Gmail: **Settings → Accounts → Send mail as → edit info**.
- **When to move off Gmail SMTP:** if you pass a few hundred emails a day, want emails from a custom domain (for example `hello@oviyascrochet.com`) with proper SPF/DKIM, or want open/delivery tracking, switch to a transactional service such as Resend, Brevo or Amazon SES. Because everything goes through `sendMail()` in `lib/mailer.ts`, you only need to change that one file.
- **OAuth 2.0 alternative:** Nodemailer also supports Gmail OAuth 2.0 (client ID, secret and refresh token from Google Cloud Console). It avoids storing a password but takes longer to set up. An App Password is fine for a small shop.

---

## 13. Troubleshooting

| Error | Meaning | Fix |
|---|---|---|
| `534-5.7.9 Application-specific password required` | Account has 2-Step Verification but you used the normal password | Use an App Password |
| `535-5.7.8 Username and Password not accepted` | Wrong or revoked App Password, or the account password changed | Create a new App Password and update env vars |
| `550 5.4.5 Daily user sending limit exceeded` | Hit the daily cap | Wait up to 24 hours; reduce sends or move to a transactional service |
| `ETIMEDOUT` / `ECONNECTION` | Network or firewall blocking port 465 | Try port 587 with `secure: false`; check hosting network settings |
| Works locally, fails after deploy | Env vars missing in hosting dashboard | Add them and redeploy |
| Emails arrive late or never (serverless) | Send was not awaited | `await sendMail(...)` before returning the response |
| `Cannot find module 'nodemailer'` on edge | Route is running on Edge runtime | Add `export const runtime = "nodejs"` |
| Emails in spam | Content or sender reputation | See section 12 |

Port 587 alternative:

```ts
nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrades with STARTTLS
  auth: { user, pass },
});
```

---

## 14. Build checklist

- [ ] 2-Step Verification on, App Password created
- [ ] `.env.local` filled and hosting env vars added
- [ ] `npm install nodemailer @types/nodemailer`
- [ ] `lib/mailer.ts` created
- [ ] `lib/email/templates.ts` created
- [ ] `/api/custom-request` route wired to the "Request a custom piece" form
- [ ] Order creation sends customer confirmation + owner alert
- [ ] Status changes send update emails
- [ ] `emailStatus` tracking added to orders/requests
- [ ] Spam protection (honeypot / rate limit) on public forms
- [ ] All tests in section 10 pass
- [ ] Test route removed or disabled in production