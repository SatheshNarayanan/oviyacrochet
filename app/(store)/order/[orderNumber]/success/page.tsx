import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Order Confirmed — Oviya's Crochet" };

interface Props {
  params: Promise<{ orderNumber: string }>;
}

async function getOrder(orderNumber: string) {
  try {
    return await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });
  } catch {
    return null;
  }
}

export default async function OrderSuccessPage({ params }: Props) {
  const { orderNumber } = await params;
  const order = await getOrder(orderNumber);

  return (
    <div style={{
      minHeight: "60vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "40px var(--pad-mobile)",
    }}>
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "var(--mint)", display: "grid",
          placeItems: "center", margin: "0 auto 20px",
        }}>
          <CheckCircle size={40} color="#276749" aria-hidden="true" />
        </div>

        <h1 className="text-section" style={{ marginBottom: 8 }}>
          Order confirmed! 🎉
        </h1>
        <p style={{ color: "var(--mute)", marginBottom: 24 }}>
          Thank you! We've received your order and will start stitching soon.
          A confirmation email has been sent to you.
        </p>

        <div className="box" style={{ textAlign: "left", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "var(--mute)", fontSize: 14 }}>Order number</span>
            <span style={{ fontWeight: 700, color: "var(--pri)", fontFamily: "Baloo 2" }}>
              {orderNumber}
            </span>
          </div>
          {order && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "var(--mute)", fontSize: 14 }}>Total paid</span>
                <span style={{ fontWeight: 700 }}>{formatINR(Number(order.total))}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--mute)", fontSize: 14 }}>Items</span>
                <span>{order.items.reduce((s, i) => s + i.quantity, 0)}</span>
              </div>
            </>
          )}
        </div>

        <div className="mint-note" style={{ marginBottom: 24, textAlign: "left" }}>
          🪡 Made to order. Your items will ship in 5–7 days.
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/track" className="btn">
            Track order
          </Link>
          <Link href="/shop" className="btn btn-alt">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
