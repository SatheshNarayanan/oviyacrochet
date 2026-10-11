import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import {
  orderConfirmation,
  ownerNewOrder,
  orderStatusUpdate,
  OrderStatus,
  Order,
} from "@/lib/email/templates";

const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "oviyascrochet@gmail.com";

export async function sendOrderEmail(orderId: string, template: string): Promise<void> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        payments: true,
      },
    });

    if (!order) return;

    const shippingAddr = (order.shippingAddress as Record<string, unknown>) || {};
    const successfulPayment = order.payments?.find((p) => p.status === "PAID") || order.payments?.[0];

    // Convert Prisma Order into enriched templates.ts Order invoice
    const mappedOrder: Order = {
      id: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      items: order.items.map((item) => ({
        name: item.nameSnapshot,
        qty: item.quantity,
        price: typeof item.finalUnitPrice === "object" ? Number((item.finalUnitPrice as any).toNumber()) : Number(item.finalUnitPrice),
      })),
      subtotal: Number(order.subtotal),
      discountTotal: Number(order.discountTotal || 0),
      shippingFee: Number(order.shippingFee || 0),
      total: Number(order.total),
      currency: "INR",
      paymentMethod: order.paymentMethod === "RAZORPAY" ? "Razorpay (Online)" : "Cash on Delivery",
      paymentStatus: order.paymentStatus,
      paymentId: successfulPayment?.providerPaymentId || undefined,
      shippingAddress: {
        fullName: (shippingAddr.fullName as string) || order.customerName,
        phone: (shippingAddr.phone as string) || order.customerPhone,
        line1: (shippingAddr.line1 as string) || "",
        line2: (shippingAddr.line2 as string) || "",
        city: (shippingAddr.city as string) || "",
        state: (shippingAddr.state as string) || "",
        pincode: (shippingAddr.pincode as string) || "",
      },
      date: new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeZone: "Asia/Kolkata",
      }).format(new Date(order.createdAt)),
    };

    let mailObj;
    let recipient = order.customerEmail;
    let replyTo = OWNER_EMAIL; // Customer replies to owner

    if (template === "order-confirmation") {
      mailObj = orderConfirmation(mappedOrder);
    } else if (template === "admin-new-order") {
      mailObj = ownerNewOrder(mappedOrder);
      recipient = OWNER_EMAIL;
      replyTo = order.customerEmail; // Owner replies to customer
    } else {
      // Map other templates to status
      const statusMap: Record<string, OrderStatus> = {
        "order-confirmed": "confirmed",
        "order-in-production": "in_progress",
        "order-ready": "in_progress", // Maps to in_progress or maybe add a new one if needed, we'll use in_progress
        "order-shipped": "shipped",
        "order-delivered": "delivered",
      };
      
      const mappedStatus = statusMap[template];
      if (!mappedStatus) return; // Ignore unknown templates like order-cancelled for now, or add to templates.ts later
      
      const trackingInfo = order.trackingNumber 
        ? `${order.trackingNumber}${order.courierName ? ` via ${order.courierName}` : ""}` 
        : undefined;
      
      mailObj = orderStatusUpdate(mappedOrder, mappedStatus, trackingInfo);
    }

    if (!mailObj) return;

    let status = "SENT";
    let errorStr: string | undefined;

    try {
      await sendMail({
        to: recipient,
        subject: mailObj.subject,
        html: mailObj.html,
        text: mailObj.text,
        replyTo,
      });
    } catch (err) {
      status = "FAILED";
      errorStr = String(err);
      console.error("[EMAIL SEND FAIL]", err);
    }

    // Log to DB (best-effort)
    try {
      await prisma.emailLog.create({
        data: { to: recipient, subject: mailObj.subject, template, orderId, status, error: errorStr },
      });
    } catch { /* ignore log failure */ }
  } catch (err) {
    console.error("[EMAIL]", err);
  }
}
