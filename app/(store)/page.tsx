import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { getEffectivePrice } from "@/lib/pricing";
import { toDiscountInput } from "@/lib/discount-mapper";
import { YarnMascot } from "@/components/ui/yarn-mascot";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { NewsletterForm } from "@/components/store/newsletter-form";
import { formatINR, phClass } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Oviya's Crochet | Handmade crochet toys, bags and gifts",
  description:
    "Cuddly toys, everyday bags and thoughtful gifts, crocheted to order in Tamil Nadu and delivered across India. Made with love, shipped with care.",
  openGraph: {
    title: "Oviya's Crochet | Handmade crochet toys, bags and gifts",
    description: "Handmade crochet from Tamil Nadu — amigurumi, bags, baby gifts and more.",
    type: "website",
  },
};

const ROUTE_TILES = [
  { href: "/shop", emoji: "🧶", bg: "#F9C6DB", label: "Shop all", hint: "Every handmade piece" },
  { href: "/shop/amigurumi", emoji: "🐼", bg: "#E7D6FA", label: "Amigurumi", hint: "Soft toys and plushies" },
  { href: "/shop/bags", emoji: "👜", bg: "#CFEBDD", label: "Bags", hint: "Totes, pouches, sleeves" },
  { href: "/shop/gift-hampers", emoji: "🎁", bg: "#FBE3B5", label: "Gift hampers", hint: "Ready to give" },
  { href: "/custom-orders", emoji: "✨", bg: "#B8D8F5", label: "Custom orders", hint: "Your colours, your idea" },
  { href: "/track", emoji: "📦", bg: "#D9C9F4", label: "Track order", hint: "Where is my parcel?" },
];

const HOW_STEPS = [
  { title: "Choose", desc: "Pick a product and your colour." },
  { title: "Pay securely", desc: "UPI, cards or netbanking." },
  { title: "We crochet", desc: "You get an email at every step." },
  { title: "Delivered", desc: "Wrapped with care in 5 to 7 days." },
];

const FALLBACK_TESTIMONIALS = [
  { id: "1", name: "Priya", town: "Kumbakonam", quote: "The bunny arrived beautifully wrapped and my daughter will not let go of it." },
  { id: "2", name: "Meena", town: "Chennai", quote: "The tote is sturdy and the colours are even prettier in person." },
  { id: "3", name: "Anitha", town: "Madurai", quote: "Loved the email updates. It felt like watching my gift being made." },
];

async function getData() {
  const now = new Date();
  try {
    const [rawFeatured, rawDiscounts, gallery, testimonials] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        orderBy: [{ featuredPosition: "asc" }, { createdAt: "desc" }],
        take: 3,
        include: {
          images: { orderBy: { position: "asc" } },
          category: true,
          discounts: { include: { discount: { include: { products: true } } } },
        },
      }),
      prisma.discount.findMany({
        where: { isActive: true, startsAt: { lte: now }, OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        include: { products: true },
      }),
      prisma.galleryImage.findMany({
        where: { isActive: true }, orderBy: { position: "asc" }, take: 6,
      }).catch(() => []),
      prisma.testimonial.findMany({
        where: { isActive: true }, orderBy: { position: "asc" }, take: 3,
      }).catch(() => []),
    ]);

    const discounts = rawDiscounts.map(toDiscountInput);
    const featured = rawFeatured.map((p) => {
      const pricing = getEffectivePrice(
        { id: p.id, price: Number(p.price), categoryId: p.categoryId },
        discounts, now
      );
      const primaryImage = p.images.find((i) => i.isPrimary)?.url ?? p.images[0]?.url;
      return {
        id: p.id, name: p.name, slug: p.slug, description: p.description,
        price: pricing.finalPrice, originalPrice: pricing.originalPrice,
        discountPercent: pricing.savingPercent,
        featuredLabel: p.featuredLabel ?? "Featured",
        primaryImage,
      };
    });

    return {
      featured,
      gallery: gallery as { id: string; url: string; alt: string }[],
      testimonials: (testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS) as {
        id: string; name: string; town: string; quote: string;
      }[],
    };
  } catch {
    return { featured: [], gallery: [], testimonials: FALLBACK_TESTIMONIALS };
  }
}

// Pastel placeholder colours for gallery when no images
const GALLERY_COLORS = ["p1", "p2", "p3", "p4", "p2", "p1"];

export default async function HomePage() {
  const { featured, gallery, testimonials } = await getData();

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="hero" aria-label="Hero">
        <div>
          <h1 className="text-hero" style={{ marginBottom: 16 }}>
            Little loops of love,<br />made by hand
          </h1>
          <p style={{ color: "var(--mute)", maxWidth: "46ch", marginBottom: 22, fontSize: 18, lineHeight: 1.55 }}>
            Cuddly toys, everyday bags and thoughtful gifts, crocheted to order in Tamil Nadu and delivered across India.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
            <Link href="/shop" className="btn">Shop all products</Link>
            <Link href="/custom-orders" className="btn btn-alt">Order something custom</Link>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", color: "var(--mute)", fontSize: 14 }}>
            {["Made to order", "Ships across India", "Pay with UPI or card"].map((t) => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--pink)", display: "inline-block", flexShrink: 0 }} />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="art" style={{ position: "relative", maxWidth: 420, width: "100%", justifySelf: "center" }}>
          <div className="blob" aria-hidden="true">
            <YarnMascot size={180} animate />
          </div>
          <span style={{
            position: "absolute", top: "6%", left: "-2%",
            background: "var(--surface)", border: "2px solid var(--line)",
            borderRadius: 18, padding: "8px 14px", fontWeight: 700, fontSize: 14, zIndex: 2,
          }}>
            100% cotton yarn
          </span>
          <span style={{
            position: "absolute", bottom: "8%", right: "-2%",
            background: "var(--mint)", color: "#2E2442", borderRadius: 18,
            padding: "8px 14px", fontWeight: 700, fontSize: 14, zIndex: 2,
          }}>
            Gift wrapping available
          </span>
        </div>
      </section>

      {/* ── WHERE WOULD YOU LIKE TO GO? ────────────────────────────── */}
      <section className="sec" id="routes" aria-labelledby="routes-heading" style={{ paddingTop: 36 }}>
        <div style={{ padding: "0 var(--pad-mobile)", maxWidth: 1160, margin: "0 auto" }}>
          <h2 id="routes-heading" className="text-section" style={{ marginBottom: 6 }}>Where would you like to go?</h2>
          <p style={{ color: "var(--mute)", marginBottom: 20 }}>Jump straight to what you need.</p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
          }}
            className="routes-grid"
          >
            {ROUTE_TILES.map((tile) => (
              <Link
                key={tile.href}
                href={tile.href}
                style={{
                  background: "var(--surface)",
                  border: "2px dashed var(--line)",
                  borderRadius: 22,
                  padding: 16,
                  textDecoration: "none",
                  display: "grid",
                  gap: 6,
                  minHeight: 120,
                  alignContent: "start",
                  transition: "transform .2s, border-color .2s",
                }}
                className="route-tile"
              >
                <span style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: tile.bg, display: "grid", placeItems: "center",
                  fontSize: 22,
                }}>
                  {tile.emoji}
                </span>
                <b style={{ font: "700 18px 'Baloo 2', sans-serif", color: "var(--ink)" }}>{tile.label}</b>
                <small style={{ color: "var(--mute)", lineHeight: 1.35 }}>{tile.hint}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR TOP 3 PICKS ────────────────────────────────────────── */}
      <section className="sec" id="shop" aria-labelledby="featured-heading" style={{ paddingTop: 8 }}>
        <div style={{ padding: "0 var(--pad-mobile)", maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            <div>
              <h2 id="featured-heading" className="text-section">Our top 3 picks</h2>
              <p style={{ color: "var(--mute)", margin: "6px 0 0" }}>The pieces customers love most right now.</p>
            </div>
            <Link href="/shop" style={{ color: "var(--pri)", fontWeight: 700, textDecoration: "none" }}>
              See all products
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="feat-grid">
              {featured.map((p, i) => (
                <article key={p.id} style={{
                  background: "var(--surface)", border: "2px solid var(--line)",
                  borderRadius: 26, padding: "10px 10px 16px", position: "relative",
                }}>
                  <span style={{
                    position: "absolute", top: 26, left: 26, zIndex: 2,
                    background: "var(--ink)", color: "var(--bg)",
                    font: "700 13px 'DM Sans', sans-serif",
                    padding: "4px 12px", borderRadius: 99,
                  }}>{p.featuredLabel}</span>
                  {p.discountPercent > 0 && (
                    <span style={{
                      position: "absolute", top: 26, right: 26, zIndex: 2,
                      background: "var(--pink)", color: "#2E2442",
                      fontWeight: 700, fontSize: 12, padding: "4px 10px", borderRadius: 99,
                    }}>{p.discountPercent}% off</span>
                  )}
                  <div className={`ph ${phClass(i)}`} style={{ borderRadius: 18, position: "relative", overflow: "hidden", aspectRatio: "1" }}>
                    {p.primaryImage ? (
                      <Image src={p.primaryImage} alt={p.name} fill sizes="(min-width:768px) 33vw, 100vw" style={{ objectFit: "cover" }} />
                    ) : (
                      <YarnMascot size={90} animate={false} />
                    )}
                  </div>
                  <Link href={`/product/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <h3 style={{ font: "700 21px 'Baloo 2', sans-serif", margin: "14px 8px 4px" }}>{p.name}</h3>
                    <p style={{ margin: "0 8px", color: "var(--mute)", fontSize: 14, lineHeight: 1.5 }}>
                      {p.description.slice(0, 60)}{p.description.length > 60 ? "…" : ""}
                    </p>
                  </Link>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "12px 8px 0", gap: 8 }}>
                    <span style={{ font: "700 22px 'Baloo 2', sans-serif" }}>
                      {formatINR(p.price)}
                      {p.discountPercent > 0 && (
                        <s style={{ font: "400 14px 'DM Sans', sans-serif", color: "var(--mute)", marginLeft: 6 }}>
                          {formatINR(p.originalPrice)}
                        </s>
                      )}
                    </span>
                    <AddToCartButton
                      productId={p.id} name={p.name}
                      price={p.price} originalPrice={p.originalPrice}
                      image={p.primaryImage ?? ""}
                      slug={p.slug}
                      style={{ border: "2px solid var(--pri)", background: "transparent", color: "var(--pri)", borderRadius: 99, padding: "9px 16px", fontWeight: 700, cursor: "pointer", minHeight: 44, fontFamily: "inherit" }}
                    >
                      Add to cart
                    </AddToCartButton>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ padding: "48px 0", textAlign: "center", color: "var(--mute)" }}>
              <YarnMascot size={80} animate={false} />
              <p style={{ marginTop: 12 }}>Featured products coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── HOW YOUR ORDER IS MADE ──────────────────────────────────── */}
      <section className="sec band" id="how" aria-labelledby="how-heading">
        <div style={{ padding: "36px var(--pad-mobile)", maxWidth: 1160, margin: "0 auto" }}>
          <h2 id="how-heading" className="text-section" style={{ marginBottom: 6 }}>How your order is made</h2>
          <p style={{ color: "var(--mute)", marginBottom: 24 }}>Every piece is stitched after you order, so it is truly yours.</p>
          <div className="steps-grid">
            {HOW_STEPS.map((step, i) => (
              <div key={step.title} style={{
                background: "var(--surface)", borderRadius: 22, padding: 18,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", background: "var(--pink)",
                  color: "#2E2442", font: "700 18px 'Baloo 2', sans-serif",
                  display: "grid", placeItems: "center", marginBottom: 10,
                }}>
                  {i + 1}
                </div>
                <b style={{ font: "700 19px 'Baloo 2', sans-serif" }}>{step.title}</b>
                <p style={{ margin: "4px 0 0", color: "var(--mute)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FRESH FROM THE HOOK ─────────────────────────────────────── */}
      <section className="sec" id="story" aria-labelledby="ig-heading">
        <div style={{ padding: "0 var(--pad-mobile)", maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            <div>
              <h2 id="ig-heading" className="text-section">Fresh from the hook</h2>
              <p style={{ color: "var(--mute)", margin: "6px 0 0" }}>Behind the scenes on @oviyas_crochet</p>
            </div>
            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/oviyas_crochet"}
              target="_blank" rel="noopener noreferrer"
              style={{ color: "var(--pri)", fontWeight: 700, textDecoration: "none" }}
            >
              Follow on Instagram
            </a>
          </div>
          <div className="ig-grid">
            {Array.from({ length: 6 }).map((_, i) => {
              const img = gallery[i];
              return (
                <div key={i} className={`ph ${phClass(i)}`} style={{ borderRadius: 16, aspectRatio: "1", position: "relative", overflow: "hidden" }}>
                  {img && (
                    <Image src={img.url} alt={img.alt} fill sizes="(min-width:768px) 16vw, 33vw" style={{ objectFit: "cover" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HAPPY HOMES ─────────────────────────────────────────────── */}
      <section className="sec" aria-labelledby="reviews-heading" style={{ paddingTop: 0 }}>
        <div style={{ padding: "0 var(--pad-mobile)", maxWidth: 1160, margin: "0 auto" }}>
          <h2 id="reviews-heading" className="text-section" style={{ marginBottom: 20 }}>Happy homes 💬</h2>
          <div className="quotes-grid">
            {testimonials.map((t) => (
              <div key={t.id} style={{
                background: "var(--surface)", border: "2px solid var(--line)",
                borderRadius: 22, padding: 18,
              }}>
                <p style={{ margin: "0 0 10px", lineHeight: 1.6 }}>&ldquo;{t.quote}&rdquo;</p>
                <small style={{ color: "var(--mute)", fontWeight: 600 }}>{t.name}, {t.town}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ──────────────────────────────────────────────── */}
      <section className="sec" aria-labelledby="nl-heading" style={{ paddingTop: 0 }}>
        <div style={{ padding: "0 var(--pad-mobile)", maxWidth: 1160, margin: "0 auto" }}>
          <div style={{
            background: "var(--surface)", border: "2px dashed var(--pri)",
            borderRadius: 28, padding: 26, textAlign: "center",
          }}>
            <h2 id="nl-heading" className="text-section">Get 10% off your first order</h2>
            <p style={{ color: "var(--mute)", margin: "6px 0 0" }}>Join for new arrivals and festive offers. No spam.</p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
