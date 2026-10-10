import { Resend } from "resend";
import { prisma } from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Oviya's Crochet <orders@oviyas.in>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? "";

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status?: string;
  trackingNumber?: string;
  courierName?: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
  address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
}

function getEmailSubject(template: string, data: OrderEmailData): string {
  const subjects: Record<string, string> = {
    "order-confirmation": `Order confirmed — ${data.orderNumber}`,
    "admin-new-order": `🧶 New order: ${data.orderNumber} from ${data.customerName}`,
    "order-confirmed": `We're preparing your order — ${data.orderNumber}`,
    "order-in-production": `We've started crocheting your order! — ${data.orderNumber}`,
    "order-ready": `Your order is ready to ship — ${data.orderNumber}`,
    "order-shipped": `Your order is on its way! — ${data.orderNumber}`,
    "order-delivered": `Your order has arrived 🎉 — ${data.orderNumber}`,
    "order-cancelled": `Order cancelled — ${data.orderNumber}`,
    "order-refunded": `Refund processed — ${data.orderNumber}`,
    "welcome": "Welcome to Oviya's Crochet 🧶",
  };
  return subjects[template] ?? `Order update — ${data.orderNumber}`;
}

function buildEmailHtml(template: string, data: OrderEmailData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #CDBCEB;">
        <strong>${item.name}</strong> × ${item.quantity}
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #CDBCEB;text-align:right;font-weight:700;">
        ₹${(item.price * item.quantity).toLocaleString("en-IN")}
      </td>
    </tr>`
    )
    .join("");

  const statusMessages: Record<string, string> = {
    "order-in-production": "We've started crocheting your item(s) with love and care. ✨",
    "order-ready": "Your order has been carefully packed and is ready to be dispatched!",
    "order-shipped": `Your order is on its way! ${data.trackingNumber ? `Tracking: <strong>${data.trackingNumber}</strong>${data.courierName ? ` via ${data.courierName}` : ""}` : ""}`,
    "order-delivered": "Your order has been delivered! We hope you love it. Tag us on Instagram @oviyas_crochet 🌸",
    "order-cancelled": "Your order has been cancelled. If you paid online, a refund will be processed within 5–7 business days.",
    "order-refunded": "Your refund has been processed. It should appear in your account within 5–7 business days.",
  };

  const bodyMessage = statusMessages[template] ?? "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${getEmailSubject(template, data)}</title>
</head>
<body style="margin:0;padding:0;background:#F6F1FD;font-family:'DM Sans',Arial,sans-serif;font-size:15px;color:#2E2442;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding:24px 16px;">
      <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#FFF9F5;border-radius:22px;border:2px solid #CDBCEB;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:#D9C9F4;padding:20px 24px;border-bottom:2px dashed #CDBCEB;text-align:center;">
            <p style="margin:0;font-family:Baloo 2,Arial,sans-serif;font-size:22px;font-weight:700;color:#6F4FB0;">
              🧶 Oviya's Crochet
            </p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:24px;">
            <h1 style="font-size:20px;font-family:Baloo 2,Arial,sans-serif;margin:0 0 12px;">
              Hi ${data.customerName}! 👋
            </h1>
            ${template === "order-confirmation" ? `
            <p style="margin:0 0 16px;color:#6B5F82;">
              Thank you for your order! We've received it and will start stitching soon.
            </p>` : ""}
            ${bodyMessage ? `<p style="margin:0 0 16px;">${bodyMessage}</p>` : ""}

            <div style="background:#F6F1FD;border-radius:16px;padding:16px;margin-bottom:16px;">
              <p style="margin:0 0 8px;font-size:13px;color:#6B5F82;">ORDER NUMBER</p>
              <p style="margin:0;font-weight:700;font-size:18px;font-family:Baloo 2,Arial,sans-serif;color:#6F4FB0;">
                ${data.orderNumber}
              </p>
            </div>

            ${template !== "admin-new-order" && data.items.length > 0 ? `
            <table role="presentation" width="100%" style="margin-bottom:16px;" cellpadding="0" cellspacing="0">
              ${itemsHtml}
              <tr>
                <td style="padding-top:12px;font-weight:700;">Total</td>
                <td style="padding-top:12px;text-align:right;font-weight:700;font-size:18px;font-family:Baloo 2,Arial,sans-serif;color:#6F4FB0;">
                  ₹${data.total.toLocaleString("en-IN")}
                </td>
              </tr>
            </table>` : ""}

            ${data.address ? `
            <div style="background:#CFEBDD;border-radius:12px;padding:12px 16px;margin-bottom:16px;font-size:14px;">
              <strong>Shipping to:</strong><br>
              ${data.address.line1}, ${data.address.city}, ${data.address.state} — ${data.address.pincode}
            </div>` : ""}

            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/track" style="display:inline-block;background:#6F4FB0;color:#fff;border-radius:999px;padding:12px 24px;text-decoration:none;font-weight:700;margin-bottom:16px;">
              Track your order
            </a>

            <p style="margin:0;font-size:13px;color:#6B5F82;">
              Questions? Reply to this email or DM us on Instagram
              <a href="https://www.instagram.com/oviyas_crochet" style="color:#6F4FB0;">@oviyas_crochet</a>.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:16px 24px;border-top:2px dashed #CDBCEB;text-align:center;font-size:12px;color:#6B5F82;">
            Handmade with love in Kanniyakumari 🌸
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export async function sendEmail({
  to,
  subject,
  template,
  orderId,
  data,
}: {
  to: string;
  subject?: string;
  template: string;
  orderId?: string;
  data: OrderEmailData;
}): Promise<void> {
  const emailSubject = subject ?? getEmailSubject(template, data);
  const html = buildEmailHtml(template, data);

  let status = "SENT";
  let error: string | undefined;

  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject: emailSubject,
      html,
    });

    if (result.error) {
      // Retry once
      const retry = await resend.emails.send({ from: FROM, to, subject: emailSubject, html });
      if (retry.error) {
        status = "FAILED";
        error = JSON.stringify(retry.error);
      }
    }
  } catch (err) {
    status = "FAILED";
    error = String(err);
    // Never let email failure crash the request
  }

  // Log to DB (best-effort)
  try {
    await prisma.emailLog.create({
      data: { to, subject: emailSubject, template, orderId, status, error },
    });
  } catch { /* ignore log failure */ }
}

export async function sendOrderEmail(orderId: string, template: string): Promise<void> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) return;

    const address = order.shippingAddress as {
      line1: string; city: string; state: string; pincode: string;
    };

    const emailData: OrderEmailData = {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      total: Number(order.total),
      trackingNumber: order.trackingNumber ?? undefined,
      courierName: order.courierName ?? undefined,
      items: order.items.map((item: { nameSnapshot: string; quantity: number; finalUnitPrice: { toNumber(): number } | number; imageSnapshot: string }) => ({
        name: item.nameSnapshot,
        quantity: item.quantity,
        price: typeof item.finalUnitPrice === "object" ? item.finalUnitPrice.toNumber() : Number(item.finalUnitPrice),
        image: item.imageSnapshot,
      })),
      address,
    };

    const recipient = template === "admin-new-order" ? ADMIN_EMAIL : order.customerEmail;
    if (!recipient) return;

    await sendEmail({ to: recipient, template, orderId, data: emailData });
  } catch (err) {
    console.error("[EMAIL]", err);
  }
}
