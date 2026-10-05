import { Header, BottomNav } from "@/components/ui/header";
import { CartDrawer } from "@/components/store/cart-drawer";
import { ToastProvider } from "@/components/ui/toast";
import { prisma } from "@/lib/db";

async function getActiveOffer() {
  try {
    const now = new Date();
    const offer = await prisma.discount.findFirst({
      where: {
        isActive: true,
        scope: "STOREWIDE",
        code: null,
        startsAt: { lte: now },
        OR: [{ endsAt: null }, { endsAt: { gte: now } }],
      },
      orderBy: { value: "desc" },
    });
    if (!offer) return null;
    if (offer.type === "PERCENTAGE") {
      return `Festive offer: ${Number(offer.value)}% off every order right now! 🎉`;
    }
    return `Special offer: ₹${Number(offer.value)} off your order! 🎉`;
  } catch {
    return null;
  }
}

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const offerText = await getActiveOffer();

  return (
    <ToastProvider>
      <Header offerText={offerText ?? undefined} />
      <main style={{ paddingBottom: 80 }}>{children}</main>
      <footer className="footer">
        <p>
          Handmade with love 🧶 Follow{" "}
          <a
            href="https://www.instagram.com/oviyas_crochet"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--pri)", fontWeight: 600 }}
          >
            @oviyas_crochet
          </a>{" "}
          on Instagram
        </p>
        <p style={{ marginTop: 8 }}>
          <a href="/shipping" style={{ color: "var(--mute)" }}>Shipping & Returns</a>
          {" · "}
          <a href="/privacy" style={{ color: "var(--mute)" }}>Privacy</a>
          {" · "}
          <a href="/terms" style={{ color: "var(--mute)" }}>Terms</a>
          {" · "}
          <a href="/contact" style={{ color: "var(--mute)" }}>Contact</a>
          {" · "}
          <a href="/faq" style={{ color: "var(--mute)" }}>FAQ</a>
        </p>
      </footer>
      <BottomNav />
      <CartDrawer />
    </ToastProvider>
  );
}
