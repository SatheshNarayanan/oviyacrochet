const BRAND = {
  name: "Oviya's Crochet",
  mint: "#5CC9B3",
  ink: "#2E3A36",
  bg: "#F9FAF9",
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
<body style="margin:0;padding:24px;background:${BRAND.bg};font-family:Arial,Helvetica,sans-serif;color:${BRAND.ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E8EBEA;">
        <tr><td style="background:${BRAND.ink};padding:20px 28px;color:#ffffff;font-size:20px;font-weight:bold;">
          ${BRAND.name}
        </td></tr>
        <tr><td style="padding:28px;line-height:1.6;font-size:15px;">
          <h1 style="margin:0 0 16px;font-size:22px;color:${BRAND.ink};">${esc(title)}</h1>
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:16px 28px;background:#F1F3F2;font-size:12px;color:#55627a;text-align:center;">
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
    .map((i) => `- ${i.name} x ${i.qty}`)
    .join("\n") + `\nTotal: ${money(order.total, order.currency)}`;
}

/* 1. Order confirmation (to customer) */
export function orderConfirmation(order: Order) {
  const html = layout(
    `Thank you, ${order.customerName}!`,
    `<p>We've received your order <strong>#${esc(order.id)}</strong>. We'll start on it soon and keep you updated by email.</p>
     ${renderOrderItems(order)}`
  );

  const text = `Thank you, ${order.customerName}!\n\nWe've received your order #${order.id}.\n${renderOrderItemsText(order)}\n\nWe'll keep you updated by email.`;

  return { subject: `Order #${order.id} received - Oviya's Crochet`, html, text };
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
  return { subject: "We received your custom request - Oviya's Crochet", html, text };
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
