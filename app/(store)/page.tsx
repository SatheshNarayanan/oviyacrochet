import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getEffectivePrice } from "@/lib/pricing";
import { toDiscountInput } from "@/lib/discount-mapper";
import { ProductCard } from "@/components/store/product-card";
import { YarnMascot } from "@/components/ui/yarn-mascot";

export const metadata: Metadata = {
  title: "Handmade Crochet — Oviya's Crochet",
  description:
    "Soft toys, bags and gifts made to order in Tamil Nadu. Browse amigurumi, tote bags, baby gifts and home decor — all handmade with love.",
};

const CATEGORIES = [
  { label: "Amigurumi", slug: "amigurumi" },
  { label: "Bags", slug: "bags" },
  { label: "Home decor", slug: "home-decor" },
  { label: "Baby", slug: "baby" },
  { label: "Accessories", slug: "accessories" },
  { label: "Gift hampers", slug: "gift-hampers" },
];

async function getFeaturedProducts() {
  const now = new Date();
  try {
    const [rawProducts, rawDiscounts] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        take: 8,
        include: {
          images: { orderBy: { position: "asc" } },
          category: true,
          discounts: { include: { discount: { include: { products: true } } } },
        },
      }),
      prisma.discount.findMany({
        where: {
          isActive: true,
          startsAt: { lte: now },
          OR: [{ endsAt: null }, { endsAt: { gte: now } }],
        },
        include: { products: true },
      }),
    ]);

    const discounts = rawDiscounts.map(toDiscountInput);

    return rawProducts.map((p) => {
      const pricing = getEffectivePrice(
        { id: p.id, price: Number(p.price), categoryId: p.categoryId },
        discounts,
        now
      );
      const sorted = [...p.images].sort((a, b) => a.position - b.position);
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: pricing.finalPrice,
        originalPrice: pricing.originalPrice,
        discountPercent: pricing.savingPercent,
        primaryImage: sorted.find((i) => i.isPrimary)?.url ?? sorted[0]?.url,
        secondaryImage: sorted[1]?.url,
      };
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <>
      {/* ── HERO ───────────────────────────────────── */}
      <section className="hero" aria-label="Hero">
        <div>
          <h1 className="text-hero" style={{ marginBottom: 16 }}>
            Handmade crochet,{" "}
            <span style={{ color: "var(--pri)" }}>stitched slowly</span>{" "}
            just for you
          </h1>
          <p style={{ color: "var(--mute)", maxWidth: "44ch", marginBottom: 24, fontSize: 16 }}>
            Soft toys, bags and gifts made to order in Tamil Nadu. Pick a
            favourite and we start stitching.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/shop" className="btn">Shop new arrivals</Link>
            <Link href="/about" className="btn btn-alt">Our story</Link>
          </div>
        </div>
        <div className="blob" aria-hidden="true">
          <YarnMascot size={180} animate />
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────── */}
      <section className="sec" aria-labelledby="cat-heading">
        <h2 id="cat-heading" className="text-section" style={{ marginBottom: 12 }}>
          Shop by category
        </h2>
        <div className="chips no-scrollbar" role="list" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/shop/${c.slug}`} className="chip" role="listitem">{c.label}</Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────── */}
      <section className="sec" aria-labelledby="featured-heading">
        <h2 id="featured-heading" className="text-section" style={{ marginBottom: 16 }}>
          Loved this month 🌸
        </h2>
        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((p, i) => (
              <ProductCard key={p.id} {...p} index={i} />
            ))}
          </div>
        ) : (
          <div style={{ padding: "40px 0", textAlign: "center", color: "var(--mute)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <YarnMascot size={80} animate={false} />
            <p>Products coming soon — check back shortly!</p>
          </div>
        )}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link href="/shop" className="btn btn-alt">View all products</Link>
        </div>
      </section>

      {/* ── HANDMADE PROMISE ──────────────────────── */}
      <section className="sec" aria-labelledby="promise-heading" style={{ background: "var(--lav)", borderTop: "2px dashed var(--line)", borderBottom: "2px dashed var(--line)", textAlign: "center", padding: "32px var(--pad-mobile)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>🧶</p>
          <h2 id="promise-heading" className="text-section" style={{ marginBottom: 12 }}>Every piece is made to order</h2>
          <p style={{ color: "var(--mute)", fontSize: 15, lineHeight: 1.6 }}>
            When you place an order, we start stitching just for you — in soft cotton yarn, with love and care. Ships in 5–7 days.
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────── */}
      <section className="sec" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="text-section" style={{ marginBottom: 16 }}>What customers say 💬</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {[
            { name: "Priya R.", text: "The amigurumi bunny is the cutest thing I've ever received! Beautifully made. Will definitely order again.", stars: 5 },
            { name: "Meena S.", text: "Loved the granny-square tote bag — perfect quality and shipped super fast. 10/10 recommend.", stars: 5 },
            { name: "Anitha K.", text: "Ordered the baby booties as a gift. The recipient absolutely loved them. So soft and well-crafted!", stars: 5 },
          ].map((t) => (
            <div key={t.name} className="card" style={{ padding: 16 }}>
              <p style={{ color: "#F59E0B", marginBottom: 8, fontSize: 18 }}>{"★".repeat(t.stars)}</p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink)", marginBottom: 12 }}>"{t.text}"</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--mute)" }}>— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────── */}
      <section className="sec" aria-labelledby="newsletter-heading" style={{ background: "var(--surface)", borderTop: "2px dashed var(--line)", textAlign: "center", padding: "32px var(--pad-mobile)" }}>
        <h2 id="newsletter-heading" className="text-section" style={{ marginBottom: 8 }}>Stay in the loop 🌸</h2>
        <p style={{ color: "var(--mute)", marginBottom: 20, fontSize: 14 }}>New designs, festive offers and behind-the-scenes peeks — straight to your inbox.</p>
        <form action="/api/newsletter" method="POST" style={{ display: "flex", gap: 8, maxWidth: 440, margin: "0 auto", flexWrap: "wrap" }}>
          <input type="email" name="email" placeholder="your@email.com" required aria-label="Email address for newsletter" className="input-pill" style={{ flex: 1, minWidth: 200 }} />
          <button type="submit" className="btn">Subscribe</button>
        </form>
      </section>
    </>
  );
}
