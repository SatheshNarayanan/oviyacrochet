import { NextRequest, NextResponse } from "next/server";
import { sendMail, verifyMailer } from "@/lib/mailer";
import {
  orderConfirmation,
  orderStatusUpdate,
  ownerNewOrder,
  Order,
} from "@/lib/email/templates";

export const runtime = "nodejs";

const SAMPLE_ORDER: Order = {
  id: "OC-TEST-001",
  customerName: "Oviya Crochet Lover",
  customerEmail: "customer@example.com",
  customerPhone: "+91 98765 43210",
  items: [
    { name: "Handmade Cat Amigurumi (Pastel Mint)", qty: 1, price: 599 },
    { name: "Floral Crochet Shoulder Bag (Rose Pink)", qty: 1, price: 899 },
  ],
  subtotal: 1498,
  discountTotal: 100,
  shippingFee: 0,
  total: 1398,
  currency: "INR",
  paymentMethod: "Razorpay (Online)",
  paymentStatus: "PAID",
  paymentId: "pay_test_sample123",
  shippingAddress: {
    fullName: "Oviya Crochet Lover",
    phone: "+91 98765 43210",
    line1: "12 Beach Road, Near Cape Sunset Point",
    city: "Kanniyakumari",
    state: "Tamil Nadu",
    pincode: "629702",
  },
  date: "11 Oct 2026",
};

function getTemplate(name: string) {
  if (name === "shipped") {
    return orderStatusUpdate(SAMPLE_ORDER, "shipped", "DELHI-987654321 via Delhivery");
  }
  if (name === "admin") {
    return ownerNewOrder(SAMPLE_ORDER);
  }
  return orderConfirmation(SAMPLE_ORDER);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const preview = searchParams.get("preview");
  const send = searchParams.get("send");
  const to = searchParams.get("to");
  const templateName = searchParams.get("template") || "invoice";

  const mailObj = getTemplate(templateName);

  // 1. Direct HTML preview in browser
  if (preview === "true" || preview === "html" || preview === "1") {
    return new Response(mailObj.html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // 2. Direct send via query params (e.g. /api/test-email?send=1&to=my@email.com)
  if (send === "1" || send === "true" || to) {
    const recipient = to || process.env.OWNER_EMAIL || process.env.GMAIL_USER;
    if (!recipient) {
      return NextResponse.json(
        { ok: false, error: "No recipient specified. Provide ?to=your@email.com or set GMAIL_USER in .env" },
        { status: 400 }
      );
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json(
        {
          ok: false,
          error: "Gmail credentials not configured in .env",
          details: "Set GMAIL_USER and GMAIL_APP_PASSWORD in your .env file to send real emails.",
        },
        { status: 400 }
      );
    }

    try {
      await verifyMailer();
      await sendMail({
        to: recipient,
        subject: `[TEST] ${mailObj.subject}`,
        html: mailObj.html,
        text: mailObj.text,
      });

      return NextResponse.json({
        ok: true,
        message: `Test email (${templateName}) sent successfully to ${recipient}!`,
        subject: `[TEST] ${mailObj.subject}`,
      });
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: String(err) },
        { status: 500 }
      );
    }
  }

  // 3. If accessed in browser (accept: text/html), render an interactive testing console
  const acceptHeader = req.headers.get("accept") || "";
  if (acceptHeader.includes("text/html")) {
    const hasUser = !!process.env.GMAIL_USER;
    const hasPass = !!process.env.GMAIL_APP_PASSWORD;

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Oviya's Crochet — Email Tester</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F6F1FD; margin: 0; padding: 24px; color: #2E2442; }
    .container { max-width: 900px; margin: 0 auto; }
    .card { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(111,79,176,0.08); margin-bottom: 24px; border: 1px solid #E9E1F5; }
    h1 { margin: 0 0 8px; font-size: 24px; color: #473268; }
    p { margin: 0 0 16px; color: #6A617A; font-size: 14px; line-height: 1.5; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 700; }
    .badge-ok { background: #DEF7EC; color: #03543F; }
    .badge-warn { background: #FEF08A; color: #854D0E; }
    .row { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
    input, select, button { padding: 10px 14px; border-radius: 10px; font-size: 14px; font-family: inherit; }
    input, select { border: 1.5px solid #D8CEE8; outline: none; flex: 1; min-width: 220px; }
    button { background: #5CC9B3; color: #fff; border: 0; font-weight: 700; cursor: pointer; transition: background 0.15s; }
    button:hover { background: #49B8A1; }
    .btn-alt { background: #473268; }
    .btn-alt:hover { background: #34244F; }
    .iframe-box { width: 100%; height: 600px; border: 1px solid #E0D7EE; border-radius: 12px; background: #FAF8FD; }
    .notice { background: #EFF8F4; border-left: 4px solid #5CC9B3; padding: 12px 16px; border-radius: 0 10px 10px 0; margin-bottom: 20px; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
        <h1>🌸 Email Tester & Live Preview</h1>
        <div>
          <span class="badge ${hasUser ? "badge-ok" : "badge-warn"}">GMAIL_USER: ${hasUser ? "✓ Set" : "✗ Missing in .env"}</span>
          <span class="badge ${hasPass ? "badge-ok" : "badge-warn"}" style="margin-left:6px;">GMAIL_APP_PASSWORD: ${hasPass ? "✓ Set" : "✗ Missing in .env"}</span>
        </div>
      </div>
      <p>Test the branded email templates (with the unsqueezed logo, invoice table, and Kanniyakumari header). You can preview the email directly in the browser or send a live test to your inbox.</p>

      ${!hasUser || !hasPass ? `
      <div class="notice">
        <strong>⚠️ To send real emails:</strong> Add <code>GMAIL_USER=your-email@gmail.com</code> and <code>GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx</code> (16-char Google App Password) to your <code>.env</code> file. Browser preview below works right now without credentials!
      </div>` : ""}

      <form method="GET" action="/api/test-email" style="margin-bottom:18px;">
        <input type="hidden" name="send" value="true" />
        <div class="row">
          <input type="email" name="to" placeholder="Enter recipient email (e.g. your-name@gmail.com)" value="${process.env.GMAIL_USER || ""}" required />
          <select name="template" id="template-select" onchange="updatePreview(this.value)">
            <option value="invoice">Invoice & Order Confirmation</option>
            <option value="shipped">Order Shipped (with Tracking)</option>
            <option value="admin">Admin New Order Alert</option>
          </select>
          <button type="submit">Send Test Email</button>
          <a href="/api/test-email?preview=true" id="open-btn" target="_blank" style="text-decoration:none;">
            <button type="button" class="btn-alt">Open Full Preview ↗</button>
          </a>
        </div>
      </form>

      <h3 style="margin:20px 0 12px;font-size:16px;color:#473268;">Live Browser Preview:</h3>
      <iframe id="preview-frame" class="iframe-box" src="/api/test-email?preview=true&template=invoice"></iframe>
    </div>
  </div>

  <script>
    function updatePreview(val) {
      document.getElementById('preview-frame').src = '/api/test-email?preview=true&template=' + val;
      document.getElementById('open-btn').href = '/api/test-email?preview=true&template=' + val;
    }
  </script>
</body>
</html>`;
    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  // 4. Fallback JSON info
  return NextResponse.json({
    ok: true,
    info: "Oviya's Crochet Email Test API",
    endpoints: {
      browserTester: "/api/test-email",
      directHtmlPreview: "/api/test-email?preview=true&template=invoice",
      sendEmail: "/api/test-email?send=true&to=recipient@gmail.com&template=invoice",
    },
    configured: {
      GMAIL_USER: !!process.env.GMAIL_USER,
      GMAIL_APP_PASSWORD: !!process.env.GMAIL_APP_PASSWORD,
      OWNER_EMAIL: process.env.OWNER_EMAIL || "oviyascrochet@gmail.com",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const recipient = body.to || process.env.OWNER_EMAIL || process.env.GMAIL_USER;
    const templateName = body.template || "invoice";

    if (!recipient) {
      return NextResponse.json({ ok: false, error: "Recipient email is required in JSON body: { to: 'email' }" }, { status: 400 });
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json(
        { ok: false, error: "GMAIL_USER or GMAIL_APP_PASSWORD missing in .env" },
        { status: 400 }
      );
    }

    const mailObj = getTemplate(templateName);
    await verifyMailer();
    await sendMail({
      to: recipient,
      subject: `[TEST] ${mailObj.subject}`,
      html: mailObj.html,
      text: mailObj.text,
    });

    return NextResponse.json({
      ok: true,
      message: `Test email (${templateName}) sent to ${recipient}!`,
      subject: `[TEST] ${mailObj.subject}`,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

