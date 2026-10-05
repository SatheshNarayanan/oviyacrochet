import type { Metadata } from "next";
import Script from "next/script";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { CheckoutForm } from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout — Oviya's Crochet",
  description: "Complete your handmade crochet order.",
};

async function getSettings() {
  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: ["shippingFee", "codEnabled"] } },
    });
    const map = Object.fromEntries(settings.map((s: { key: string; value: unknown }) => [s.key, s.value]));
    return {
      shippingFee: Number(map.shippingFee ?? 60),
      codEnabled: Boolean(map.codEnabled ?? false),
    };
  } catch {
    return { shippingFee: 60, codEnabled: false };
  }
}

export default async function CheckoutPage() {
  const [settings, session] = await Promise.all([getSettings(), auth()]);
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";

  // Fetch saved addresses if user is logged in
  let savedAddresses: {
    id: string; fullName: string; phone: string;
    line1: string; line2: string | null; city: string;
    state: string; pincode: string; isDefault: boolean;
  }[] = [];

  if (session?.user?.id) {
    try {
      savedAddresses = await prisma.address.findMany({
        where: { userId: session.user.id },
        orderBy: { isDefault: "desc" },
      });
    } catch { /* ignore */ }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div style={{ padding: "16px var(--pad-mobile) 0" }}>
        <h1 className="text-section">Checkout</h1>
      </div>
      <CheckoutForm
        shippingFee={settings.shippingFee}
        codEnabled={settings.codEnabled}
        razorpayKeyId={razorpayKeyId}
        savedAddresses={savedAddresses}
        userEmail={session?.user?.email ?? ""}
        userName={session?.user?.name ?? ""}
      />
    </>
  );
}

