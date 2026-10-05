import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendOrderEmail } from "@/lib/email";

const STATUS_TO_TEMPLATE: Record<string, string> = {
  CONFIRMED: "order-confirmed",
  IN_PRODUCTION: "order-in-production",
  READY_TO_SHIP: "order-ready",
  SHIPPED: "order-shipped",
  DELIVERED: "order-delivered",
  CANCELLED: "order-cancelled",
  REFUNDED: "order-refunded",
};

export async function POST(req: NextRequest) {
  try {
    const { orderId, status, note, trackingNumber, courierName } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // TODO: In production, check session role === ADMIN here

    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: {
          status,
          ...(trackingNumber ? { trackingNumber } : {}),
          ...(courierName ? { courierName } : {}),
        },
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId,
          status,
          note,
          emailSent: false,
          changedBy: "admin",
        },
      }),
    ]);

    // Send email (best-effort)
    const template = STATUS_TO_TEMPLATE[status];
    if (template) {
      await sendOrderEmail(orderId, template).catch(() => {});
      await prisma.orderStatusHistory.updateMany({
        where: { orderId, status, emailSent: false },
        data: { emailSent: true },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[ADMIN_UPDATE_STATUS]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
