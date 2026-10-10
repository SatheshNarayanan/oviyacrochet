import Link from "next/link";
import { Header, BottomNav } from "@/components/ui/header";
import { CartDrawer } from "@/components/store/cart-drawer";
import { ToastProvider } from "@/components/ui/toast";
import { SearchOverlay } from "@/components/store/search-overlay";
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
      <SearchOverlay />
      <main style={{ paddingBottom: 80 }}>{children}</main>

      {/* ── v2 Footer — ice-blue, 4-column layout (guide §10) ── */}
      <footer className="footer" aria-label="Site footer">
        {/* Review strip */}
        {/* <div style={{ textAlign: "center", padding: "28px var(--gutter) 0", borderBottom: "1px solid #DCE6EE" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--ink)", fontWeight: 600 }}>
            <span style={{ color: "var(--star)" }}>★★★★★</span> Handmade with love in Kanniyakumari
          </p>
        </div> */}

        {/* 4 columns */}
        <div className="footer__cols">
          <div className="footer__col">
            <h4>Shop</h4>
            <ul>
              <li><a href="/shop">All Products</a></li>
              <li><a href="/shop?category=amigurumi">Amigurumi</a></li>
              <li><a href="/shop?category=bags">Bags</a></li>
              <li><a href="/shop?category=home-decor">Home Décor</a></li>
              <li><a href="/shop?category=baby">Baby Gifts</a></li>
              <li><a href="/shop?category=accessories">Accessories</a></li>
            </ul>
            <h4>Gifts &amp; Custom</h4>
            <ul>
              <li><a href="/shop?category=gift-hampers">Gift Hampers</a></li>
              <li><a href="/custom-orders">Custom Orders</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Learn &amp; Inspire</h4>
            <ul>
              <li><a href="/about">Our Story</a></li>
              <li><a href="https://www.instagram.com/oviyas_crochet" target="_blank" rel="noopener noreferrer">@oviyas_crochet</a></li>
              <li><a href="https://www.youtube.com/@oviyas_crochet" target="_blank" rel="noopener noreferrer">YouTube</a></li>
            </ul>
            <h4>Account</h4>
            <ul>
              <li><a href="/account">My Account</a></li>
              <li><a href="/account/login">Sign In</a></li>
              <li><a href="/track">Track Order</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Support &amp; Policies</h4>
            <ul>
              <li><Link href="/contact">Contact us</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/shipping-policy">Shipping policy</Link></li>
              <li><Link href="/returns-refunds">Returns &amp; refunds</Link></li>
              <li><Link href="/data-sharing-opt-out">Data sharing opt-out</Link></li>
              <li><Link href="/terms-of-service">Terms of service</Link></li>
              <li><Link href="/privacy-policy">Privacy policy</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>About Oviya&apos;s Crochet</h4>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "var(--text-muted)", marginBottom: 16 }}>
              Cuddly toys, everyday bags and thoughtful gifts, crocheted to order in Kanniyakumari and delivered across India.
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              📍 Kanniyakumari, India<br />
              🚚 Ships across India<br />
              ✉️ contact.oviyascrochet@gmail.com
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer__bar">
          <div className="social" aria-label="Social links">
            <a
              href="https://www.instagram.com/oviyas_crochet"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
            </a>
            <a
              href="https://www.youtube.com/@oviyas_crochet"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
            </a>
          </div>
          <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} Oviya&apos;s Crochet. Made with 🧶 in Kanniyakumari.
          </p>
          <div className="pay" aria-label="Payment methods accepted">
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>UPI · Cards · NetBanking · COD</span>
          </div>
        </div>
      </footer>

      <BottomNav />
      <CartDrawer />
    </ToastProvider>
  );
}
