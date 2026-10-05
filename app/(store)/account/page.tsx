import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AccountClient } from "./account-client";

export const metadata: Metadata = {
  title: "My Account — Oviya's Crochet",
  description: "Manage your account, addresses and orders.",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/account/login?callbackUrl=/account");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      addresses: { orderBy: { isDefault: "desc" } },
    },
  });

  if (!user) redirect("/account/login");

  // Fetch orders linked to this user (by userId) OR placed with this email (guest orders)
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { userId: user.id },
        { customerEmail: user.email },
      ],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      createdAt: true,
      items: { select: { nameSnapshot: true, quantity: true }, take: 2 },
    },
  });

  return (
    <AccountClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
      }}
      addresses={user.addresses.map((a) => ({
        id: a.id,
        fullName: a.fullName,
        phone: a.phone,
        line1: a.line1,
        line2: a.line2 ?? "",
        city: a.city,
        state: a.state,
        pincode: a.pincode,
        isDefault: a.isDefault,
      }))}
      orders={orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        total: Number(o.total),
        createdAt: o.createdAt.toISOString(),
        items: o.items,
      }))}
    />
  );
}
