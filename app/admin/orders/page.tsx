import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { AdminOrdersClient } from "./orders-client";

export const metadata: Metadata = { title: "Orders — Admin | Oviya's Crochet" };

async function getAdminData() {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  try {
    const [orders, newCount, weekRevenue, inProduction] = await Promise.all([
      prisma.order.findMany({
        where: { status: { not: "PENDING_PAYMENT" } },
        orderBy: [{ isSeenByAdmin: "asc" }, { createdAt: "desc" }],
        include: { items: true },
        take: 50,
      }),
      prisma.order.count({ where: { isSeenByAdmin: false, status: { not: "PENDING_PAYMENT" } } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: weekAgo }, paymentStatus: "PAID" },
        _sum: { total: true },
      }),
      prisma.order.count({ where: { status: "IN_PRODUCTION" } }),
    ]);

    return {
      orders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        customerPhone: o.customerPhone,
        total: Number(o.total),
        status: o.status as string,
        paymentMethod: o.paymentMethod as string,
        isSeenByAdmin: o.isSeenByAdmin,
        createdAt: o.createdAt.toISOString(),
        shippingAddress: o.shippingAddress as Record<string, string>,
        items: o.items.map((i) => ({
          id: i.id,
          name: i.nameSnapshot,
          quantity: i.quantity,
          price: Number(i.finalUnitPrice),
          image: i.imageSnapshot,
        })),
      })),
      stats: {
        newCount,
        weekRevenue: Number(weekRevenue._sum.total ?? 0),
        inProduction,
      },
    };
  } catch {
    return { orders: [], stats: { newCount: 0, weekRevenue: 0, inProduction: 0 } };
  }
}

export default async function AdminOrdersPage() {
  const data = await getAdminData();
  return (
    <div style={{ padding: "20px var(--pad-mobile) 40px" }}>
      <h1 className="text-section" style={{ marginBottom: 20 }}>Orders</h1>
      <AdminOrdersClient data={data} />
    </div>
  );
}
