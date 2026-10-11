const BRAND = {
  name: "Oviyas Crochet",
  pri: "#6F4FB0",
  mint: "#5CC9B3",
  pink: "#F58FB5",
  ink: "#2E2442",
  bg: "#F6F1FD",
  logo: "https://pub-f4009fab71cc4affa9a480dfa912e095.r2.dev/app/oc-logo.png",
  siteUrl: "https://oviyascrochet.ignisailabs.com",
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
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
</head>
<body style="margin:0;padding:24px 12px;background:#F6F1FD;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2E2442;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #E9E1F5;box-shadow:0 8px 30px rgba(111,79,176,0.06);">
        <!-- Header with Official Logo -->
        <tr>
          <td align="center" style="background:linear-gradient(135deg, #2E2442 0%, #473268 100%);padding:32px 24px;text-align:center;">
            <a href="${BRAND.siteUrl}" target="_blank" style="text-decoration:none;display:inline-block;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 12px;border-collapse:separate;">
                <tr>
                  <td align="center" valign="middle" width="90" height="90" style="width:90px;height:90px;background:#ffffff;border-radius:50%;border:3px solid rgba(255,255,255,0.25);text-align:center;vertical-align:middle;padding:0;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                    <img src="${BRAND.logo}" alt="${BRAND.name}" width="78" height="41" style="width:78px;height:41px;display:block;margin:0 auto;border:0;outline:none;" />
                  </td>
                </tr>
              </table>
              <div style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;margin-bottom:4px;">${BRAND.name}</div>
              <div style="color:#CFEBDD;font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:600;">Handmade with love in Kanniyakumari 🌸</div>
            </a>
          </td>
        </tr>
        <!-- Body Content -->
        <tr>
          <td style="padding:32px 28px;line-height:1.6;font-size:15px;color:#2E2442;">
            ${bodyHtml}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 28px;background:#FAF8FD;font-size:12px;color:#7A708C;text-align:center;border-top:1px solid #EFEAF7;">
            <p style="margin:0 0 8px;font-weight:600;color:#2E2442;">Oviyas Crochet • Handmade Craft Studio</p>
            <p style="margin:0 0 8px;">Kanniyakumari, Tamil Nadu, India • <a href="https://instagram.com/oviyas_crochet" target="_blank" style="color:#6F4FB0;text-decoration:none;font-weight:600;">@oviyas_crochet</a></p>
            <p style="margin:0;font-size:11px;color:#9B92AB;">Need help with your invoice? Simply reply to this email or reach us at <a href="mailto:contact.oviyascrochet@gmail.com" style="color:#6F4FB0;text-decoration:none;">contact.oviyascrochet@gmail.com</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export type OrderItem = { name: string; qty: number; price: number };

export type ShippingAddress = {
  fullName?: string;
  phone?: string;
  line1?: string;
  line2?: string | null;
  city?: string;
  state?: string;
  pincode?: string;
};

export type Order = {
  id: string; // Order Number
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal?: number;
  discountTotal?: number;
  shippingFee?: number;
  total: number;
  currency?: string; // e.g. "INR"
  paymentMethod?: string;
  paymentStatus?: string;
  paymentId?: string; // Razorpay payment ID
  shippingAddress?: ShippingAddress;
  date?: string;
};

const money = (n: number, c = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: c }).format(n);

function renderOrderItems(order: Order) {
  const rows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #E8EBEA;">${esc(i.name)} × ${i.qty}</td>
         <td align="right" style="border-bottom:1px solid #E8EBEA;">${money(i.price * i.qty, order.currency)}</td></tr>`
    )
    .join("");

  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
       ${rows}
       <tr><td style="padding:12px 0;font-weight:bold;">Total</td>
           <td align="right" style="font-weight:bold;">${money(order.total, order.currency)}</td></tr>
     </table>`;
}

function renderOrderItemsText(order: Order) {
  return order.items
    .map((i) => `- ${i.name} x ${i.qty} (${money(i.price * i.qty, order.currency)})`)
    .join("\n") + `\nTotal: ${money(order.total, order.currency)}`;
}

/* 1. Order confirmation / Invoice (to customer) */
export function orderConfirmation(order: Order) {
  const isPaid = order.paymentStatus === "PAID" || order.paymentMethod?.toLowerCase().includes("razorpay");
  const paymentBadge = isPaid
    ? `<span style="display:inline-block;background:#D1E7DD;color:#0F5132;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.5px;">PAID</span>`
    : `<span style="display:inline-block;background:#FFF3CD;color:#664D03;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.5px;">CASH ON DELIVERY</span>`;

  const addr = order.shippingAddress;
  const formattedAddress = addr
    ? [
      addr.fullName && `<strong>${esc(addr.fullName)}</strong>`,
      addr.phone && `Phone: ${esc(addr.phone)}`,
      addr.line1 && esc(addr.line1),
      addr.line2 && esc(addr.line2),
      (addr.city || addr.state || addr.pincode) &&
      `${esc(addr.city || "")}${addr.city && addr.state ? ", " : ""}${esc(addr.state || "")} ${esc(addr.pincode ? `- ${addr.pincode}` : "")}`,
    ]
      .filter(Boolean)
      .join("<br>")
    : "";

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 8px;border-bottom:1px solid #EFEAF7;font-size:14px;color:#2E2442;">
          <strong>${esc(item.name)}</strong>
        </td>
        <td align="center" style="padding:12px 8px;border-bottom:1px solid #EFEAF7;font-size:14px;color:#6A617A;">
          ${item.qty}
        </td>
        <td align="right" style="padding:12px 8px;border-bottom:1px solid #EFEAF7;font-size:14px;color:#6A617A;">
          ${money(item.price, order.currency)}
        </td>
        <td align="right" style="padding:12px 8px;border-bottom:1px solid #EFEAF7;font-size:14px;font-weight:600;color:#2E2442;">
          ${money(item.price * item.qty, order.currency)}
        </td>
      </tr>`
    )
    .join("");

  const subtotalRow = order.subtotal !== undefined
    ? `<tr>
        <td colspan="3" align="right" style="padding:8px 8px 4px;font-size:13px;color:#7A708C;">Subtotal:</td>
        <td align="right" style="padding:8px 8px 4px;font-size:13px;font-weight:600;color:#2E2442;">${money(order.subtotal, order.currency)}</td>
      </tr>`
    : "";

  const discountRow = order.discountTotal && order.discountTotal > 0
    ? `<tr>
        <td colspan="3" align="right" style="padding:4px 8px;font-size:13px;color:#2E7D32;">Discount:</td>
        <td align="right" style="padding:4px 8px;font-size:13px;font-weight:600;color:#2E7D32;">−${money(order.discountTotal, order.currency)}</td>
      </tr>`
    : "";

  const shippingRow = order.shippingFee !== undefined
    ? `<tr>
        <td colspan="3" align="right" style="padding:4px 8px;font-size:13px;color:#7A708C;">Shipping:</td>
        <td align="right" style="padding:4px 8px;font-size:13px;font-weight:600;color:${order.shippingFee === 0 ? "#2E7D32" : "#2E2442"};">
          ${order.shippingFee === 0 ? "Free" : money(order.shippingFee, order.currency)}
        </td>
      </tr>`
    : "";

  const totalRow = `
    <tr>
      <td colspan="3" align="right" style="padding:12px 8px 4px;font-size:15px;font-weight:700;color:#2E2442;border-top:2px solid #E0D7EE;">Total Paid:</td>
      <td align="right" style="padding:12px 8px 4px;font-size:18px;font-weight:800;color:#6F4FB0;border-top:2px solid #E0D7EE;">
        ${money(order.total, order.currency)}
      </td>
    </tr>`;

  const bodyHtml = `
    <div style="margin-bottom:24px;">
      <h2 style="margin:0 0 6px;font-size:22px;color:#2E2442;">Payment Confirmed 🎉</h2>
      <p style="margin:0;font-size:14px;color:#6A617A;">
        Hi ${esc(order.customerName)}, thank you for your order! Here is your official order invoice and receipt.
      </p>
    </div>

    <!-- Invoice Summary Box -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8FD;border:1px solid #E9E1F5;border-radius:12px;margin-bottom:24px;border-collapse:separate;">
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#7A708C;width:50%;border-bottom:1px solid #EFEAF7;">
          <div style="font-size:11px;text-transform:uppercase;font-weight:700;color:#7A708C;letter-spacing:0.5px;margin-bottom:4px;">Invoice / Order #</div>
          <span style="font-family:monospace;font-size:15px;color:#2E2442;font-weight:700;">#${esc(order.id)}</span>
        </td>
        <td style="padding:14px 16px;font-size:13px;color:#7A708C;width:50%;text-align:right;border-bottom:1px solid #EFEAF7;">
          <div style="font-size:11px;text-transform:uppercase;font-weight:700;color:#7A708C;letter-spacing:0.5px;margin-bottom:4px;">Date</div>
          <span style="color:#2E2442;font-weight:600;">${esc(order.date || "Today")}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#7A708C;">
          <div style="font-size:11px;text-transform:uppercase;font-weight:700;color:#7A708C;letter-spacing:0.5px;margin-bottom:4px;">Payment Method</div>
          <span style="color:#2E2442;font-weight:600;">${esc(order.paymentMethod || "Razorpay (Online)")}</span>
          ${order.paymentId ? `<div style="font-size:11px;color:#9B92AB;font-family:monospace;margin-top:2px;">ID: ${esc(order.paymentId)}</div>` : ""}
        </td>
        <td style="padding:14px 16px;font-size:13px;color:#7A708C;text-align:right;">
          <div style="font-size:11px;text-transform:uppercase;font-weight:700;color:#7A708C;letter-spacing:0.5px;margin-bottom:4px;">Status</div>
          ${paymentBadge}
        </td>
      </tr>
    </table>

    <!-- Shipping Address Box -->
    ${formattedAddress ? `
    <div style="background:#FFFFFF;border:1px solid #EFEAF7;border-radius:12px;padding:16px;margin-bottom:24px;">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:700;color:#6F4FB0;margin-bottom:8px;">
        📦 Delivery Address
      </div>
      <div style="font-size:13px;line-height:1.6;color:#4A415A;">
        ${formattedAddress}
      </div>
    </div>` : ""}

    <!-- Items Table -->
    <div style="margin-bottom:24px;">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:700;color:#6F4FB0;margin-bottom:10px;">
        🧶 Invoice Details
      </div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
        <thead>
          <tr style="background:#F2EDF9;border-bottom:2px solid #E0D7EE;">
            <th align="left" style="padding:10px 8px;font-size:12px;font-weight:700;color:#53436B;text-transform:uppercase;letter-spacing:0.5px;">Item</th>
            <th align="center" style="padding:10px 8px;font-size:12px;font-weight:700;color:#53436B;text-transform:uppercase;letter-spacing:0.5px;width:40px;">Qty</th>
            <th align="right" style="padding:10px 8px;font-size:12px;font-weight:700;color:#53436B;text-transform:uppercase;letter-spacing:0.5px;width:80px;">Price</th>
            <th align="right" style="padding:10px 8px;font-size:12px;font-weight:700;color:#53436B;text-transform:uppercase;letter-spacing:0.5px;width:90px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          ${subtotalRow}
          ${discountRow}
          ${shippingRow}
          ${totalRow}
        </tbody>
      </table>
    </div>

    <!-- Crafting Timeline Box -->
    <div style="background:#EFF8F4;border-left:4px solid #5CC9B3;padding:14px 16px;border-radius:0 10px 10px 0;margin-bottom:16px;">
      <div style="font-weight:700;color:#1B5E4B;font-size:13px;margin-bottom:4px;">✨ What happens next?</div>
      <div style="color:#2E4A40;font-size:13px;line-height:1.5;">
        Every piece is made to order by Oviya and her team in Kanniyakumari. Your order is scheduled for production (5–7 business days). We'll send you tracking updates as soon as it's on its way!
      </div>
    </div>
  `;

  const html = layout(`Invoice #${order.id} - ${BRAND.name}`, bodyHtml);
  const text = `Invoice #${order.id}\nThank you, ${order.customerName}!\n\nOrder: #${order.id}\nStatus: ${order.paymentStatus || "PAID"}\n${order.paymentId ? `Transaction ID: ${order.paymentId}\n` : ""}\nItems:\n${renderOrderItemsText(order)}\n\nDelivery Address:\n${addr?.fullName || order.customerName}\n${addr?.line1 || ""}, ${addr?.city || ""} ${addr?.pincode || ""}\n\nHandmade with love by Oviyas Crochet.`;

  return { subject: `Invoice & Order Confirmation #${order.id} - Oviyas Crochet`, html, text };
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
  const html = layout(
    c.subject,
    `<p>Hi ${esc(order.customerName)},</p>
     <p>${c.message}</p>
     ${tracking}
     <p style="margin-top:24px;margin-bottom:8px;font-weight:bold;color:${BRAND.ink};">Order #${esc(order.id)} Details:</p>
     ${renderOrderItems(order)}`
  );
  const text = `Hi ${order.customerName},\n\n${c.message}\n${trackingInfo ? `Tracking: ${trackingInfo}\n` : ""}\nOrder #${order.id} Details:\n${renderOrderItemsText(order)}`;
  return { subject: `${c.subject} - Order #${order.id}`, html, text };
}

/* 3. Custom request received (to customer) */
export type CustomRequest = {
  name: string;
  email: string;
  phone?: string;
  itemType: string;
  character?: string;
  size: string;
  colours?: string;
  neededBy?: string;
  referenceLinks?: string;
  details: string;
  consent: boolean;
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
     ${req.phone ? `<p><strong>Phone:</strong> ${esc(req.phone)}</p>` : ""}
     <p><strong>Item:</strong> ${esc(req.itemType)}</p>
     <p><strong>Character / idea:</strong> ${esc(req.character || "-")}</p>
     <p><strong>Size / Age:</strong> ${esc(req.size)}</p>
     ${req.colours ? `<p><strong>Colours:</strong> ${esc(req.colours)}</p>` : ""}
     ${req.neededBy ? `<p><strong>Needed by:</strong> ${esc(req.neededBy)}</p>` : ""}
     ${req.referenceLinks ? `<p><strong>Reference Links:</strong> ${esc(req.referenceLinks)}</p>` : ""}
     <p style="margin-top:16px;"><strong>Details:</strong></p>
     <p>${esc(req.details).replace(/\n/g, "<br>")}</p>
     <p style="margin-top:24px;">Reply to this email to answer the customer directly.</p>`
  );
  const text = `New custom request\n${req.name} (${req.email})\nPhone: ${req.phone || "-"}\nItem: ${req.itemType}\nCharacter: ${req.character || "-"}\nSize: ${req.size}\nColours: ${req.colours || "-"}\nNeeded by: ${req.neededBy || "-"}\nReference Links: ${req.referenceLinks || "-"}\n\nDetails:\n${req.details}`;
  return { subject: `Custom request from ${req.name}`, html, text };
}

/* 5. Contact Form */
export type ContactMessage = {
  name: string;
  email: string;
  phone?: string;
  topic: string;
  order?: string;
  message: string;
};

export function ownerNewContactMessage(req: ContactMessage) {
  const html = layout(
    `New contact message: ${esc(req.topic)}`,
    `<p><strong>${esc(req.name)}</strong> (${esc(req.email)})</p>
     ${req.phone ? `<p><strong>Phone:</strong> ${esc(req.phone)}</p>` : ""}
     ${req.order ? `<p><strong>Order Number:</strong> ${esc(req.order)}</p>` : ""}
     <p><strong>Topic:</strong> ${esc(req.topic)}</p>
     <p style="margin-top:16px;"><strong>Message:</strong></p>
     <p>${esc(req.message).replace(/\n/g, "<br>")}</p>
     <p style="margin-top:24px;">Reply to this email to answer the customer directly.</p>`
  );
  const text = `New contact message: ${req.topic}\n\nName: ${req.name} (${req.email})\nPhone: ${req.phone || "-"}\nOrder: ${req.order || "-"}\nTopic: ${req.topic}\n\nMessage:\n${req.message}`;
  return { subject: `Contact form: ${req.topic} - ${req.name}`, html, text };
}
